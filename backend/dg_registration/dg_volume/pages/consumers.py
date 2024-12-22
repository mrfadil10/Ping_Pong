# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json

from .models import ChatMessage, PrivateMessageModel, Conversation, Notifications, BlockedList
from django.contrib.auth import get_user_model

from asgiref.sync import sync_to_async
from .models import UserProfile


# --------------------------------------->> Game start
import random
import asyncio
from .models import GameResult
import time

class PongConsumer(AsyncWebsocketConsumer):
    rooms = {}
    last_collision_user = {}

    async def connect(self):
        self.all_names = self.scope['url_route']['kwargs']['room_name']
        if ("_" in self.all_names):
            self.username, self.sender, self.receiver = self.all_names.split('_')
        else:
            self.username = self.all_names
            self.sender = self.receiver = "null"
        # return
        self.user_obj = await sync_to_async(UserProfile.objects.select_related('user').get)(user__username=self.username)
        self.profile_image = self.user_obj.profile_image.name

        for room_name, room in self.rooms.items():
            if self.username in room['players_name'].values():
                return
        # Case 1: self.username equals self.sender (create a new room and add username)
        if self.username == self.sender:
            self.room_name = f'invite_pong_room_{len(self.rooms) + 1}'
            self.rooms[self.room_name] = self.create_new_room()
            room = self.rooms[self.room_name]

        # Case 2: self.username equals self.receiver (join a room with the sender)
        elif self.username == self.receiver:
            available_room = None
            for room_name, room in self.rooms.items():
                if ((self.sender in room['players_name'].values()) and (len(room['players']) == 1)):
                    available_room = room_name
                    break
            if available_room:
                self.room_name = available_room
                room = self.rooms[self.room_name]
            else:
                # Handle case where no room with sender exists
                await self.close()
                return

        # Case 3: self.username equals self.all_names
        elif self.username == self.all_names:
            # Look for an available room with one player
            available_room = None
            for room_name, room in self.rooms.items():
                if ((len(room['players']) == 1) and ("invite" not in room_name)):
                    available_room = room_name
                    break
            if available_room:
                self.room_name = available_room
            else:
                # Create a new room
                self.room_name = f'pong_room_{len(self.rooms) + 1}'
                self.rooms[self.room_name] = self.create_new_room()
            room = self.rooms[self.room_name]

        self.room_group_name = f'game_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        if len(room['players']) < 2:
            self.user_role = 'user1' if 'user1' not in room['players'] else 'user2'
            room['players'][self.user_role] = self
            room['players_name'][self.user_role] = self.username
            room['players_photo'][self.user_role] = self.profile_image
            # print(f"WebSocket connection accepted for {self.channel_name} as {self.user_role} in room {self.room_name}")
            if len(room['players']) == 2:
                room['game_state']['status'] = 'running'
                room['game_state'] = self.create_new_game_state()
                room['game_state']['paddles']['user1']['name'] = room['players_name']['user1']
                room['game_state']['paddles']['user2']['name'] = room['players_name']['user2']
                room['game_state']['paddles']['user1']['photo'] = room['players_photo']['user1']
                room['game_state']['paddles']['user2']['photo'] = room['players_photo']['user2']
                room['game_loop_task'] = asyncio.create_task(self.game_loop(room))
                # print(f"Game loop task created for room {self.room_name}")
            else:
                room['game_state']['status'] = 'waiting'
        else:
            # This shouldn't happen, but just in case
            await self.close()
            return
        await self.send_game_state()

    def create_new_room(self):
        return {
            'players': {},
            'game_loop_task': None,
            'players_name': {},
            'players_photo': {},
            'game_state': self.create_new_game_state()
        }

    def create_new_game_state(self):
        return {
            'canvas': {'width': 800, 'height': 500},
            'ball': {
                'x': 400, 'y': 250, 'dx': 5, 'dy': 5, 'radius': 10,
                'velocityX': 5, 'velocityY': 5, 'speed': 0, 'fit_u1' : 0, 'fit_u2' : 0
            },
            'paddles': {
                'user1': {'photo': '', 'name': '', 'x': 0, 'y': 200, 'width': 10, 'height': 100},
                'user2': {'photo': '', 'name': '', 'x': 790, 'y': 200, 'width': 10, 'height': 100}
            },
            'scores': {'user1': 0, 'user2': 0},
            'winner': 'none',
            'score_max': 5,
            'status': 'waiting'
        }

    async def disconnect(self, close_code):
        # print(f"WebSocket disconnected. Close code: {close_code}")
        if hasattr(self, 'room_name'):
            room = self.rooms[self.room_name]
            if self.user_role in room['players']:
                del room['players'][self.user_role]
            # room['game_state'] = self.create_new_game_state()
            room['game_state']['scores'][self.user_role] = 0
            if self.user_role == 'user1':
                room['game_state']['scores']['user2'] = room['game_state']['score_max']
                # await self.save_game_result(room, 'user2', room['game_state']['scores']['user1'], room['game_state']['scores']['user2'], room['game_state']['ball']['fit_u1'], room['game_state']['ball']['fit_u2'])
            else:
                room['game_state']['scores']['user1'] = room['game_state']['score_max']
                # await self.save_game_result(room, 'user1', room['game_state']['scores']['user1'], room['game_state']['scores']['user2'], room['game_state']['ball']['fit_u1'], room['game_state']['ball']['fit_u2'])
            room['game_state']['status'] = 'quit'
            if room['game_loop_task']:
                room['game_loop_task'].cancel()
                room['game_loop_task'] = None
            if len(room['players']) == 0:
                del self.rooms[self.room_name]
            else:
                await self.send_game_state()
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        if not hasattr(self, 'room_name'):
            for room_name, room in self.rooms.items():
                if self.username in room['players_name'].values():
                    self.room_name = room_name
                    break
        room = self.rooms[self.room_name]
        data = json.loads(text_data)
        if data['type'] == 'score_max':
            room['game_state']['score_max'] = data['score_max']

        if data['type'] == 'paddle_move' and room['game_state']['status'] == 'running':
            direction = data['direction']
            
            old_y = room['game_state']['paddles'][self.user_role]['y']
            move_amount = 5
            if direction == 'up':
                room['game_state']['paddles'][self.user_role]['y'] = max(0, old_y - move_amount)
            else:
                room['game_state']['paddles'][self.user_role]['y'] = min(
                    room['game_state']['canvas']['height'] - room['game_state']['paddles'][self.user_role]['height'],
                    old_y + move_amount
                )
            await self.send_game_state()

    async def send_game_state(self):
        room = self.rooms[self.room_name]
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_update',
                'game_state': room['game_state']
            }
        )

    async def game_update(self, event):
        await self.send(text_data=json.dumps(event['game_state']))

    def reset_ball(self):
        room = self.rooms[self.room_name]
        ball = room['game_state']['ball']
        canvas = room['game_state']['canvas']
        paddles = room['game_state']['paddles']
        ball['x'] = canvas['width'] / 2
        ball['y'] = canvas['height'] / 2
        ball['speed'] = 0
        ball['velocityX'] = 5 if random.random() > 0.5 else -5
        ball['velocityY'] = 5 if random.random() > 0.5 else -5
        paddles['user1']['y'] = canvas['height'] / 2 - paddles['user1']['height'] / 2
        paddles['user2']['y'] = canvas['height'] / 2 - paddles['user2']['height'] / 2

    def collision(self, ball, paddle):
        return (
            ball['x'] + ball['radius'] > paddle['x'] and
            ball['x'] - ball['radius'] < paddle['x'] + paddle['width'] and
            ball['y'] + ball['radius'] > paddle['y'] and
            ball['y'] - ball['radius'] < paddle['y'] + paddle['height']
        )

    @sync_to_async
    def save_game_result(self,room, winner, user1_score, user2_score, fit_u1, fit_u2):
        player1 = (UserProfile.objects.select_related('user').get)(user__username=room['game_state']['paddles']['user1']['name'])
        player2 = (UserProfile.objects.select_related('user').get)(user__username=room['game_state']['paddles']['user2']['name'])
        winner_user = player1 if winner == 'user1' else player2
        game_result = GameResult.objects.create(
            player1=player1.user.username,
            player2=player2.user.username,
            winner=winner_user.user.username,
            player1_score=user1_score,
            player2_score=user2_score,
            imagePlayer1=player1.profile_image,
            imagePlayer2=player2.profile_image,
            player1_fit=fit_u1,
            player2_fit=fit_u2
        )
        player1.games.add(game_result)
        player2.games.add(game_result)

        self.update_player_stats(player1, winner == 'user1', user1_score, user2_score)
        self.update_player_stats(player2, winner == 'user2', user2_score, user1_score)

    def update_player_stats(self, player, is_winner, user_score, score_other_player):
        achievements = player.achievements
        consecutive_wins = player.consecutive_wins
        consecutive_los = player.consecutive_los
        level = player.level
        percent = player.percent
        loss = player.loss
        wins = player.wins
        score = player.score
        score_table = list(player.score_table)
        if is_winner:
            wins = player.wins + 1
            consecutive_wins += 1
            consecutive_los = 0
            score += user_score
            percent += 35
            if percent >= 100:
                percent = 7
                level = player.level + 1
        else:
            score -= int((score_other_player + 1) / 2)
            if score < 0:
                score = 0
            percent += 12
            if percent >= 100:
                percent = 7
                level = player.level + 1
            loss = player.loss + 1
            consecutive_los += 1
            consecutive_wins = 0
        if (wins == 1):
            achievements = 1
        if ((level % 2 == 0) and (percent == 7) and (achievements < 10)):
            achievements += 1
        total_game = player.total_game + 1
        score_table.append(score)
        max_consecutive_wins = max(player.max_consecutive_wins, consecutive_wins)
        max_consecutive_los = max(player.max_consecutive_los, consecutive_los)
        UserProfile.objects.filter(user__username=player.user.username).update(
            level=level,
            wins=wins,
            loss=loss,
            consecutive_wins=consecutive_wins,
            consecutive_los=consecutive_los,
            max_consecutive_los=max_consecutive_los,
            max_consecutive_wins=max_consecutive_wins,
            achievements=achievements,
            total_game=total_game,
            percent=percent,
            score=score,
            score_table=score_table
        )
    
    async def game_loop(self, room):
        # print(f"Game loop started for room {self.room_name}")
        try:
            self.last_collision_user[self.room_name] = None
            room = self.rooms[self.room_name]
            time.sleep(2)
            room['game_state']['status'] = 'running'
            await self.send_game_state()
            time.sleep(2)###
            while True:
                room = self.rooms[self.room_name]###
                if len(room['players']) < 2:
                    room['game_state']['status'] = 'waiting'
                    await self.send_game_state()
                    return
                if room['game_state']['scores']['user2'] == room['game_state']['score_max']:
                    room['game_state']['winner'] = 'W2' 
                    room['game_state']['status'] = 'finished'
                    await self.send_game_state()
                    await self.save_game_result(room, 'user2', room['game_state']['scores']['user1'], room['game_state']['scores']['user2'], room['game_state']['ball']['fit_u1'], room['game_state']['ball']['fit_u2'])
                    return
                if room['game_state']['scores']['user1'] == room['game_state']['score_max']:
                    room['game_state']['winner'] = 'W1'
                    room['game_state']['status'] = 'finished'
                    await self.send_game_state()
                    await self.save_game_result(room, 'user1', room['game_state']['scores']['user1'], room['game_state']['scores']['user2'], room['game_state']['ball']['fit_u1'], room['game_state']['ball']['fit_u2'])
                    return
                ball = room['game_state']['ball']
                canvas = room['game_state']['canvas']
                paddles = room['game_state']['paddles']
                # Ball collision with top and bottom
                if ball['y'] + ball['radius'] > canvas['height'] or ball['y'] - ball['radius'] < 0:
                    ball['velocityY'] = -ball['velocityY']
                # Update ball position
                ball['x'] += ball['velocityX']
                ball['y'] += ball['velocityY']
                # Determine which user's paddle to check
                user = 'user1' if ball['x'] + ball['radius'] < canvas['width'] / 2 else 'user2'
                paddle = paddles[user]
                # Ball collision with paddles or scoring
                if ball['x'] + ball['radius'] > canvas['width'] - paddles['user1']['width'] or ball['x'] - ball['radius'] < paddles['user1']['width']:
                    if self.collision(ball, paddle):
                        if self.last_collision_user[self.room_name] != user:
                            self.last_collision_user[self.room_name] = user
                            ball['velocityX'] = -ball['velocityX']
                            if user == 'user1':
                                ball['fit_u1'] += 1
                            else:
                                ball['fit_u2'] += 1
                    else:
                        if ball['x'] - ball['radius'] < 0:
                            room['game_state']['scores']['user2'] += 1
                            self.reset_ball()
                            self.last_collision_user[self.room_name] = None
                            await self.send_game_state()
                        elif ball['x'] + ball['radius'] > canvas['width']:
                            room['game_state']['scores']['user1'] += 1
                            self.reset_ball()
                            self.last_collision_user[self.room_name] = None
                            await self.send_game_state()

                await self.send_game_state()
                await asyncio.sleep(1/60)  # 60 FPS
        except asyncio.CancelledError:
            print(f"Game loop was cancelled for room {self.room_name}")
        except Exception as e:
            print(f"Error in game loop for room {self.room_name}: {e}")


# --------------------------------------->> Game end

#================================================================================ idryab ================================================================================
class chat(AsyncWebsocketConsumer):
    async def connect(self):
        # This could be based on the user or room name
        # self.room_name = 'default_room'  # You might use a dynamic room name
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'


        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        # Send a message to the user indicating that they are connected
        msg_data = json.dumps({'message': "You're connected to the server", 'username': "Server"})
        await self.send(text_data=msg_data)

        #Load last 50 messages from the database
        #Django's ORM (Object-Relational Mapping) is synchronous by nature, use Django's sync_to_async utility to run the synchronous code in a thread-safe manner.
        #sync_to_async is used to run synchronous code (like a database query) in an asynchronous context.
        #using list function ensures that the evaluation of the queryset happens inside a thread-safe environment.
        messages = await sync_to_async(list)(
            ChatMessage.objects.filter(room=self.room_name).select_related('sender').order_by('-timestamp')[:50]
        )
        for message in reversed(messages):
            await self.send(text_data=json.dumps({
                'message': message.content,
                'username': message.sender.username,
                'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            }))


    async def disconnect(self, close_code):
        #Leave the group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        username = data['sender']
        receiver = data['receiver']

        #Get sender object from databse
        try:
            sender = await sync_to_async(UserProfile.objects.get)(username=username)
        except:
            self.disconnect(1003)
        #Save message into the database
        save_message = await sync_to_async(ChatMessage.objects.create)(
            sender=sender,
            room=self.room_name,
            content=message
        )

        #Broadcast message to the room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
                'timestamp': save_message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'channel_name': self.channel_name  #Optionally include the sender's channel_name, I'm gonna remove it later
            }
        )
    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        timestamp = event['timestamp']
        channelname = event.get('channel_name')
        # Send the message to WebSocket
        if channelname != self.channel_name:
            await self.send(text_data=json.dumps({
                'message': message,
                'username': username,
                'timestamp': timestamp
            }))

from channels.db import database_sync_to_async
from django.core.cache import cache

# Here I'm using Django ORM with Redis Cache.(Django's caching framework)

from django.db.models import Q

from datetime import datetime

def get_current_time():
    now = datetime.now()
    return now.strftime("%Y-%m-%d %H:%M:%S")

@sync_to_async
def get_user_obj(username):
    return UserProfile.objects.get(user__username=username)
@sync_to_async
def get_blocked_friends(fr_block_list):
    return list(fr_block_list.blocked_friends.all())
@sync_to_async
def get_private_messages(receiver_obj, sender_obj):
    return list(PrivateMessageModel.objects.filter(
        Q(receiver=receiver_obj, sender=sender_obj) | Q(receiver=sender_obj, sender=receiver_obj)
    ).select_related('receiver', 'sender').order_by('-timestamp'))



@sync_to_async
def store_notifications(sender_obj, receiver_obj, timestamp):
    return Notifications.objects.create(
        user1=sender_obj,
        user2=receiver_obj,
        notify_at=timestamp
    )

@sync_to_async
def store_private_messages(sender_obj, receiver_obj, message, timestamp):
    if message:
        conversation, created = Conversation.objects.get_or_create(
            user1=sender_obj, user2=receiver_obj,
            defaults={'last_message_at': timestamp}
        )
        if not created:
            conversation.last_message_at = timestamp
            conversation.save()

        conversation_reverse, created_reverse = Conversation.objects.get_or_create(
            user1=receiver_obj, user2=sender_obj,
            defaults={'last_message_at': timestamp}
        )

        if not created_reverse:
            conversation_reverse.last_message_at = timestamp
            conversation_reverse.save()
        return PrivateMessageModel.objects.create(sender=sender_obj, receiver=receiver_obj, content=message)

@sync_to_async
def get_sender_username(msg):
    return msg.sender.user.username

@sync_to_async
def check_blockedList(blocker, blocked_user):
    blockedlist =  BlockedList.objects.filter(
        Q(blocker=blocker, blocked=blocked_user) | Q(blocker=blocked_user, blocked=blocker)).first()
    if blockedlist:
        return True
    return False
    # blockedlist = BlockedList.objects.filter(Q(blocker=blocker) & Q(blocked=blocked_user)).first()
    # beingblockedlist = BlockedList.objects.filter(Q(blocker=blocked_user) & Q(blocked=blocker)).first()
    # if blockedlist:
    #     return blockedlist
    # if beingblockedlist:
    #     return beingblockedlist
    # return None

onine_userslist = []
class PrivateChat(AsyncWebsocketConsumer):
    async def connect(self):
        self.username = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"prv_chat_{self.username}_channel"

        # Join room group(every user has a group that contain one or multiple channel_namezzz)
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        # everyone connected(online), I add them to the active_users group, and everytime someone connected I broadcast the onine_userslist to everyone in this group.
        await self.channel_layer.group_add("active_users", self.channel_name)
        # update the list of online userzzz
        onine_userslist.append(self.username)
        await self.channel_layer.group_send(
            "active_users",
            {
                'type': 'status_update',
                'online_users': onine_userslist,
                'typeofmsg': "status_update"
            }
        )
        await self.accept()

    async def disconnect(self, close_code):
        #Leave the group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        await self.channel_layer.group_discard("active_users", self.channel_name)
        onine_userslist.remove(self.username)
        await self.channel_layer.group_send(
            "active_users",
            {
                'type': 'status_update',
                'online_users': onine_userslist,
                'typeofmsg': "status_update"
            }
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        sender = data['sender']
        receiver = data['receiver']
        message = data['message']
        typeofmsg = data['typeofmsg']
        timestamp = get_current_time()
        to_group_name = f"prv_chat_{receiver}_channel"

        sender_obj = await get_user_obj(username=sender)
        receiver_obj = await get_user_obj(username=receiver)
        is_blocked = await check_blockedList(sender_obj, receiver_obj)

        if typeofmsg == "friend_request" or typeofmsg == "invite_to_game":
            await self.channel_layer.group_send(
                to_group_name,
                {
                        'type': 'prv_message',
                        'message': message,
                        'sender': sender,
                        'receiver': receiver,
                        'timestamp': timestamp,
                        'typeofmsg': typeofmsg,
                })
            if typeofmsg == "friend_request":
                await store_notifications(sender_obj, receiver_obj, timestamp)

        elif typeofmsg == "message":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                        'type': 'prv_message',
                        'message': message,
                        'sender': sender,
                        'receiver': receiver,
                        'timestamp': timestamp,
                        'typeofmsg': typeofmsg,
                }
            )
            if is_blocked == False:
                await store_private_messages(sender_obj, receiver_obj, message, timestamp)
                await self.channel_layer.group_send(
                    to_group_name,
                    {
                            'type': 'prv_message',
                            'message': message,
                            'sender': sender,
                            'receiver': receiver,
                            'timestamp': timestamp,
                            'typeofmsg': typeofmsg,
                    })

    async def prv_message(self, event):
        message = event['message']
        sender = event['sender']
        receiver = event['receiver']
        timestamp = event['timestamp']
        typeofmsg = event['typeofmsg']
        
        await self.send(text_data=json.dumps({
            'content': message,
            'senderName': sender,
            'receiverName': receiver,
            'timestamp': timestamp,
            'typeofmsg': typeofmsg,
        }))

    async def status_update(self, event):
        typeofmsg = event['typeofmsg']
        online_users = event['online_users']
        
        await self.send(text_data=json.dumps({
            'online_users': online_users,
            'typeofmsg': "status_update"
    }))
#================================================================================ End of idryab ================================================================================  
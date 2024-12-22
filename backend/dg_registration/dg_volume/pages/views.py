from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, UserProfileSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import UserProfile, PrivateMessageModel, Conversation, Notifications, VerificationCode, GameResult, BlockedList
from .serializers import UserProfileSerializer, GameResultSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
import requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from dotenv import load_dotenv
import os

load_dotenv()


#-------------------------------------------idryab----------------------------------------------
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from asgiref.sync import sync_to_async
from django.db.models import Q
from .serializers import MessageSerializer, ConversationSerializer

#=======Today===============
class SearchFriends(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def get_queryset(self):
        user_profile = UserProfile.objects.get(user=self.request.user)
        foundUsers = user_profile.friends.filter(username="idryab")
        return foundUsers


class MessagePagination(PageNumberPagination):
    page_size = 14  # Default number of messages per page
    page_size_query_param = 'page_size'  # Allow clients to set the page size
    max_page_size = 100  # Limit the maximum page size


class LoadMessagesView(APIView):
    permission_classes = [AllowAny]
    pagination_class = MessagePagination

    def get(self, request):
        username1 = request.query_params.get('user1')
        username2 = request.query_params.get('user2')

        if not username1 or not username2:
            return Response({'error': 'Both user1 and user2 usernames are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # Fetch users by username
            user1_profile = UserProfile.objects.get(user__username=username1)
            user2_profile = UserProfile.objects.get(user__username=username2)
        except UserProfile.DoesNotExist:
            return Response({'error': 'One or both users not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Filter messages
        messages = PrivateMessageModel.objects.filter(
            (Q(receiver=user1_profile) & Q(sender=user2_profile)) |
            (Q(receiver=user2_profile) & Q(sender=user1_profile))
        ).order_by('-timestamp')

        paginator = self.pagination_class()
        # paginated_messages = paginator.paginate_queryset(messages, request)

        try:
            paginated_messages = paginator.paginate_queryset(messages, request)
        except Exception:
            # Handle out-of-bounds page request
            return Response({'messages': []}, status=status.HTTP_200_OK)

        if not paginated_messages:  # Check if there are no messages
            return Response({'messages': []}, status=status.HTTP_200_OK)

        serializer = MessageSerializer(paginated_messages, many=True)
        return paginator.get_paginated_response(serializer.data)


# class WhoTalkedWith(generics.ListAPIView):
#     permission_classes = [AllowAny]
#     serializer_class = UserSerializer

#     def get_queryset(self):
#         user_profile = UserProfile.objects.get(user=self.request.user)
#         talked_with = PrivateMessageModel.objects.filter(
#             Q(sender=user_profile) | Q(receiver=user_profile)
#         ).values_list('sender', 'receiver')

#         talked_with_user_ids = set()
#         for sender_id, receiver_id in talked_with:
#             if sender_id != user_profile.id:
#                 talked_with_user_ids.add(sender_id)
#             if receiver_id != user_profile.id:
#                 talked_with_user_ids.add(receiver_id)
#         return user_profile.friends.filter(id__in=talked_with_user_ids)


class allFriendzzzz(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        user_profile = UserProfile.objects.get(user=self.request.user)

        friends = list(user_profile.friends.all())
        friends_list = []
        for friend in friends:
            friend_profile = UserProfile.objects.get(user=friend)
            friends_list.append(friend_profile)
        return friends_list

class Friendzzzz(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        user_profile = UserProfile.objects.get(user__username=self.request.user)
        conversations = Conversation.objects.filter(
            Q(user1=user_profile) | Q(user2=user_profile)
        ).order_by('-last_message_at')

        friends = list()
        for conversation in conversations:
            if conversation.user1 == user_profile:
                friend = conversation.user2
            else:
                friend = conversation.user1
            friends.append(friend)
        return list(dict.fromkeys(friends))

class Notificationzzzz(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        user_profile = UserProfile.objects.get(user__username=self.request.user)
        notifs = Notifications.objects.filter(Q(user2=user_profile)).order_by('-notify_at')

        friends = list()
        for notif in notifs:
            if notif.user1 == user_profile:
                friend = notif.user2
            else:
                friend = notif.user1
            friends.append(friend)
        return list(dict.fromkeys(friends))

def check_blockedList(blocker, blocked_user):
    blockedlist = BlockedList.objects.filter((Q(user1=blocker) & Q(user2=blocked_user))).first()
    beingblockedlist = BlockedList.objects.filter((Q(user1=blocked_user) & Q(user2=blocker))).first()
    if blockedlist:
        return blockedlist
    if beingblockedlist:
        return beingblockedlist
    return None

class BlockFriend(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        friend_username = kwargs.get('username')
        try:
            friend = User.objects.get(username=friend_username)
        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

        if request.user == friend:
            return Response({"error": "You cannot block yourself mf."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blocker = UserProfile.objects.get(user=request.user)
            blocked_user = UserProfile.objects.get(user=friend)
            # if check_blockedList(blocker, blocked_user):
            #     return Response({'error': 'You have already blocked this user'}, status=400)
            BlockedList.objects.create(blocker=blocker, blocked=blocked_user)
            return Response({'success': f'{blocked_user.user.username} has been blocked.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

class UnBlockFriend(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        friend_username = kwargs.get('username')
        try:
            friend = User.objects.get(username=friend_username)
        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

        try:
            blocker = UserProfile.objects.get(user=request.user)
            blocked_user = UserProfile.objects.get(user=friend)
            BlockedList.objects.get(blocker=blocker, blocked=blocked_user).delete()
            return Response({'success': f'{blocked_user.user.username} has been Unblocked.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'You have not blocked this user'}, status=404)


class CheckBlockedList(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        blocker_username = kwargs.get('blocker_username')
        blocked_username = kwargs.get('blocked_username')
        try:
            blocker = User.objects.get(username=blocker_username)
            blocked_user = User.objects.get(username=blocked_username)
        except User.DoesNotExist:
            return Response({"error": "One or both users do not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Check blocked list
        block_status = check_blockedList(blocker, blocked_user)
        if block_status:
            return Response({"status": "Blocked", "details": str(block_status)}, status=status.HTTP_200_OK)
        return Response({"status": "Not Blocked"}, status=status.HTTP_200_OK)

# def GetAllBlockedMembers(blocker):
#     blockedlist = BlockedList.objects.filter(Q(blocker=blocker) | Q(blocked=blocker))
#     # blockedlist = BlockedList.objects.filter(Q(user1=blocker) | Q(user2=blocked_user)).first()

class GetBlockList(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        blocker = UserProfile.objects.get(user=request.user)

        # block_status = GetAllBlockedMembers(blocker)
        blockedlist = BlockedList.objects.filter(Q(blocker=blocker))
        blocked_data = []
        if blockedlist.exists():
            blocked_data = [blocked.blocked.user.username for blocked in blockedlist]
            return JsonResponse({"blocked_users": blocked_data})
        return JsonResponse({"blocked_users": blocked_data}, status=200)
        # return Response({"status": "Not Blocked"}, status=status.HTTP_200_OK)

def check_friend_req(requester, accepter):
    notification = Notifications.objects.filter(
        (Q(user1=requester, user2=accepter) | Q(user1=accepter, user2=requester))
    ).first()
    return notification


class FriendReqState(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        friend_username = kwargs.get('username')
        try:
            friend = User.objects.get(username=friend_username)
        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)
        user_profile = UserProfile.objects.get(user=request.user)
        for friend in user_profile.friends.all():
            if friend.username == friend_username:
                return Response({"FriendReqState": "Accepted"}, status=status.HTTP_200_OK)
        friend_profile = UserProfile.objects.get(user=friend)
        notification = check_friend_req(user_profile, friend_profile)
        if notification:
            return Response({"FriendReqState": "Pending"}, status=status.HTTP_200_OK)
        return Response({"FriendReqState": "Default"}, status=status.HTTP_200_OK)

class RejectFriend(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        friend_username = kwargs.get('username')
        try:
            friend = User.objects.get(username=friend_username)
        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

        user_profile = UserProfile.objects.get(user=request.user)
        friend_profile = UserProfile.objects.get(user=friend)
        notification = check_friend_req(friend_profile, user_profile)
        if notification:
            notification.delete()
            return Response({"success": "success"}, status=status.HTTP_200_OK)
        return Response({"error": "fail"}, status=status.HTTP_200_OK)
#------------------------ End of idryab--------------------------------------------------------------------

class UserProfileView(APIView):
    permission_classes = [AllowAny]  # Autoriser les utilisateurs non authentifiés (à modifier si nécessaire)

    def get(self, request, *args, **kwargs):
        # Récupérer le profil de l'utilisateur actuel
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            raise NotFound("User profile not found.")

        # Sérialiser et renvoyer le profil
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # Récupérer le profil de l'utilisateur
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            raise NotFound("User profile not found.")
        
        # Mettre à jour le statut 'is_online' depuis les données du frontend
        is_online = request.data.get('is_online')
        if is_online is not None:
            profile.is_online = is_online
            profile.save()

        # Sérialiser et renvoyer le profil mis à jour
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

#------------------------------------------------------------------------#

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

#------------------------------------------------------------------------#



class AddFriendView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        friend_username = kwargs.get('username')
        try:
            friend = User.objects.get(username=friend_username)
        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

        if request.user == friend:
            return Response({"error": "You cannot add yourself as a friend."}, status=status.HTTP_400_BAD_REQUEST)

        user_profile = UserProfile.objects.get(user=request.user)
        friend_profile = UserProfile.objects.get(user=friend)

        user_profile.friends.add(friend)
        friend_profile.friends.add(request.user)
        notification = check_friend_req(friend_profile, user_profile)
        if notification:
            notification.delete()
        return Response({"success": "Friend added."}, status=status.HTTP_200_OK)

class ListFriendsView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def get_queryset(self):
        user_profile = UserProfile.objects.get(user=self.request.user)
        return user_profile.friends.all()

class RemoveFriendView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        friend_username = kwargs.get('username')
        try:
            friend = User.objects.get(username=friend_username)
        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

        if request.user == friend:
            return Response({"error": "You cannot remove yourself as a friend."}, status=status.HTTP_400_BAD_REQUEST)

        user_profile = UserProfile.objects.get(user=request.user)
        friend_profile = UserProfile.objects.get(user=friend)

        user_profile.friends.remove(friend)
        friend_profile.friends.remove(request.user)

        return Response({"success": "Friend removed."}, status=status.HTTP_200_OK)

class FriendProfileView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserProfileSerializer

    def get_object(self):
        username = self.kwargs.get('username')
        try:
            user = User.objects.get(username=username)
            profile = UserProfile.objects.get(user=user)
        except User.DoesNotExist:
            return Response({"success": {}}, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({"success": {}}, status=status.HTTP_200_OK)
        return profile

#------------------------------------------------------------------------#

class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            profile.is_online = False
            profile.save()

            # Blacklist the refresh token
            refresh_token = request.data.get("refresh_token")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            return Response({"success": "Logged out successfully."}, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({"error": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

#------------------------------------------------------------------------#

class UserSettingsView(APIView):
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request):
        user = request.user
        data = request.data

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        new_password = data.get('new_password')
        profile_image = data.get('profile_image')

        # if not user.check_password(password):
        #     return Response({"error": "Incorrect current password"}, status=status.HTTP_400_BAD_REQUEST)

        if username:
            user.username = username

        if new_password:
            user.set_password(new_password)

        if profile_image:
            user.profile.profile_image = profile_image
        
        if email:
            user.email = email

        user.save()
        user.profile.save()

        return Response({"success": "Profile updated successfully"}, status=status.HTTP_200_OK)

#------------------------------------------------------------------------#

class SearchUserView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        username = request.GET.get('username')
        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
            profile = UserProfile.objects.get(user=user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

#------------------------------------------------------------------------#

class GameResultView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        username = request.GET.get('username')  # Retrieve the username from the query parameters
        
        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Filter games where the user is either player1 or player2
            games = GameResult.objects.filter(player1=username) | GameResult.objects.filter(player2=username)
            
            # Check if games exist for the given username
            if not games.exists():
                return Response({"message": "No games found for this user."}, status=status.HTTP_200_OK)

            serializer = GameResultSerializer(games, many=True)  # Serialize the game results
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"success": str(e)}, status=status.HTTP_200_OK)



class LeaderboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profiles = UserProfile.objects.all().order_by('score').reverse()
        serializer = UserProfileSerializer(profiles, many=True)
        return Response(serializer.data)

#------------------------------------------------------------------------#

class AnonymizeDataView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        user = request.user

        profile = UserProfile.objects.get(user=user)
        profile.username = 'anonymized22_user'
        profile.email = f'anonymized22_{user.id}@example.com'
        profile.profile_image = 'profile_images/default_profile_image.jpg'
        profile.save()

        user.username = 'anonymized22_user'
        user.email = f'anonymized22_{user.id}@example.com'
        user.set_password('temporary_password')
        user.save()

        return Response({'message': 'Your data has been anonymized.'}, status=200)

#------------------------------------------------------------------------#


class UserInfoView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user
        data = {
            'username': user.username,
            'email': user.email,
        }
        return Response(data)


class DeleteUserView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request):
        user = request.user
        try:
            user.profile.delete()
            user.delete()
            return Response({"message": "User data deleted successfully"}, status=200)
        except Exception as e:
            return Response({"success": str(e)}, status=200)


class PermanentDeleteAccountView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        profile = UserProfile.objects.get(user=request.user)

        profile.is_deleted = True 
        profile.deleted_at = timezone.now()
        profile.save()
        
        return Response({'message': 'Your account has been marked for deletion. You can restore it within 30 days.'}, status=status.HTTP_200_OK)



class RestoreAccountView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        profile = UserProfile.objects.get(user=request.user)


        if not profile.is_deleted:
            return Response({'error': 'Your account is not marked for deletion.'}, status=status.HTTP_400_BAD_REQUEST)

        if timezone.now() - profile.deleted_at > timedelta(days=30):
            return Response({'error': 'The restoration period has expired.'}, status=status.HTTP_400_BAD_REQUEST)

        profile.is_deleted = False
        profile.deleted_at = None
        profile.save()

        return Response({'message': 'Your account has been restored.'}, status=status.HTTP_200_OK)


class UserIsDeletedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({'is_deleted': user.profile.is_deleted})


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        id_token = request.data.get('id_token')
        if not id_token:
            return JsonResponse({'error': 'ID token is required'}, status=400)

        try:
            # Verify the token with Google's OAuth2 API
            response = requests.get(
                'https://oauth2.googleapis.com/tokeninfo',
                params={'id_token': id_token}
            )
            id_info = response.json()

            if 'error' in id_info:
                return JsonResponse({'error': id_info['error_description']}, status=400)

            user_info = {
                'email': id_info['email'],
                'username': id_info['name'].split()[0],
            }

            User = get_user_model()
            user, created = User.objects.get_or_create(email=user_info['email'], defaults={'username': user_info['username']})

            if created:
                user.set_unusable_password()
                user.save()

            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            # login(request, user)
            return JsonResponse({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        except Exception as e:
            return JsonResponse({'success': str(e)}, status=200)


from urllib.parse import urlparse
from django.core.files.base import ContentFile
from django.conf import settings
from django.db import IntegrityError


class IntraLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get("code")
        client_id = os.getenv("VITE_CLIENT_ID")
        client_secret = os.getenv("VITE_CLIENT_SECRET")
        redirect_uri = os.getenv("VITE_REDIRECT_URI")

        # Step 1: Retrieve Access Token
        token_response = requests.post(
            "https://api.intra.42.fr/oauth/token",
            data={
                "grant_type": "authorization_code",
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code,
                "redirect_uri": redirect_uri,
            },
        )

        if token_response.status_code != 200:
            return Response(
                {"error": "Failed to retrieve access token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        access_token = token_response.json().get("access_token")

        # Step 2: Get User Information
        info_response = requests.get(
            "https://api.intra.42.fr/v2/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        if info_response.status_code != 200:
            return Response(
                {"error": "Failed to retrieve user information."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_data = info_response.json()
        email = user_data.get("email")
        login = user_data.get("login")
        image_large = user_data.get("image", {}).get("versions", {}).get("large")

        try:
            # Step 3: Create or Retrieve User
            user, created = User.objects.get_or_create(
                username=login,
                email=email,
            )

            # Step 4: Download and Save the Profile Image
            if image_large:
                filename = os.path.basename(urlparse(image_large).path)  # Extract filename
                response = requests.get(image_large)

                if response.status_code == 200:
                    media_path = os.path.join(settings.MEDIA_ROOT, filename)
                    with open(media_path, 'wb') as f:
                        f.write(response.content)

            # Step 5: Create or Update UserProfile with the downloaded image
            user_profile, profile_created = UserProfile.objects.get_or_create(user=user)
            if profile_created or user_profile.profile_image != filename:
                user_profile.profile_image = filename  # Save filename relative to MEDIA_ROOT
                user_profile.save()

            # Update email if necessary
            if not created and user.email != email:
                user.email = email
                user.save()

        except IntegrityError:
            return Response(
                {"error": "A user with this username already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Step 6: Generate Tokens
        refresh = RefreshToken.for_user(user)

        # Step 7: Return Tokens and User Info
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )


# @shared_task
# def delete_old_accounts():
#     retention_period = timedelta(days=30)
#     threshold_date = timezone.now() - retention_period
#     User.objects.filter(is_deleted=True, deleted_at__lt=threshold_date).delete()

class SendVerificationCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        # Generate and save the verification code
        code = VerificationCode.generate_code()
        VerificationCode.objects.create(user=user, code=code)

        # Send the code to the user's email
        send_mail(
            'Your verification code',
            f'Your verification code is: {code}',
            'your_email@example.com',
            [user.email],
            fail_silently=False,
        )

        return Response({"success": "Verification code sent"}, status=200)

#------------------------------------------------------------------------#

class VerifyCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        code = request.data.get('code')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        try:
            verification_code = VerificationCode.objects.filter(
                user=user, 
                code=code,
                created_at__gte=timezone.now() - timedelta(minutes=1)
            ).latest('created_at')
        except VerificationCode.DoesNotExist:
            return Response({"error": "Invalid or expired code"}, status=400)

        return Response({"success": "Code verified"}, status=200)


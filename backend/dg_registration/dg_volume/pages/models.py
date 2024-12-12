from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
import random
import string


# -----------------------------> Game start
import json
from django.core.serializers.json import DjangoJSONEncoder

class GameResult(models.Model):
    placeholder_user = User.objects.first()
    player1 = models.CharField(max_length=50, default='user1')
    player2 = models.CharField(max_length=50, default='user2')
    imagePlayer1 = models.ImageField(upload_to='game_images/', default='game_images/default_game_image.jpg', null=True, blank=True)
    imagePlayer2 = models.ImageField(upload_to='game_images/', default='game_images/default_game_image.jpg', null=True, blank=True)
    winner = models.CharField(max_length=50, default='root')
    player1_score = models.IntegerField()
    player2_score = models.IntegerField()
    player1_fit = models.IntegerField()
    player2_fit = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Game {self.id}: ({self.player1_score}-{self.player2_score})"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    level = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    loss = models.IntegerField(default=0)
    consecutive_wins = models.IntegerField(default=0)
    consecutive_los = models.IntegerField(default=0)
    max_consecutive_wins = models.IntegerField(default=0)
    max_consecutive_los = models.IntegerField(default=0)
    achievements = models.IntegerField(default=0)
    total_game = models.IntegerField(default=0)
    percent = models.IntegerField(default=0.0)
    score = models.IntegerField(default=0)

    score_table = models.JSONField(default=list, encoder=DjangoJSONEncoder)
    games = models.ManyToManyField(GameResult, related_name='games')

    is_online = models.BooleanField(default=False)
    profile_image = models.ImageField(upload_to='profile_images/', default='profile_images/default_profile_image.jpg', null=True, blank=True)
    friends = models.ManyToManyField(User, related_name='friends', blank=True)
    blocked_friends = models.ManyToManyField(User, related_name='blocked_friends', blank=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} Profile"

    #     def get_scores(self):
    #     """Return the scores as a list."""
    #     return json.loads(self.scores)

    def add_score(self, new_score):
        """Add a new score to the list of scores."""
        current_scores = self.get_scores()
        current_scores.append(new_score)
        self.scores = json.dumps(current_scores)
        self.save()
# -----------------------------> Game end

class VerificationCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_code():
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    instance.profile.save()

@receiver(pre_save, sender=User)
def check_unique_email(sender, instance, **kwargs):
    if User.objects.filter(email=instance.email).exclude(pk=instance.pk).exists():
        raise ValidationError("Email already exists.")



class FriendRequestModel(models.Model):
    requester = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='sent_request')
    accepter = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_request', null=True, blank=True)
    status = models.CharField(max_length=10)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.requester.username

#-----------------------------idryab---------------------------------------------

class ChatMessage(models.Model):
    sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_messages', null=True, blank=True)
    room = models.CharField(max_length=255, null=True, blank=True)  # for group chat or room-based chat
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender.username}: {self.content[:20]}'

class Chatgroups(models.Model):
    name = models.CharField(max_length=50)
    message = models.ForeignKey(ChatMessage, on_delete=models.CASCADE, related_name="g_message")


    def __str__(self):
        return f'{self.message.sender}'

class PrivateMessageModel(models.Model):
    sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='sent_prv_messages')
    receiver = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_prv_messages', null=True, blank=True)
    content = models.TextField()
    read_at = models.DateTimeField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def mark_as_read(self):
        self.read_at = models.DateTimeField(auto_now=True)
        self.save()

    def is_read(self):
        return self.read_at is not None

    def __str__(self):
        return f'{self.sender.user.username}: {self.content[:30]}'

class Conversation(models.Model):
    user1 = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="user1_conversations")
    user2 = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="user2_conversations")
    last_message_at = models.DateTimeField()

    class Meta:
        unique_together = ('user1', 'user2')  # Ensure that each pair is unique

    def __str__(self):
        # return f"Conversation between {self.user1__username} and {self.user2__username}"
        return "Conversation between"

class Notifications(models.Model):
    user1 = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="user1_notifications")
    user2 = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="user2_notifications")
    notify_at = models.DateTimeField()

    class Meta:
        unique_together = ('user1', 'user2')  # Ensure that each pair is unique

    def __str__(self):
        # return "Conversation between"
        return f"Notification between {self.user1.user.username} and {self.user2.user.username}"
        
#-----------------------------End of idryab---------------------------------------------
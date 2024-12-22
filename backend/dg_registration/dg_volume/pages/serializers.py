from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, BlockedList


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "email"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
        

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    friends = UserSerializer(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'username','level','wins','loss','consecutive_wins','consecutive_los','max_consecutive_wins','max_consecutive_los','achievements','total_game', 'percent', 'score', 'score_table', 'is_online', 'profile_image', 'friends', 'blocked_friends']


#-----------idryab--------------------------------------
from .models import PrivateMessageModel, Conversation

class MessageSerializer(serializers.ModelSerializer):
    senderName = serializers.SerializerMethodField()
    receiverName = serializers.SerializerMethodField()

    class Meta:
        model = PrivateMessageModel
        fields = ['id', 'sender', 'receiver', 'content', 'timestamp', 'senderName', 'receiverName']  # Adjust fields as necessary
    def get_senderName(self, obj):
        return obj.sender.user.username

    def get_receiverName(self, obj):
        return obj.receiver.user.username

class ConversationSerializer(serializers.ModelSerializer):
    senderName = serializers.SerializerMethodField()
    receiverName = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'user1', 'user2', 'last_message_at']
    # def get_senderName(self, obj):
    #     return obj.sender.user.username

    # def get_receiverName(self, obj):
    #     return obj.receiver.user.username

class BlockListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedList
        fields = ['id', 'blocker', 'blocked', 'blocked_at']
#-----------End of idryab--------------------------------------


#-----------Game --------------------------------------
from .models import GameResult

class GameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameResult
        fields = '__all__'  # Sérialise tous les champs

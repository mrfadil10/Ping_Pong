from django.contrib import admin
from .models import GameResult, UserProfile, PrivateMessageModel, Conversation, Notifications

# Register your models here.

# Game
admin.site.register(GameResult)
admin.site.register(UserProfile)
admin.site.register(PrivateMessageModel)
admin.site.register(Conversation)
admin.site.register(Notifications)
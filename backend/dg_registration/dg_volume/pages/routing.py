from django.urls import path
from . import consumers
from django.urls import re_path

# Define WebSocket URL patterns
websocket_urlpatterns = [
    path('api/ws/chat/<str:room_name>/', consumers.chat.as_asgi()),
    path('api/ws/prvchat/<str:room_name>/', consumers.PrivateChat.as_asgi()),
    #new_route
    path('api/ws/friend_req/<str:accepter_name>/', consumers.PrivateChat.as_asgi()),
    path('api/ws/pong/<str:room_name>/', consumers.PongConsumer.as_asgi())
]
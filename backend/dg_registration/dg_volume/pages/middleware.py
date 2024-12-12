from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken, TokenError
from pages.models import UserProfile
from rest_framework_simplejwt.authentication import JWTAuthentication

# class TokenExpirationMiddleware(MiddlewareMixin):

#     def process_request(self, request):
#         auth = JWTAuthentication()
#         try:
#             validated_token = auth.get_validated_token(request.headers.get('Authorization').split()[1])
#             user = auth.get_user(validated_token)
#             if not user.is_authenticated:
#                 return
#         except (TokenError, AttributeError):
#             user = None

#         if user:
#             profile = UserProfile.objects.get(user=user)
#             profile.is_online = True
#             profile.save()
#         else:
#             # Update the status to offline
#             if request.user.is_authenticated:
#                 profile = UserProfile.objects.get(user=request.user)
#                 profile.is_online = False
#                 profile.save()
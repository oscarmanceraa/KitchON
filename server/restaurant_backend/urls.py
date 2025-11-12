"""
URL configuration for restaurant_backend project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('health', lambda request: __import__('django.http').http.JsonResponse({'status': 'ok', 'message': 'Server is running'})),
]


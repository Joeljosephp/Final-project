from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
import datetime

# pyrefly: ignore [missing-import]
from .models import Habit, HabitLog
# pyrefly: ignore [missing-import]
from .serializers import HabitSerializer, HabitLogSerializer

class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer

    def get_queryset(self):
        # SECURITY: Ensure users never see each other's data
        return Habit.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # SECURITY: Automatically attach the logged-in user to the new habit
        serializer.save(owner=self.request.user)

    # We renamed this from toggle_log to log_progress to make more sense
    @action(detail=True, methods=['post'])
    def log_progress(self, request, pk=None):
        habit = self.get_object()
        date_str = request.data.get('date', datetime.date.today().isoformat())
        
        # Get the log if it exists, otherwise create an empty one for that day
        log, created = HabitLog.objects.get_or_create(
            habit=habit, 
            date=date_str
        )
        
        # 1. Handle Numeric Habits (e.g., drank 3 out of 4 liters)
        if habit.is_numeric:
            amount = int(request.data.get('amount_done', 0))
            log.amount_done = amount
            # Automatically check it off if they hit their target!
            log.is_done = amount >= habit.target_amount
            
        # 2. Handle Simple Checkbox Habits
        else:
            # If React sends a specific True/False, use it
            if 'is_done' in request.data:
                log.is_done = request.data.get('is_done')
            # Otherwise, just flip it like a light switch
            else:
                log.is_done = not log.is_done if not created else True
                
        # 3. Handle Note if provided
        if 'note' in request.data:
            log.note = request.data.get('note')
            
        log.save()
            
        return Response(HabitLogSerializer(log).data)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=username, 
            password=password, 
            email=email, 
            first_name=first_name, 
            last_name=last_name
        )
        return Response({'success': 'User created successfully'}, status=status.HTTP_201_CREATED)
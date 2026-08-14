from django.db import models
from django.contrib.auth.models import User

class Habit(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    
    # 1. Categories & Color-Coding
    category = models.CharField(max_length=50, default='General')
    color = models.CharField(max_length=20, default='#4F46E5') # Default minimalist indigo
    
    # 2. Flexible Targets
    is_numeric = models.BooleanField(default=False) # False = Checkbox, True = Number tracker
    target_amount = models.IntegerField(default=1)  # e.g., 4 (liters), 20 (pages)
    unit = models.CharField(max_length=50, blank=True, default='') # e.g., 'liters', 'pages'
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, related_name='logs', on_delete=models.CASCADE)
    date = models.DateField()
    
    # For simple Checkbox habits
    is_done = models.BooleanField(default=False)
    
    # For Numeric habits (e.g., read 15 out of 20 pages)
    amount_done = models.IntegerField(default=0)
    
    # Optional note for the daily log
    note = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('habit', 'date')

    def __str__(self):
        return f"{self.habit.name} - {self.date}"
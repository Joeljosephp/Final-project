from django.contrib import admin
# pyrefly: ignore [missing-import]
from .models import Habit, HabitLog

admin.site.register(Habit)
admin.site.register(HabitLog)
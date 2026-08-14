from rest_framework import serializers
from datetime import date, timedelta
# pyrefly: ignore [missing-import]
from .models import Habit, HabitLog

class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        # Added amount_done and note for numeric tracking and journaling
        fields = ['id', 'date', 'is_done', 'amount_done', 'note']

class HabitSerializer(serializers.ModelSerializer):
    logs = HabitLogSerializer(many=True, read_only=True)
    
    # This creates a dynamic field that calculates on the fly
    current_streak = serializers.SerializerMethodField()

    class Meta:
        model = Habit
        # Added all the new fields from our model
        fields = [
            'id', 'name', 'category', 'color', 
            'is_numeric', 'target_amount', 'unit', 
            'created_at', 'logs', 'current_streak'
        ]

    def get_current_streak(self, obj):
        # 1. Gather all logs and figure out which days were successfully completed
        completed_dates = {}
        for log in obj.logs.all():
            if obj.is_numeric:
                completed_dates[log.date] = log.amount_done >= obj.target_amount
            else:
                completed_dates[log.date] = log.is_done

        # 2. Start counting backwards from today
        streak = 0
        check_date = date.today()

        # If today isn't done, we allow the streak to still be "alive" if yesterday was done
        if not completed_dates.get(check_date):
            check_date -= timedelta(days=1)
            # If yesterday wasn't done either, the streak is broken (0)
            if not completed_dates.get(check_date):
                return 0

        # 3. Keep counting backwards until we hit a day that wasn't completed
        while completed_dates.get(check_date):
            streak += 1
            check_date -= timedelta(days=1)

        return streak
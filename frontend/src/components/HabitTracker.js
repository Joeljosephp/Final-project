import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Trash2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const HabitTracker = () => {
    const [habits, setHabits] = useState([]);
    const [dates, setDates] = useState([]);
    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitColor, setNewHabitColor] = useState('#00f3ff');

    const [viewEndDate, setViewEndDate] = useState(new Date());

    useEffect(() => {
        // Generate the last 7 days ending at viewEndDate
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date(viewEndDate);
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        setDates(last7Days);
        fetchHabits();
    }, [viewEndDate]);

    const shiftWeek = (direction) => {
        const newDate = new Date(viewEndDate);
        newDate.setDate(newDate.getDate() + (direction * 7));
        setViewEndDate(newDate);
    };

    const handleDateChange = (e) => {
        if (e.target.value) {
            const [year, month, day] = e.target.value.split('-');
            const newDate = new Date(year, month - 1, day);
            setViewEndDate(newDate);
        }
    };

    const fetchHabits = async () => {
        try {
            const response = await api.get('/habits/');
            setHabits(response.data);
        } catch (error) {
            console.error("Error fetching habits", error);
        }
    };

    const addHabit = async (e) => {
        e.preventDefault();
        if (!newHabitName.trim()) return;

        let color = newHabitColor || '#00f3ff';

        try {
            await api.post('/habits/', {
                name: newHabitName,
                category: 'General',
                color: color,
            });
            setNewHabitName('');
            fetchHabits();
        } catch (error) {
            console.error("Error adding habit", error);
        }
    };

    const toggleHabit = async (habitId, date) => {
        try {
            await api.post(`/habits/${habitId}/log_progress/`, { date });
            fetchHabits();
        } catch (error) {
            console.error("Error toggling habit", error);
        }
    };

    const deleteHabit = async (habitId) => {
        try {
            await api.delete(`/habits/${habitId}/`);
            fetchHabits();
        } catch (error) {
            console.error("Error deleting habit", error);
        }
    };

    const getLogStatus = (habit, date) => {
        const log = habit.logs.find(l => l.date === date);
        return log ? log.is_done : false;
    };

    // Format date nicely (e.g. "Aug 14")
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            monthDay: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };
    };

    return (
        <div className="w-full p-2 lg:p-4 font-sans mt-2 text-white">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Controls Area (Add Habit + Date Navigator) */}
                <div className="flex flex-col xl:flex-row gap-4">
                    {/* Add Habit Form */}
                    <div className="flex-1 backdrop-blur-md bg-black/40 border border-white/10 p-4 rounded-xl shadow-2xl flex flex-col justify-center">
                        <form onSubmit={addHabit} className="flex gap-3">
                            <div className="flex bg-white/5 border border-white/10 rounded-lg items-center px-3 focus-within:ring-1 focus-within:ring-[#00f3ff] transition-all" title="Choose Habit Color">
                                <input
                                    type="color"
                                    value={newHabitColor}
                                    onChange={(e) => setNewHabitColor(e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="ADD NEW HABIT..."
                                value={newHabitName}
                                onChange={(e) => setNewHabitName(e.target.value)}
                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-medium placeholder-gray-400 focus:ring-1 focus:ring-[#00f3ff] focus:border-[#00f3ff] outline-none transition-all uppercase tracking-widest text-sm shadow-inner"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 border border-[#00f3ff]/40 text-[#00f3ff] bg-[#00f3ff]/10 font-bold rounded-lg hover:bg-[#00f3ff]/20 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all uppercase tracking-widest text-sm shadow-lg"
                            >
                                Add
                            </button>
                        </form>
                    </div>

                    {/* Date Navigator */}
                    <div className="backdrop-blur-md bg-black/40 border border-white/10 p-4 rounded-xl shadow-2xl flex flex-col justify-center items-center gap-2">
                        <div className="text-gray-400 text-[0.65rem] tracking-[0.2em] uppercase font-semibold">Date Range</div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => shiftWeek(-1)}
                                className="p-1.5 border border-white/10 rounded-md hover:bg-white/10 hover:border-[#00f3ff] transition-colors text-[#00f3ff]"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <div className="relative group flex items-center">
                                <Calendar size={14} className="text-gray-400 absolute left-3 pointer-events-none" />
                                <input
                                    type="date"
                                    value={viewEndDate.toISOString().split('T')[0]}
                                    onChange={handleDateChange}
                                    className="pl-9 pr-2 py-1.5 bg-white/5 border border-white/10 rounded-md text-white text-xs font-mono focus:ring-1 focus:ring-[#00f3ff] outline-none cursor-pointer"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>

                            <button
                                onClick={() => shiftWeek(1)}
                                className="p-1.5 border border-white/10 rounded-md hover:bg-white/10 hover:border-[#00f3ff] transition-colors text-[#00f3ff]"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* The Grid */}
                <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-full">
                            <thead>
                                <tr className="bg-black/40 border-b border-white/10">
                                    <th className="p-3 font-bold tracking-widest text-gray-300 text-xs w-1/4 uppercase">Habit</th>
                                    <th className="p-3 font-bold tracking-widest text-gray-300 text-xs text-center uppercase">Streak</th>
                                    {dates.map(date => {
                                        const { day, monthDay } = formatDate(date);
                                        return (
                                            <th key={date} className="p-2 text-center">
                                                <div className="text-gray-400 text-[0.65rem] font-bold uppercase tracking-widest">{day}</div>
                                                <div className="text-gray-200 text-xs font-mono tracking-wider mt-0.5">{monthDay}</div>
                                            </th>
                                        );
                                    })}
                                    <th className="p-3 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {habits.map(habit => (
                                    <tr key={habit.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-3">
                                            <div className="font-semibold tracking-wide text-sm flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color || '#00f3ff' }}></div>
                                                {habit.name}
                                            </div>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold font-mono rounded-md bg-[#ffaa00]/10 border border-[#ffaa00]/40 text-[#ffaa00] shadow-[0_0_10px_rgba(255,170,0,0.1)]">
                                                {habit.current_streak} DAYS
                                            </span>
                                        </td>
                                        {dates.map(date => {
                                            const isDone = getLogStatus(habit, date);
                                            return (
                                                <td key={date} className="p-2 text-center">
                                                    <button
                                                        onClick={() => toggleHabit(habit.id, date)}
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all duration-300 border text-sm ${isDone
                                                                ? 'bg-[#00f3ff]/20 text-[#00f3ff] border-[#00f3ff]/50 shadow-[0_0_15px_rgba(0,243,255,0.4)] scale-110 font-bold'
                                                                : 'bg-white/5 border-white/20 text-white/30 hover:bg-white/10 hover:border-white/40 hover:text-white/50 hover:scale-105'
                                                            }`}
                                                    >
                                                        {isDone ? '●' : '○'}
                                                    </button>
                                                </td>
                                            )
                                        })}
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => deleteHabit(habit.id)}
                                                className="text-gray-600 hover:text-[#ff0044] transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete Habit"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {habits.length === 0 && (
                                    <tr>
                                        <td colSpan={10} className="p-12 text-center">
                                            <div className="text-gray-500 tracking-[0.2em] uppercase text-sm">No habits found. Add one above.</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HabitTracker;
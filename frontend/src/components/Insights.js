import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Insights = () => {
    const [chartData, setChartData] = useState([]);
    const [activeHabits, setActiveHabits] = useState([]);
    
    useEffect(() => {
        const fetchAndProcessData = async () => {
            try {
                const response = await api.get('/habits/');
                const habits = response.data;
                
                // Track each habit separately
                const uniqueHabits = habits.map(h => ({ name: h.name, color: h.color || '#00f3ff' }));
                setActiveHabits(uniqueHabits);

                // Process the data to show if a habit was completed per day
                const last7Days = [...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                }).reverse();

                const processedData = last7Days.map(date => {
                    const dataPoint = { 
                        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
                    };
                    
                    // Initialize habits to 0
                    uniqueHabits.forEach(h => dataPoint[h.name] = 0);

                    habits.forEach(habit => {
                        const log = habit.logs.find(l => l.date === date);
                        if (log && log.is_done) {
                            dataPoint[habit.name] = 1;
                        }
                    });
                    
                    return dataPoint;
                });

                setChartData(processedData);
            } catch (error) {
                console.error("Error fetching insights data", error);
            }
        };

        fetchAndProcessData();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/80 backdrop-blur-md border border-white/20 p-4 rounded-lg shadow-2xl min-w-[150px]">
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-3 border-b border-white/10 pb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center mb-1 text-sm font-mono">
                            <span style={{ color: entry.color }} className="mr-4 uppercase tracking-wider">{entry.name}</span>
                            <span className="font-bold text-white">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full p-4 lg:p-8 font-sans mt-4 text-white">
            <div className="max-w-4xl mx-auto space-y-8">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-light tracking-[0.2em] uppercase text-white mb-2 opacity-90">
                        Telemetry <span className="text-[#00f3ff]">Diagnostics</span>
                    </h2>
                    <p className="text-sm tracking-[0.1em] text-gray-400 uppercase">
                        Habit Resonance Over Last 7 Cycles
                    </p>
                </div>

                <div className="backdrop-blur-md bg-black/40 border border-white/10 p-4 lg:p-8 rounded-2xl shadow-2xl h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                stroke="rgba(255,255,255,0.2)" 
                                tick={{fill: '#9ca3af', fontSize: 12, fontFamily: 'JetBrains Mono'}} 
                                tickLine={false}
                                axisLine={false}
                                dy={15}
                            />
                            <YAxis 
                                stroke="rgba(255,255,255,0.2)" 
                                tick={{fill: '#9ca3af', fontSize: 12, fontFamily: 'JetBrains Mono'}} 
                                tickLine={false}
                                axisLine={false}
                                dx={-10}
                                allowDecimals={false}
                                domain={[0, 1]}
                                ticks={[0, 1]}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                            <Legend 
                                wrapperStyle={{ paddingTop: '20px', fontFamily: 'JetBrains Mono', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                iconType="circle"
                            />
                            
                            {activeHabits.map(habit => (
                                <Line 
                                    key={habit.name}
                                    type="monotone" 
                                    dataKey={habit.name} 
                                    name={habit.name}
                                    stroke={habit.color} 
                                    strokeWidth={3} 
                                    dot={{ fill: '#010103', stroke: habit.color, strokeWidth: 2, r: 4 }}
                                    activeDot={{ fill: habit.color, stroke: '#fff', strokeWidth: 2, r: 6 }}
                                    animationDuration={2000}
                                    animationEasing="ease-in-out"
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
};

export default Insights;

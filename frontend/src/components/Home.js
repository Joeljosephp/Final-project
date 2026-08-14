import React from 'react';
import { Mail, Phone, MapPin, Activity, Shield, Zap } from 'lucide-react';

const Home = () => {
    return (
        <div className="w-full p-4 lg:p-8 font-sans text-white max-w-4xl mx-auto space-y-12">
            
            {/* Hero Section */}
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                    Welcome to <span className="text-[#00f3ff]">Singularity</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Your central hub for personal telemetry and biometric tracking. Master your habits, visualize your data, and optimize your life.
                </p>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#00f3ff]/30 transition-all group">
                    <Activity className="text-[#00f3ff] mb-4 group-hover:scale-110 transition-transform" size={32} />
                    <h3 className="text-xl font-semibold mb-2">Habit Tracking</h3>
                    <p className="text-gray-400 text-sm">Monitor your daily parameters and maintain your streaks with our advanced telemetry grid.</p>
                </div>
                <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#bf00ff]/30 transition-all group">
                    <Zap className="text-[#bf00ff] mb-4 group-hover:scale-110 transition-transform" size={32} />
                    <h3 className="text-xl font-semibold mb-2">Insights</h3>
                    <p className="text-gray-400 text-sm">Gain deep diagnostic insights into your performance with interactive charts and analytics.</p>
                </div>
                <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#ffaa00]/30 transition-all group">
                    <Shield className="text-[#ffaa00] mb-4 group-hover:scale-110 transition-transform" size={32} />
                    <h3 className="text-xl font-semibold mb-2">Secure Data</h3>
                    <p className="text-gray-400 text-sm">Your biometric and cognitive data is encrypted and stored securely within the system.</p>
                </div>
            </div>

            {/* Contact Details Section */}
            <div className="backdrop-blur-md bg-black/40 border border-white/10 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6 tracking-wide uppercase text-gray-200">Contact & Support</h2>
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-[#00f3ff]">
                            <Mail size={24} />
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Email Support</div>
                            <div className="font-mono">support@singularity-tracker.io</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-[#ffaa00]">
                            <Phone size={24} />
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Comm Link</div>
                            <div className="font-mono">+91 8840778810</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-[#bf00ff]">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Headquarters</div>
                            <div className="font-mono">Nexus Core, Sector 7G</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center text-gray-600 text-xs tracking-widest uppercase pb-8">
                &copy; {new Date().getFullYear()} Singularity Systems. All rights reserved.
            </div>
        </div>
    );
};

export default Home;

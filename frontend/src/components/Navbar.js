import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const { logout } = useContext(AuthContext);
    const location = useLocation();

    // Helper to highlight the active tab
    const isActive = (path) => location.pathname === path 
        ? "text-[#00f3ff] border-b-2 border-[#00f3ff]" 
        : "text-gray-400 hover:text-white";

    return (
        <nav className="backdrop-blur-md bg-black/30 border-b border-white/10 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-light text-xl text-[#00f3ff] tracking-[0.3em] uppercase">∞ Singularity</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                            <Link 
                                to="/" 
                                className={`inline-flex items-center px-1 pt-1 text-xs md:text-sm font-medium transition-colors tracking-widest uppercase ${isActive('/')}`}
                            >
                                Home
                            </Link>
                            <Link 
                                to="/habits" 
                                className={`inline-flex items-center px-1 pt-1 text-xs md:text-sm font-medium transition-colors tracking-widest uppercase ${isActive('/habits')}`}
                            >
                                Habit Tracker
                            </Link>
                            <Link 
                                to="/insights" 
                                className={`inline-flex items-center px-1 pt-1 text-xs md:text-sm font-medium transition-colors tracking-widest uppercase ${isActive('/insights')}`}
                            >
                                Insights
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center ml-2">
                        <button 
                            onClick={logout} 
                            className="text-sm font-medium tracking-widest uppercase text-[#ff0044] hover:text-[#ff0044]/70 transition-colors border border-[#ff0044]/30 bg-[#ff0044]/10 hover:bg-[#ff0044]/20 px-4 py-1.5 rounded-full"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
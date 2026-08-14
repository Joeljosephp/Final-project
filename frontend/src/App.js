import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import HabitTracker from './components/HabitTracker';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Background3D from './components/Background3D';
import Insights from './components/Insights';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="flex min-h-screen text-white bg-[#010103] relative overflow-hidden">
      {/* Sidebar for 3D Background - absolute with mask for seamless fade */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ 
          width: isSidebarOpen ? '65%' : '100%',
          WebkitMaskImage: isSidebarOpen ? 'linear-gradient(to right, black 70%, transparent 100%)' : 'none', 
          maskImage: isSidebarOpen ? 'linear-gradient(to right, black 70%, transparent 100%)' : 'none' 
        }}
      >
        <Background3D />
      </div>
      
      {/* Tracker Explanation Text below Singularity */}
      <div className="absolute top-32 left-12 max-w-lg z-10 pointer-events-none transition-opacity duration-700 opacity-100 hidden lg:block">
        <h2 className="text-2xl font-light tracking-[0.2em] uppercase text-white/90 mb-3">
            About Singularity
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed tracking-wider">
            Singularity is an advanced telemetry engine designed to monitor and visualize your daily parameters. Track your habits, maintain streaks, and gain actionable insights into your performance through an immersive, data-driven interface.
        </p>
      </div>
      
      {/* Sliding Sidebar Drawer */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-[1000px] bg-black/50 backdrop-blur-2xl z-30 flex flex-col transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Toggle Arrow Button attached to the left edge of the sidebar */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-1/2 -left-12 -translate-y-1/2 w-12 h-24 bg-black/60 backdrop-blur-xl border border-r-0 border-white/10 rounded-l-2xl flex items-center justify-center text-white/50 hover:text-[#00f3ff] hover:bg-white/5 transition-all z-40 group shadow-[-10px_0_20px_rgba(0,0,0,0.5)] cursor-pointer"
          title="Toggle Telemetry Panel"
        >
          {isSidebarOpen ? <ChevronRight size={28} className="group-hover:scale-110 transition-transform" /> : <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />}
        </button>

        <Navbar />
        <main className="flex-1 overflow-y-auto p-2 lg:p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={
            <div className="flex min-h-screen text-white bg-[#010103] relative">
              {/* Left Side: Singularity absolute with mask */}
              <div 
                className="hidden lg:block absolute left-0 top-0 h-full w-[65%] pointer-events-none z-0"
                style={{ WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)', maskImage: 'linear-gradient(to right, black 60%, transparent 100%)' }}
              >
                <Background3D />
              </div>
              
              {/* Spacer */}
              <div className="hidden lg:block lg:w-1/2 relative z-10 pointer-events-none"></div>

              {/* Right Side: Login Form 50% */}
              <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-20 overflow-y-auto">
                <Login />
              </div>
            </div>
          } />

          <Route path="/register" element={
            <div className="flex min-h-screen text-white bg-[#010103] relative">
              {/* Left Side: Singularity absolute with mask */}
              <div 
                className="hidden lg:block absolute left-0 top-0 h-full w-[65%] pointer-events-none z-0"
                style={{ WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)', maskImage: 'linear-gradient(to right, black 60%, transparent 100%)' }}
              >
                <Background3D />
              </div>
              
              {/* Spacer */}
              <div className="hidden lg:block lg:w-1/2 relative z-10 pointer-events-none"></div>

              {/* Right Side: Register Form 50% */}
              <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-20 overflow-y-auto">
                <Register />
              </div>
            </div>
          } />
          
          {/* Protected Route */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Home />
                </AppLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/habits" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <HabitTracker />
                </AppLayout>
              </ProtectedRoute>
            } 
          />

          {/* Placeholder for the Stats page */}
          <Route 
            path="/insights" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Insights />
                </AppLayout>
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Invalid username or password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md font-sans">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-light tracking-[0.2em] uppercase text-[#00f3ff] mb-2 opacity-90">
                    Stable Singularity
                </h2>
                <p className="text-sm tracking-[0.1em] text-gray-400 uppercase">
                    Initialize Authentication
                </p>
            </div>

            <div className="backdrop-blur-md bg-black/40 border border-white/10 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="text-[#ff0044] text-sm text-center font-medium bg-red-900/20 border border-[#ff0044]/30 p-2 rounded">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium tracking-wider text-gray-300 uppercase">
                            Username
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-1 focus:ring-[#00f3ff] focus:border-[#00f3ff] sm:text-sm transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium tracking-wider text-gray-300 uppercase">
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-1 focus:ring-[#00f3ff] focus:border-[#00f3ff] sm:text-sm transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-2 px-4 border border-[#00f3ff]/30 rounded-md shadow-sm text-sm font-medium text-[#00f3ff] bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 focus:outline-none transition-all uppercase tracking-widest ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Authenticating...' : 'Login'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        to="/register"
                        className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#00f3ff] transition-colors inline-block"
                    >
                        Haven't made an account? Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
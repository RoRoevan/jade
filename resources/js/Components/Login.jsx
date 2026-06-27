import { useForm, Link } from '@inertiajs/react';
import { X, Mail, Lock } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/supabase';
import axios from 'axios';

const InputField = ({ id, name, type, value, onChange, placeholder, icon, error }) => (
    <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            {icon}
        </div>
        <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full p-3 pl-10 rounded-lg border bg-gray-50 ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-amber-500`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

export default function LoginModal({ onClose, onSwitchToRegister }) {
    const { data, setData, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [localProcessing, setLocalProcessing] = useState(false);
    const [localErrors, setLocalErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalProcessing(true);
        setLocalErrors({});

        try {
            // 1. Authenticate with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (authError) {
                setLocalErrors({ email: authError.message });
                setLocalProcessing(false);
                return;
            }

            const user = authData.user;
            const session = authData.session;

            if (!user || !session) {
                setLocalErrors({ email: 'Login succeeded, but no session details were found.' });
                setLocalProcessing(false);
                return;
            }

            // 2. Fetch user profile from Supabase public.users table
            const { data: profileData, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            let userData = {
                email: user.email,
                first_name: user.user_metadata?.first_name || '',
                last_name: user.user_metadata?.last_name || '',
                membership_tier: 'Seed',
                points: 0,
                is_admin: false,
            };

            if (profileError) {
                console.warn('Profile not found in Supabase users table, creating fallback...', profileError);
                // Fallback: create the public.users record if missing
                await supabase.from('users').insert({
                    id: user.id,
                    email: user.email,
                    first_name: user.user_metadata?.first_name || '',
                    last_name: user.user_metadata?.last_name || '',
                    membership_tier: 'Seed',
                    points: 0,
                    is_admin: false,
                });
            } else if (profileData) {
                userData = profileData;
            }

            // 3. Post session and profile to Laravel /auth-sync
            const syncResponse = await axios.post('/auth-sync', {
                access_token: session.access_token,
                user_data: userData,
            });

            if (syncResponse.data.status === 'success') {
                onClose();
                window.location.reload();
            } else {
                setLocalErrors({ email: 'Failed to sync authentication session with server.' });
            }
        } catch (err) {
            console.error('Login error:', err);
            setLocalErrors({ email: err.message || 'An unexpected login error occurred.' });
        } finally {
            setLocalProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-green-900">Welcome Back!</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Close">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <InputField
                        id="login_email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Email Address"
                        icon={<Mail className="w-5 h-5 text-gray-400" />}
                        error={localErrors.email}
                    />
                    <InputField
                        id="login_password"
                        name="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Password"
                        icon={<Lock className="w-5 h-5 text-gray-400" />}
                        error={localErrors.password}
                    />
                    <div className="flex justify-between items-center mb-6">
                        <label className="flex items-center text-sm text-gray-600">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded border-gray-300 text-green-800 shadow-sm focus:ring-green-700"
                            />
                            <span className="ml-2">Remember me</span>
                        </label>
                        <Link href="#" className="text-sm text-green-800 hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <button 
                        type="submit"
                        disabled={localProcessing}
                        className="w-full bg-green-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
                    >
                        {localProcessing ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?
                    <button 
                        onClick={onSwitchToRegister} 
                        className="font-semibold text-green-800 hover:underline ml-1"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
}
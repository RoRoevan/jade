import { useForm } from '@inertiajs/react';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';
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

export default function RegisterModal({ onClose, onSwitchToLogin }) {
    const { data, setData, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [localProcessing, setLocalProcessing] = useState(false);
    const [localErrors, setLocalErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalProcessing(true);
        setLocalErrors({});

        if (data.password !== data.password_confirmation) {
            setLocalErrors({ password_confirmation: 'Passwords do not match' });
            setLocalProcessing(false);
            return;
        }

        try {
            // 1. Sign up user with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        first_name: data.first_name,
                        last_name: data.last_name,
                    }
                }
            });

            if (authError) {
                setLocalErrors({ email: authError.message });
                setLocalProcessing(false);
                return;
            }

            const user = authData.user;
            const session = authData.session;

            if (!user) {
                setLocalErrors({ email: 'Registration succeeded, but user was not found.' });
                setLocalProcessing(false);
                return;
            }

            // 2. Write profile row into the public.users table in Supabase
            const { error: dbError } = await supabase.from('users').insert({
                id: user.id,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                membership_tier: 'Seed',
                points: 0,
                is_admin: false,
            });

            if (dbError) {
                console.error('Failed to create user record in Supabase database:', dbError);
            }

            // 3. Log user in on Laravel using the secure session token
            if (session?.access_token) {
                const syncResponse = await axios.post('/auth-sync', {
                    access_token: session.access_token,
                    user_data: {
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,
                        membership_tier: 'Seed',
                        points: 0,
                        is_admin: false,
                    }
                });

                if (syncResponse.data.status === 'success') {
                    onClose();
                    window.location.reload();
                } else {
                    setLocalErrors({ email: 'Failed to sync registration session with server.' });
                }
            } else {
                // If email confirmation is enabled and session is not active immediately
                setLocalErrors({ email: 'Registration successful! Please check your email to confirm your account before logging in.' });
            }
        } catch (err) {
            console.error('Registration error:', err);
            setLocalErrors({ email: err.message || 'An unexpected registration error occurred.' });
        } finally {
            setLocalProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-green-900">Create Account</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Close">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            id="first_name"
                            name="first_name"
                            type="text"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            placeholder="First Name"
                            icon={<UserIcon className="w-5 h-5 text-gray-400" />}
                            error={localErrors.first_name}
                        />
                        <InputField
                            id="last_name"
                            name="last_name"
                            type="text"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            placeholder="Last Name"
                            icon={<UserIcon className="w-5 h-5 text-gray-400" />}
                            error={localErrors.last_name}
                        />
                    </div>
                    <InputField
                        id="signup_email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Email Address"
                        icon={<Mail className="w-5 h-5 text-gray-400" />}
                        error={localErrors.email}
                    />
                    <InputField
                        id="signup_password"
                        name="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Password"
                        icon={<Lock className="w-5 h-5 text-gray-400" />}
                        error={localErrors.password}
                    />
                    <InputField
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Confirm Password"
                        icon={<Lock className="w-5 h-5 text-gray-400" />}
                        error={localErrors.password_confirmation}
                    />
                    <button 
                        type="submit"
                        disabled={localProcessing}
                        className="w-full bg-green-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition mt-2"
                    >
                        {localProcessing ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?
                    <button 
                        onClick={onSwitchToLogin} 
                        className="font-semibold text-green-800 hover:underline ml-1"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}
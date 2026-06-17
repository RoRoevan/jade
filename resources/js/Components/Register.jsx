import { useForm } from '@inertiajs/react';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';

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
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register', {
            onSuccess: () => onClose(),
        });
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
                            error={errors.first_name}
                        />
                        <InputField
                            id="last_name"
                            name="last_name"
                            type="text"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            placeholder="Last Name"
                            icon={<UserIcon className="w-5 h-5 text-gray-400" />}
                            error={errors.last_name}
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
                        error={errors.email}
                    />
                    <InputField
                        id="signup_password"
                        name="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Password"
                        icon={<Lock className="w-5 h-5 text-gray-400" />}
                        error={errors.password}
                    />
                    <InputField
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Confirm Password"
                        icon={<Lock className="w-5 h-5 text-gray-400" />}
                        error={errors.password_confirmation}
                    />
                    <button 
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition mt-2"
                    >
                        {processing ? 'Creating account...' : 'Sign Up'}
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
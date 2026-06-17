import { useForm, usePage, Link, router } from '@inertiajs/react';
import { useCart } from '@/Components/CartModal.jsx';
import { Mail, User, MapPin, Phone, CreditCard, Lock } from 'lucide-react';
import { useState } from 'react';
import visaLogo from '../../assets/visa-mastercard.png';
import gcashLogo from '../../assets/gcash.png';
import mayaLogo from '../../assets/maya.png';
import grabpayLogo from '../../assets/grabpay.png';
import bpiLogo from '../../assets/bpi.png';
import atomeLogo from '../../assets/atome.svg';
import billeaseLogo from '../../assets/billease.svg';

const InputField = ({ id, name, type, placeholder, icon, value, onChange, error }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {placeholder}
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                {icon}
            </div>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={`Enter your ${placeholder.toLowerCase()}`}
                className={`w-full p-3 pl-10 rounded-lg border bg-gray-50 ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-700`}
            />
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

export default function Checkout() {
    const { auth } = usePage().props;
    const { cartItems, subtotal, clearCart } = useCart();

    const tier = new URLSearchParams(window.location.search).get('tier'); 
    const isMembership = !!tier; 
    const membershipPrices = {
        Seed: 0,
        Tree: 2999,
    };

    const [shippingCost] = useState(isMembership ? 0.00 : 50.00);
    const baseSubtotal = isMembership ? membershipPrices[tier] || 0 : subtotal;
    const total = baseSubtotal + shippingCost;

    const { data, setData, post, processing, errors } = useForm({
        email: auth.user?.email || '',
        first_name: auth.user?.first_name || '',
        last_name: auth.user?.last_name || '',
        phone: '',
        address: '',
        payment_method: 'card', 
    });

    const paymentOptions = [
    { id: 'card', name: 'Visa / Mastercard', logo: visaLogo },
    { id: 'gcash', name: 'GCash', logo: gcashLogo },
    { id: 'maya', name: 'Maya', logo: mayaLogo },
    { id: 'grabpay', name: 'GrabPay', logo: grabpayLogo },
    { id: 'bpi', name: 'BPI Online', logo: bpiLogo },
    { id: 'atome', name: 'Atome', logo: atomeLogo },
    { id: 'billease', name: 'BillEase', logo: billeaseLogo }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isMembership) {
            router.post('/subscribe', { tier });
        } else {
            const orderData = {
            shipping: data,
            items: cartItems,
            subtotal: subtotal,
            shippingCost: shippingCost,
            total: total
            };
            sessionStorage.setItem('latestOrder', JSON.stringify(orderData));
            clearCart();
            router.visit('/orders');
        }
    };


    return (
        <div className="bg-white">
            <section className="py-20 bg-gradient-to-br from-green-50 to-amber-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold text-green-900 mb-4">
                        Checkout
                    </h1>
                    {isMembership && (
                        <p className="text-xl text-green-900 font-medium mt-2">
                            You are subscribing to the <span className="capitalize">{tier}</span> plan
                        </p>
                    )}
                    <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                        You're almost there! Please complete your order.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        <div className="lg:col-span-1 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold text-green-900">Contact Information</h2>
                                <InputField
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    icon={<Mail className="w-5 h-5 text-gray-400" />}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    error={errors.email}
                                />
                            </div>

                            {!isMembership && (
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-green-900">Shipping Address</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        placeholder="First Name"
                                        icon={<User className="w-5 h-5 text-gray-400" />}
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        error={errors.first_name}
                                    />
                                    <InputField
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        placeholder="Last Name"
                                        icon={<User className="w-5 h-5 text-gray-400" />}
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        error={errors.last_name}
                                    />
                                    </div>
                                    <InputField
                                    id="address"
                                    name="address"
                                    type="text"
                                    placeholder="Address (Street, Brgy, City, Postal Code)"
                                    icon={<MapPin className="w-5 h-5 text-gray-400" />}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    error={errors.address}
                                    />
                                    <InputField
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone Number"
                                    icon={<Phone className="w-5 h-5 text-gray-400" />}
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    error={errors.phone}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-1 space-y-4">
                            <h2 className="text-2xl font-semibold text-green-900">Payment Method</h2>
                            <div className="space-y-3">
                                {paymentOptions.map((option) => (
                                    <label
                                        key={option.id}
                                        htmlFor={option.id}
                                        className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                                            data.payment_method === option.id
                                                ? 'border-green-700 ring-2 ring-green-700'
                                                : 'border-gray-300'
                                        }`}
                                    >
                                        <input
                                            id={option.id}
                                            type="radio"
                                            name="payment_method"
                                            value={option.id}
                                            checked={data.payment_method === option.id}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="h-4 w-4 text-green-800 focus:ring-green-700"
                                        />
                                        <div className="ml-3 flex items-center space-x-2">
                                            <span className="font-medium text-gray-800">{option.name}</span>
                                                <img
                                                    src={option.logo}
                                                    alt={option.name}
                                                    className="h-5 w-auto object-contain"
                                                />
                                        </div>

                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 sticky top-24">
                                <h2 className="text-2xl font-semibold text-green-900 mb-6">Order Summary</h2>
                                
                                <div className="divide-y divide-gray-200" style={{ maxHeight: '30vh', overflowY: 'auto' }}>
                                    {isMembership ? (
                                        <div className="flex items-center justify-between py-4">
                                            <p className="font-semibold text-gray-800">{tier} Membership</p>
                                            <p className="font-medium text-gray-800">₱{membershipPrices[tier].toFixed(2)}</p>
                                        </div>
                                        ) : cartItems.length > 0 ? (
                                        cartItems.map(item => (
                                            <div key={item.id} className="flex items-center py-4">
                                            <div className="text-3xl bg-gradient-to-br from-green-50 to-amber-50 rounded-lg p-2 mr-4">
                                                {item.image}
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="font-medium text-gray-800">
                                                ₱{(item.price * item.quantity).toFixed(2)}
                                            </div>
                                            </div>
                                        ))
                                        ) : (
                                        <p className="text-gray-500 text-center py-4">Your cart is empty.</p>
                                    )}
                                </div>

                                <div className="space-y-3 mt-6 border-t pt-6">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal</span>
                                        <span className="font-medium">₱{subtotal.toFixed(2)}</span>
                                    </div>
                                    {!isMembership && (
                                        <div className="flex justify-between text-gray-700">
                                            <span>Shipping</span>
                                            <span className="font-medium">₱{shippingCost.toFixed(2)}</span>
                                        </div>
                                 )}
                                    <div className="flex justify-between text-2xl font-bold text-green-900 mt-4 pt-4 border-t">
                                        <span>Total</span>
                                        <span>₱{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing || (!isMembership && cartItems.length === 0)}
                                    className="w-full inline-flex items-center justify-center bg-green-800 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition group shadow-lg disabled:opacity-50"
                                >
                                    {processing ? 'Processing...' : `Place Order (₱${total.toFixed(2)})`}
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </section>
        </div>
    );
}
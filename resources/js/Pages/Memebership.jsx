import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Check, Sprout, TreePine, Trees, Gift, Truck, Users, Heart } from 'lucide-react';
import { useState } from 'react';
import LoginModal from '@/Components/Login.jsx';
import RegisterModal from '@/Components/Register.jsx';

export default function Membership() {
    const { auth } = usePage().props;
    const isLoggedIn = !!auth?.user;
    const userTier = auth?.user?.membership_tier;

    const [modalView, setModalView] = useState(null);
    const showLogin = () => setModalView('login');
    const showRegister = () => setModalView('register');
    const closeModal = () => setModalView(null);

    const tiers = [
        {
            name: 'Seed',
            price: '₱0',
            frequency: '/ year',
            description: 'Join the mission and start your sustainable journey with us.',
            icon: Sprout,
            features: [
                'Email about emergency rescue buys'
            ],
            isPopular: false,
        },
        {
            name: 'Tree',
            price: '₱3,999',
            frequency: '/ year',
            description: 'Our most popular plan for dedicated supporters.',
            icon: TreePine,
            features: [
                'RuRi Welcome Kit',
                'Loyalty Points per purchase',
                'Early access to new products',
                'Priority for Chilled Delivery',
            ],
            isPopular: true,
        },
        {
            name: 'Forest',
            price: 'Negotiable',
            frequency: '',
            description: 'For passionate advocates of our local farmers.',
            icon: Trees,
            features: [
                'For businesses and bulk buyers',
                'Exclusive discounts on bulk orders',
                'Featured supporter on our website',
            ],
            isPopular: false,
        }
    ];

    return (
        <div className="bg-white">
            <section className="relative bg-gradient-to-br from-green-50 to-amber-50 overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
                    <h1 className="text-5xl lg:text-6xl font-bold text-green-900 leading-tight">
                        Continuing our mission.
                    </h1>
                    <p className="mt-8 text-lg text-gray-700 leading-relaxed space-y-4">
                        <p>
                            Over the past four years, Rural Rising Philippines has worked tirelessly to connect growers and consumers. In 2021, we had 500 Founder Members sign up, a testament to the overwhelming support and trust our community had in our mission.
                        </p>
                        <p>
                            In late 2023, we soft-launched the Ruri Membership in order to encourage and support organic farmers in Kabayan, Benguet. The initial launch was promising and showed us what we needed to do to make the program more structured and impactful.
                        </p>
                        <p>
                            The first half of 2024 we dedicated to testing the walk-in retail market and streamlining our digital marketplace. To all the early adopters who continue to believe in RuRi through all the years, we are incredibly grateful.
                        </p>
                    </p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold text-green-900">
                                Reaffirming Our Commitment
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                With the struggles of our farmers remaining dire and ever increasingly evident, there is no going back for RuRi; we would like to go bravely forward. Armed with four years of experience, we are now ready to engage with all stakeholders effectively.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold text-green-900">
                                Path To Sustainability
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                With the RuRi Membership Membership, we shall invest in essential IT and customer service infrastructure in the city that would support a sustainable community-supported agriculture program in the countryside. By joining Ruri Membership, you become part of a transformative movement that values sustainability, community, and high-quality food.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-br from-green-50 to-amber-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold text-green-900">
                                Engaging With The Community
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                At Ruri Membership , we believe in fostering a strong community connection. Members are invited to participate in educational workshops on canning, storing, and cooking fresh produce, as well as social events.
                            </p>
                            <div className="bg-green-800 text-white rounded-2xl p-8 mt-8">
                                <Users className="w-10 h-10 mb-4" />
                                <h3 className="text-2xl font-semibold mb-2">Become Part of the Family</h3>
                                <p className="text-green-100">
                                    Join workshops, connect with farmers, and share recipes with a community that cares.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold text-green-900">
                                Supporting Farmers And Our Vision
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Your Ruri Membership membership directly supports local farmers through various projects designed to improve agricultural practices, increase productivity, and ensure sustainability:
                            </p>
                            <ul className="p-2 space-y-3 mt-6">
                                {[
                                    'Rapid composting sites',
                                    'Tramlines for easier transport',
                                    'Aggregate centers for packing',
                                    'Water infrastructure projects',
                                    'Training and education',
                                    'Guaranteed market access'
                                ].map((item) => (
                                    <li key={item} className="flex items-center text-gray-700">
                                        <Check className="w-5 h-5 text-green-800 mr-3 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-green-900 mb-4">
                            Join the RuRi Membership
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Choose the plan that fits you best and help us build a sustainable future.
                        </p>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {tiers.map((tier) => (
                            <div
                                key={tier.name}
                                className={`rounded-2xl p-8 border-2 ${
                                    tier.isPopular 
                                        ? 'border-green-800 shadow-2xl scale-105' 
                                        : 'border-gray-200 shadow-lg'
                                } flex flex-col`}
                            >
                                {tier.isPopular && (
                                    <div className="text-center -mt-12 mb-6">
                                        <span className="bg-green-800 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <div className="bg-gradient-to-br from-green-50 to-amber-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                                    <tier.icon className="w-8 h-8 text-green-800" />
                                </div>
                                <h3 className="text-2xl font-bold text-green-900 mb-2">{tier.name}</h3>
                                <p className="text-gray-500 mb-4">{tier.description}</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-green-900">{tier.price}</span>
                                    <span className="text-gray-500 ml-1">{tier.frequency}</span>
                                </div>
                                <ul className="space-y-3 mb-8 flex-grow">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-center text-gray-700">
                                            <Check className="w-5 h-5 text-green-800 mr-3 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                {(() => {
                                    if (tier.name === 'Forest') {
                                        if (!isLoggedIn) {
                                            return (
                                                <button
                                                    onClick={showLogin}
                                                    className="inline-flex items-center justify-center w-full px-8 py-4 rounded-full font-semibold transition group bg-white text-green-800 border-2 border-green-800 hover:bg-green-50"
                                                >
                                                    Contact Us
                                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                                                </button>
                                            );
                                        }
                                        return (
                                            <Link
                                                href="/forest-form"
                                                className="inline-flex items-center justify-center w-full px-8 py-4 rounded-full font-semibold transition group bg-white text-green-800 border-2 border-green-800 hover:bg-green-50"
                                            >
                                                Contact Us
                                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                                            </Link>
                                        );
                                    }
                                    
                                    if (tier.name === 'Seed') {
                                        if (isLoggedIn) {
                                            return (
                                                <span className="inline-flex items-center justify-center w-full px-8 py-4 rounded-full font-semibold bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-default">
                                                    Already subscribed
                                                </span>
                                            );
                                        }
                                        return (
                                            <button
                                                onClick={showLogin}
                                                className="inline-flex items-center justify-center w-full px-8 py-4 rounded-full font-semibold transition group bg-white text-green-800 border-2 border-green-800 hover:bg-green-50"
                                            >
                                                Choose Plan
                                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                                            </button>
                                        );
                                    }

                                    if (tier.name === 'Tree') {
                                        if (!isLoggedIn) {
                                            return (
                                                <button
                                                    onClick={showLogin}
                                                    className="inline-flex items-center justify-center w-full px-8 py-4 rounded-full font-semibold transition group bg-green-800 text-white hover:bg-green-700 shadow-lg"
                                                >
                                                    Choose Plan
                                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                                                </button>
                                            );
                                        }
                                        if (userTier === 'Tree') {
                                            return (
                                                <span className="inline-flex items-center justify-center w-full px-8 py-4 rounded-full font-semibold bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-default">
                                                    Already subscribed
                                                </span>
                                            );
                                        }
                                        return (
                                            <Link
                                                href="/checkout?tier=Tree"
                                                className="inline-flex items-center justify-center w-full px-8 py-4 rounded-full font-semibold transition group bg-green-800 text-white hover:bg-green-700 shadow-lg"
                                            >
                                                Choose Plan
                                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                                            </Link>
                                        );
                                    }
                                })()}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-br from-green-50 to-amber-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-green-900 mb-4">
                            More Benefits of RuRi Membership
                        </h2>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        
                        <div className="flex items-start space-x-6">
                            <div className="bg-green-800 text-white w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                <Truck className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-green-900 mb-2">
                                    Chilled Delivery
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We have partnered with Ninja Chill for a new delivery service that uses mobile cold chain technology. Your produce will arrive at your doorstep in optimum condition, freshness and quality maintained.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-6">
                            <div className="bg-green-800 text-white w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                <Gift className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-green-900 mb-2">
                                    Affiliate Discounts and Rewards
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Earn loyalty points with every purchase you make as a RuRi Membership member. Accumulate points to redeem for exclusive discounts, special products, and members-only merchandise.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {modalView === 'login' && <LoginModal onClose={closeModal} onSwitchToRegister={showRegister} />}
            {modalView === 'register' && <RegisterModal onClose={closeModal} onSwitchToLogin={showLogin} />}
        </div>
    );
}
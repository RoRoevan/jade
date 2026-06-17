import { Link } from '@inertiajs/react';
import { ArrowRight, Leaf, Users, Truck, Heart, Star } from 'lucide-react';

export default function Home() {
    const features = [
        {
            icon: Leaf,
            title: 'Farm Fresh',
            description: 'Vegetables and fruits harvested at peak freshness, delivered within 24 hours'
        },
        {
            icon: Users,
            title: 'Support Local',
            description: 'Direct from Filipino farmers, ensuring fair prices and sustainable livelihoods'
        },
        {
            icon: Truck,
            title: 'Fast Delivery',
            description: 'Same-day and next-day delivery options available across Metro Manila'
        },
        {
            icon: Heart,
            title: 'Quality Assured',
            description: 'Every product inspected for quality, freshness, and organic certification'
        }
    ];

    const categories = [
        { name: 'Vegetables', image: '🥬', count: '30+ items' },
        { name: 'Fruits', image: '🍎', count: '20+ items' },
        { name: 'Produce', image: '🥚', count: '5+ items' }
    ];

    const testimonials = [
        {
            name: 'Maria Santos',
            location: 'Quezon City',
            rating: 5,
            text: 'The freshness is unmatched! I love supporting local farmers while getting the best produce.'
        },
        {
            name: 'John Cruz',
            location: 'Makati',
            rating: 5,
            text: 'Fast delivery and amazing quality. My family only buys from RuRi now.'
        },
        {
            name: 'Ana Reyes',
            location: 'Pasig',
            rating: 5,
            text: 'Knowing my food comes directly from farmers makes all the difference. Highly recommend!'
        }
    ];

    return (
        <div className="bg-white">
            <section className="relative bg-gradient-to-br from-green-50 to-amber-50 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-block">
                                <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold">
                                    🌱 Supporting Filipino Farmers
                                </span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-green-900 leading-tight">
                                Fresh From Farm to Your
                                <span className="text-amber-600"> Table</span>
                            </h1>
                            <p className="text-xl text-gray-700 leading-relaxed">
                                Experience the authentic taste of locally-grown produce. Connect directly with farmers and enjoy premium quality vegetables, fruits, and more delivered fresh to your doorstep.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center justify-center bg-green-800 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl group"
                                >
                                    Shop Now
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                                </Link>
                                <Link
                                    href="/membership"
                                    className="inline-flex items-center justify-center bg-white text-green-800 px-8 py-4 rounded-full font-semibold border-2 border-green-800 hover:bg-green-50 transition"
                                >
                                    Join Membership
                                </Link>
                            </div>
                            <div className="flex items-center space-x-8 pt-4">
                                <div>
                                    <p className="text-3xl font-bold text-green-900">2,500+</p>
                                    <p className="text-sm text-gray-600">Happy Customers</p>
                                </div>
                                <div className="h-12 w-px bg-gray-300"></div>
                                <div>
                                    <p className="text-3xl font-bold text-green-900">100+</p>
                                    <p className="text-sm text-gray-600">Partner Farms</p>
                                </div>
                                <div className="h-12 w-px bg-gray-300"></div>
                                <div>
                                    <p className="text-3xl font-bold text-green-900">100%</p>
                                    <p className="text-sm text-gray-600">Fresh Guarantee</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-amber-400 rounded-3xl transform rotate-3"></div>
                            <div className="relative bg-gradient-to-br from-green-100 to-amber-100 rounded-3xl p-8 shadow-2xl">
                                <div className="text-9xl text-center">🥗</div>
                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    <div className="bg-white rounded-2xl p-4 text-center shadow-md">
                                        <div className="text-4xl">🥕</div>
                                        <p className="text-xs mt-2 font-medium text-gray-700">Veggies</p>
                                    </div>
                                    <div className="bg-white rounded-2xl p-4 text-center shadow-md">
                                        <div className="text-4xl">🍓</div>
                                        <p className="text-xs mt-2 font-medium text-gray-700">Fruits</p>
                                    </div>
                                    <div className="bg-white rounded-2xl p-4 text-center shadow-md">
                                        <div className="text-4xl">🥚</div>
                                        <p className="text-xs mt-2 font-medium text-gray-700">Produce</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-green-900 mb-4">
                            Why Choose RuRi?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            More than just fresh produce – we're building a sustainable future for Filipino agriculture
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-green-50 to-amber-50 rounded-2xl p-8 hover:shadow-xl transition group"
                            >
                                <div className="bg-green-800 text-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-green-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-br from-green-50 to-amber-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-green-900 mb-4">
                            Browse by Category
                        </h2>
                        <p className="text-xl text-gray-600">
                            Explore our wide selection of farm-fresh products
                        </p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                href={`/shop?category=${category.name.toLowerCase()}`}
                                className="bg-white rounded-2xl p-8 text-center hover:shadow-2xl transition group"
                            >
                                <div className="text-6xl mb-4 group-hover:scale-110 transition">
                                    {category.image}
                                </div>
                                <h3 className="text-xl font-bold text-green-900 mb-2">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-500">{category.count}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-green-900 mb-4">
                            What Our Customers Say
                        </h2>
                        <p className="text-xl text-gray-600">
                            Join thousands of satisfied customers
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-green-50 to-amber-50 rounded-2xl p-8 hover:shadow-xl transition"
                            >
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 italic leading-relaxed">
                                    "{testimonial.text}"
                                </p>
                                <div>
                                    <p className="font-bold text-green-900">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-r from-green-800 to-green-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Experience Farm-Fresh Quality?
                    </h2>
                    <p className="text-xl text-green-100 mb-8">
                        Join our community today and get 20% off your first order
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center bg-amber-500 text-green-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-amber-400 transition shadow-2xl hover:shadow-3xl group"
                    >
                        Get Started Now
                        <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../../assets/logo.jpg';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-green-900 to-green-950 text-green-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-white p-2 rounded-lg">
                                <img 
                                    src={logo}
                                    alt="Rural Rising Logo" 
                                    className="w-10 h-10 rounded-full" 
                                />
                            </div>
                            <span className="text-xl font-bold text-white">Rural Rising</span>
                        </div>
                        <p className="text-sm text-green-200 leading-relaxed">
                            Connecting local farmers with communities, delivering fresh, sustainable produce straight from the farm to your table.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            <a href="https://www.facebook.com/ruralrisingph" className="text-green-200 hover:text-amber-400 transition">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://www.instagram.com/ruralrisingph/" className="text-green-200 hover:text-amber-400 transition">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://x.com/ruralrisingph" className="text-green-200 hover:text-amber-400 transition">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/shop" className="text-green-200 hover:text-amber-400 transition text-sm">
                                    Browse Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/membership" className="text-green-200 hover:text-amber-400 transition text-sm">
                                    Membership Plans
                                </Link>
                            </li>
                            <li>
                                <Link href="/farmers" className="text-green-200 hover:text-amber-400 transition text-sm">
                                    Meet Our Farmers
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-green-200 hover:text-amber-400 transition text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-green-200 hover:text-amber-400 transition text-sm">
                                    FAQs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/track-order" className="text-green-200 hover:text-amber-400 transition text-sm">
                                    Spoilage Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/delivery" className="text-green-200 hover:text-amber-400 transition text-sm">
                                    Allergy Disclaimer
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-green-200 hover:text-amber-400 transition text-sm">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-green-200 hover:text-amber-400 transition text-sm">
                                    Weight Notice
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-green-200 hover:text-amber-400 transition text-sm">
                                    Return And Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Get In Touch</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-green-200">
                                    Avida Towers Centera Retail, Epifanio de los Santos Ave, Mandaluyong City, 1550 Metro Manila
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                <span className="text-sm text-green-200">
                                    +63 917 502 7787
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                <span className="text-sm text-green-200">
                                    info@ruralrisingph.com
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-green-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-green-300">
                            © 2025 Rural Rising. All rights reserved. Supporting Filipino Farmers.
                        </p>
                        <div className="flex space-x-6 text-sm">
                            <Link href="/sitemap" className="text-green-300 hover:text-amber-400 transition">
                                Sitemap
                            </Link>
                            <Link href="/accessibility" className="text-green-300 hover:text-amber-400 transition">
                                Accessibility
                            </Link>
                            <Link href="/cookies" className="text-green-300 hover:text-amber-400 transition">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
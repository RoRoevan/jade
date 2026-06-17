import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, User, Menu, X, Bell, ShieldCheck } from 'lucide-react';
import logo from '../../assets/logo.jpg';
import LoginModal from './Login.jsx';
import RegisterModal from './Register.jsx';
import { CartModal, useCart } from './CartModal.jsx';

export default function Header() {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [modalView, setModalView] = useState(null);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);

    const { cartItems } = useCart();
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const showLogin = () => setModalView('login');
    const showRegister = () => setModalView('register');
    const showCart = () => setModalView('cart');
    const closeModal = () => setModalView(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                notificationRef.current && !notificationRef.current.contains(event.target)
            ) {
                setProfileDropdownOpen(false);
                setNotificationOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Notifications now come from the backend via Inertia shared props.
    // The HandleInertiaRequests middleware should share `notifications` for
    // logged-in members. Until then we fall back to the static array below.
    const allNotifications = usePage().props.memberNotifications ?? [];

    let filteredNotifications = [];
    const userTier = auth?.user?.membership_tier;

    if (userTier === 'Tree') {
        filteredNotifications = allNotifications;
    } else if (userTier === 'Seed') {
        filteredNotifications = [allNotifications[0]];
    }

    const { url } = usePage();

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-green-900 to-green-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <Link href="/" className="flex items-center space-x-3">
                        <img
                            src={logo}
                            alt="Rural Rising Logo"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Rural Rising</h1>
                            <p className="text-xs text-green-200">Fresh from the Farm</p>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className={`font-medium transition ${
                                url === '/'
                                    ? 'text-amber-400 border-b-2 border-amber-400 pb-1'
                                    : 'text-white hover:text-amber-400'
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/shop"
                            className={`font-medium transition ${
                                url.startsWith('/shop')
                                    ? 'text-amber-400 border-b-2 border-amber-400 pb-1'
                                    : 'text-white hover:text-amber-400'
                            }`}
                        >
                            Shop
                        </Link>
                        <Link
                            href="/membership"
                            className={`font-medium transition ${
                                url.startsWith('/membership')
                                    ? 'text-amber-400 border-b-2 border-amber-400 pb-1'
                                    : 'text-white hover:text-amber-400'
                            }`}
                        >
                            Membership
                        </Link>
                        <Link
                            href="/farmers"
                            className={`font-medium transition ${
                                url.startsWith('/farmers')
                                    ? 'text-amber-400 border-b-2 border-amber-400 pb-1'
                                    : 'text-white hover:text-amber-400'
                            }`}
                        >
                            Our Farmers
                        </Link>

                        {/* Admin nav link — only visible to admin users */}
                        {auth?.user?.is_admin && (
                            <Link
                                href="/admin"
                                className={`flex items-center gap-1.5 font-medium transition ${
                                    url.startsWith('/admin')
                                        ? 'text-amber-400 border-b-2 border-amber-400 pb-1'
                                        : 'text-white hover:text-amber-400'
                                }`}
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Admin
                            </Link>
                        )}
                    </nav>

                    <div className="flex items-center space-x-4">
                        {auth?.user ? (
                            <>
                                <button
                                    onClick={showCart}
                                    className="relative text-white hover:text-amber-400 transition"
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-amber-500 text-green-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>

                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => {
                                            setProfileDropdownOpen(!profileDropdownOpen);
                                            setNotificationOpen(false);
                                        }}
                                        className="flex items-center space-x-2 text-white hover:text-amber-400 transition focus:outline-none"
                                    >
                                        <User className="w-6 h-6" />
                                        <span className="hidden lg:inline">{auth.user.first_name}</span>
                                    </button>

                                    {profileDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                            <Link href="/profile" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
                                            <Link href="/orders" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
                                            {auth.user.is_admin && (
                                                <Link href="/admin" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-green-800 font-semibold hover:bg-gray-100">
                                                    <ShieldCheck className="w-4 h-4" /> Admin Panel
                                                </Link>
                                            )}
                                            <Link href="/logout" method="post" as="button" onClick={() => setProfileDropdownOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</Link>
                                        </div>
                                    )}
                                </div>

                                {['Seed', 'Tree'].includes(auth.user.membership_tier) && (
                                    <div className="relative" ref={notificationRef}>
                                        <button
                                            onClick={() => {
                                                setNotificationOpen(!notificationOpen);
                                                setProfileDropdownOpen(false);
                                            }}
                                            className="relative text-white hover:text-amber-400 transition"
                                        >
                                            <Bell className="w-6 h-6" />
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">!</span>
                                        </button>

                                        {notificationOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-red-500 rounded-lg shadow-2xl z-50">
                                                <div className="px-4 py-2 bg-red-500 text-white font-semibold rounded-t-lg">
                                                    Notifications
                                                </div>
                                                <ul className="max-h-60 overflow-y-auto">
                                                    {filteredNotifications.map((note, index) => (
                                                        <li
                                                            key={index}
                                                            className="px-4 py-3 text-sm text-red-800 border-b border-gray-100 hover:bg-red-50 transition"
                                                        >
                                                            {note}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <button onClick={showCart} className="relative text-white hover:text-amber-400 transition">
                                    <ShoppingCart className="w-6 h-6" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-amber-500 text-green-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                                <button onClick={showLogin} className="text-white hover:text-amber-400 font-medium transition">Login</button>
                                <button onClick={showRegister} className="bg-amber-500 text-green-900 px-6 py-2 rounded-full font-semibold hover:bg-amber-400 transition shadow-lg">Sign Up</button>
                            </>
                        )}

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-white"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-green-800 border-t border-green-700">
                    <nav className="flex flex-col space-y-2 px-4 py-4">
                        <Link href="/" className="text-white hover:text-amber-400 py-2 font-medium transition" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                        <Link href="/shop" className="text-white hover:text-amber-400 py-2 font-medium transition" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                        <Link href="/membership" className="text-white hover:text-amber-400 py-2 font-medium transition" onClick={() => setMobileMenuOpen(false)}>Membership</Link>
                        <Link href="/farmers" className="text-white hover:text-amber-400 py-2 font-medium transition" onClick={() => setMobileMenuOpen(false)}>Our Farmers</Link>
                        {auth?.user?.is_admin && (
                            <Link href="/admin" className="flex items-center gap-2 text-amber-400 hover:text-amber-300 py-2 font-medium transition" onClick={() => setMobileMenuOpen(false)}>
                                <ShieldCheck className="w-4 h-4" /> Admin Panel
                            </Link>
                        )}
                    </nav>
                </div>
            )}

            {modalView === 'login' && <LoginModal onClose={closeModal} onSwitchToRegister={showRegister} />}
            {modalView === 'register' && <RegisterModal onClose={closeModal} onSwitchToLogin={showLogin} />}
            {modalView === 'cart' && <CartModal onClose={closeModal} />}
        </header>
    );
}

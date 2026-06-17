import React, { createContext, useContext, useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { X, ArrowRight, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, amount) => {
        setCartItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === productId) {
                    const newQuantity = item.quantity + amount;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            }).filter(Boolean); 
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const subtotal = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [cartItems]);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        subtotal,
        clearCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    return useContext(CartContext);
};

export function CartModal({ onClose }) {
    
    const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
            
            <div className="relative w-full max-w-lg bg-white rounded-2xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-green-900">Your Cart</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Close">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {cartItems.length > 0 ? (
                    <>
                        <div className="divide-y divide-gray-200 -mx-8 px-8" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-center py-4">
                                    <div className="text-4xl bg-gradient-to-br from-green-50 to-amber-50 rounded-lg p-3 mr-4">
                                        {item.image}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">₱{item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                                        >
                                            <Minus className="w-4 h-4 text-gray-700" />
                                        </button>
                                        <span className="font-medium">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                                        >
                                            <Plus className="w-4 h-4 text-gray-700" />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="ml-4 text-red-500 hover:text-red-700" title="Remove"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 border-t pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-medium text-gray-700">Subtotal:</span>
                                <span className="text-2xl font-bold text-green-900">₱{subtotal.toFixed(2)}</span>
                            </div>
                            <Link
                                href="/checkout"
                                onClick={onClose}
                                className="w-full inline-flex items-center justify-center bg-green-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition group"
                            >
                                Proceed to Checkout
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                            </Link>
                            <Link
                                href="/cart"
                                onClick={onClose}
                                className="w-full inline-flex items-center justify-center bg-white text-green-800 px-8 py-3 mt-3 rounded-full font-semibold border-2 border-green-800 hover:bg-green-50 transition"
                            >
                                View Full Cart
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10">
                        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h4>
                        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                        <Link
                            href="/shop"
                            onClick={onClose} 
                            className="inline-flex items-center justify-center bg-amber-500 text-green-900 px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
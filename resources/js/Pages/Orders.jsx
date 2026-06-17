import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export default function Orders() {
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const storedOrder = sessionStorage.getItem('latestOrder');
        
        if (storedOrder) {
            setOrderDetails(JSON.parse(storedOrder));
        }
    }, []);

    return (
        <div className="bg-white">
            <section className="py-20 bg-gradient-to-br from-green-50 to-amber-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <CheckCircle className="w-24 h-24 text-green-700 mx-auto mb-6" />
                    <h1 className="text-5xl font-bold text-green-900 mb-4">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                        Thank you for your purchase. Here are your order details.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {orderDetails ? (
                        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
                            <h2 className="text-2xl font-semibold text-green-900 mb-6">Order Summary</h2>

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800">Shipping To:</h3>
                                <p className="text-gray-600">{orderDetails.shipping.first_name} {orderDetails.shipping.last_name}</p>
                                <p className="text-gray-600">{orderDetails.shipping.address}</p>
                                <p className="text-gray-600">{orderDetails.shipping.phone}</p>
                                <p className="text-gray-600">{orderDetails.shipping.email}</p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800">Payment Method:</h3>
                                <p className="text-gray-600 capitalize">{orderDetails.shipping.payment_method}</p>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Items Ordered:</h3>
                            <div className="divide-y divide-gray-200 border-t border-b">
                                {orderDetails.items.map(item => (
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
                                ))}
                            </div>

                            <div className="mt-6 text-right">
                                <div className="text-gray-700">
                                    Subtotal: <span className="font-medium">₱{orderDetails.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="text-gray-700">
                                    Shipping: <span className="font-medium">₱{orderDetails.shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="text-2xl font-bold text-green-900 mt-2">
                                    Total: <span >₱{orderDetails.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-800">No order details found.</h2>
                            <p className="text-gray-500 mb-6">You can view your past orders in your profile.</p>
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center bg-amber-500 text-green-900 px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
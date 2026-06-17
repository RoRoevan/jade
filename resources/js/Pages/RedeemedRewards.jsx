import { usePage, Link } from '@inertiajs/react';
import { Gift, ArrowLeft, CalendarDays, Coins } from 'lucide-react';

export default function RedeemedRewards() {
    const { user, redeemed } = usePage().props;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">

            <div className="bg-green-900 text-white px-6 py-4 flex items-center gap-3">
                <Link href="/profile" className="text-green-300 hover:text-white transition">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-amber-400" />
                    <span className="font-semibold">Redeemed Rewards</span>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-14">

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Current Balance</p>
                        <p className="text-3xl font-bold text-green-900">{user.points ?? 0} <span className="text-lg font-medium text-gray-400">pts</span></p>
                    </div>
                    <Link
                        href="/redeem"
                        className="inline-flex items-center gap-2 bg-green-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-green-700 transition shadow-sm"
                    >
                        <Gift className="w-4 h-4" />
                        Redeem More
                    </Link>
                </div>

                {redeemed.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                        <Gift className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No redemptions yet</h3>
                        <p className="text-gray-400 text-sm mb-6">Head over to the rewards page and redeem your first gift!</p>
                        <Link
                            href="/redeem"
                            className="inline-flex items-center gap-2 bg-green-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
                        >
                            Browse Rewards
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1 mb-2">
                            {redeemed.length} Redemption{redeemed.length !== 1 ? 's' : ''}
                        </p>
                        {redeemed.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex items-center gap-5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                                    <Gift className="w-6 h-6 text-green-700" />
                                </div>

                                <div className="flex-grow min-w-0">
                                    <p className="font-bold text-gray-900 truncate">{item.reward_name}</p>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="flex items-center gap-1 text-xs text-gray-400">
                                            <CalendarDays className="w-3.5 h-3.5" />
                                            {new Date(item.created_at).toLocaleDateString('en-PH', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-shrink-0 text-right">
                                    <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-full">
                                        −{item.points_spent} pts
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

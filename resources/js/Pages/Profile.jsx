import { usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Gift, QrCode, History } from 'lucide-react';

export default function Profile() {
  const { auth, flash } = usePage().props;
  const user = auth.user;
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex flex-col">
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto py-20 px-6">
          <h1 className="text-4xl font-bold text-green-900 mb-8">My Profile</h1>

          <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg p-8">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-6 mb-6 md:mb-0">
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`w-full text-left font-semibold transition ${
                      activeTab === 'details'
                        ? 'text-green-800'
                        : 'text-gray-600 hover:text-green-700'
                    }`}
                  >
                    Details
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('subscription')}
                    className={`w-full text-left font-semibold transition ${
                      activeTab === 'subscription'
                        ? 'text-green-800'
                        : 'text-gray-600 hover:text-green-700'
                    }`}
                  >
                    Subscription
                  </button>
                </li>
              </ul>
            </div>

            {/* Content */}
            <div className="flex-1 md:pl-8">
              {activeTab === 'details' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Account Details</h2>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <span className="font-medium">Name:</span>{' '}
                      {user.first_name} {user.last_name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'subscription' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">My Subscription</h2>
                  <p className="text-lg">
                    Tier: <strong>{user.membership_tier}</strong>
                  </p>

                  {user.membership_tier === 'Tree' && (
                    <div className="mt-6 space-y-5">
                      <p className="text-lg">
                        Current Points: <strong>{user.points}</strong>
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href="/redeem"
                          className="inline-flex items-center gap-2 bg-green-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-green-700 transition shadow-sm"
                        >
                          <Gift className="w-4 h-4" />
                          Redeem Gifts
                        </Link>

                        <Link
                          href="/redeemed-rewards"
                          className="inline-flex items-center gap-2 bg-white text-green-800 border-2 border-green-800 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-green-50 transition"
                        >
                          <History className="w-4 h-4" />
                          Redeemed Rewards
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-3">Shopping in person?</p>
                        <Link
                          href="/instore-qr"
                          className="inline-flex items-center gap-2 bg-amber-500 text-green-900 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-amber-400 transition shadow-sm"
                        >
                          <QrCode className="w-4 h-4" />
                          Get In-Store QR Code
                        </Link>
                      </div>
                    </div>
                  )}

                  {user.membership_tier === 'Seed' && (
                    <Link
                      href="/checkout?tier=Tree"
                      className="mt-6 inline-flex items-center bg-green-800 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
                    >
                      Upgrade to Tree
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

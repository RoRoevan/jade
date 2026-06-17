import { usePage, Link, router } from '@inertiajs/react';

export default function Redeem() {
  const { user, rewards, flash } = usePage().props;

  const handleRedeem = (id) => {
    router.post('/redeem-claim', { reward_id: id });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex flex-col">
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto py-20 px-6">
          <h1 className="text-4xl font-bold text-green-900 mb-8 text-center">Redeem Your Gifts</h1>
          <p className="text-lg text-center text-gray-700 mb-10">
            You currently have <strong>{user.points}</strong> points.
          </p>

          {flash?.status && (
            <div className="text-green-800 bg-green-100 border border-green-300 rounded-lg px-4 py-3 mb-6 text-center">
              {flash.status}
            </div>
          )}
          {flash?.error && (
            <div className="text-red-800 bg-red-100 border border-red-300 rounded-lg px-4 py-3 mb-6 text-center">
              {flash.error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {reward.image ? (
                    <img
                      src={reward.image}
                      alt={reward.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h2 className="text-xl font-semibold text-green-900 mb-2">
                    {reward.name}
                  </h2>
                  <p className="text-gray-600 flex-grow">{reward.description}</p>
                  <p className="mt-4 text-sm text-gray-700">
                    Requires <strong>{reward.points_required}</strong> points
                  </p>
                  <button
                    onClick={() => handleRedeem(reward.id)}
                    disabled={user.points < reward.points_required}
                    className={`mt-6 w-full inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold transition shadow-md ${
                      user.points >= reward.points_required
                        ? 'bg-green-800 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {user.points >= reward.points_required ? 'Redeem Now' : 'Not Enough Points'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/profile"
              className="inline-flex items-center bg-green-800 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

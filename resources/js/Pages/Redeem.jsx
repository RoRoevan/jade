import { usePage, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';

export default function Redeem() {
  const { user, rewards, flash } = usePage().props;
  const [localRewards, setLocalRewards] = useState(rewards || []);
  const [supabaseUserPoints, setSupabaseUserPoints] = useState(user?.points ?? 0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSupabaseData = async () => {
      try {
        const { data: dbRewards, error: rewardsError } = await supabase
          .from('rewards')
          .select('*')
          .order('points_required', { ascending: true });

        if (dbRewards) {
          setLocalRewards(dbRewards);
        }

        if (user?.supabase_id) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('points')
            .eq('id', user.supabase_id)
            .single();

          if (userData) {
            setSupabaseUserPoints(userData.points);
          }
        }
      } catch (err) {
        console.error('Error loading Supabase redeem data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSupabaseData();
  }, [user]);

  const handleRedeem = async (id) => {
    const reward = localRewards.find(r => r.id === id);
    if (!reward) return;

    const userSupabaseId = user?.supabase_id;
    if (!userSupabaseId) {
      console.error('User not authenticated via Supabase');
      return;
    }

    try {
      // 1. Decrement points in Supabase users table
      const newPoints = (supabaseUserPoints ?? user.points) - reward.points_required;
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ points: newPoints })
        .eq('id', userSupabaseId);

      if (userUpdateError) throw userUpdateError;

      // 2. Log into redeemed_rewards table in Supabase
      const { error: redeemError } = await supabase
        .from('redeemed_rewards')
        .insert({
          user_id: userSupabaseId,
          reward_id: reward.id,
          reward_name: reward.name,
          points_spent: reward.points_required
        });

      if (redeemError) throw redeemError;

      // 3. Log transaction into points_transactions table in Supabase
      await supabase.from('points_transactions').insert({
        user_id: userSupabaseId,
        points_change: -reward.points_required,
        type: 'redemption',
        description: `Redeemed reward: ${reward.name}`
      });

      // 4. Update local state
      setSupabaseUserPoints(newPoints);

      // 5. Post to Laravel backend to sync SQLite representation
      router.post('/redeem-claim', { reward_id: reward.id }, {
        onSuccess: () => {
          window.location.reload();
        }
      });
    } catch (err) {
      console.error('Failed to claim reward:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex flex-col">
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto py-20 px-6">
          <h1 className="text-4xl font-bold text-green-900 mb-8 text-center">Redeem Your Gifts</h1>
          <p className="text-lg text-center text-gray-700 mb-10">
            You currently have <strong>{supabaseUserPoints}</strong> points.
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
            {localRewards.map((reward) => (
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
                    disabled={supabaseUserPoints < reward.points_required}
                    className={`mt-6 w-full inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold transition shadow-md ${
                      supabaseUserPoints >= reward.points_required
                        ? 'bg-green-800 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {supabaseUserPoints >= reward.points_required ? 'Redeem Now' : 'Not Enough Points'}
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

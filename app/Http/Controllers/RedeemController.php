<?php

namespace App\Http\Controllers;

use App\Models\Reward;
use App\Models\RedeemedReward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RedeemController extends Controller
{
    /**
     * Show the redeem page.
     */
    public function index()
    {
        $user    = Auth::user();
        $rewards = Reward::orderBy('points_required')->get();

        return Inertia::render('Redeem', [
            'user'    => $user,
            'rewards' => $rewards,
        ]);
    }

    /**
     * Claim a reward and log it to redeemed_rewards.
     */
    public function claim(Request $request)
    {
        $request->validate([
            'reward_id' => 'required|integer|exists:rewards,id',
        ]);

        $user   = Auth::user();
        $reward = Reward::findOrFail($request->reward_id);

        if ($user->points < $reward->points_required) {
            return back()->with('error', 'Not enough points to redeem this reward.');
        }

        // Deduct points
        $user->points -= $reward->points_required;
        $user->save();

        // Log the redemption
        RedeemedReward::create([
            'user_id'      => $user->id,
            'reward_id'    => $reward->id,
            'reward_name'  => $reward->name,
            'points_spent' => $reward->points_required,
        ]);

        return back()->with('status', "You have successfully redeemed: {$reward->name}!");
    }

    /**
     * Show the redeemed rewards history page.
     */
    public function redeemed()
    {
        $user = Auth::user();

        $redeemed = RedeemedReward::where('user_id', $user->id)
            ->with('reward')
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('RedeemedRewards', [
            'user'     => $user,
            'redeemed' => $redeemed,
        ]);
    }
}

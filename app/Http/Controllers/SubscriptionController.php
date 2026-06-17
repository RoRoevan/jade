<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'tier' => 'required|in:Seed,Tree,Forest',
        ]);

        $user = Auth::user();

        if ($request->tier === 'Tree') {
            $user->membership_tier = 'Tree';
            $user->points = 100; 
            $user->save();

            return redirect()->route('profile');
        }

        if ($request->tier === 'Seed') {
            $user->membership_tier = 'Seed';
            $user->save();
            return redirect()->route('profile');
        }

        return redirect()->route('profile')->with('status', 'Contact us for Forest membership.');
    }

    public function redeemPoints(Request $request)
    {
        $user = Auth::user();

        if ($user->membership_tier !== 'Tree') {
            return back()->with('error', 'Only Tree members can redeem points.');
        }

        if ($user->points < 100) {
            return back()->with('error', 'Not enough points to redeem.');
        }

        $user->points -= 100;
        $user->save();

        return back()->with('status', '100 points redeemed!');
    }
}

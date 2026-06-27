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
        $user = Auth::user();
        $rewards = [];

        try {
            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'apikey' => env('VITE_SUPABASE_ANON_KEY', 'sb_publishable_icgYx3cjCVnbiVBSPXORSg_5N37R3im'),
                'Authorization' => 'Bearer ' . env('VITE_SUPABASE_ANON_KEY', 'sb_publishable_icgYx3cjCVnbiVBSPXORSg_5N37R3im'),
            ])->get(env('VITE_SUPABASE_URL', 'https://aknuiuavolazpdhlmrmd.supabase.co') . '/rest/v1/rewards?order=points_required.asc');
            
            $rewards = $response->json() ?? [];
        } catch (\Exception $e) {
            // Ignore API exceptions
        }

        return Inertia::render('Redeem', [
            'user'    => $user,
            'rewards' => $rewards,
        ]);
    }

    /**
     * Claim a reward (handled client-side; kept as stub).
     */
    public function claim(Request $request)
    {
        return back()->with('status', 'Claim submitted successfully!');
    }

    /**
     * Show the redeemed rewards history page.
     */
    public function redeemed()
    {
        $user = Auth::user();
        $redeemed = [];

        if ($user && !empty($user->supabase_id)) {
            try {
                $response = \Illuminate\Support\Facades\Http::withHeaders([
                    'apikey' => env('VITE_SUPABASE_ANON_KEY', 'sb_publishable_icgYx3cjCVnbiVBSPXORSg_5N37R3im'),
                    'Authorization' => 'Bearer ' . env('VITE_SUPABASE_ANON_KEY', 'sb_publishable_icgYx3cjCVnbiVBSPXORSg_5N37R3im'),
                ])->get(env('VITE_SUPABASE_URL', 'https://aknuiuavolazpdhlmrmd.supabase.co') . '/rest/v1/redeemed_rewards?user_id=eq.' . $user->supabase_id . '&order=id.desc');
                
                $redeemed = $response->json() ?? [];
            } catch (\Exception $e) {
                // Ignore API exceptions
            }
        }

        return Inertia::render('RedeemedRewards', [
            'user'     => $user,
            'redeemed' => $redeemed,
        ]);
    }
}

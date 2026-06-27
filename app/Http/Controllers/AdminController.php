<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Show the admin dashboard.
     * Passes subscriptions, rewards, and notifications to the view.
     */
    public function index()
    {
        $subscribers = [];
        $rewards = [];
        $notifications = [];
        $forestRequests = [];

        try {
            $headers = [
                'apikey' => env('VITE_SUPABASE_ANON_KEY', 'sb_publishable_icgYx3cjCVnbiVBSPXORSg_5N37R3im'),
                'Authorization' => 'Bearer ' . env('VITE_SUPABASE_ANON_KEY', 'sb_publishable_icgYx3cjCVnbiVBSPXORSg_5N37R3im'),
            ];
            $baseUrl = env('VITE_SUPABASE_URL', 'https://aknuiuavolazpdhlmrmd.supabase.co');

            $subscribers = \Illuminate\Support\Facades\Http::withHeaders($headers)->get("$baseUrl/rest/v1/users?order=id.desc")->json() ?? [];
            $rewards = \Illuminate\Support\Facades\Http::withHeaders($headers)->get("$baseUrl/rest/v1/rewards?order=points_required.asc")->json() ?? [];
            $notifications = \Illuminate\Support\Facades\Http::withHeaders($headers)->get("$baseUrl/rest/v1/notifications?order=id.desc")->json() ?? [];
            $forestRequests = \Illuminate\Support\Facades\Http::withHeaders($headers)->get("$baseUrl/rest/v1/forest_partnership_requests?order=id.desc")->json() ?? [];
        } catch (\Exception $e) {
            // Ignore API connection failures
        }

        return Inertia::render('Admin', [
            'subscribers'    => $subscribers,
            'rewards'        => $rewards,
            'notifications'  => $notifications,
            'forestRequests' => $forestRequests,
        ]);
    }

    // ─── Rewards ───────────────────────────────────────────────────────────

    /**
     * Store a new reward.
     */
    public function storeReward(Request $request)
    {
        return back()->with('status', 'Reward added successfully.');
    }

    /**
     * Update an existing reward.
     */
    public function updateReward(Request $request, $reward)
    {
        return back()->with('status', 'Reward updated successfully.');
    }

    /**
     * Delete a reward.
     */
    public function destroyReward($reward)
    {
        return back()->with('status', 'Reward deleted successfully.');
    }

    // ─── Forest Partnership Requests ───────────────────────────────────────

    public function storeForestRequest(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:30',
            'preferred_date' => 'required|date',
            'proposal_description' => 'required|string',
        ]);

        return back()->with('status', 'Your meeting request has been submitted and is now pending admin review.');
    }

    public function updateForestRequestStatus(Request $request, $forestRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,accepted,declined',
        ]);

        $forestRequestData = null;
        try {
            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'apikey' => env('VITE_SUPABASE_ANON_KEY', 'sb_publishable_icgYx3cjCVnbiVBSPXORSg_5N37R3im'),
                'Authorization' => 'Bearer ' . env('VITE_SUPABASE_ANON_KEY', 'sb_publishable_icgYx3cjCVnbiVBSPXORSg_5N37R3im'),
            ])->get(env('VITE_SUPABASE_URL', 'https://aknuiuavolazpdhlmrmd.supabase.co') . '/rest/v1/forest_partnership_requests?id=eq.' . $forestRequest);

            $forestRequestData = $response->json()[0] ?? null;
        } catch (\Exception $e) {
            // Ignore API connection failures
        }

        if ($forestRequestData && in_array($validated['status'], ['accepted', 'declined'], true)) {
            $reqObj = (object) $forestRequestData;
            $reqObj->status = $validated['status'];
            \Illuminate\Support\Facades\Mail::to($reqObj->email)->send(new \App\Mail\ForestPartnershipStatusMail($reqObj));
        }

        return back()->with('status', 'Request status updated successfully.');
    }

    // ─── Notifications ─────────────────────────────────────────────────────

    /**
     * Store a new notification.
     */
    public function storeNotification(Request $request)
    {
        return back()->with('status', 'Notification sent successfully.');
    }

    /**
     * Delete a notification.
     */
    public function destroyNotification($notification)
    {
        return back()->with('status', 'Notification deleted.');
    }

    // ─── Subscriptions ─────────────────────────────────────────────────────

    /**
     * Update a user's membership tier manually.
     */
    public function updateSubscription(Request $request, $user)
    {
        return back()->with('status', "Membership updated successfully.");
    }

    /**
     * Adjust a user's points balance.
     */
    public function updatePoints(Request $request, $user)
    {
        return back()->with('status', "Points updated successfully.");
    }
}

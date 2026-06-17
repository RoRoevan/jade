<?php

namespace App\Http\Controllers;

use App\Mail\ForestPartnershipStatusMail;
use App\Models\User;
use App\Models\Reward;
use App\Models\AdminNotification;
use App\Models\ForestPartnershipRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Show the admin dashboard.
     * Passes subscriptions, rewards, and notifications to the view.
     */
    public function index()
    {
        $subscribers = User::whereIn('membership_tier', ['Seed', 'Tree', 'Forest'])
            ->select('id', 'first_name', 'last_name', 'email', 'membership_tier', 'points', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        $rewards = Reward::orderBy('created_at', 'desc')->get();

        $notifications = AdminNotification::orderBy('created_at', 'desc')->get();

        $forestRequests = ForestPartnershipRequest::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin', [
            'subscribers'    => $subscribers,
            'rewards'        => $rewards,
            'notifications'  => $notifications,
            'forestRequests' => $forestRequests,
        ]);
    }

    // ─── Rewards ───────────────────────────────────────────────────────────

    /**
     * Store a new reward with optional image upload.
     */
    public function storeReward(Request $request)
    {
        $request->validate([
            'name'            => 'required|string|max:255',
            'description'     => 'required|string',
            'points_required' => 'required|integer|min:1',
            'image'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('rewards', 'public');
        }

        Reward::create([
            'name'            => $request->name,
            'description'     => $request->description,
            'points_required' => $request->points_required,
            'image'           => $imagePath ? '/storage/' . $imagePath : null,
        ]);

        return back()->with('status', 'Reward added successfully.');
    }

    /**
     * Update an existing reward. Replaces image if a new one is uploaded.
     */
    public function updateReward(Request $request, Reward $reward)
    {
        $request->validate([
            'name'            => 'required|string|max:255',
            'description'     => 'required|string',
            'points_required' => 'required|integer|min:1',
            'image'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imagePath = $reward->image; // keep existing by default

        if ($request->hasFile('image')) {
            // Delete old image from storage if it exists
            if ($reward->image) {
                $oldPath = str_replace('/storage/', '', $reward->image);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            $imagePath = '/storage/' . $request->file('image')->store('rewards', 'public');
        }

        $reward->update([
            'name'            => $request->name,
            'description'     => $request->description,
            'points_required' => $request->points_required,
            'image'           => $imagePath,
        ]);

        return back()->with('status', 'Reward updated successfully.');
    }

    /**
     * Delete a reward and its associated image.
     */
    public function destroyReward(Reward $reward)
    {
        if ($reward->image) {
            $oldPath = str_replace('/storage/', '', $reward->image);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
        }

        $reward->delete();

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

        $requestRecord = ForestPartnershipRequest::create(array_merge($validated, [
            'status' => 'pending',
        ]));

        AdminNotification::create([
            'message' => 'New forest partnership request from ' . $validated['business_name'] . ' (contact: ' . $validated['contact_person'] . ').',
            'audience' => 'seed_and_tree',
        ]);

        return back()->with('status', 'Your meeting request has been submitted and is now pending admin review.');
    }

    public function updateForestRequestStatus(Request $request, ForestPartnershipRequest $forestRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,accepted,declined',
        ]);

        $forestRequest->status = $validated['status'];
        $forestRequest->save();

        if (in_array($validated['status'], ['accepted', 'declined'], true)) {
            Mail::to($forestRequest->email)->send(new ForestPartnershipStatusMail($forestRequest));
        }

        return back()->with('status', 'Request status updated successfully.');
    }

    // ─── Notifications ─────────────────────────────────────────────────────

    /**
     * Store a new notification.
     * audience: 'seed_and_tree' | 'tree_only'
     */
    public function storeNotification(Request $request)
    {
        $request->validate([
            'message'  => 'required|string|max:500',
            'audience' => 'required|in:seed_and_tree,tree_only',
        ]);

        AdminNotification::create($request->only('message', 'audience'));

        return back()->with('status', 'Notification sent successfully.');
    }

    /**
     * Delete a notification.
     */
    public function destroyNotification(AdminNotification $notification)
    {
        $notification->delete();

        return back()->with('status', 'Notification deleted.');
    }

    // ─── Subscriptions ─────────────────────────────────────────────────────

    /**
     * Update a user's membership tier manually.
     */
    public function updateSubscription(Request $request, User $user)
    {
        $request->validate([
            'membership_tier' => 'required|in:Seed,Tree,Forest',
        ]);

        $user->membership_tier = $request->membership_tier;

        // Grant starter points when upgraded to Tree by admin
        if ($request->membership_tier === 'Tree' && $user->points === 0) {
            $user->points = 100;
        }

        $user->save();

        return back()->with('status', "Membership updated for {$user->first_name}.");
    }

    /**
     * Adjust a user's points balance.
     */
    public function updatePoints(Request $request, User $user)
    {
        $request->validate([
            'points' => 'required|integer|min:0',
        ]);

        $user->points = $request->points;
        $user->save();

        return back()->with('status', "Points updated for {$user->first_name}.");
    }
}

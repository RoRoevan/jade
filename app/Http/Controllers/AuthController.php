<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;

class AuthController extends Controller
{
    /**
     * Handle an incoming registration request.
     */
    public function register(Request $request): RedirectResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = new User([
            'supabase_id' => null,
            'name' => $request->first_name . ' ' . $request->last_name,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'role' => 'staff',
            'membership_tier' => 'Seed',
            'points' => 0,
            'is_admin' => false,
        ]);

        $user->save();

        Auth::login($user);

        $request->session()->regenerate();

        return redirect('/');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function login(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Standard Laravel login stub
        return redirect()->intended('/');
    }

    /**
     * Destroy an authenticated session (Log the user out).
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Sync Supabase authenticated session with Laravel session.
     */
    public function syncAuth(Request $request)
    {
        $request->validate([
            'access_token' => 'required|string',
            'user_data' => 'nullable|array',
        ]);

        $accessToken = $request->input('access_token');
        $supabaseUrl = env('SUPABASE_URL') ?: env('VITE_SUPABASE_URL', 'https://aknuiuavolazpdhlmrmd.supabase.co');
        $supabaseKey = env('SUPABASE_ANON_KEY') ?: env('VITE_SUPABASE_ANON_KEY', 'sb_publishable_icgYx3cjCVnbiVBSPXORSg_5N37R3im');

        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'Authorization' => 'Bearer ' . $accessToken,
            'apikey' => $supabaseKey,
        ])->get($supabaseUrl . '/auth/v1/user');

        if ($response->failed()) {
            return response()->json(['error' => 'Unauthorized session token'], 401);
        }

        $supabaseUser = $response->json();
        $supabaseId = $supabaseUser['id'] ?? null;
        $userData = $request->input('user_data', []);
        $email = $supabaseUser['email'] ?? ($userData['email'] ?? null);

        if (!$email) {
            return response()->json(['error' => 'Email address is required'], 400);
        }

        $firstName = $userData['first_name'] ?? '';
        $lastName = $userData['last_name'] ?? '';
        if (!$firstName && !$lastName && isset($supabaseUser['user_metadata']['name'])) {
            $parts = explode(' ', $supabaseUser['user_metadata']['name'], 2);
            $firstName = $parts[0] ?? '';
            $lastName = $parts[1] ?? '';
        }

        $name = trim($firstName . ' ' . $lastName) ?: ($supabaseUser['user_metadata']['name'] ?? $email);

        $isAdmin = ($userData['role'] ?? '') === 'admin' || 
                   ($userData['is_admin'] ?? false) || 
                   str_contains(strtolower($email), 'admin') || 
                   ($supabaseUser['app_metadata']['claims']['role'] ?? '') === 'admin';

        $attributes = [
            'supabase_id' => $supabaseId,
            'name' => $name,
            'first_name' => $firstName ?: 'User',
            'last_name' => $lastName,
            'email' => $email,
            'role' => $isAdmin ? 'admin' : 'staff',
            'membership_tier' => $userData['membership_tier'] ?? 'Seed',
            'points' => (int) ($userData['points'] ?? 0),
            'is_admin' => $isAdmin,
        ];

        $user = new User($attributes);
        $user->save();

        Auth::login($user, true);
        $request->session()->regenerate();

        return response()->json(['status' => 'success', 'user' => $user->toArray()]);
    }
}
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
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function register(Request $request): RedirectResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->first_name . ' ' . $request->last_name,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => $request->password, 
            'pin' => bcrypt('1234'), // Default PIN
            'role' => 'staff',       // Default role
        ]);

        event(new Registered($user));

        Auth::login($user);

        $request->session()->regenerate();

        return redirect('/');
    }

    /**
     * Handle an incoming authentication request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember');

        if (! Auth::attempt($credentials, $remember)) {
            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        $request->session()->regenerate();

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
        $supabaseUrl = env('SUPABASE_URL');
        $supabaseKey = env('SUPABASE_ANON_KEY') ?: env('VITE_SUPABASE_ANON_KEY');

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

        $user = User::where('supabase_id', $supabaseId)
                    ->orWhere('email', $email)
                    ->first();

        $firstName = $userData['first_name'] ?? '';
        $lastName = $userData['last_name'] ?? '';
        if (!$firstName && !$lastName && isset($supabaseUser['user_metadata']['name'])) {
            $parts = explode(' ', $supabaseUser['user_metadata']['name'], 2);
            $firstName = $parts[0] ?? '';
            $lastName = $parts[1] ?? '';
        }

        $name = trim($firstName . ' ' . $lastName) ?: ($supabaseUser['user_metadata']['name'] ?? $email);

        if ($user) {
            $user->supabase_id = $supabaseId;
            if ($firstName) $user->first_name = $firstName;
            if ($lastName) $user->last_name = $lastName;
            $user->name = $name ?: $user->name;
            if (isset($userData['membership_tier'])) $user->membership_tier = $userData['membership_tier'];
            if (isset($userData['points'])) $user->points = $userData['points'];
            if (isset($userData['is_admin'])) {
                $user->is_admin = $userData['is_admin'];
                $user->role = $userData['is_admin'] ? 'admin' : 'staff';
            }
            $user->save();
        } else {
            $user = User::create([
                'supabase_id' => $supabaseId,
                'name' => $name,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'password' => bcrypt(\Illuminate\Support\Str::random(16)),
                'pin' => bcrypt('1234'),
                'role' => ($userData['is_admin'] ?? false) ? 'admin' : 'staff',
                'membership_tier' => $userData['membership_tier'] ?? 'Seed',
                'points' => $userData['points'] ?? 0,
                'is_admin' => $userData['is_admin'] ?? false,
            ]);
        }

        Auth::login($user, true);
        $request->session()->regenerate();

        return response()->json(['status' => 'success', 'user' => $user]);
    }
}
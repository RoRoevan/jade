<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'memberNotifications' => function () use ($request) {
                if (! $request->user()) return [];

                $tier = $request->user()->membership_tier;

                if (! in_array($tier, ['Seed', 'Tree'])) return [];

                try {
                    $supabaseUrl = env('SUPABASE_URL') ?: env('VITE_SUPABASE_URL', 'https://aknuiuavolazpdhlmrmd.supabase.co');
                    $supabaseKey = env('SUPABASE_ANON_KEY') ?: env('VITE_SUPABASE_ANON_KEY', 'sb_publishable_icgYx3cjCVnbiVBSPXORSg_5N37R3im');

                    $url = $supabaseUrl . '/rest/v1/notifications?order=id.desc';
                    if ($tier === 'Seed') {
                        $url .= '&audience=eq.seed_and_tree';
                    }

                    $response = \Illuminate\Support\Facades\Http::withHeaders([
                        'apikey' => $supabaseKey,
                        'Authorization' => 'Bearer ' . $supabaseKey,
                    ])->get($url);

                    if ($response->successful()) {
                        return collect($response->json())->pluck('message')->toArray();
                    }
                } catch (\Exception $e) {
                    // Fallback to empty array
                }

                return [];
            },
        ];
    }
}

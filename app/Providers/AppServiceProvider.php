<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        if (config('app.env') === 'production') {
            \URL::forceScheme('https');
        }

        \Illuminate\Support\Facades\Auth::provider('supabase', function ($app, array $config) {
            return new class implements \Illuminate\Contracts\Auth\UserProvider {
                public function retrieveById($identifier)
                {
                    $userData = session('supabase_user');
                    if ($userData && $userData['supabase_id'] == $identifier) {
                        return new \App\Models\User($userData);
                    }
                    return null;
                }
                public function retrieveByToken($identifier, $token) {}
                public function updateRememberToken(\Illuminate\Contracts\Auth\Authenticatable $user, $token) {}
                public function retrieveByCredentials(array $credentials) {}
                public function validateCredentials(\Illuminate\Contracts\Auth\Authenticatable $user, array $credentials) {}
                public function rehashPasswordIfRequired(\Illuminate\Contracts\Auth\Authenticatable $user, array $credentials, bool $force = false) {
                    return $user;
                }
            };
        });
    }
}

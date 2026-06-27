<?php

namespace App\Models;

use Illuminate\Contracts\Auth\Authenticatable;

class User implements Authenticatable
{
    public $supabase_id;
    public $name;
    public $first_name;
    public $last_name;
    public $email;
    public $role;
    public $membership_tier;
    public $points;
    public $is_admin;

    public function __construct(array $attributes = [])
    {
        foreach ($attributes as $key => $value) {
            $this->{$key} = $value;
        }
    }

    // Authenticatable Contracts
    public function getAuthIdentifierName() { return 'supabase_id'; }
    public function getAuthIdentifier() { return $this->supabase_id; }
    public function getAuthPasswordName() { return ''; }
    public function getAuthPassword() { return ''; }
    public function getRememberToken() { return null; }
    public function setRememberToken($value) {}
    public function getRememberTokenName() { return ''; }

    public function save()
    {
        $attributes = $this->toArray();
        session(['supabase_user' => $attributes]);

        if (!empty($this->supabase_id)) {
            try {
                \Illuminate\Support\Facades\Http::withHeaders([
                    'apikey' => env('VITE_SUPABASE_ANON_KEY', 'sb_publishable_icgYx3cjCVnbiVBSPXORSg_5N37R3im'),
                    'Authorization' => 'Bearer ' . env('VITE_SUPABASE_ANON_KEY', 'sb_publishable_icgYx3cjCVnbiVBSPXORSg_5N37R3im'),
                    'Content-Type' => 'application/json',
                ])->patch(
                    env('VITE_SUPABASE_URL', 'https://aknuiuavolazpdhlmrmd.supabase.co') . '/rest/v1/users?id=eq.' . $this->supabase_id,
                    [
                        'membership_tier' => $this->membership_tier,
                        'points' => (int) $this->points,
                    ]
                );
            } catch (\Exception $e) {
                // Ignore API connection failures
            }
        }

        return true;
    }

    public function fill(array $attributes)
    {
        foreach ($attributes as $key => $value) {
            $this->{$key} = $value;
        }
        return $this;
    }

    public function toArray()
    {
        return [
            'supabase_id' => $this->supabase_id,
            'name' => $this->name,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'role' => $this->role,
            'membership_tier' => $this->membership_tier,
            'points' => $this->points,
            'is_admin' => (bool) $this->is_admin,
        ];
    }
}
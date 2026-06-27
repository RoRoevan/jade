<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Product;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Seed Users
        User::create([
            'id' => 1,
            'name' => 'Roevan Admin',
            'first_name' => 'Roevan',
            'last_name' => 'Admin',
            'email' => 'roevan@ruralrising.ph',
            'password' => bcrypt('ruriclub'),
            'pin' => bcrypt('1234'),
            'role' => 'admin',
            'membership_tier' => 'Tree',
            'points' => 480,
            'is_admin' => true,
        ]);

        User::create([
            'id' => 2,
            'name' => 'Myles Gomez',
            'first_name' => 'Myles',
            'last_name' => 'Gomez',
            'email' => 'myles@ruralrising.ph',
            'password' => bcrypt('password'),
            'pin' => bcrypt('1234'),
            'role' => 'manager',
            'membership_tier' => 'Seed',
            'points' => 120,
            'is_admin' => false,
        ]);

        User::create([
            'id' => 3,
            'name' => 'Justine Conanan',
            'first_name' => 'Justine',
            'last_name' => 'Conanan',
            'email' => 'justine@ruralrising.ph',
            'password' => bcrypt('password'),
            'pin' => bcrypt('1234'),
            'role' => 'staff',
            'membership_tier' => 'Tree',
            'points' => 950,
            'is_admin' => false,
        ]);

        User::create([
            'id' => 4,
            'name' => 'Miguel Perico',
            'first_name' => 'Miguel',
            'last_name' => 'Perico',
            'email' => 'miguel@ruralrising.ph',
            'password' => bcrypt('password'),
            'pin' => bcrypt('1234'),
            'role' => 'staff',
            'membership_tier' => 'Seed',
            'points' => 50,
            'is_admin' => false,
        ]);
    }
}
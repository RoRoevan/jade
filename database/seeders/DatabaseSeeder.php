<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->create([
            'first_name' => 'Admin',
            'last_name'  => 'RuRi',
            'email'      => 'admin@ruralrising.com',
            'password'   => bcrypt('ruriclub'),
            'is_admin'   => true,
        ]);
    }
}
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

        // Seed Products
        Product::create([
            'id' => 1,
            'sku_code' => 'PROD-MNG',
            'name' => 'Mango',
            'category' => 'Fruits',
            'unit' => 'kg',
            'shelf_life' => 7,
            'price' => 150.00,
            'created_by' => 1,
        ]);

        Product::create([
            'id' => 2,
            'sku_code' => 'PROD-EGP',
            'name' => 'Eggplant',
            'category' => 'Vegetables',
            'unit' => 'kg',
            'shelf_life' => 5,
            'price' => 80.00,
            'created_by' => 1,
        ]);

        Product::create([
            'id' => 3,
            'sku_code' => 'PROD-EGG',
            'name' => 'Egg',
            'category' => 'Poultry',
            'unit' => 'Trays',
            'shelf_life' => 14,
            'price' => 200.00,
            'created_by' => 1,
        ]);

        Product::create([
            'id' => 4,
            'sku_code' => 'PROD-PRSL',
            'name' => 'Parsley',
            'category' => 'Herbs & Spices',
            'unit' => 'kg',
            'shelf_life' => 4,
            'price' => 120.00,
            'created_by' => 1,
        ]);

        Product::create([
            'id' => 5,
            'sku_code' => 'PROD-BNN',
            'name' => 'Banana',
            'category' => 'Fruits',
            'unit' => 'kg',
            'shelf_life' => 6,
            'price' => 90.00,
            'created_by' => 1,
        ]);

        Product::create([
            'id' => 6,
            'sku_code' => 'PROD-HNY',
            'name' => 'Honey',
            'category' => 'Processed Goods',
            'unit' => 'pcs',
            'shelf_life' => 365,
            'price' => 250.00,
            'created_by' => 1,
        ]);
    }
}
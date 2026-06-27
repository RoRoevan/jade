<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RedeemController;
use App\Http\Controllers\AdminController;
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/shop', function () {
    return Inertia::render('Shop');
})->name('shop');

Route::get('/membership', function () {
    return Inertia::render('Memebership');
})->name('membership');

Route::get('/farmers', function () {
    return Inertia::render('Farmers');
})->name('farmers');

Route::get('/forest-form', function () {
    return Inertia::render('ForestForm');
})->name('forest.form');

Route::post('/forest-form', [AdminController::class, 'storeForestRequest'])->name('forest.form.store');

Route::get('/checkout', function () {
    return Inertia::render('Checkout');
})->middleware(['auth']);

Route::get('/profile', function () {
    return Inertia::render('Profile');
})->middleware(['auth'])->name('profile');

Route::get('/orders', function () {
    return Inertia::render('Orders');
})->middleware(['auth']);

Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::post('/auth-sync', [AuthController::class, 'syncAuth'])->name('auth.sync');

Route::middleware(['auth'])->group(function () {
    Route::get('/cart', function () {
        return Inertia::render('Cart');
    })->name('cart');

    Route::post('/subscribe', [SubscriptionController::class, 'subscribe'])->name('subscribe');
    Route::post('/redeem-points', [SubscriptionController::class, 'redeemPoints'])->name('redeem.points');
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');

    Route::get('/redeem', [RedeemController::class, 'index'])->name('redeem');
    Route::post('/redeem-claim', [RedeemController::class, 'claim'])->name('redeem.claim');
    Route::get('/redeemed-rewards', [RedeemController::class, 'redeemed'])->name('redeemed.rewards');

    Route::get('/orders', function () {
        return Inertia::render('Orders');
    })->name('orders');

    // In-store QR code page (Tree members only)
    Route::get('/instore-qr', function () {
        return Inertia::render('InStoreQR');
    })->name('instore.qr');
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/', [AdminController::class, 'index'])->name('index');

    Route::post('/rewards', [AdminController::class, 'storeReward'])->name('rewards.store');
    Route::put('/rewards/{reward}', [AdminController::class, 'updateReward'])->name('rewards.update');
    Route::delete('/rewards/{reward}', [AdminController::class, 'destroyReward'])->name('rewards.destroy');

    Route::post('/notifications', [AdminController::class, 'storeNotification'])->name('notifications.store');
    Route::delete('/notifications/{notification}', [AdminController::class, 'destroyNotification'])->name('notifications.destroy');

    Route::put('/subscriptions/{user}', [AdminController::class, 'updateSubscription'])->name('subscriptions.update');
    Route::put('/subscriptions/{user}/points', [AdminController::class, 'updatePoints'])->name('subscriptions.points');

    Route::patch('/forest-requests/{forestRequest}', [AdminController::class, 'updateForestRequestStatus'])->name('forest-requests.update');
});

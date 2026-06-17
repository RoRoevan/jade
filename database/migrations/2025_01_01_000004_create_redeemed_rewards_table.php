<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('redeemed_rewards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('reward_id')->constrained()->onDelete('cascade');
            $table->string('reward_name'); // snapshot in case reward is deleted later
            $table->unsignedInteger('points_spent');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('redeemed_rewards');
    }
};

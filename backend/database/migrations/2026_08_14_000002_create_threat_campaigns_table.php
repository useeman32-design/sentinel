<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('threat_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('severity'); // Critical, High, Medium
            $table->string('category');
            $table->string('region');
            $table->text('description');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('threat_campaigns');
    }
};

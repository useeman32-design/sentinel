<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('threat_reports', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('risk_level')->default('Low');
            $table->text('summary');
            $table->json('metrics')->nullable();
            $table->json('recommendations')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('threat_reports');
    }
};

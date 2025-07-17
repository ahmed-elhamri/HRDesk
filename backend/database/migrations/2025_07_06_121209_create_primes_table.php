<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('primes', function (Blueprint $table) {
            $table->id();
            $table->string('motif');
            $table->enum('impot', ['IMPOSABLE', 'NON IMPOSABLE'])->default('NON IMPOSABLE');
            $table->decimal('plafond');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('primes');
    }
};

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
            $table->boolean('soumis_cotisation_cnss_amo_cimr')->default(false);
            $table->boolean('soumis_ir')->default(false);
            $table->decimal('plafond_ir')->default(0.0);
            $table->decimal('plafond_cnss')->default(0.0);
            $table->boolean('calcul_proportionnel_jours')->default(false);
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

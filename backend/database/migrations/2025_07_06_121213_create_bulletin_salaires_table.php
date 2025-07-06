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
        Schema::create('bulletins_salaire', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employe_id')->constrained('employes')->onDelete('cascade');
            $table->string('mois'); // Format: '2025-06'
            $table->decimal('salaire_base', 10, 2);
            $table->decimal('total_primes', 10, 2);
            $table->decimal('total_prets', 10, 2);
            $table->decimal('total_absences', 10, 2);
            $table->decimal('salaire_net', 10, 2);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bulletin_salaires');
    }
};

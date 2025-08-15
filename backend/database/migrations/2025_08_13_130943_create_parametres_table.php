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
        Schema::create('frais_professionnels', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['annuel', 'mensuel']); // type of calculation
            $table->decimal('min_sbi', 10, 2)->nullable(); // lower bound
            $table->decimal('max_sbi', 10, 2)->nullable(); // upper bound
            $table->decimal('taux', 5, 2); // percentage
            $table->decimal('plafond', 10, 2)->nullable(); // cap (null if no limit)
            $table->timestamps();
        });

        Schema::create('amo_cotisations', function (Blueprint $table) {
            $table->id();
            $table->string('cotisation'); // e.g. AMO, Participation AMO
            $table->decimal('part_salariale', 5, 2)->nullable(); // %
            $table->decimal('part_patronale', 5, 2)->nullable(); // %
            $table->decimal('plafond', 10, 2)->nullable(); // e.g. "Non plafonné" or numeric
            $table->timestamps();
        });

        Schema::create('cnss_cotisations', function (Blueprint $table) {
            $table->id();
            $table->string('cotisation');
            $table->decimal('part_salariale', 5, 2)->nullable();
            $table->decimal('part_patronale', 5, 2)->nullable();
            $table->decimal('plafond', 10, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('ir_tranches', function (Blueprint $table) {
            $table->id();
            $table->enum('period', ['MENSUEL', 'ANNUEL'])->index();        // monthly / annual scale
            $table->decimal('rni_min', 12, 2);                              // "RNI du"
            $table->decimal('rni_max', 12, 2)->nullable();                  // "RNI au" (null = open-ended "+")
            $table->decimal('taux', 5, 2);                                  // % rate (0–100)
            $table->decimal('deduction', 12, 2)->default(0);                // fixed deduction
            $table->timestamps();
        });

        Schema::create('family_charges', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('nbr_enfants');
            $table->decimal('mensuel', 10, 2);
            $table->decimal('annuel', 10, 2);
            $table->timestamps();
        });

        Schema::create('taux_heures_supplementaires', function (Blueprint $table) {
            $table->id();
            $table->enum('periode', ['JOUR', 'NUIT']);       // Jour / Nuit
            $table->time('heure_debut');                     // Exemple : 06:00
            $table->time('heure_fin');                       // Exemple : 21:00 (peut dépasser minuit)
            $table->decimal('taux_jours_ouvres', 5, 2);      // % ex : 25.00
            $table->decimal('taux_jours_feries', 5, 2);      // % ex : 50.00
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('frais_professionnels');
        Schema::dropIfExists('amo_cotisations');
        Schema::dropIfExists('cnss_cotisations');
        Schema::dropIfExists('ir_tranches');
        Schema::dropIfExists('family_charges');
        Schema::dropIfExists('taux_heures_supplementaires');
    }
};

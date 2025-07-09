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
        Schema::create('employes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->unsignedBigInteger('fonction_id');
            $table->string('matricule');
            $table->string('nom');
            $table->string('prenom');
            $table->string('cin');
            $table->enum('sexe', ['HOMME', 'FEMME'])->default('HOMME');
            $table->string('nationalite');
            $table->date('date_de_naissance');
            $table->string('pays');
            $table->string('ville');
            $table->string('adresse_actuelle');
            $table->string('telephone_mobile');
            $table->string('telephone_fixe');
            $table->string('email_personnel');
            $table->enum('situation_familiale', ['MARIE', 'CELIBATAIRE'])->default('CELIBATAIRE');
            $table->date('date_embauche');
            $table->decimal('salaire_base', 10, 2);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('fonction_id')->references('id')->on('fonctions')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employes');
    }
};

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
            $table->string('matricule')->unique();
            $table->enum('civilite', ['M', 'MME', 'MLLE'])->default('M');
            $table->string('nom');
            $table->string('prenom');
            $table->string('adresse');
            $table->string('ville');
            $table->string('nationalite');
            $table->string('cin')->nullable();
            $table->string('sejour')->nullable();
            $table->string('telephone_mobile');
            $table->string('telephone_fixe')->nullable();
            $table->string('email');
            $table->date('date_de_naissance');
            $table->string('lieu_de_naissance');
            $table->enum('situation_familiale', ['MARIE', 'CELIBATAIRE'])->default('CELIBATAIRE');
            $table->integer('nb_enfants')->default(0);
            $table->integer('nb_deductions')->default(0);
            $table->date('date_embauche');
            $table->date('date_entree');
            $table->integer('taux_anciennete')->default(0);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('fonction_id')->references('id')->on('fonctions')->onDelete('cascade');
        });

        Schema::create('contrats', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employe_id')->unique();
            $table->enum('type_contrat', ['CDI', 'CDD'])->default('CDI');
            $table->enum('type_remuneration', ['MENSUEL', 'HORAIRE', 'QUINZAINE'])->default('MENSUEL');
            $table->enum('statut', ['PERMANENT', 'VACATAIRE', 'OCCASIONNEL', 'STAGAIRE', 'TAHFIZ', 'PCS'])->default('PERMANENT');
            $table->date('date_fin')->nullable();
            $table->float('salaire_base');
            $table->integer('taux_horaire');
            $table->enum('classification', ['NR', 'SO', 'DE', 'IT', 'IL', 'AT', 'CS', 'MS', 'MP'])->default('NR');
            $table->boolean('est_avocat')->default(false);
            $table->boolean('est_domestique')->default(false);
            $table->boolean('est_saisonnier')->default(false);
            $table->integer('nb_jours_saisonnier')->nullable();
            $table->boolean('nouveau_declarant')->default(false);
            $table->timestamps();

            $table->foreign('employe_id')->references('id')->on('employes')->onDelete('cascade');
        });

        Schema::create('caisses_sociales', function (Blueprint $table) {
           $table->id();
           $table->unsignedBigInteger('employe_id')->unique();
           $table->string('numero_cnss');
           $table->string('numero_mutuelle');
           $table->string('numero_adherent_cimr');
           $table->string('numero_categorie_cimr');
           $table->string('matricule_cimr');
           $table->float('taux_cotisation_cimr');
           $table->date('date_affiliation_cimr');
           $table->timestamps();

           $table->foreign('employe_id')->references('id')->on('employes')->onDelete('cascade');

        });

        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employe_id')->unique();
            $table->string('mode_paiement')->nullable();
            $table->string('banque')->nullable();
            $table->string('numero_compte')->nullable();
            $table->string('adresse_banque')->nullable();
            $table->timestamps();

            $table->foreign('employe_id')->references('id')->on('employes')->onDelete('cascade');
        });

        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employe_id')->unique();
            $table->string('chemin_cin')->nullable();
            $table->string('chemin_cnss')->nullable();
            $table->string('chemin_contrat_travail')->nullable();
            $table->string('chemin_tableau_amortissement')->nullable();
            $table->string('lettre_demission')->nullable();
            $table->string('diplome_un')->nullable();
            $table->string('diplome_deux')->nullable();
            $table->string('diplome_trois')->nullable();
            $table->string('diplome_quatre')->nullable();
            $table->string('diplome_cinq')->nullable();
            $table->timestamps();

            $table->foreign('employe_id')->references('id')->on('employes')->onDelete('cascade');
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

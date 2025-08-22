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
        Schema::create('bulletins', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employe_id');
            $table->double('jrs_trav');
            $table->double('hrs_trav');
            $table->double('hrs_sup');
            $table->double('brut');
            $table->double('cnss');
            $table->double('amo');
            $table->double('igr');
            $table->double('net_a_payer');
            $table->date('periode');
            $table->timestamps();

            $table->foreign('employe_id')->references('id')->on('employes')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bulletins');
    }
};

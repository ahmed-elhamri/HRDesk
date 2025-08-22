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
        Schema::create('bulletin_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bulletin_id');
            $table->string('libele');
            $table->double('base');
            $table->double('taux');
            $table->double('gain');
            $table->double('retenue');
            $table->timestamps();

            $table->foreign('bulletin_id')->references('id')->on('bulletins')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bulletin_details');
    }
};

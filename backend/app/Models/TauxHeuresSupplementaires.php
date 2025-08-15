<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TauxHeuresSupplementaires extends Model
{
    use HasFactory;
    protected $table = 'taux_heures_supplementaires';

    protected $fillable = [
        'periode',
        'heure_debut',
        'heure_fin',
        'taux_jours_ouvres',
        'taux_jours_feries'
    ];
}

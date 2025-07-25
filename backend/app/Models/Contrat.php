<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contrat extends Model
{
    use HasFactory;
    protected $table = 'contrats';

    protected $fillable = [
        'employe_id',
        'type_contrat',
        'type_remuneration',
        'statut',
        'date_fin',
        'salaire_base',
        'taux_horaire',
        'classification',
        'est_avocat',
        'est_domestique',
        'est_saisonnier',
        'nb_jours_saisonnier',
        'nouveau_declarant',
    ];

    public function employe()
    {
        return $this->belongsTo(Employe::class);
    }
}

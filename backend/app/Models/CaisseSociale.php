<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaisseSociale extends Model
{
    use HasFactory;
    protected $table = 'caisses_sociales';

    protected $fillable = [
        'employe_id',
        'numero_cnss',
        'numero_mutuelle',
        'numero_adherent_cimr',
        'numero_categorie_cimr',
        'matricule_cimr',
        'taux_cotisation_cimr',
        'date_affiliation_cimr',
    ];

    public function employe()
    {
        return $this->belongsTo(Employe::class);
    }
}

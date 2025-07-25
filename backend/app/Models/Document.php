<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;
    protected $table = 'documents';

    protected $fillable = [
        'employe_id',
        'chemin_cin',
        'chemin_cnss',
        'chemin_contrat_travail',
        'chemin_tableau_amortissement',
        'lettre_demission',
        'diplome_un',
        'diplome_deux',
        'diplome_trois',
        'diplome_quatre',
        'diplome_cinq',
    ];

    public function employe()
    {
        return $this->belongsTo(Employe::class);
    }
}

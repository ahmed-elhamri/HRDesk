<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prime extends Model
{
    use HasFactory;

    protected $fillable = [
        'motif',
        'impot',
        'soumis_cotisation_cnss_amo_cimr',
        'soumis_ir',
        'plafond_ir',
        'plafond_cnss',
        'calcul_proportionnel_jours',
    ];

    public function employes()
    {
        return $this->belongsToMany(Employe::class, "employe_prime")
            ->withPivot('montant', 'periode')
            ->withTimestamps();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;
    protected $table = 'paiements';

    protected $fillable = [
        'employe_id',
        'mode_paiement',
        'banque',
        'numero_compte',
        'adresse_banque',
    ];

    public function employe()
    {
        return $this->belongsTo(Employe::class);
    }
}

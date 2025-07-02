<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pret extends Model
{
    use HasFactory;

    protected $fillable = [
        'employe_id',
        'montant',
        'mensualite',
        'date_demande',
        'statut',
    ];

    public function employe() {
        return $this->belongsTo(Employe::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conge extends Model
{
    use HasFactory;

    protected $fillable = [
        'employe_id',
        'date_debut',
        'date_fin',
        'type',
        'etat',
    ];

    public function employe() {
        return $this->belongsTo(Employe::class);
    }
}

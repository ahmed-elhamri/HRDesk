<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeureSupplementaire extends Model
{
    use HasFactory;
    protected $table = 'heures_supplementaires';

    protected $fillable = [
        'employe_id',
        'jour',          // OUVRABLE | FERIES
        'heure_debut',   // HH:MM
        'heure_fin',     // HH:MM
        'date',
    ];

    public function employe()
    {
        return $this->belongsTo(Employe::class);
    }
}

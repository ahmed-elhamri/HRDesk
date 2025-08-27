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
        'date',
        'jour',          // OUVRABLE | FERIES
        'perdiode',   // HH:MM
        'nombre',     // HH:MM
    ];

    public function employe()
    {
        return $this->belongsTo(Employe::class);
    }
}

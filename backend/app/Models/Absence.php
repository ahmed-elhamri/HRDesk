<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Absence extends Model
{
    use HasFactory;

    protected $fillable = [
        'employe_id',
        'date',
        'motif',
        'justifie',
    ];

    public function employe() {
        return $this->belongsTo(Employe::class);
    }
}

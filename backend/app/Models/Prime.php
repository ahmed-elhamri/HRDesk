<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prime extends Model
{
    use HasFactory;

    protected $fillable = [
        'employe_id',
        'montant',
        'motif',
        'impot',
        'date_attribution',
    ];

    public function employe() {
        return $this->belongsTo(Employe::class);
    }
}

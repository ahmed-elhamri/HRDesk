<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IrTranche extends Model
{
    use HasFactory;

    protected $table = 'ir_tranches';

    protected $fillable = [
        'period',
        'rni_min',
        'rni_max',
        'taux',
        'deduction'
    ];

}

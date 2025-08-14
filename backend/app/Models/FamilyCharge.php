<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FamilyCharge extends Model
{
    use HasFactory;
    protected $table = 'family_charges';

    protected $fillable = [
        'nbr_enfants',
        'mensuel',
        'annuel'
    ];
}

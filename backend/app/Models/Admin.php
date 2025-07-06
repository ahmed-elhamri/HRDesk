<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nom',
        'prenom',
        'poste',
        'date_embauche',
        'salaire_base',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

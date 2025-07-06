<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departement extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'designation',
    ];

    public function services() {
        return $this->hasMany(Service::class);
    }
}

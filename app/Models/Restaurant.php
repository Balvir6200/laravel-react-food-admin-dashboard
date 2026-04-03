<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = [
        'name',
        'owner_name',
        'email',
        'phone',
        'address',
        'status',
        'rating',
    ];
}
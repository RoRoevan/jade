<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForestPartnershipRequest extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'business_name',
        'contact_person',
        'email',
        'phone',
        'preferred_date',
        'proposal_description',
        'status',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'sku_code',
        'name',
        'category',
        'unit',
        'shelf_life',
        'price',
        'created_by',
    ];

    protected $casts = [
        'price' => 'float',
        'shelf_life' => 'integer',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

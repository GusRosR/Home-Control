<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //Line to link factory files
    use HasFactory;

    //Columns to be assigned massively
    protected $fillable = [
        'name',
        'amount',
        'buy_date',
        'category_id',
    ];

    //Relationship where a product has one category
    public function categories(){
        return $this->belongsTo(Category::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    //Line to be able to use factories
    use HasFactory;
    
    //Declaring which fields can be mass assigned
    protected $fillable = [
        'name',
        'parent_id',
    ];

    //Relationship where a category can have multiple products
    public function products(){
        return $this->hasMany(Product::class);
    }

    //Relationship where a category can have a parent category
    public function parent(){
        return $this->belongsTo(Category::class, 'parent_id');
    }

    //Relationship where a category can have multiple children classes
    public function children(){
        return $this->hasMany(Category::class, 'parent_id');
    }
}

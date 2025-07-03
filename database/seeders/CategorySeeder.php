<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::factory()->count(50)->create();

        $categories->random(round($categories->count() * 0.3))->each(function ($category) use ($categories) {
        $parent = $categories->where('id', '!=', $category->id)->random();
        $category->update([
                'parent_id' => $parent->id,
            ]);
        });

    }
}

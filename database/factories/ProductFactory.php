<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'amount' => fake()->numberBetween(1,100),
            'buy_date' => fake()->date(),
            'category_id' => Category::query()->exists()
            ? Category::inRandomOrder()->first()->id
            : Category::factory()->create()->id,
        ];
    }
}

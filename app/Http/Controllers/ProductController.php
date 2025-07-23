<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpParser\Node\Stmt\TryCatch;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('categories')->latest(); //Queries products table with categories associated to them. Order from newest to oldest
        return Inertia::render('Products/Index', [
            'products' => $products //We pass collection of products as props to the page
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::select('id', 'name')->get(); //Query categories table and retrieves the id and name columns
        return Inertia::render('Products/Create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            
            //Data sanitization
            $validated = $request->validate([
                'name' => 'required|string|max:200|unique:products,name',
                'amount' => 'required|integer|min:0',
                'buy_date' => 'required|date',
                'category_id' => 'required|exists:categories,id',
            ]);

            
            Product::create($validated);

            
            return redirect()
                ->route('products.index')
                ->with('success', 'Product created successfully');

        } catch (\Exception $e) {
            
            return redirect()
                ->back()
                ->with('error', 'Failed to create product: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $categories = Category::select('id','name')->get(); //We retrieve the table records (from id and name columns of course)
        return Inertia::render('Products/Edit', [
            'product' =>$product->loadMissing('category'), //We load the relationship of a product and its category
            'categories' => $categories //We pass data collection as a prop
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        try {

            $validated = $request->validate([
                'name' => 'required|string|max:200|unique:products,name,' . $product->id, //Check for name duplicates except the selected record
                'amount' => 'required|integer|min:0',
                'buy_date' => 'required|date',
                'category_id' => 'required|exists:categories,id'
            ]);

            $product->update($validated);
             return redirect()
                 ->route('products.edit', $product->id)
                 ->with('success', 'Product updated successfully!');

        } catch (\Exception $e) {

            return redirect()
                ->back()
                ->with('error', 'Failed to update the product: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product)
    {
        try {
            if(!$request->has('confirm')){
                return redirect()
                    ->back()
                    ->with('warning', 'Are you sure you want to delete this product?');
            }

            $product->delete();

            return redirect()
                ->route('products.index')
                ->with('success', 'The product was deleted successfully!');


        } catch (\Exception $e) {
            
            return redirect()
                ->back()
                ->with('error', 'Failed to delete the product: ' . $e->getMessage());
        }
    }
}

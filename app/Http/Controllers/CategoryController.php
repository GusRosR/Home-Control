<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;


class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Category::with('parent');
        
        //Handle search
        if ($request->filled('search')) {
            $search = $request->search;
           $query->where(function ($query) use ($search) {
                $query->where('name', 'LIKE', "%{$search}%")
                    ->orWhereHas('parent', function ($q) use ($search) {
                        $q->where('name', 'LIKE', "%{$search}%");
              });
    });
        }

        // Handle sort
    $sort = $request->get('sort', 'newest');

    switch ($sort) {
        case 'oldest':
            $query->orderBy('id', 'asc');
            break;
        case 'az':
            $query->orderBy('name', 'asc');
            break;
        case 'za':
            $query->orderBy('name', 'desc');
            break;
        default: // newest
            $query->orderBy('id', 'desc');
            break;
    }
    
        $categories = $query->paginate(15)->withQueryString(); // Keep query params (like ?page=2&search=abc)
    
        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only('search','sort'), // Optional: send back the filter
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::select('id', 'name')->get(); 

        return Inertia::render('Categories/Create', [
            'categories' => $categories
        ] ); //Just returns the view with the forms to add a new category
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

            //We create rules to validate input data
            $validated = $request->validate([
                'name' => 'required|string|max:150',
                'parent_id' => 'nullable|exists:categories,id', //Makes sure that matches an actual id on the table if filled
            ]);

            Category::create($validated); //Creates a record with sanitized data

            //Redirect the user back to the index with a success message
            return redirect()
                ->route('categories.index')
                ->with('success', 'Category created successfully!');

        } catch (\Exception $e) {

            logger()->error('Category creation failed: ' . $e->getMessage());
            //Take the user to the previous page and return the error message
            return redirect()
                ->back()
                ->with('error', 'Category names must be unique');
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
    public function edit(Category $category) //we pass the model as a parameter for model binding
    {
        return Inertia::render('Categories/Edit', [
            'category' => $category, //We render the page passing the model as a prop so the routes get the resource to be edited faster
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category) //We add model binding as well for the same reason
    {
         try {

            //We create rules to validate input data
            $validated = $request->validate([
                'name' => 'required|string|max:150',
                'parent_id' => 'nullable|exists:categories,id', //Makes sure that matches an actual id on the table if filled
            ]);

            $category -> update($validated);

            //Redirect the user back to the edit page with a success message
            return redirect()
                ->route('categories.index', $category->id)
                ->with('success', 'Category updated successfully!');

        } catch (\Exception $e) {

            logger()->error('Category creation failed: ' . $e->getMessage());
            //Take the user to the previous page and return the error message
            return redirect()
                ->back()
                ->with('error', 'Category names must be unique');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Category $category) //We ask for the request to validate confirmation and use model binding
    {
        try {

            //Get the associated records count for reuse
            $productsCount = $category -> products() -> count();
            $childrenCount = $category -> children() -> count();

            //Validation that user confirmed delete and associated records exist
            if(!$request->has('confirm') && ($productsCount > 0 || $childrenCount > 0)){

                $warning = "This category has:";

                //Add to warning message if records exist
                if($productsCount > 0){
                    $warning .= " {$productsCount} product(s)";
                }

                //Same as above
                if($childrenCount > 0) {
                    $warning .= " and {$childrenCount} sub-categorie(s)";
                }

                $warning .= ". If you delete it, these associated records will also be deleted";

                
                return back()->with('warning',$warning);
            }

            //Delete the records
            $category->delete();

            //Return user to the index
            return redirect()
                ->route('categories.index')
                ->with('success', 'The category and its products were successfully deleted');

        } catch (\Exception $e) {

            logger()->error('Category creation failed: ' . $e->getMessage());
            //Take the user to the previous page and return the error message
            return redirect()
                ->back()
                ->with('error', 'Category could not be deleted, try again');
        }
    }
}

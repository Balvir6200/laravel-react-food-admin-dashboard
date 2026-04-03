<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function page()
    {
        return view('admin.restaurants.index');
    }

    public function list()
    {
        return response()->json(
            Restaurant::latest()->get()
        );
    }

public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'owner_name' => 'nullable|string|max:255',
        'email' => 'nullable|email|max:255',
        'phone' => 'nullable|string|max:50',
        'address' => 'nullable|string',
        'status' => 'required|string|max:50',
        'rating' => 'nullable|numeric|min:0|max:5',
    ]);

    // ✅ fix: default rating
    $validated['rating'] = $validated['rating'] ?? 0;

    $restaurant = Restaurant::create($validated);

    return response()->json([
        'message' => 'Restaurant created successfully.',
        'restaurant' => $restaurant,
    ]);
}

    public function update(Request $request, Restaurant $restaurant)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'owner_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'status' => 'required|string|max:50',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        $restaurant->update($validated);

        return response()->json([
            'message' => 'Restaurant updated successfully.',
            'restaurant' => $restaurant,
        ]);
    }

    public function destroy(Restaurant $restaurant)
    {
        $restaurant->delete();

        return response()->json([
            'message' => 'Restaurant deleted successfully.',
        ]);
    }
}
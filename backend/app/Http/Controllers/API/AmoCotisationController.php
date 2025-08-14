<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AmoCotisation;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class AmoCotisationController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth:sanctum',
//            new Middleware('role:SUPERVISOR,ADMIN'),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(AmoCotisation::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cotisation' => 'required|string|max:255',
            'part_salariale' => 'nullable|numeric',
            'part_patronale' => 'nullable|numeric',
            'plafond' => 'nullable|string|max:255',
        ]);

        $item = AmoCotisation::create($validated);
        return response()->json($item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(AmoCotisation::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $item = AmoCotisation::findOrFail($id);

        $validated = $request->validate([
            'cotisation' => 'sometimes|required|string|max:255',
            'part_salariale' => 'nullable|numeric',
            'part_patronale' => 'nullable|numeric',
            'plafond' => 'nullable|string|max:255',
        ]);

        $item->update($validated);
        return response()->json($item);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        AmoCotisation::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}

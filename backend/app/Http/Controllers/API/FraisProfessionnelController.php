<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FraisProfessionnel;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class FraisProfessionnelController extends Controller implements HasMiddleware
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
        return response()->json(FraisProfessionnel::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:annuel,mensuel',
            'min_sbi' => 'nullable|numeric',
            'max_sbi' => 'nullable|numeric',
            'taux' => 'required|numeric',
            'plafond' => 'nullable|numeric',
        ]);

        $item = FraisProfessionnel::create($validated);
        return response()->json($item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(FraisProfessionnel::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $item = FraisProfessionnel::findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|in:annuel,mensuel',
            'min_sbi' => 'nullable|numeric',
            'max_sbi' => 'nullable|numeric',
            'taux' => 'required|numeric',
            'plafond' => 'nullable|numeric',
        ]);

        $item->update($validated);
        return response()->json($item);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        FraisProfessionnel::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}

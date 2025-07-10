<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Departement;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class DepartementController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth:sanctum',
            new Middleware('role:SUPERVISOR,ADMIN'),
        ];
    }
    public function index()
    {
        return response()->json(Departement::all());
    }

    public function getAllServices()
    {
        return response()->json(Departement::services()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'reference' => 'required|string',
            'designation' => 'required|string',
        ]);

        $departement = Departement::create($request->all());

        return response()->json($departement, 201);
    }

    public function show($id)
    {
        $departement = Departement::with("services")->findOrFail($id);
        return response()->json($departement);
    }

    public function getByReference($reference)
    {
        $departement = Departement::where('reference', $reference)->first();

        if (!$departement) {
            return response()->json(['message' => 'Departement not found'], 404);
        }

        return response()->json($departement);
    }

    public function update(Request $request, $id)
    {
        $departement = Departement::findOrFail($id);

        $validated = $request->validate([
            'reference' => 'required|string|unique:departements,reference,' . $id,
            'designation' => 'required|string|max:255',
        ]);

        $departement->update($validated);

        return response()->json($departement);
    }

    public function destroy($id)
    {
        Departement::destroy($id);
        return response()->json(['message' => 'Departement deleted successfully']);
    }
}

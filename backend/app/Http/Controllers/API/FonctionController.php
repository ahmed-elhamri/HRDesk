<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Fonction;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class FonctionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth:sanctum',
        ];
    }

    public function index()
    {
        return response()->json(Fonction::with('service.departement')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'reference' => 'required|string|unique:fonctions,reference',
            'designation' => 'required|string',
        ]);

        $fonction = Fonction::create($request->all());

        return response()->json($fonction, 201);
    }

    public function show($id)
    {
        $fonction = Fonction::findOrFail($id);
        return response()->json($fonction);
    }

    public function getByReference($reference)
    {
        $service = Fonction::with(['service.departement', 'employes'])
            ->where('reference', $reference)
            ->first();

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        return response()->json($service);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'reference' => 'required|string|unique:fonctions,reference,' . $id,
            'designation' => 'required|string|max:255',
        ]);

        $fonction = Fonction::findOrFail($id);
        $fonction->update($request->all());

        return response()->json($fonction);
    }

    public function destroy($id)
    {
        Fonction::destroy($id);
        return response()->json(['message' => 'Fonction deleted successfully']);
    }
}

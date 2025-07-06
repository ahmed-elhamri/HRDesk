<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Departement;
use Illuminate\Http\Request;

class DepartementController extends Controller
{
    public function index()
    {
        return response()->json(Departement::all());
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
        $departement = Departement::findOrFail($id);
        return response()->json($departement);
    }

    public function update(Request $request, $id)
    {
        $departement = Departement::findOrFail($id);
        $departement->update($request->all());

        return response()->json($departement);
    }

    public function destroy($id)
    {
        Departement::destroy($id);
        return response()->json(['message' => 'Departement deleted successfully']);
    }
}

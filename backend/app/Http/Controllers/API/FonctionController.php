<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Fonction;
use Illuminate\Http\Request;

class FonctionController extends Controller
{
    public function index()
    {
        return response()->json(Fonction::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'reference' => 'required|string',
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

    public function update(Request $request, $id)
    {
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

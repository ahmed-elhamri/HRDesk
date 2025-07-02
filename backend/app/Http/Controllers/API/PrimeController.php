<?php

namespace App\Http\Controllers\API;

use App\Models\Prime;
use App\Models\Employe;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PrimeController extends Controller
{
    public function index()
    {
        return response()->json(Prime::with('employe')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'employe_id' => 'required|exists:employes,id',
            'montant' => 'required|numeric',
            'motif' => 'required|string',
            'date_attribution' => 'required|date',
        ]);

        $prime = Prime::create($request->all());

        return response()->json($prime, 201);
    }

    public function show($id)
    {
        $prime = Prime::with('employe')->findOrFail($id);
        return response()->json($prime);
    }

    public function update(Request $request, $id)
    {
        $prime = Prime::findOrFail($id);
        $prime->update($request->all());

        return response()->json($prime);
    }

    public function destroy($id)
    {
        Prime::destroy($id);
        return response()->json(['message' => 'Prime deleted successfully']);
    }
}

<?php

namespace App\Http\Controllers\API;

use App\Models\Employe;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EmployeController extends Controller
{
    public function index()
    {
        return response()->json(Employe::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:employes,email',
            'poste' => 'required|string',
            'departement' => 'required|string',
            'date_embauche' => 'required|date',
            'salaire_base' => 'required|numeric',
        ]);

        $employe = Employe::create($request->all());

        return response()->json($employe, 201);
    }

    public function show($id)
    {
        $employe = Employe::findOrFail($id);
        return response()->json($employe);
    }

    public function update(Request $request, $id)
    {
        $employe = Employe::findOrFail($id);
        $employe->update($request->all());

        return response()->json($employe);
    }

    public function destroy($id)
    {
        Employe::destroy($id);
        return response()->json(['message' => 'Employe deleted successfully']);
    }
}

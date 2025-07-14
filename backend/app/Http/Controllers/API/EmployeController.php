<?php

namespace App\Http\Controllers\API;

use App\Models\Employe;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class EmployeController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth:sanctum',
            new Middleware('role:SUPERVISOR,ADMIN', except: ['show', 'update']),
        ];
    }
    public function index()
    {
        return response()->json(Employe::with(['fonction', 'fonction.service', 'fonction.service.departement'])->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email',
            'fonction_id' => 'required|exists:fonctions,id',
            'matricule' => 'required|string|unique:employes,matricule',
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'cin' => 'required|string',
            'sexe' => 'required|in:HOMME,FEMME',
            'nationalite' => 'required|string',
            'date_de_naissance' => 'required|date',
            'pays' => 'required|string',
            'ville' => 'required|string',
            'adresse_actuelle' => 'required|string',
            'telephone_mobile' => 'required|string',
            'telephone_fixe' => 'required|string',
            'email_personnel' => 'required|email|unique:employes,email_personnel',
            'situation_familiale' => 'required|in:MARIE,CELIBATAIRE',
            'date_embauche' => 'required|date',
            'salaire_base' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        // Create user first
        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make('123456'),
            'role' => 'EMPLOYE'
        ]);

        // Create employe
        $employeData = $request->all();
        $employeData['user_id'] = $user->id;
        unset($employeData['email']);

        $employe = Employe::create($employeData);

        return response()->json($employe, 201);
    }

    public function show($id)
    {
        $employe = Employe::with([
            'fonction',
            'fonction.service',
            'fonction.service.departement',
            'user'
        ])->where("user_id", $id)->first();
        return response()->json($employe);
    }

    public function getByMatricule($matricule)
    {
        $employe = Employe::with([
            'fonction',
            'fonction.service',
            'fonction.service.departement',
            'user'
        ])->where('matricule', $matricule)->first();

        if (!$employe) {
            return response()->json(['message' => 'Employe not found'], 404);
        }

        return response()->json($employe);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role === 'EMPLOYE') {
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string',
                'prenom' => 'required|string',
                'cin' => 'required|string',
                'sexe' => 'required|in:HOMME,FEMME',
                'nationalite' => 'required|string',
                'date_de_naissance' => 'required|date',
                'pays' => 'required|string',
                'ville' => 'required|string',
                'adresse_actuelle' => 'required|string',
                'telephone_mobile' => 'required|string',
                'telephone_fixe' => 'required|string',
                'email_personnel' => 'required|email|unique:employes,email_personnel,' . $id,
                'situation_familiale' => 'required|in:MARIE,CELIBATAIRE',
            ]);
        } else{
            $validator = Validator::make($request->all(), [
                'fonction_id' => 'required|exists:fonctions,id',
                'matricule' => 'required|string|unique:employes,matricule,' . $id,
                'nom' => 'required|string',
                'prenom' => 'required|string',
                'cin' => 'required|string',
                'sexe' => 'required|in:HOMME,FEMME',
                'nationalite' => 'required|string',
                'date_de_naissance' => 'required|date',
                'pays' => 'required|string',
                'ville' => 'required|string',
                'adresse_actuelle' => 'required|string',
                'telephone_mobile' => 'required|string',
                'telephone_fixe' => 'required|string',
                'email_personnel' => 'required|email|unique:employes,email_personnel,' . $id,
                'situation_familiale' => 'required|in:MARIE,CELIBATAIRE',
                'date_embauche' => 'required|date',
                'salaire_base' => 'required|numeric'
            ]);
        }


        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

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

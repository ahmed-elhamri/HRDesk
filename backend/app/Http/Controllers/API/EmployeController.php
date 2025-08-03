<?php

namespace App\Http\Controllers\API;

use App\Imports\EmployesImport;
use App\Models\Employe;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
class EmployeController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth:sanctum',
        ];
    }
    public function index()
    {
        return response()->json(
            Employe::select('id', 'fonction_id', 'user_id', 'matricule', 'nom', 'prenom')
            ->with(['fonction:id,service_id,designation',
                'fonction.service:id,departement_id,designation',
                'fonction.service.departement:id,designation'
                ])
            ->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fonction_id' => 'required|exists:fonctions,id',
            'matricule' => 'required|string|unique:employes,matricule',
            'civilite' => 'required|in:M,MME,MLLE',
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'adresse' => 'required|string',
            'ville' => 'required|string',
            'nationalite' => 'required|string',
            'cin' => 'nullable|string',
            'sejour' => 'nullable|string',
            'telephone_mobile' => 'required|string',
            'telephone_fixe' => 'nullable|string',
            'email' => 'required|string|unique:employes,email|unique:users,email',
            'date_de_naissance' => 'required|date',
            'lieu_de_naissance' => 'required|string',
            'situation_familiale' => 'required|in:MARIE,CELIBATAIRE',
            'nb_enfants' => 'required|numeric',
            'nb_deductions' => 'required|numeric',
            'date_embauche' => 'required|date',
            'date_entree' => 'required|date',
            'taux_anciennete' => 'required|numeric',
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

        $employe = Employe::create($employeData);

        Permission::insert([
            [
                'user_id' => $user->id,
                'entity' => 'departement',
            ],
            [
                'user_id' => $user->id,
                'entity' => 'service',
            ],
            [
                'user_id' => $user->id,
                'entity' => 'fonction',
            ],
            [
                'user_id' => $user->id,
                'entity' => 'employe',
            ],
            [
                'user_id' => $user->id,
                'entity' => 'prime',
            ],
        ]);

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
                'civilite' => 'required|in:M,MME,MLLE',
                'nom' => 'required|string',
                'prenom' => 'required|string',
                'adresse' => 'required|string',
                'ville' => 'required|string',
                'nationalite' => 'required|string',
                'cin' => 'nullable|string',
                'sejour' => 'nullable|string',
                'telephone_mobile' => 'required|string',
                'telephone_fixe' => 'nullable|string',
                'email' => 'required|string',
                'date_de_naissance' => 'required|date',
                'lieu_de_naissance' => 'required|string',
                'situation_familiale' => 'required|in:MARIE,CELIBATAIRE',
                'nb_enfants' => 'required|numeric',
                'nb_deductions' => 'required|numeric',
            ]);
        } else{
            $validator = Validator::make($request->all(), [
                'fonction_id' => 'required|exists:fonctions,id',
                'matricule' => 'required|string|unique:employes,matricule,' . $id,
                'civilite' => 'required|in:M,MME,MLLE',
                'nom' => 'required|string',
                'prenom' => 'required|string',
                'adresse' => 'required|string',
                'ville' => 'required|string',
                'nationalite' => 'required|string',
                'cin' => 'nullable|string',
                'sejour' => 'nullable|string',
                'telephone_mobile' => 'required|string',
                'telephone_fixe' => 'nullable|string',
                'email' => 'required|string',
                'date_de_naissance' => 'required|date',
                'lieu_de_naissance' => 'required|string',
                'situation_familiale' => 'required|in:MARIE,CELIBATAIRE',
                'nb_enfants' => 'required|numeric',
                'nb_deductions' => 'required|numeric',
                'date_embauche' => 'required|date',
                'date_entree' => 'required|date',
                'taux_anciennete' => 'required|numeric',
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
        $employe = Employe::findOrFail($id);
        User::destroy($employe->user_id);
        $employe->delete();
        return response()->json(['message' => 'Employe deleted successfully']);
    }

    public function import(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:xlsx,csv',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        Excel::import(new EmployesImport, $request->file('file'));

        return response()->json(['message' => 'Employees imported successfully.']);
    }
}

<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class DocumentController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
//        dd($request->all());
        $validator = Validator::make($request->all(), [
            'employe_id' => 'required|exists:employes,id|unique:documents,employe_id',
            'chemin_cin' => 'nullable|file',
            'chemin_cnss' => 'nullable|file',
            'chemin_contrat_travail' => 'nullable|file',
            'chemin_tableau_amortissement' => 'nullable|file',
            'lettre_demission' => 'nullable|file',
            'diplome_un' => 'nullable|file',
            'diplome_deux' => 'nullable|file',
            'diplome_trois' => 'nullable|file',
            'diplome_quatre' => 'nullable|file',
            'diplome_cinq' => 'nullable|file',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $data = ['employe_id' => $request->employe_id];

        foreach ([
                     'chemin_cin', 'chemin_cnss', 'chemin_contrat_travail', 'chemin_tableau_amortissement',
                     'lettre_demission', 'diplome_un', 'diplome_deux', 'diplome_trois', 'diplome_quatre', 'diplome_cinq'
                 ] as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $hashedName = $file->hashName();
                $file->storeAs('documents', $hashedName, 'public');
                $data[$field] = 'documents/' . $hashedName;
            }
        }
        $document = Document::create($data);

        return response()->json($document, 201);
    }

    public function show(Request $request)
    {
        $document = Document::where("employe_id", $request->employe_id)->firstOrFail();
        return response()->json($document);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $document = Document::where('employe_id', $request->employe_id)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'chemin_cin' => 'nullable|file',
            'chemin_cnss' => 'nullable|file',
            'chemin_contrat_travail' => 'nullable|file',
            'chemin_tableau_amortissement' => 'nullable|file',
            'lettre_demission' => 'nullable|file',
            'diplome_un' => 'nullable|file',
            'diplome_deux' => 'nullable|file',
            'diplome_trois' => 'nullable|file',
            'diplome_quatre' => 'nullable|file',
            'diplome_cinq' => 'nullable|file',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $data = [];

        $fields = [
            'chemin_cin', 'chemin_cnss', 'chemin_contrat_travail', 'chemin_tableau_amortissement',
            'lettre_demission', 'diplome_un', 'diplome_deux', 'diplome_trois', 'diplome_quatre', 'diplome_cinq'
        ];

        foreach ($fields as $field) {
            if ($request->hasFile($field)) {
                // delete old file
                if ($document->$field && \Storage::disk('public')->exists($document->$field)) {
                    \Storage::disk('public')->delete($document->$field);
                }

                $file = $request->file($field);
                $hashedName = $file->hashName();
                $file->storeAs('documents', $hashedName, 'public');
                $data[$field] = $hashedName;
            } elseif ($request->has($field) && $request->input($field) === null) {
                // If explicitly null, delete the old file and set DB to null
                if ($document->$field && \Storage::disk('public')->exists($document->$field)) {
                    \Storage::disk('public')->delete($document->$field);
                }
                $data[$field] = null;
            }
        }

        $document->update($data);

        return response()->json($document);
    }

}

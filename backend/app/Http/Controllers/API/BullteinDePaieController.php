<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AmoCotisation;
use App\Models\CnssCotisation;
use App\Models\Contrat;
use App\Models\Employe;
use App\Models\EmployePrime;
use App\Models\FraisProfessionnel;
use App\Models\HeureSupplementaire;
use App\Models\IrTranche;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BullteinDePaieController extends Controller
{
    public function calculerSalaireNet(Request $request)
    {
        $request->validate([
            'mois' => ['required', 'regex:/^\d{4}\-\d{2}$/'], // yyyy-mm
            'employe_id' => ['required', 'exists:employes,id'],
        ]);

        $data = $this->salaireNetPermanant($request->mois, $request->employe_id);

        // Generate and attach PDF URL
        $pdfUrl = $this->generatePdf($request->mois, $data[0]['employe'], $data[0]['bulletin'], $data[0]['cumuls']);

        return response()->json([
            'bulletin' => $data[0]['bulletin'],
            'cumuls'   => $data[0]['cumuls'],
            'employe'  => $data[0]['employe'],
            'pdf_url'  => $pdfUrl,
        ]);
    }

    private function generatePdf(string $mois, $employe, array $bulletin, array $cumuls): string
    {
        $pdf = Pdf::loadView('bulletin', [
            'mois'     => $mois,
            'employe'  => $employe,
            'bulletin' => $bulletin,
            'cumuls'   => $cumuls,
        ])->setPaper('A4');

        $safeRef = $employe->matricule ?? ('emp_'.$employe->id);
        $filename = "bulletins/bulletin_{$safeRef}_{$mois}.pdf";

        Storage::disk('public')->put($filename, $pdf->output());

        // Public URL (requires `php artisan storage:link`)
        return Storage::url($filename);
    }
    private function salaireNetPermanant($mois, $employe_id)
    {
        $employe = Employe::findOrFail($employe_id);
        $response = [];
        $bulletin = [];
        [$year, $month] = explode('-', $mois);
        $start = Carbon::create((int)$year, (int)$month, 1)->startOfMonth()->toDateString(); // 2025-08-01
        $end   = Carbon::create((int)$year, (int)$month, 1)->endOfMonth()->toDateString();   // 2025-08-31

        // Salaire de base
        $salaire_base = Contrat::where('employe_id', $employe_id)->value('salaire_base');
        $bulletin[] = [
            "libele" => "Salaire de base",
            "base" => $salaire_base,
            "taux" => 26,
            "gain" => $salaire_base,
            "retenue" => 0.00,
        ];

        // Heures supplementaires
        $heures_supplementaire = HeureSupplementaire::whereBetween('date', [$start, $end])->where('employe_id', $employe_id)->get();
        $hs = 0;
        $gain_hs = 0;
        if ($heures_supplementaire->isNotEmpty()) {
            foreach ($heures_supplementaire as $heure) {
                $startDT = Carbon::parse($heure->heure_debut);
                $endDT   = Carbon::parse($heure->heure_fin);

                if ($endDT->lessThanOrEqualTo($startDT)) {
                    $endDT->addDay();
                }
                $hs += $startDT->floatDiffInHours($endDT);
            }
            $gain_hs = (double) number_format(($salaire_base / 26 / 8) * $hs, 2, '.', '');
            $bulletin[] = [
                "libele" => "Heures Supplémentaire",
                "base" => $salaire_base,
                "taux" => $hs,
                "gain" => $gain_hs,
                "retenue" => 0.00,
            ];
        }

        // Les primes
        $primes = EmployePrime::whereBetween('date_attribution', [$start, $end])->where('employe_id', $employe_id)->get();
        $primes_imposables = [];
        $primes_non_imposables = [];
        if ($primes->isNotEmpty()) {
            foreach ($primes as $prime) {
                $bulletin[] = [
                    "libele" => $prime->prime->motif,
                    "base" => 0.00,
                    "taux" => 0.00,
                    "gain" => $prime->montant,
                    "retenue" => 0.00,
                ];
                if ($prime->prime->impot === "NON IMPOSABLE")
                    $primes_non_imposables[] = $prime->montant;
                else
                    $primes_imposables[] = $prime->montant;
            }
        }

        // La somme du salaire base
        if (!empty($primes_imposables)){
            foreach ($primes_imposables as $prime){
                $salaire_base += $prime;
            }
        }
        $salaire_base = (double) number_format($salaire_base + $gain_hs, 2, '.', '');

//        dd($salaire_base);

        //Frais Professionnel
        $frais = FraisProfessionnel::where('type', 'MENSUEL')
            ->where('min_sbi', '<=', $salaire_base)
            ->where(function ($q) use ($salaire_base) {
                $q->where('max_sbi', '>=', $salaire_base)
                    ->orWhereNull('max_sbi');
            })
            ->first();

//        dd($frais->plafond);
        $retenu_frais = (double) number_format($salaire_base * $frais->taux / 100, 2, '.', '');
        if (!is_null($frais->plafond) && $retenu_frais > $frais->plafond) {
            $retenu_frais = (double) $frais->plafond;
        }
        $bulletin[] = [
            "libele" => "Fais Professionnel",
            "base" => $salaire_base,
            "taux" => $frais->taux,
            "gain" => 0.00,
            "retenue" => $retenu_frais,
        ];


        //Amo
        $amo = AmoCotisation::where('cotisation', 'AMO')->value('part_salariale');
        $retenu_amo = (double) number_format($salaire_base * $amo / 100, 2, '.', '');
        $bulletin[] = [
            "libele" => "Cotisation AMO",
            "base" => $salaire_base,
            "taux" => $amo,
            "gain" => 0.00,
            "retenue" => $retenu_amo,
        ];

        //CNSS
        $cnss = CnssCotisation::where('cotisation', 'Prestation Sociale')->value('part_salariale');
        $plafond_cnss = CnssCotisation::where('cotisation', 'Prestation Sociale')->value('plafond');
        $retenu_cnss = 0;
        if ($salaire_base > $plafond_cnss) {
            $retenu_cnss = (double)number_format($plafond_cnss * $cnss / 100, 2, '.', '');
            $bulletin[] = [
                "libele" => "Cotisation CNSS",
                "base" => $plafond_cnss,
                "taux" => $cnss,
                "gain" => 0.00,
                "retenue" => $retenu_cnss,
            ];
        }
        else {
            $retenu_cnss = (double)number_format($salaire_base * $cnss / 100, 2, '.', '');
            $bulletin[] = [
                "libele" => "Cotisation CNSS",
                "base" => $salaire_base,
                "taux" => $cnss,
                "gain" => 0.00,
                "retenue" => $retenu_cnss,
            ];
        }
//        dd($retenu_cnss);


        //IR
        $retenu = (double) number_format($salaire_base - $retenu_frais - $retenu_amo - $retenu_cnss, 2, '.', '');
        $ir = $row = IrTranche::where('period', 'MENSUEL')
            ->where('rni_min', '<=', $retenu)
            ->where(function ($q) use ($retenu) {
                $q->where('rni_max', '>=', $retenu)
                    ->orWhereNull('rni_max');
            })
            ->first();
        $retenu_ir = (double) number_format($retenu * $ir->taux / 100  - $ir->deduction, 2, '.', '');

        $bulletin[] = [
            "libele" => "Retenue IR",
            "base" => $retenu,
            "taux" => $ir->taux,
            "gain" => 0.00,
            "retenue" => $retenu_ir,
        ];

        $salaire_net = $salaire_base - $retenu_cnss - $retenu_amo - $retenu_ir;
        if (!empty($primes_non_imposables)) {
            foreach ($primes_non_imposables as $prime) {
                $salaire_net += $prime;
            }
        }

        $arrondi = (double) number_format(ceil($salaire_net) - $salaire_net, 2, '.', '');
        $salaire_net = ceil($salaire_net);
        $bulletin[] = [
            "libele" => "Arrondi",
            "base" => 0.00,
            "taux" => 0.00,
            "gain" => $arrondi,
            "retenue" => 0.00,
        ];
        $cumuls = [
            "Jrs trav" => 26,
            "Hrs trav" => 26 * 8,
            "Hrs sup" => $hs,
            "Brut" => $salaire_base,
            "CNSS" => $retenu_cnss,
            "AMO" => $retenu_amo,
            "IGR" => $retenu_ir,
            "Net a payer" => $salaire_net,
        ];
        $response[] = [
            "bulletin" => $bulletin,
            "cumuls" => $cumuls,
            "employe" => $employe,
        ];
        return $response;


    }
}

<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AmoCotisation;
use App\Models\Bulletin;
use App\Models\BulletinDetails;
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
use function Symfony\Component\String\s;

class BulletinDePaieController extends Controller
{
    public function calculerSalaireNet(Request $request)
    {
        $request->validate([
            'mois' => ['required', 'regex:/^\d{4}\-\d{2}$/'], // yyyy-mm
            'employe_id' => ['required', 'exists:employes,id'],
        ]);
        [$year, $month] = explode('-', $request->mois);
        $start = Carbon::create((int)$year, (int)$month, 1)->startOfYear()->toDateString(); // 2025-08-01
        $end   = Carbon::create((int)$year, (int)$month, 1)->endOfMonth()->toDateString();   // 2025-08-31

        $data = $this->salaireNetPermanant2($request->mois, $request->employe_id);

        $old_bulletin = Bulletin::where('periode', $request->mois.'-01')->where('employe_id', $request->employe_id)->first();
        if ($old_bulletin)
            $old_bulletin->delete();

        $cumuls = $data[0]['cumuls'];
        $cumuls["employe_id"] = $request->employe_id;
        $cumuls["periode"] = $request->mois.'-01';
        $bulletin = Bulletin::create($cumuls);
        $bulletins = $data[0]['bulletin'];
        foreach($bulletins as $b) {
            $b['bulletin_id'] = $bulletin->id;
            BulletinDetails::create($b);
        }
//            dd($data[0]['cumuls']);
        $jrs_trav = 0;
        $hrs_trav = 0;
        $hrs_sup = 0;
        $brut = 0;
        $cnss = 0;
        $amo = 0;
        $igr = 0;
        $net_a_payer = 0;
        $all_bulletins = Bulletin::whereBetween('periode', [$start, $end])->where('employe_id', $request->employe_id)->get();
        foreach ($all_bulletins as $b) {
            $jrs_trav += $b->jrs_trav;
            $hrs_trav += $b->hrs_trav;
            $hrs_sup += $b->hrs_sup;
            $brut += $b->brut;
            $cnss += $b->cnss;
            $amo += $b->amo;
            $igr += $b->igr;
            $net_a_payer += $b->net_a_payer;
        }
        $cumuls_annee = [
            'jrs_trav' => $jrs_trav,
            'hrs_trav' => $hrs_trav,
            'hrs_sup' => $hrs_sup,
            'brut' => $brut,
            'cnss' => $cnss,
            'amo' => $amo,
            'igr' => $igr,
            'net_a_payer' => $net_a_payer,
        ];
        $pdfUrl = $this->generatePdf($request->mois, $data[0]['employe'], $data[0]['bulletin'], $data[0]['cumuls'], $cumuls_annee);

        return response()->json([
            'bulletin' => $data[0]['bulletin'],
            'cumuls'   => $data[0]['cumuls'],
            'cumuls_annee' => $cumuls_annee,
            'employe'  => $data[0]['employe'],
            'pdf_url'  => $pdfUrl,
        ]);
    }

    private function generatePdf(string $mois, $employe, array $bulletin, array $cumuls, array $cumuls_annee): string
    {
        $pdf = Pdf::loadView('bulletin', [
            'mois'     => $mois,
            'employe'  => $employe,
            'bulletin' => $bulletin,
            'cumuls'   => $cumuls,
            'cumuls_annee'   => $cumuls_annee,
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
        $salaire_brut = $salaire_base;
        $bulletin[] = [
            "libele" => "Salaire de base",
            "base" => $salaire_brut,
            "taux" => 26,
            "gain" => $salaire_brut,
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
            $gain_hs = (double) number_format(($salaire_brut / 26 / 8) * $hs, 2, '.', '');
            $bulletin[] = [
                "libele" => "Heures Supplémentaire",
                "base" => $salaire_brut,
                "taux" => $hs,
                "gain" => $gain_hs,
                "retenue" => 0.00,
            ];
        }

        // Les primes
        $primes = EmployePrime::where('employe_id', $employe_id)->get();
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
                $salaire_brut += $prime;
            }
        }
        $salaire_brut = (double) number_format($salaire_brut + $gain_hs, 2, '.', '');

//        dd($salaire_brut);

        //Frais Professionnel
        $frais_professionnel = config('bareme.frais_professionnel.2025.mensuel');
//        $frais = FraisProfessionnel::where('type', 'MENSUEL')
//            ->where('min_sbi', '<=', $salaire_brut)
//            ->where(function ($q) use ($salaire_brut) {
//                $q->where('max_sbi', '>=', $salaire_brut)
//                    ->orWhereNull('max_sbi');
//            })
//            ->first();
        $taux_frais_professionnel = 0;
        $plafond_frais_professionnel = 0;
        foreach ($frais_professionnel as $frais) {
            if (
                $salaire_brut >= $frais['min_sbi'] &&
                (is_null($frais['max_sbi']) || $salaire_brut <= $frais['max_sbi'])
            ) {
                $taux_frais_professionnel = $frais['taux'];
                $plafond_frais_professionnel = $frais['plafond'];
                break;
            }
        }

//        dd($frais->plafond);
        $retenu_frais = (double) number_format($salaire_brut * $taux_frais_professionnel / 100, 2, '.', '');
        if (!is_null($plafond_frais_professionnel) && $retenu_frais > $plafond_frais_professionnel) {
            $retenu_frais = (double) $plafond_frais_professionnel;
        }
        $bulletin[] = [
            "libele" => "Fais Professionnel",
            "base" => $salaire_brut,
            "taux" => $taux_frais_professionnel,
            "gain" => 0.00,
            "retenue" => $retenu_frais,
        ];


        //Amo
//        $amo = AmoCotisation::where('cotisation', 'AMO')->value('part_salariale');
        $amo = config('bareme.cotisation_amo.2025.amo.part_salariale');
        $retenu_amo = (double) number_format($salaire_brut * $amo / 100, 2, '.', '');
        $bulletin[] = [
            "libele" => "Cotisation AMO",
            "base" => $salaire_brut,
            "taux" => $amo,
            "gain" => 0.00,
            "retenue" => $retenu_amo,
        ];

        //CNSS
//        $cnss = CnssCotisation::where('cotisation', 'Prestation Sociale')->value('part_salariale');
        $cnss = config('bareme.cotisation_cnss.2025.prestation_sociale.part_salariale');
//        $plafond_cnss = CnssCotisation::where('cotisation', 'Prestation Sociale')->value('plafond');
        $plafond_cnss = config('bareme.cotisation_cnss.2025.prestation_sociale.plafond');
        $retenu_cnss = 0;
        if ($salaire_brut > $plafond_cnss) {
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
            $retenu_cnss = (double)number_format($salaire_brut * $cnss / 100, 2, '.', '');
            $bulletin[] = [
                "libele" => "Cotisation CNSS",
                "base" => $salaire_brut,
                "taux" => $cnss,
                "gain" => 0.00,
                "retenue" => $retenu_cnss,
            ];
        }
//        dd($retenu_cnss);


        //IR
        $retenu = (double) number_format($salaire_brut - $retenu_frais - $retenu_amo - $retenu_cnss, 2, '.', '');
//        $ir = IrTranche::where('period', 'MENSUEL')
//            ->where('rni_min', '<=', $retenu)
//            ->where(function ($q) use ($retenu) {
//                $q->where('rni_max', '>=', $retenu)
//                    ->orWhereNull('rni_max');
//            })
//            ->first();
        $ir_tranches = config('bareme.tranches_ir.2025.mensuel');
        $taux_ir = 0;
        $deduction_ir = 0;
        foreach ($ir_tranches as $ir) {
            if (
                $retenu >= $ir['min'] &&
                (is_null($ir['max']) || $retenu <= $ir['max'])
            ) {
                $taux_ir = $ir['taux'];
                $deduction_ir = $ir['deduction'];
                break;
            }
        }
//        dd($retenu, $taux_ir, $deduction_ir);
        $retenu_ir = (double) number_format($retenu * $taux_ir / 100  - $deduction_ir, 2, '.', '');

        $bulletin[] = [
            "libele" => "Retenue IR",
            "base" => $retenu,
            "taux" => $taux_ir,
            "gain" => 0.00,
            "retenue" => $retenu_ir,
        ];

        $salaire_net = $salaire_brut - $retenu_cnss - $retenu_amo - $retenu_ir;
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
            "Brut" => $salaire_brut,
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
    private function salaireNetPermanant2($mois, $employe_id)
    {
        $employe = Employe::findOrFail($employe_id);
        $response = [];
        $bulletin = [];
        [$year, $month] = explode('-', $mois);
        $start = Carbon::create((int)$year, (int)$month, 1)->startOfMonth()->toDateString(); // 2025-08-01
        $end   = Carbon::create((int)$year, (int)$month, 1)->endOfMonth()->toDateString();   // 2025-08-31
        $salaire_base = Contrat::where('employe_id', $employe_id)->value('salaire_base');

//        (double) number_format(, 2, '.', '');
        $brut_total = 0;
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
            $salaire_base = (double) number_format($salaire_base + $gain_hs, 2, '.', '');
            $bulletin[] = [
                "libele" => "Heures Supplémentaire",
                "base" => $brut_total,
                "taux" => $hs,
                "gain" => $gain_hs,
                "retenue" => 0.00,
            ];
        }
        $brut_total +=  (double) number_format($brut_total + $salaire_base, 2, '.', '');
        // Les primes
        $primes = EmployePrime::where('employe_id', $employe_id)->get();
//        dd($primes[0]->prime);
        $total_primes_non_imposables = 0;
        $total_primes_soumis_cnss_amo = 0;
        $total_primes_soumis_cnss_amo +=  (double) number_format($total_primes_soumis_cnss_amo + $salaire_base, 2, '.', '');
        $total_primes_soumis_ir = 0;
        $total_primes_soumis_ir +=  (double) number_format($total_primes_soumis_ir + $salaire_base, 2, '.', '');

        if ($primes->isNotEmpty()) {
            foreach ($primes as $prime) {
                $bulletin[] = [
                    "libele" => $prime->prime->motif,
                    "base" => 0.00,
                    "taux" => 0.00,
                    "gain" => $prime->montant,
                    "retenue" => 0.00,
                ];
                $brut_total += $prime->montant;
                if ($prime->prime->impot === "NON IMPOSABLE"){
                    $total_primes_non_imposables = (double) number_format($total_primes_non_imposables + $prime->montant, 2, '.', '');
                }
                else {
                    if ($prime->prime->soumis_cotisation_cnss_amo_cimr){
                        if ($prime->prime->plafond_cnss > 0.0){
                            $montant_cnss_imposable = (double) number_format(abs($prime->montant - $prime->prime->plafond_cnss), 2, '.', '');
                            $montant_non_imposable = (double) number_format(abs($prime->montant - $montant_cnss_imposable), 2, '.', '');
                            $total_primes_soumis_cnss_amo = (double) number_format($total_primes_soumis_cnss_amo + $montant_cnss_imposable, 2, '.', '');
                            $total_primes_non_imposables = (double) number_format($total_primes_non_imposables + $montant_non_imposable, 2, '.', '');
                        } else {
                            $total_primes_soumis_cnss_amo = (double) number_format($total_primes_soumis_cnss_amo + $prime->montant, 2, '.', '');
                        }

                    }
                    if ($prime->prime->soumis_ir){
                        if ($prime->prime->plafond_ir > 0.0){
                            $montant_ir_imposable = (double) number_format(abs($prime->montant - $prime->prime->plafond_ir), 2, '.', '');
                            $montant_non_imposable = (double) number_format(abs($prime->montant - $montant_ir_imposable), 2, '.', '');
                            $total_primes_soumis_ir = (double) number_format($total_primes_soumis_ir + $montant_ir_imposable, 2, '.', '');
                            $total_primes_non_imposables = (double) number_format($total_primes_non_imposables + $montant_non_imposable, 2, '.', '');
                        } else {
                            $total_primes_soumis_ir = (double) number_format($total_primes_soumis_ir + $prime->montant, 2, '.', '');
                        }
                    }
                }
            }
        }

        //CNSS
        $cnss = config('bareme.cotisation_cnss.2025.prestation_sociale.part_salariale');
        $plafond_cnss = config('bareme.cotisation_cnss.2025.prestation_sociale.plafond');
        $retenu_cnss = 0;
        if ($total_primes_soumis_cnss_amo > $plafond_cnss) {
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
            $retenu_cnss = (double)number_format($total_primes_soumis_cnss_amo * $cnss / 100, 2, '.', '');
            $bulletin[] = [
                "libele" => "Cotisation CNSS",
                "base" => $total_primes_soumis_cnss_amo,
                "taux" => $cnss,
                "gain" => 0.00,
                "retenue" => $retenu_cnss,
            ];
        }

        //Amo
        $amo = config('bareme.cotisation_amo.2025.amo.part_salariale');
        $retenu_amo = (double) number_format($total_primes_soumis_cnss_amo * $amo / 100, 2, '.', '');
        $bulletin[] = [
            "libele" => "Cotisation AMO",
            "base" => $total_primes_soumis_cnss_amo,
            "taux" => $amo,
            "gain" => 0.00,
            "retenue" => $retenu_amo,
        ];
        $total_cotisation = (double) number_format($retenu_cnss + $retenu_amo, 2, '.', '');

        //Frais Professionnel
        $frais_professionnel = config('bareme.frais_professionnel.2025.mensuel');
        $taux_frais_professionnel = 0;
        $plafond_frais_professionnel = 0;
        foreach ($frais_professionnel as $frais) {
            if (
                $total_primes_soumis_ir >= $frais['min_sbi'] &&
                (is_null($frais['max_sbi']) || $total_primes_soumis_ir <= $frais['max_sbi'])
            ) {
                $taux_frais_professionnel = $frais['taux'];
                $plafond_frais_professionnel = $frais['plafond'];
                break;
            }
        }

        $retenu_frais = (double) number_format($total_primes_soumis_ir * $taux_frais_professionnel / 100, 2, '.', '');
        if (!is_null($plafond_frais_professionnel)) {
            $retenu_frais = min($plafond_frais_professionnel, $retenu_frais);
        }
        $bulletin[] = [
            "libele" => "Fais Professionnel",
            "base" => $total_primes_soumis_ir,
            "taux" => $taux_frais_professionnel,
            "gain" => 0.00,
            "retenue" => $retenu_frais,
        ];

        //IR
        //Revenu Net Imposable (rni)
        $rni = (double) number_format($total_primes_soumis_ir - $retenu_frais - $total_cotisation, 2, '.', '');
        $ir_tranches = config('bareme.tranches_ir.2025.mensuel');
        $taux_ir = 0;
        $deduction_ir = 0;
        foreach ($ir_tranches as $ir) {
            if (
                $rni >= $ir['min'] &&
                (is_null($ir['max']) || $rni <= $ir['max'])
            ) {
                $taux_ir = $ir['taux'];
                $deduction_ir = $ir['deduction'];
                break;
            }
        }
//        dd($retenu, $taux_ir, $deduction_ir);
        $retenu_ir = (double) number_format($rni * $taux_ir / 100  - $deduction_ir, 2, '.', '');

        $bulletin[] = [
            "libele" => "Retenue IR",
            "base" => $rni,
            "taux" => $taux_ir,
            "gain" => 0.00,
            "retenue" => $retenu_ir,
        ];

        // Net a payer
        $salaire_net = (double) number_format($brut_total - $total_cotisation - $retenu_ir, 2, '.', '');
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
            "jrs_trav" => 26,
            "hrs_trav" => 26 * 8,
            "hrs_sup" => $hs,
            "brut" => $brut_total,
            "cnss" => $retenu_cnss,
            "amo" => $retenu_amo,
            "igr" => $retenu_ir,
            "net_a_payer" => $salaire_net,
        ];
        $response[] = [
            "bulletin" => $bulletin,
            "cumuls" => $cumuls,
            "employe" => $employe,
        ];
        return $response;
    }
}

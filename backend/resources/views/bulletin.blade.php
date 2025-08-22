<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bulletin de Paie - {{ $mois }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color:#222; }
        h1 { font-size: 18px; margin: 0 0 10px; background-color: #26612c; padding: 10px; text-align: center; color: #fff}
        .header { display:flex; justify-content: space-between; align-items:flex-start; margin-bottom: 10px; }
        .box { border:1px solid #ddd; border-radius:6px; padding:10px; margin-bottom:12px; }
        table { width:100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 6px 8px;}
        th { background:#26612c; color: #fff;  text-align:center; }
        .muted { color:#666; font-size:11px; }
    </style>
</head>
<body>
<div class="header">
        <h1>Bulletin de Paie</h1>
</div>
<table style="width:100%; border-collapse:collapse; margin-bottom: 10px">
    <tr>
        <td style="width:40%; border:1px solid #ddd; border-radius:6px;  padding:8px; vertical-align:top; margin-bottom: 10px">
            <b>FINANCE CONSULTING GP DE MKCB</b><br>
            RES LA KARELLE K 29<br>
            3 LTG APPRT N 4 AV AL IRAK<br>
            N° CNSS: 7727890 &nbsp;&nbsp; N° Mat: ...
        </td>

        <!-- Right big box (spans 2 rows) -->
        <td style="width:60%; border:1px solid #ddd; border-radius:6px; padding:8px; vertical-align:top; margin-left: 10px" rowspan="2">
            <div><b>Période du :</b> {{ \Carbon\Carbon::parse($mois . '-01')->locale('fr')->translatedFormat('F Y') }}</div>
            <div>Paiement le : / Par Espèce</div>
            <div><b>Matricule:</b> {{ $employe->matricule ?? '-' }}</div>
            <div><b>Service:</b>  {{ $employe->fonction->service->designation ?? '-' }}</div>
            <div><b>Fonction:</b>  {{ $employe->fonction->designation ?? '-' }}</div>
            <div>
                <span><b>Date de naissance:</b>  {{ \Carbon\Carbon::parse($employe->date_de_naissance)->translatedFormat('d/m/y') ?? '-' }}</span>
                &nbsp;&nbsp;&nbsp;
                <span><b>Situation familale:</b>  {{ $employe->situation_familiale ?? '-' }}</span>
            </div>
            <div>
                <span><b>Date d'embauche:</b>  {{ \Carbon\Carbon::parse($employe->date_embauche)->translatedFormat('d/m/y')?? '-' }}</span>
                &nbsp;&nbsp;&nbsp;
                <span><b>Nombre d'enfants:</b>  {{ $employe->nb_enfants ?? '-' }}</span>
                &nbsp;&nbsp;&nbsp;
                <span><b>Nombre de deductions:</b>  {{ $employe->nb_deductions ?? '-' }}</span>
            </div>
            <div>
                <span><b>Matricule Cnss:</b>  {{ $employe->caisse->numero_cnss ?? '-' }}</span>
                &nbsp;&nbsp;&nbsp;
                <span><b>Matricule Mutuelle:</b>  {{ $employe->caisse->numero_mutuelle ?? '-' }}</span>
            </div>
        </td>
    </tr>

    <!-- Left bottom box -->
    <tr>
        <td style="border:1px solid #ddd; border-radius:6px; padding:8px; vertical-align:top; text-align:center;">
            <b> {{ $employe->prenom ?? '' }} {{ $employe->nom ?? '' }}</b>
        </td>
    </tr>
</table>
<table>
    <thead>
    <tr>
        <th>Libellé</th>
        <th class="right">Base</th>
        <th class="right">Taux/Qté</th>
        <th class="right">Gain</th>
        <th class="right">Retenue</th>
    </tr>
    </thead>
    <tbody>
    @foreach($bulletin as $row)
        <tr>
            <td>{{ $row['libele'] }}</td>
            <td class="right">{{ number_format($row['base'], 2, '.', ' ') }}</td>
            <td class="right">{{ is_numeric($row['taux']) ? number_format($row['taux'], 2, '.', ' ') : $row['taux'] }}</td>
            <td class="right">{{ number_format($row['gain'], 2, '.', ' ') }}</td>
            <td class="right">{{ number_format($row['retenue'], 2, '.', ' ') }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
<table>
    <tr>
    @foreach($cumuls as $k => $v)
        <th>{{ $k }}</th>
    @endforeach
    </tr>
    <tr>
    @foreach($cumuls as $k => $v)
        <td class="right">{{ number_format($v, 2, '.', ' ') }}</td>
    @endforeach
    </tr>
    <tr>
        @foreach($cumuls_annee as $k => $v)
            <td class="right">{{ number_format($v, 2, '.', ' ') }}</td>
        @endforeach
    </tr>
    <tr>
        <td colspan="2">Signature</td>
        <td colspan="6"></td>
    </tr>
</table>
</body>
</html>

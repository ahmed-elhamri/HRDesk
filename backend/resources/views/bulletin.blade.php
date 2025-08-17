<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bulletin de Paie - {{ $mois }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color:#222; }
        .container {
            display: flex;
            justify-content: space-between;
            gap: 10px;
        }
        h1 { font-size: 18px; margin: 0 0 10px; }
        .header { display:flex; justify-content: space-between; align-items:flex-start; margin-bottom: 10px; }
        .box { border:1px solid #ddd; border-radius:6px; padding:10px; margin-bottom:12px; }
        table { width:100%; border-collapse: collapse; margin-top:6px; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; }
        th { background:#f5f5f5; text-align:left; }
        .right { text-align:right; }
        .muted { color:#666; font-size:11px; }
    </style>
</head>
<body>
<div class="header">
    <div>
        <h1>Bulletin de Paie</h1>
        <div class="muted">Période: {{ $mois }}</div>
    </div>
    <div class="muted">
        Généré le: {{ now()->format('Y-m-d H:i') }}
    </div>
</div>

<div class="box">
    <div class="box">
        <div><b>Matricule:</b> {{ $employe->matricule ?? '-' }}</div>
        <div><b>Nom:</b> {{ $employe->prenom ?? '' }} {{ $employe->nom ?? '' }}</div>
        <div>
            <span><b>Service:</b>  {{ $employe->fonction->service->designation ?? '-' }}</span>
            &nbsp;&nbsp;&nbsp;
            <span><b>Fonction:</b>  {{ $employe->fonction->designation ?? '-' }}</span>
        </div>

        <div>
            <span><b>Date de naissance:</b>  {{ $employe->date_de_naissance ?? '-' }}</span>
            &nbsp;&nbsp;&nbsp;
            <span><b>Date d'embauche:</b>  {{ $employe->date_embauche ?? '-' }}</span>
        </div>
        <div>
            <span><b>Situation familale:</b>  {{ $employe->situation_familiale ?? '-' }}</span>
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
    </div>
    <div class="box">
        <strong>Bulletin</strong>
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
    </div>
    <div class="box">
        <strong>Cumuls</strong>
        <table>
            <tbody>
            @foreach($cumuls as $k => $v)
                <tr>
                    <td>{{ $k }}</td>
                    <td class="right">{{ number_format($v, 2, '.', ' ') }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
</div>
</body>
</html>

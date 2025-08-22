<?php
return [
    '2024' => [
        'mensuel' => [
            [
                'min' => 0.00,
                'max' => 2500.00,
                'taux' => 0,
                'deduction' => 0.00
            ],
            [
                'min' => 2500.01,
                'max' => 4166.67,
                'taux' => 10,
                'deduction' => 250
            ],
            [
                'min' => 4166.68,
                'max' => 5000.00,
                'taux' => 20,
                'deduction' => 666.67
            ],
            [
                'min' => 5000.01,
                'max' => 6666.67,
                'taux' => 30,
                'deduction' => 1166.67
            ],
            [
                'min' => 6666.68,
                'max' => 15000.00,
                'taux' => 34,
                'deduction' => 1433.33
            ],
            [
                'min' => 15000.01,
                'max' => null,
                'taux' => 38,
                'deduction' => 2033.33
            ],
        ],
        'annuel' => [
            [
                'min' => 0.00,
                'max' => 30000.00,
                'taux' => 0,
                'deduction' => 0.00
            ],
            [
                'min' => 30001,
                'max' => 50000.00,
                'taux' => 10,
                'deduction' => 3000.00
            ],
            [
                'min' => 50001,
                'max' => 60000.00,
                'taux' => 20,
                'deduction' => 8000.00
            ],
            [
                'min' => 60001,
                'max' => 80000.00,
                'taux' => 30,
                'deduction' => 14000.00
            ],
            [
                'min' => 80001,
                'max' => 180000.00,
                'taux' => 34,
                'deduction' => 17200.00
            ],
            [
                'min' => 180001,
                'max' => null,
                'taux' => 38,
                'deduction' => 24400.00
            ],
        ],
    ],
    '2025' => [
        'mensuel' => [
            [
                'min' => 0.00,
                'max' => 3333.00,
                'taux' => 0,
                'deduction' => 0.00
            ],
            [
                'min' => 3333.01,
                'max' => 5000.00,
                'taux' => 10,
                'deduction' => 333.33
            ],
            [
                'min' => 5000.01,
                'max' => 6667.00,
                'taux' => 20,
                'deduction' => 833.33
            ],
            [
                'min' => 6667.01,
                'max' => 8333.00,
                'taux' => 30,
                'deduction' => 1500.00
            ],
            [
                'min' => 8333.01,
                'max' => 15000.00,
                'taux' => 34,
                'deduction' => 1833.33
            ],
            [
                'min' => 15000.01,
                'max' => null,
                'taux' => 37,
                'deduction' => 2283.33
            ],
        ],
        'annuel' => [
            [
                'min' => 0.00,
                'max' => 40000.00,
                'taux' => 0,
                'deduction' => 0.00
            ],
            [
                'min' => 40000.01,
                'max' => 60000.00,
                'taux' => 10,
                'deduction' => 4000.00
            ],
            [
                'min' => 60000.01,
                'max' => 80000.00,
                'taux' => 20,
                'deduction' => 10000.00
            ],
            [
                'min' => 80000.01,
                'max' => 100000.00,
                'taux' => 30,
                'deduction' => 18000.00
            ],
            [
                'min' => 100000.01,
                'max' => 180000.00,
                'taux' => 34,
                'deduction' => 22000.00
            ],
            [
                'min' => 180000.01,
                'max' => null,
                'taux' => 37,
                'deduction' => 27000.00
            ],
        ],
    ],
];

<?php

declare(strict_types=1);

return [
    'db' => [
        'host' => getenv('DB_HOST') ?: '127.0.0.1',
        'port' => (int)(getenv('DB_PORT') ?: 3306),
        'database' => getenv('DB_DATABASE') ?: 'anto_psi',
        'username' => getenv('DB_USERNAME') ?: 'anto_psi',
        'password' => getenv('DB_PASSWORD') ?: 'vqNSfbfvAPYKL2PmnvLT',
        'charset' => 'utf8mb4',
    ],
    'cors' => [
        'allowed_origin' => getenv('CORS_ORIGIN') ?: 'http://localhost:4200',
    ],
];

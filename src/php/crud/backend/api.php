<?php
declare(strict_types=1);

$config = require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . $config['cors']['allowed_origin']);
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$tables = [
    'contatto' => [
        'columns' => ['id','indirizzo1','indirizzo2','indirizzo3','tel','cell','email','pec'],
        'required' => ['indirizzo1','indirizzo2','indirizzo3','tel','cell'],
    ],
    'contatto_orari' => [
        'columns' => ['id','contatto_id','orario','position'],
        'required' => ['contatto_id','orario','position'],
    ],
    'settings' => [
        'columns' => ['id','autoPlayAudio','autoPlayVideo'],
        'required' => ['autoPlayAudio','autoPlayVideo'],
    ],
    'media' => [
        'columns' => ['id','src','caption','date','type'],
        'required' => ['caption','type'],
    ],
    'titolare' => [
        'columns' => ['id','contatto_id','name','sub1','sub2','image','description','email','ordine','linkOrdine'],
        'required' => ['contatto_id','name','sub1','image','description','ordine','linkOrdine'],
    ],
    'titolare_formazione' => [
        'columns' => ['id','titolare_id','formazione','position'],
        'required' => ['titolare_id','formazione','position'],
    ],
    'titolare_spec' => [
        'columns' => ['id','titolare_id','spec','position'],
        'required' => ['titolare_id','spec','position'],
    ],
    'titolare_media' => [
        'columns' => ['id','titolare_id','media_id','position'],
        'required' => ['titolare_id','media_id','position'],
    ],
    'site' => [
        'columns' => ['id','settings_id','title','subtitle','contatto_id','titolare_id'],
        'required' => ['settings_id','title','subtitle','contatto_id','titolare_id'],
    ],
    'social' => [
        'columns' => ['id','site_id','name','icon','link','position'],
        'required' => ['site_id','name','icon','link','position'],
    ],
    'aforisma' => [
        'columns' => ['id','site_id','text','author','position'],
        'required' => ['site_id','text','author','position'],
    ],
    'servizio' => [
        'columns' => ['id','site_id','icon','title','description','cost','position'],
        'required' => ['site_id','position'],
    ],
    'process_step' => [
        'columns' => ['id','site_id','title','description','position'],
        'required' => ['site_id','title','description','position'],
    ],
    'webinar' => [
        'columns' => ['id','type','state','location_indirizzo1','location_indirizzo2','location_indirizzo3','title','description','utcDate','people','extra','price','form'],
        'required' => ['type','state','title','description','utcDate','people','extra','price','form'],
    ],
    'webinar_info' => [
        'columns' => ['id','webinar_id','info','position'],
        'required' => ['webinar_id','info','position'],
    ],
    'webinar_media' => [
        'columns' => ['id','webinar_id','media_id','position'],
        'required' => ['webinar_id','media_id','position'],
    ],
    'site_webinar' => [
        'columns' => ['site_id','webinar_id'],
        'required' => ['site_id','webinar_id'],
        'pk' => ['site_id','webinar_id'],
    ],
    'site_media' => [
        'columns' => ['site_id','media_id'],
        'required' => ['site_id','media_id'],
        'pk' => ['site_id','media_id'],
    ],
];

$foreignKeys = [
    ['table'=>'contatto_orari','column'=>'contatto_id','refTable'=>'contatto','refColumn'=>'id'],
    ['table'=>'titolare','column'=>'contatto_id','refTable'=>'contatto','refColumn'=>'id'],
    ['table'=>'titolare_formazione','column'=>'titolare_id','refTable'=>'titolare','refColumn'=>'id'],
    ['table'=>'titolare_spec','column'=>'titolare_id','refTable'=>'titolare','refColumn'=>'id'],
    ['table'=>'titolare_media','column'=>'titolare_id','refTable'=>'titolare','refColumn'=>'id'],
    ['table'=>'titolare_media','column'=>'media_id','refTable'=>'media','refColumn'=>'id'],
    ['table'=>'site','column'=>'settings_id','refTable'=>'settings','refColumn'=>'id'],
    ['table'=>'site','column'=>'contatto_id','refTable'=>'contatto','refColumn'=>'id'],
    ['table'=>'site','column'=>'titolare_id','refTable'=>'titolare','refColumn'=>'id'],
    ['table'=>'social','column'=>'site_id','refTable'=>'site','refColumn'=>'id'],
    ['table'=>'aforisma','column'=>'site_id','refTable'=>'site','refColumn'=>'id'],
    ['table'=>'servizio','column'=>'site_id','refTable'=>'site','refColumn'=>'id'],
    ['table'=>'process_step','column'=>'site_id','refTable'=>'site','refColumn'=>'id'],
    ['table'=>'webinar_info','column'=>'webinar_id','refTable'=>'webinar','refColumn'=>'id'],
    ['table'=>'webinar_media','column'=>'webinar_id','refTable'=>'webinar','refColumn'=>'id'],
    ['table'=>'webinar_media','column'=>'media_id','refTable'=>'media','refColumn'=>'id'],
    ['table'=>'site_webinar','column'=>'site_id','refTable'=>'site','refColumn'=>'id'],
    ['table'=>'site_webinar','column'=>'webinar_id','refTable'=>'webinar','refColumn'=>'id'],
    ['table'=>'site_media','column'=>'site_id','refTable'=>'site','refColumn'=>'id'],
    ['table'=>'site_media','column'=>'media_id','refTable'=>'media','refColumn'=>'id'],
];

function respond(mixed $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $message, int $status = 400): never {
    respond(['error' => $message], $status);
}

try {
    $db = $config['db'];
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $db['host'], $db['port'], $db['database'], $db['charset']
    );
    $pdo = new PDO($dsn, $db['username'], $db['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (Throwable $e) {
    fail('Database connection failed: ' . $e->getMessage(), 500);
}

function tableConfig(string $table): array {
    global $tables;
    if (!isset($tables[$table])) {
        fail('Unknown table', 404);
    }
    return $tables[$table];
}

function requestJson(): array {
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        fail('Invalid JSON body');
    }
    return $data;
}

function validateFields(string $table, array $data): array {
    $cfg = tableConfig($table);
    $result = [];
    foreach ($data as $key => $value) {
        if (!in_array($key, $cfg['columns'], true)) {
            continue;
        }
        if ($key === 'id' && !isset($cfg['pk'])) {
            continue;
        }
        if ($key === 'src') {
            continue; // handled by media upload
        }
        $result[$key] = $value;
    }
    return $result;
}

function primaryKey(array $cfg): array {
    return $cfg['pk'] ?? ['id'];
}

function getIdFromRequest(array $cfg): array {
    $pk = primaryKey($cfg);
    $values = [];
    foreach ($pk as $column) {
        $value = $_GET[$column] ?? null;
        if ($value === null || $value === '') {
            fail('Missing primary key field: ' . $column);
        }
        $values[$column] = $value;
    }
    return $values;
}

function wherePrimary(array $pkValues): array {
    $parts = [];
    $params = [];
    foreach ($pkValues as $column => $value) {
        $parts[] = "`$column` = :pk_$column";
        $params[":pk_$column"] = $value;
    }
    return [implode(' AND ', $parts), $params];
}

$action = $_GET['action'] ?? 'schema';
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($action === 'schema') {
        respond([
            'tables' => $tables,
            'foreignKeys' => $foreignKeys,
        ]);
    }

    if ($action === 'media') {
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) fail('Invalid media id');
        $stmt = $pdo->prepare('SELECT src, caption, type FROM media WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) fail('Media not found', 404);
        if ($row['src'] === null) fail('Media has no binary content', 404);

        $mime = match ($row['type']) {
            'IMAGE' => 'image/jpeg',
            'VIDEO' => 'video/mp4',
            'AUDIO' => 'audio/mpeg',
            default => 'application/octet-stream',
        };
        header('Content-Type: ' . $mime);
        echo $row['src'];
        exit;
    }

    if ($action === 'media-upload') {
        if ($method !== 'POST') fail('POST required', 405);
        if (!isset($_FILES['file'])) fail('Missing file');
        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) fail('Upload failed');
        $caption = trim((string)($_POST['caption'] ?? $file['name']));
        $type = strtoupper(trim((string)($_POST['type'] ?? 'IMAGE')));
        if (!in_array($type, ['VIDEO','IMAGE','AUDIO'], true)) fail('Invalid media type');

        $content = file_get_contents($file['tmp_name']);
        if ($content === false) fail('Cannot read uploaded file');
        $stmt = $pdo->prepare('INSERT INTO media (src, caption, date, type) VALUES (?, ?, NOW(), ?)');
        $stmt->bindValue(1, $content, PDO::PARAM_LOB);
        $stmt->bindValue(2, $caption);
        $stmt->bindValue(3, $type);
        $stmt->execute();
        respond(['id' => (int)$pdo->lastInsertId()], 201);
    }

    if ($action === 'rows') {
        $table = (string)($_GET['table'] ?? '');
        $cfg = tableConfig($table);

        if ($method === 'GET') {
            $limit = min(max((int)($_GET['limit'] ?? 100), 1), 500);
            $offset = max((int)($_GET['offset'] ?? 0), 0);
            $search = trim((string)($_GET['search'] ?? ''));

            $select = implode(', ', array_map(fn($c) => "`$c`", $cfg['columns']));
            $sql = "SELECT $select FROM `$table`";
            $params = [];

            if ($search !== '') {
                $textColumns = array_values(array_filter($cfg['columns'], fn($c) => $c !== 'id' && !str_ends_with($c, '_id') && $c !== 'src'));
                if ($textColumns) {
                    $conditions = [];
                    foreach ($textColumns as $i => $column) {
                        $name = ":s$i";
                        $conditions[] = "CAST(`$column` AS CHAR) LIKE $name";
                        $params[$name] = '%' . $search . '%';
                    }
                    $sql .= ' WHERE ' . implode(' OR ', $conditions);
                }
            }

            $sql .= ' ORDER BY ' . (in_array('position', $cfg['columns'], true) ? '`position`, ' : '') . '`' . $cfg['columns'][0] . '` DESC';
            $sql .= " LIMIT $limit OFFSET $offset";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            respond($stmt->fetchAll());
        }

        if ($method === 'POST') {
            $data = validateFields($table, requestJson());
            foreach ($cfg['required'] as $field) {
                if (!array_key_exists($field, $data) || $data[$field] === '' || $data[$field] === null) {
                    fail("Missing required field: $field");
                }
            }
            if (!$data) fail('No fields supplied');

            $columns = array_keys($data);
            $sql = 'INSERT INTO `' . $table . '` (' .
                implode(', ', array_map(fn($c) => "`$c`", $columns)) .
                ') VALUES (' .
                implode(', ', array_map(fn($c) => ":$c", $columns)) .
                ')';
            $stmt = $pdo->prepare($sql);
            foreach ($data as $column => $value) {
                $stmt->bindValue(":$column", $value);
            }
            $stmt->execute();
            $id = isset($cfg['pk']) ? null : (int)$pdo->lastInsertId();
            respond(['success' => true, 'id' => $id], 201);
        }
    }

    if ($action === 'row') {
        $table = (string)($_GET['table'] ?? '');
        $cfg = tableConfig($table);
        $pkValues = getIdFromRequest($cfg);
        [$where, $whereParams] = wherePrimary($pkValues);

        if ($method === 'GET') {
            $select = implode(', ', array_map(fn($c) => "`$c`", $cfg['columns']));
            $stmt = $pdo->prepare("SELECT $select FROM `$table` WHERE $where");
            $stmt->execute($whereParams);
            $row = $stmt->fetch();
            if (!$row) fail('Row not found', 404);
            respond($row);
        }

        if ($method === 'PUT') {
            $data = validateFields($table, requestJson());
            if (!$data) fail('No fields supplied');
            $sets = [];
            foreach (array_keys($data) as $column) {
                $sets[] = "`$column` = :$column";
            }
            $sql = "UPDATE `$table` SET " . implode(', ', $sets) . " WHERE $where";
            $stmt = $pdo->prepare($sql);
            foreach ($data as $column => $value) {
                $stmt->bindValue(":$column", $value);
            }
            foreach ($whereParams as $name => $value) {
                $stmt->bindValue($name, $value);
            }
            $stmt->execute();
            respond(['success' => true]);
        }

        if ($method === 'DELETE') {
            $stmt = $pdo->prepare("DELETE FROM `$table` WHERE $where");
            $stmt->execute($whereParams);
            respond(['success' => true]);
        }
    }

    fail('Unknown action', 404);
} catch (PDOException $e) {
    $message = $e->getCode() === '23000'
        ? 'Database constraint violation: ' . $e->getMessage()
        : 'Database error: ' . $e->getMessage();
    fail($message, 400);
} catch (Throwable $e) {
    fail($e->getMessage(), 500);
}

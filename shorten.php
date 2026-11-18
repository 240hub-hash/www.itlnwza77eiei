<?php
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'ข้อมูลไม่ถูกต้อง']);
    exit;
}

$code = is_string($data['code'] ?? null) ? trim($data['code']) : '';
$link = is_string($data['link'] ?? null) ? trim($data['link']) : '';

if ($code === '') {
    http_response_code(400);
    echo json_encode(['error' => 'กรุณาใส่โค้ด Lua']);
    exit;
}
if (mb_strlen($code) > 80000) {
    http_response_code(400);
    echo json_encode(['error' => 'โค้ดยาวเกินไป (จำกัด 80,000 ตัวอักษร)']);
    exit;
}

if (!is_dir(__DIR__ . '/s')) {
    mkdir(__DIR__ . '/s', 0755, true);
}

function seg($len) {
    $s = '';
    $chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for ($i = 0; $i < $len; $i++) {
        $s .= $chars[random_int(0, 35)];
    }
    return $s;
}

// Generate an id and make sure the file doesn't already exist
do {
    $id = 'by240-' . seg(2) . '-' . seg(2) . '-' . seg(3);
} while (file_exists(__DIR__ . '/s/' . $id . '.lua'));

// Store the REAL Lua code as a file in the web folder (this is the "code in the web itself")
file_put_contents(__DIR__ . '/s/' . $id . '.lua', $code, LOCK_EX);
// Metadata for the browser-link page
file_put_contents(__DIR__ . '/s/' . $id . '.link', $link, LOCK_EX);

echo json_encode(['id' => $id]);
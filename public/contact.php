<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Yalnızca POST istekleri kabul edilir.']);
    exit;
}

// Honeypot spam koruması
if (!empty($_POST['website'])) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Mesajınız alındı.']);
    exit;
}

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$guests  = trim($_POST['guests'] ?? '');
$date    = trim($_POST['date'] ?? '');
$message = trim($_POST['message'] ?? '');

if (empty($name) || empty($email) || empty($guests)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ad, e-posta ve kişi sayısı zorunludur.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Geçerli bir e-posta adresi giriniz.']);
    exit;
}

// XSS koruması
$name    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email   = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$phone   = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$guests  = htmlspecialchars($guests, ENT_QUOTES, 'UTF-8');
$date    = htmlspecialchars($date, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

$to = 'rezervasyon@example.com'; // cPanel'de gerçek e-posta adresinizi girin
$subject = 'Yeni Rezervasyon Talebi — Karanlık Deneyim';
$body = "Yeni rezervasyon talebi:\n\n"
      . "Ad Soyad: $name\n"
      . "E-posta: $email\n"
      . "Telefon: $phone\n"
      . "Kişi Sayısı: $guests\n"
      . "Tarih: $date\n"
      . "Mesaj: $message\n"
      . "\n---\n"
      . "Gönderim: " . date('Y-m-d H:i:s') . "\n"
      . "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'bilinmiyor') . "\n";

$headers = "From: noreply@" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . "\r\n"
         . "Reply-To: $email\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n"
         . "X-Mailer: PHP/" . phpversion();

$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Rezervasyon talebiniz başarıyla gönderildi.']);
} else {
    // Mail sunucusu yapılandırılmamışsa kayıt dosyasına yaz
    $logFile = __DIR__ . '/reservations.log';
    $logEntry = date('Y-m-d H:i:s') . " | $name | $email | $guests | $date\n";
    @file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
    echo json_encode(['success' => true, 'message' => 'Talebiniz kaydedildi. En kısa sürede dönüş yapılacaktır.']);
}

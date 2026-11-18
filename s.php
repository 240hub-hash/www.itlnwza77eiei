<?php
$id = preg_replace('/[^A-Za-z0-9-]/', '', $_GET['id'] ?? '');

if ($id === '' || !preg_match('/^by240-[a-z0-9]{2}-[a-z0-9]{2}-[a-z0-9]{3}$/', $id)) {
    http_response_code(404);
    echo 'Not found';
    exit;
}

$codeFile = __DIR__ . '/s/' . $id . '.lua';
$linkFile = __DIR__ . '/s/' . $id . '.link';

if (!file_exists($codeFile)) {
    http_response_code(404);
    echo 'Not found';
    exit;
}

// Real Lua code, stored as a file. Executors fetch this directly.
$code = file_get_contents($codeFile);
$link = file_exists($linkFile) ? trim(file_get_contents($linkFile)) : '';

$ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');

// Detect an executor (Roblox / Lua) vs a normal browser
$execToken  = preg_match('/roblox|luau|executor|synapse|fluxus|hydra|krnl|arceus|nightx|hydrogen|codex|jjsploit|asura|delta|gamehttp|httpget|gamesense/', $ua);
$browserTok = preg_match('/mozilla|applewebkit|gecko\/|trident/', $ua);
$isBrowser  = $browserTok && !$execToken;

if (!$isBrowser) {
    header('Content-Type: text/plain; charset=utf-8');
    echo $code;
    exit;
}

// ---- Browser: show the by240 page with the configured link ----
$DEFAULT_LINK = 'https://cdn.discordapp.com/attachments/1534204097404866560/1545051390664249456/Messenger_creation_227D07DD-E7B3-4086-A0E6-1A82A583206F.mp4?ex=6aa002bd&is=6a9eb13d&hm=21f54421375b862742314ed4c9c04f20c76c5e240b140426fdb170a1867a3bc2&';
$target = $link !== '' ? $link : $DEFAULT_LINK;

function esc($s) {
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}
function isImageLink($l) {
    return (bool)preg_match('#\.(png|jpe?g|gif|webp|bmp|avif|svg|ico)(\?.*)?(#.*)?$#i', $l);
}
function isVideoLink($l) {
    return (bool)preg_match('#\.(mp4|webm|ogg|mov|ogv|m4v)(\?.*)?(#.*)?$#i', $l);
}

$isVideo = isVideoLink($target);
$isImage = isImageLink($target);

if ($isVideo || $isImage) {
    $el = $isVideo
        ? '<video id="vd" src="' . esc($target) . '" autoplay muted loop playsinline></video>
           <button id="muteBtn" class="mute-btn" type="button">🔇 เปิดเสียง</button>'
        : '<img src="' . esc($target) . '" alt="BY240">';
    $script = $isVideo ? '<script>
        const v = document.getElementById("vd");
        const btn = document.getElementById("muteBtn");
        btn.addEventListener("click", () => { v.muted = false; v.play().catch(()=>{}); btn.remove(); });
        v.addEventListener("play", () => btn.remove());
        v.play().catch(()=>{});
    </script>' : '';
    echo '<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"><title>BY240</title><style>
*{box-sizing:border-box;margin:0;padding:0}
body{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
gap:18px;font-family:"Segoe UI",system-ui,sans-serif;
background:radial-gradient(1000px 700px at 20% -10%,rgba(255,122,26,.18),transparent 60%),
radial-gradient(900px 600px at 110% 110%,rgba(255,122,26,.12),transparent 60%),
linear-gradient(160deg,#07070b,#0d0d15);padding:20px}
img,video{max-width:100%;max-height:60vh;width:auto;height:auto;object-fit:contain;border-radius:12px;
box-shadow:0 10px 40px rgba(255,122,26,.25);border:1px solid rgba(255,158,62,.3);background:#000}
img{width:100%;max-width:460px}
.mute-btn{border:1px solid rgba(255,158,62,.45);background:rgba(255,122,26,.14);color:#ffa23e;
font-size:14px;font-weight:600;font-family:inherit;padding:9px 18px;border-radius:999px;cursor:pointer}
.mute-btn:hover{background:rgba(255,122,26,.24)}
.mark{font-size:140px;font-weight:900;letter-spacing:4px;
background:linear-gradient(90deg,#ffa23e,#ff7a1a);-webkit-background-clip:text;background-clip:text;
color:transparent;filter:drop-shadow(0 0 24px rgba(255,122,26,.6))}
@media(max-width:480px){body{padding:16px}img{max-width:300px}.mark{font-size:90px}}
</style></head><body><div class="mark">by240</div>' . $el . $script . '</body></html>';
    exit;
}

$ytMatch = null;
preg_match('#(?:youtu\.be/|youtube\.com/(?:watch\?v=|embed/|shorts/))([\w-]{11})#', $target, $ytMatch);
if ($ytMatch) {
    $vid = $ytMatch[1];
    $embed = 'https://www.youtube.com/embed/' . $vid . '?autoplay=1&rel=0';
    echo '<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"><title>BY240</title><style>
*{box-sizing:border-box;margin:0;padding:0}
body{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
gap:24px;font-family:"Segoe UI",system-ui,sans-serif;
background:radial-gradient(1000px 700px at 20% -10%,rgba(255,122,26,.18),transparent 60%),
radial-gradient(900px 600px at 110% 110%,rgba(255,122,26,.12),transparent 60%),
linear-gradient(160deg,#07070b,#0d0d15);padding:20px}
.mark{font-size:150px;font-weight:900;letter-spacing:5px;
background:linear-gradient(90deg,#ffa23e,#ff7a1a);-webkit-background-clip:text;background-clip:text;
color:transparent;filter:drop-shadow(0 0 28px rgba(255,122,26,.6))}
.vid{width:min(560px,90vw);aspect-ratio:16/9;border-radius:14px;overflow:hidden;
border:1px solid rgba(255,158,62,.35);box-shadow:0 12px 40px rgba(255,122,26,.25);background:#000}
iframe{width:100%;height:100%;border:0}
@media(max-width:480px){.mark{font-size:90px}}
</style></head><body><div class="mark">by240</div>
<div class="vid"><iframe src="' . $embed . '" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe></div>
</body></html>';
    exit;
}

// Fallback: redirect the browser elsewhere
$targetEsc = esc($target);
echo '<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8">
<meta http-equiv="refresh" content="0;url=' . $targetEsc . '"><title>Redirecting</title></head>
<body><script>location.replace(' . json_encode($target) . ');</script></body></html>';
exit;
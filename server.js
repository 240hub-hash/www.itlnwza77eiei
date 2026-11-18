export const schema = `
  CREATE TABLE IF NOT EXISTS snippets (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    username TEXT,
    code TEXT NOT NULL,
    link TEXT NOT NULL DEFAULT ''
  );
  CREATE INDEX IF NOT EXISTS snippets_user ON snippets (user_id);
`;

const MAX_LEN = 5000000;
const DEFAULT_LINK = "https://cdn.discordapp.com/attachments/1534204097404866560/1545051390664249456/Messenger_creation_227D07DD-E7B3-4086-A0E6-1A82A583206F.mp4?ex=6aa2a5bd&is=6aa1543d&hm=e0e8af6aa01fa860dd8fe3d865fc21a094ea16b6da73e15a9498e77bb7aa5860&";
const IMG_EXT = /\.(png|jpe?g|gif|webp|bmp|avif|svg|ico)(\?.*)?(#.*)?$/i;
const VID_EXT = /\.(mp4|webm|ogg|mov|ogv|m4v)(\?.*)?(#.*)?$/i;

function isImageLink(link) {
  try { return IMG_EXT.test(new URL(link).pathname); } catch { return IMG_EXT.test(link); }
}
function isVideoLink(link) {
  try { return VID_EXT.test(new URL(link).pathname); } catch { return VID_EXT.test(link); }
}

function randomId() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars.charAt((Math.random() * chars.length) | 0);
  return `b${s}`;
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function redirectPage(link) {
  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0;url=${esc(link)}">
<title>Redirecting</title>
</head>
<body>
<script>location.replace(${JSON.stringify(link)});</script>
</body>
</html>`;
}

function mediaPage(link, isVideo) {
  const el = isVideo
    ? `<div class="vid-block">
        <video id="vd" src="${esc(link)}" playsinline loop preload="auto"></video>
        <div id="tapHint" class="tap-hint">แตะเพื่อเล่นเสียง</div>
      </div>`
    : `<img src="${esc(link)}" alt="BY240">`;
  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BY240</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    font-family: "Segoe UI", system-ui, sans-serif;
    background: #0a0a0a;
    color: #f5f5f5;
    padding: 20px;
  }
  .mark {
    font-size: 150px;
    font-weight: 900;
    font-style: italic;
    font-family: "Playfair Display", Georgia, serif;
    letter-spacing: 4px;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    background-image: linear-gradient(180deg, #ffffff, #5a5a5a);
    filter: drop-shadow(0 12px 30px rgba(0,0,0,.7));
    user-select: none;
  }
  img, video {
    max-width: 100%;
    max-height: 60vh;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 8px;
    background: #000;
    border: 1px solid #222;
    box-shadow: 0 18px 50px rgba(0,0,0,.8);
  }
  img { width: 100%; max-width: 460px; }
  .vid-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  .vid-block video { display: block; cursor: pointer; }
  .tap-hint {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: #d0d0d0;
    background: rgba(20,20,20,.7);
    border: 1px solid #333;
    padding: 10px 22px;
    border-radius: 999px;
    cursor: pointer;
    transition: background .2s, color .2s;
  }
  .tap-hint:hover { background: #2a2a2a; color: #fff; }
  @media (max-width: 480px) {
    .mark { font-size: 90px; }
    img { max-width: 300px; }
  }
</style>
</head>
<body>
  <div class="mark">by240</div>
  ${el}
  ${isVideo ? `<script>
    const v = document.getElementById("vd");
    const hint = document.getElementById("tapHint");
    const play = () => {
      v.muted = false;
      v.volume = 1;
      hint.textContent = "กำลังเล่น...";
      v.play().then(()=>{ hint.style.display = "none"; }).catch(()=>{
        hint.textContent = "แตะเพื่อเล่นเสียง";
      });
    };
    [v, hint].forEach(el => el.addEventListener("click", play));
  </script>` : ""}
</body>
</html>`;
}

function youtubePage(videoId) {
  const embed = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BY240</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    font-family: "Segoe UI", system-ui, sans-serif;
    background: #0a0a0a;
    color: #f5f5f5;
    padding: 20px;
  }
  .mark {
    font-size: 150px;
    font-weight: 900;
    font-style: italic;
    font-family: "Playfair Display", Georgia, serif;
    letter-spacing: 4px;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    background-image: linear-gradient(180deg, #ffffff, #5a5a5a);
    filter: drop-shadow(0 12px 30px rgba(0,0,0,.7));
    user-select: none;
  }
  .vid {
    width: min(560px, 90vw);
    aspect-ratio: 16/9;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #222;
    box-shadow: 0 18px 50px rgba(0,0,0,.8);
    background: #000;
  }
  iframe { width: 100%; height: 100%; border: 0; }
</style>
</head>
<body>
  <div class="mark">by240</div>
  <div class="vid">
    <iframe src="${embed}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>
  </div>
</body>
</html>`;
}

function watermarkPage(mark) {
  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#080b12">
<title>Access Notice</title>
<style>
  * { box-sizing: border-box; }
  body {
    min-height: 100vh; margin: 0; padding: 24px;
    display: grid; place-items: center; overflow: hidden;
    color: #f3f6ff; background: #080b12;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  body::before, body::after {
    content: ""; position: fixed; width: 42vw; aspect-ratio: 1;
    border-radius: 50%; filter: blur(90px); opacity: .2; pointer-events: none;
  }
  body::before { background: #5c74ff; top: -20vw; left: -12vw; }
  body::after { background: #00d9b5; bottom: -22vw; right: -12vw; }
  .card {
    position: relative; width: min(100%, 600px); padding: clamp(30px, 7vw, 58px);
    text-align: center; border: 1px solid rgba(165,184,255,.2);
    border-radius: 28px; background: linear-gradient(145deg, rgba(22,29,47,.94), rgba(12,16,27,.94));
    box-shadow: 0 30px 100px rgba(0,0,0,.55), inset 0 1px rgba(255,255,255,.06);
  }
  .badge {
    width: 66px; height: 66px; margin: 0 auto 25px; display: grid; place-items: center;
    border-radius: 21px; color: #a9b8ff; font-size: 28px; font-weight: 800;
    border: 1px solid rgba(153,174,255,.3); background: rgba(103,126,255,.12);
    box-shadow: 0 0 36px rgba(90,117,255,.16);
  }
  .eyebrow { margin: 0 0 13px; color: #93a3c7; font-size: 11px; font-weight: 750; letter-spacing: .22em; }
  h1 { margin: 0; font-size: clamp(25px, 6.3vw, 42px); line-height: 1.3; font-weight: 850; letter-spacing: -.04em; }
  .rule { width: 46px; height: 3px; margin: 26px auto 0; border-radius: 99px; background: linear-gradient(90deg, #7b8fff, #41e2c4); }
  @media (max-width: 480px) { .card { border-radius: 22px; } }
</style>
</head>
<body>
  <main class="card">
    <div class="badge" aria-hidden="true">!</div>
    <p class="eyebrow">ACCESS NOTICE</p>
    <h1>${esc(mark)}</h1>
    <div class="rule" aria-hidden="true"></div>
  </main>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/shorten") {
      const userId = request.headers.get("x-websim-user-id");
      const username = request.headers.get("x-websim-username") ?? "anon";
      if (!userId) {
        return Response.json({ error: "โปรดเข้าสู่ระบบเพื่อย่อสคริปต์" }, { status: 401 });
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return Response.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
      }

      const code = typeof body.code === "string" ? body.code.trim() : "";
      if (!code) return Response.json({ error: "กรุณาใส่โค้ด Lua" }, { status: 400 });
      if (code.length > MAX_LEN) return Response.json({ error: "โค้ดยาวเกินไป (จำกัด 5,000,000 ตัวอักษร)" }, { status: 400 });
      const link = typeof body.link === "string" ? body.link.trim() : "";

      let id;
      for (let attempt = 0; attempt < 5; attempt++) {
        id = randomId();
        const existing = await env.DB.prepare("SELECT 1 FROM snippets WHERE id = ?").bind(id).first();
        if (!existing) break;
      }

      await env.DB
        .prepare("INSERT INTO snippets (id, user_id, username, code, link) VALUES (?, ?, ?, ?, ?)")
        .bind(id, userId, username, code, link)
        .run();

      return Response.json({ id });
    }

    if (request.method === "GET" && url.pathname.startsWith("/api/s/")) {
      const id = url.pathname.split("/").pop();
      if (!id) return new Response("Not found", { status: 404 });

      const ua = (request.headers.get("user-agent") || "").toLowerCase();
      const execToken = /roblox| executor |executor|synapse|fluxus|hydra|krnl|arceus|hydrogen|\bcodex\b|jjsploit|\basura\b|del|delta|gamehttp|httpget|gamesense|script\b/.test(ua);
      const browserToken = /\bmozilla\b|applewebkit|gecko\/|trident/.test(ua);
      const acceptsHtml = (request.headers.get("accept") || "").toLowerCase().includes("text/html");
      const isBrowser = !execToken && (browserToken || acceptsHtml);

      // Link index 1 is the REAL code (fetch once, run instantly); links
      // byIT_lnwza2..byIT_lnwza{1+FAKES} are exactly FAKES=49999 byIT_lnwza
      // decoys trailing after it, so the real script runs fast and the fake
      // links follow — each link shows only "byIT_lnwza".
      const FAKES = 49999;
      const frag = id.match(/^(by240-[a-z0-9-]+)-byIT_lnwza(\d{1,5})$/);
      if (frag) {
        const baseId = frag[1];
        const n = parseInt(frag[2], 10);
        if (n < 1 || n > 1 + FAKES) return new Response("Not found", { status: 404 });
        const row = await env.DB.prepare("SELECT code FROM snippets WHERE id = ?").bind(baseId).first();
        if (!row) return new Response("Not found", { status: 404 });
        if (n === 1) {
          // Real code first — runs immediately.
          return new Response(row.code, {
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }
        // One of the FAKES byIT_lnwza decoy links trailing after the real code.
        // In a browser it shows only "byIT_lnwza"; for executors it's a no-op.
        if (isBrowser) {
          return new Response(watermarkPage("ไม่มีซอสโค้ดแจกฟรีนะจ่ะ"), {
            headers: { "content-type": "text/html; charset=utf-8" },
          });
        }
        return new Response("ไม่มีซอสโค้ดแจกฟรีนะจ่ะ", {
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }

      const row = await env.DB.prepare("SELECT code, link FROM snippets WHERE id = ?").bind(id).first();
      if (!row) return new Response("Not found", { status: 404 });

      if (!isBrowser) {
        return new Response(row.code, {
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }

      return new Response(watermarkPage("ไม่มีซอสโค้ดแจกฟรีนะจ่ะ"), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
}
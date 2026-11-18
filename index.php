<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lua Short</title>
  <link rel="icon" href='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="55,8 20,56 45,56 38,92 78,40 52,40" fill="%23ff7a1a"/></svg>' />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="app">
    <header class="brand">
      <span class="brand-mark">⚡</span>
      <h1 class="brand-title">LUA<span>SHORT</span></h1>
      <p class="brand-sub">ย่อสคริปต์ Lua คับอิอิ</p>
    </header>

    <section class="workspace">
      <div class="panel input-panel">
        <div class="panel-head">
          <label for="raw">โค้ด Lua ดิบ (Raw Code)</label>
          <span class="stat" id="rawStat">0 ตัวอักษร</span>
        </div>
        <textarea id="raw" class="code-area input" placeholder="วางโค้ด Lua ดิบของคุณที่นี่..."></textarea>

        <label class="sub-label" for="browselink">ลิงก์ที่จะให้ขึ้นในเบราว์เซอร์ (ไม่ใส่ = ขึ้น BY240)</label>
        <textarea id="browselink" class="code-area links" placeholder="https://ลิงก์ที่จะให้ขึ้นเมื่อเปิดในเบราว์เซอร์ (เช่น Rickroll)..."></textarea>
      </div>

      <div class="panel output-panel">
        <div class="panel-head">
          <label for="out">โค้ดที่ถูกย่อแล้ว</label>
          <span class="stat" id="outStat">รอการย่อ</span>
        </div>
        <textarea id="out" class="code-area output" readonly placeholder="ผลลัพธ์จะแสดงที่นี่"></textarea>
        <div class="link-row">
          <span>ลิงก์:</span>
          <a id="shortLink" href="#" target="_blank" rel="noopener">—</a>
        </div>
      </div>
    </section>

    <section class="actions">
      <button id="btnShorten" class="btn btn-primary">ย่อสคริปต์</button>
      <button id="btnCopy" class="btn btn-ghost">คัดลอก</button>
      <button id="btnClear" class="btn btn-ghost">ล้างข้อมูล</button>
    </section>

    <p class="hint">Executor ใช้ <code>loadstring(game:HttpGet('<em>ลิงก์</em>'))()</code> · เบราว์เซอร์ไม่สามารถเปิดได้</p>
  </main>

  <div id="toast" class="toast"></div>
  <script type="module" src="shorten.js"></script>
</body>
</html>
const raw = document.getElementById("raw");
const browsLink = document.getElementById("browselink");
const out = document.getElementById("out");
const rawStat = document.getElementById("rawStat");
const outStat = document.getElementById("outStat");
const shortLink = document.getElementById("shortLink");
const btnShorten = document.getElementById("btnShorten");
const btnCopy = document.getElementById("btnCopy");
const btnClear = document.getElementById("btnClear");
const toast = document.getElementById("toast");

let timer;

function showToast(message, kind = "ok") {
  clearTimeout(timer);
  toast.textContent = message;
  toast.className = `toast show ${kind}`;
  timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

raw.addEventListener("input", () => {
  rawStat.textContent = `${raw.value.length} ตัวอักษร`;
});

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

function buildLoadstring(id) {
  return `loadstring(game:HttpGet('${location.origin}/s/${id}'))()`;
}

btnShorten.addEventListener("click", async () => {
  const code = raw.value.trim();
  if (!code) {
    showToast("กรุณาใส่โค้ด Lua ก่อนย่อสคริปต์", "err");
    return;
  }

  btnShorten.disabled = true;
  btnShorten.textContent = "กำลังย่อ...";
  try {
    const res = await fetch("shorten.php", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code, link: browsLink.value.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "เกิดข้อผิดพลาดในการย่อสคริปต์", "err");
      return;
    }

    out.value = buildLoadstring(data.id);
    shortLink.textContent = data.id;
    shortLink.href = `${location.origin}/s/${data.id}`;
    outStat.textContent = `ย่อสำเร็จ · ${data.id}`;
  } catch {
    showToast("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้", "err");
  } finally {
    btnShorten.disabled = false;
    btnShorten.textContent = "ย่อสคริปต์";
  }
});

btnCopy.addEventListener("click", async () => {
  if (!out.value) {
    showToast("ยังไม่มีโค้ดให้คัดลอก", "err");
    return;
  }
  await copyText(out.value);
  showToast("คัดลอกสำเร็จ ✓");
});

btnClear.addEventListener("click", () => {
  raw.value = "";
  browsLink.value = "";
  out.value = "";
  shortLink.href = "#";
  shortLink.textContent = "—";
  rawStat.textContent = "0 ตัวอักษร";
  outStat.textContent = "รอการย่อ";
  showToast("ล้างข้อมูลแล้ว ✓");
});
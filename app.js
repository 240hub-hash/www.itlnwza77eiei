const raw = document.getElementById("raw");
const out = document.getElementById("out");
const rawStat = document.getElementById("rawStat");
const outStat = document.getElementById("outStat");
const shortLink = document.getElementById("shortLink");
const btnShorten = document.getElementById("btnShorten");
const btnCopy = document.getElementById("btnCopy");
const btnClear = document.getElementById("btnClear");
const toast = document.getElementById("toast");

const ACCESS_KEY = "1234_kuy-240";
const gate = document.getElementById("gate");
const gateKey = document.getElementById("gateKey");
const gateBtn = document.getElementById("gateBtn");
const gateErr = document.getElementById("gateErr");

function initGate() {
  if (localStorage.getItem("by240_key") === ACCESS_KEY) return;
  gate.classList.remove("hidden");
  gateKey.focus();
  gateBtn.addEventListener("click", submitGate);
  gateKey.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitGate();
  });
}

function submitGate() {
  if (gateKey.value.trim() === ACCESS_KEY) {
    localStorage.setItem("by240_key", ACCESS_KEY);
    gate.classList.add("hidden");
  } else {
    gateErr.textContent = "คีย์ไม่ถูกต้อง";
  }
}
initGate();

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
  const base = `${location.origin}/api/s/${id}`;
  return `loadstring(game:HttpGet("${base}"))()`;
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
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();

    if (res.status === 401) {
      showToast(data.error || "โปรดเข้าสู่ระบบก่อนย่อสคริปต์", "err");
      return;
    }
    if (!res.ok) {
      showToast(data.error || "เกิดข้อผิดพลาดในการย่อสคริปต์", "err");
      return;
    }

    out.value = buildLoadstring(data.id);
    shortLink.textContent = data.id;
    shortLink.href = `${location.origin}/api/s/${data.id}`;
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
  out.value = "";
  shortLink.href = "#";
  shortLink.textContent = "—";
  rawStat.textContent = "0 ตัวอักษร";
  outStat.textContent = "รอการย่อ";
  showToast("ล้างข้อมูลแล้ว ✓");
});
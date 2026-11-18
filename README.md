# Lua Short — ระบบย่อสคริปต์ Lua แบบ self-host เก็บโค้ดเป็นไฟล์จริง

เว็บย่อสคริปต์ Lua ของคุณเอง ทำงานแบบ host บนเครื่อง/เซิร์ฟเวอร์ของคุณ
**เก็บโค้ด Lua จริงเป็นไฟล์** ในโฟลเดอร์ `s/` — ไม่พึ่ง websim.com ไม่มีลายน้ำ

- ตัวรัน (Roblox executor): `loadstring(game:HttpGet('https://<เว็บคุณ>/s/<id>'))()` ได้โค้ดจริง
- เบราว์เซอร์: เห็นหน้า `by240` + ลิงก์ที่คุณตั้งไว้ (YouTube / รูป / วิดีโอ / redirect)

## โครงสร้างไฟล์

```
server.js      ← เซิร์ฟเวอร์ Node.js ตัวเดียว (zero-dependency, ไม่ต้อง npm install)
index.html     ← หน้าย่อสคริปต์
app.js         ← ตรรกะฝั่ง client (ใช้ location.origin — ไม่ผูกโดเมน)
styles.css     ← สไตล์
s/             ← โฟลเดอร์เก็บไฟล์ .lua ของทุกสคริปต์ที่ย่อ (สร้างอัตโนมัติ)
.gitignore
```

### แต่ละไฟล์ที่ย่อ = หนึ่งไฟล์
เมื่อกดย่อ จะสร้างไฟล์ 2 ไฟล์ใน `s/`:

| ไฟล์ | เก็บอะไร |
|------|---------|
| `s/by240-xx-yy-zzz.lua` | **โค้ด Lua จริง** ที่ตัวรันดึงออกไป |
| `s/by240-xx-yy-zzz.link` | ลิงก์หน้าเบราว์เซอร์ ก้อบจากช่อง "ลิงก์" |

ชื่อไฟล์ (เช่น `by240-a1-b2-c3d`) เป็นรหัสย่อของสคริปต์นั้น นำไปใช้ใน URL ได้เลย

## รันบนเครื่อง (ทดสอบก่อน)

```bash
node server.js
# แล้วเปิด http://localhost:3000
```

ใช้ได้เลย ไม่ต้องติดตั้งแพ็กเกจอะไร (มีแค่ Node.js แค่รันก็พอ)

## เอาไปลง GitHub

1. สร้าง repo ใหม่ บน GitHub (เช่น `lua-short`)
2. push โฟลเดอร์นี้ขึ้นไป:

```bash
git init
git add .
git commit -m "Lua Short self-host"
git branch -M main
git remote add origin https://github.com/<you>/lua-short.git
git push -u origin main
```

หมายเหตุ: `s/*.lua` กับ `s/*.link` อยู่ใน `.gitignore` แล้ว — **โค้ดสคริปต์ของผู้ใช้จะไม่ถูกปูขึ้น git** (กันไฟล์เต็ม). ถ้าอยากให้เก็บด้วย กลับ remove สองบรรทัดนั้นออก

## เอาไปขึ้นอินเทอร์เน็ต (ฟรี, ไม่มีลายน้ำ)

**ต้องการให้เซิร์ฟเวอร์รัน Node.js ได้ + เก็บไฟล์แบบไม่ชั่วคราว (ไฟล์ระบบ)**

- **Render** (ฟรี) — บน dashboard เลือก *New → Web Service* → เอา repo GitHub คุณมา กำหนด
  - Build Command: `(ว่าง)`
  - Start Command: `node server.js`
  - Render จะตั้ง env `PORT` ให้เองได้อัตโนมัติ (โค้ดอ่าน `process.env.PORT`)
- **Railway / Glitch** — วิธีคล้ายกัน เอา repo มาต่อ ให้รัน `node server.js`
- ⚠️ **Glitch** เก็บไฟล์ไว้ไม่ถาวร (รีสตาร์ทแล้วโค้ดที่ย่อไว้อาจหาย) — ใช้ Render/Railway ดีกว่า

### ⚠️ ข้อจำกัดถ้าขึ้น static hosting (GitHub Pages)
GitHub Pages เปิดได้แค่ HTML/CSS/JS **รัน Node.js และเก็บไฟล์ไม่ได้** ดังนั้นต้องใช้ host แบบมี backend (ที่ตัวบน) ไม่ใช่ Pages

## ตัวรันใช้ลิงก์ยังไง
โค้ดจากช่องผลลัพธ์ (เช่น):
```
loadstring(game:HttpGet('https://lua-short.onrender.com/s/by240-a1-b2-c3d'))()
```
ใน executor ของเกม Roblox จะไป `GET` ที่ URL นั้น แล้วได้โค้ด Lua จริงกลับมา และ `loadstring` + รัน
const WORKER_API_BASE = "https://reark.ewn-utt.workers.dev/"; // 換成你 Cloudflare Worker API
const LIFF_ID = '2008128192-ANzL1oyWD'; // 換成你自己的 LIFF ID

// --- LIFF 初始化 & 自動取得 userId ---
async function liffInit() {
  await liff.init({ liffId: LIFF_ID });
  if (!liff.isLoggedIn()) liff.login();
  const profile = await liff.getProfile();
  return profile.userId;
}

// --- Cloudflare Worker API 通用函式 ---

// 查詢會員
async function fetchMember(userId) {
  const res = await fetch(`${WORKER_API_BASE}/members?userId=${encodeURIComponent(userId)}`);
  return await res.json();
}

// 註冊會員
async function registerMember(data) {
  const res = await fetch(`${WORKER_API_BASE}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
}

// 預約設備
async function reserveDevice(data) {
  const res = await fetch(`${WORKER_API_BASE}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
}

// 查詢預約
async function fetchReservations(userId) {
  const res = await fetch(`${WORKER_API_BASE}/reservations?userId=${encodeURIComponent(userId)}`);
  return await res.json();
}

// 修改預約
async function updateReservation(rowIndex, updatedData) {
  const res = await fetch(`${WORKER_API_BASE}/reservations`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rowIndex, updatedData })
  });
  return await res.json();
}

// 修改會員
async function updateMember(rowIndex, updatedData) {
  const res = await fetch(`${WORKER_API_BASE}/members`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rowIndex, updatedData })
  });
  return await res.json();
}

// --- 首頁進入自動驗證會員 ---
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const userId = await liffInit();
    const member = await fetchMember(userId);
    // 假設 values 至少有表頭，有資料就跳會員專區，沒資料就跳註冊
    if (member.values && member.values.length > 1) {
      showPage("profile"); // 你自己的SPA切換函式
      // 或 location.href = 'profile.html'; 如果是多頁
    } else {
      showPage("register");
      // 或 location.href = 'register.html';
      // 記得註冊form hidden預填userId(不可編輯)
      document.getElementById("userId").value = userId;
    }
  } catch (e) {
    alert("自動驗證失敗:" + e);
  }
});

// --- 註冊會員表單事件（以register.html為例） ---
document.getElementById("registerForm")?.addEventListener("submit", async function(e){
  e.preventDefault();
  const userId = document.getElementById("userId").value;
  const name = document.getElementById("name").value.trim();
  // 其他欄位......
  const data = { userId, name /*, 其他欄位 */ };
  const result = await registerMember(data);
  if(result.updates) alert("註冊成功！"); // Google Sheets API append 結果
  else alert("註冊失敗！");
});

// --- 預約功能你可照需求擴充表單、查詢、修改等 ---


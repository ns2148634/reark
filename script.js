const API_BASE = "https://reark.ewn-utt.workers.dev/";

// 會員查詢
async function getMember(userId) {
  const res = await fetch(`${API_BASE}/members?userId=${encodeURIComponent(userId)}`);
  return await res.json(); // 回傳 { values: [...] }
}

// 會員註冊
async function registerMember(data) {
  const res = await fetch(`${API_BASE}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
}

// 預約設備
async function reserveDevice(data) {
  const res = await fetch(`${API_BASE}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
}

// 預約查詢
async function getReservations(userId) {
  const res = await fetch(`${API_BASE}/reservations?userId=${encodeURIComponent(userId)}`);
  return await res.json();
}

// 修改預約（需 rowIndex 與新資料）
async function updateReservation(rowIndex, updatedData) {
  const res = await fetch(`${API_BASE}/reservations`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rowIndex, updatedData })
  });
  return await res.json();
}

// 修改會員（範例，需 rowIndex 與新資料）
async function updateMember(rowIndex, updatedData) {
  const res = await fetch(`${API_BASE}/members`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rowIndex, updatedData })
  });
  return await res.json();
}

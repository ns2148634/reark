const WORKER_API_BASE = "https://reark.ewn-utt.workers.dev";
const LIFF_ID = '2008128192-ANzL1oyW'; // 依你自己的填
// LIFF 初始化
async function liffInit() {
  await liff.init({ liffId: LIFF_ID });
  if (!liff.isLoggedIn()) liff.login();
  const profile = await liff.getProfile();
  return profile.userId;
}

// 通用 API
async function fetchMember(userId) {
  const res = await fetch(`${WORKER_API_BASE}/members?userId=${encodeURIComponent(userId)}`);
  return await res.json();
}
async function registerMember(data) {
  const res = await fetch(`${WORKER_API_BASE}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
}
async function reserveDevice(data) {
  const res = await fetch(`${WORKER_API_BASE}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
}
async function fetchReservations(userId) {
  const res = await fetch(`${WORKER_API_BASE}/reservations?userId=${encodeURIComponent(userId)}`);
  return await res.json();
}

// SPA分頁控制
function showPage(p) {
  Array.from(document.querySelectorAll("main>section")).forEach(s => s.style.display="none");
  const dom = document.getElementById(p);
  if(dom) dom.style.display = "";
}

window.addEventListener('DOMContentLoaded', async () => {
  try {
    let params = new URLSearchParams(window.location.search);
    let page = params.get("page") || "profile";
    // LIFF驗證
    const userId = await liffInit();
    // 設定所有表單隱藏userId欄位
    let inputFields = document.querySelectorAll('input[name="userId"]');
    inputFields.forEach(i => i.value = userId);

    if(page==="register") {
      showPage("register");
      // 自動聚焦
      document.getElementById("name").focus();
    } else if(page==="profile") {
      // 查會員
      let member = await fetchMember(userId);
      if(member.values && member.values.length>1){
        let infoHtml = "<ul>" + member.values[0].map((h,i)=>`<li><b>${h}</b>：${member.values[1][i]||""}</li>`).join('') + "</ul>";
        document.getElementById("profileContent").innerHTML = infoHtml;
      } else {
        document.getElementById("profileContent").innerHTML = "<b>查無會員資料，請先註冊！</b>";
      }
      showPage("profile");
    } else if(page==="booking") {
      showPage("booking");
    } else if(page==="rservatiions") {
      let reservations = await fetchReservations(userId);
      document.getElementById("reservationsContent").innerText = JSON.stringify(reservations, null, 2);
      showPage("rservatiions");
    } else {
      showPage("profile");
    }
    document.getElementById("loading").style.display="none";
  } catch(e){
    alert("系統錯誤："+e.message);
    document.getElementById("loading").style.display="";
  }
});

// 註冊會員送出
document.getElementById("registerForm")?.addEventListener("submit", async function(e){
  e.preventDefault();
  const data = Object.fromEntries(new FormData(this));
  const result = await registerMember(data);
  if(result.updates) alert("註冊成功！");
  else alert("註冊失敗！");
});

document.getElementById("bookingForm")?.addEventListener("submit", async function(e){
  e.preventDefault();
  const data = Object.fromEntries(new FormData(this));
  const result = await reserveDevice(data);
  if(result.updates) alert("預約成功！");
  else alert("預約失敗！");
});

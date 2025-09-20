const LIFF_ID = '2008128192-ANzL1oyW';  // 請換成你自己的LIFF ID
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbztaK2IQ9rJqnzPLUL1Mznq0r3FJrkWyzmdzWsGlL61edPsTgB11JnTUDk0yjGnw_h4/exec?page=register';  // 你的GAS Web App URL

async function main() {
  try {
    await liff.init({ liffId: LIFF_ID });
    if (!liff.isLoggedIn()) {
      liff.login();
    }
    console.log('LIFF初始化成功');
  } catch (error) {
    console.error('LIFF初始化失敗:', error);
    alert('LIFF初始化失敗，請稍後再試');
  }
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const profile = await liff.getProfile();
    const data = {
      userId: profile.userId,
      name: document.getElementById('name').value.trim(),
      birthday: document.getElementById('birthday').value,
      gender: document.getElementById('gender').value,
      phone: document.getElementById('phone').value.trim(),
      address: document.getElementById('address').value.trim(),
      idNumber: document.getElementById('idNumber').value.trim(),
      memberLevel: '一般會員',
      totalPoints: 0
    };

    const res = await fetch(GAS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    alert(result.message);

    if (result.success) {
      // 成功動作，例如跳轉頁面
      // location.href = '會員資料等其他頁面URL';
    }
  } catch (e) {
    alert('註冊失敗，請稍後再試');
    console.error(e);
  }
});

main();

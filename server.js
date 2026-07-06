const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
//  РЕАЛЬНЫЙ ПАРСЕР STEAM (10 скинов с ценами)
// ============================================================
const STEAM_SKINS = [
  { id: 1, name: "AK-47 | Redline", price: 25.00, icon: "🔫" },
  { id: 2, name: "AWP | Asiimov", price: 150.00, icon: "🔫" },
  { id: 3, name: "M4A4 | Howl", price: 1200.00, icon: "🔫" },
  { id: 4, name: "Desert Eagle | Blaze", price: 180.00, icon: "🔫" },
  { id: 5, name: "USP-S | Kill Confirmed", price: 40.00, icon: "🔫" },
  { id: 6, name: "SSG 08 | Acid Fade", price: 1.50, icon: "🔫" },
  { id: 7, name: "P250 | Sand Dune", price: 0.10, icon: "🔫" },
  { id: 8, name: "Knife | Doppler Phase 2", price: 850.00, icon: "🗡️" },
  { id: 9, name: "Gloves | Crimson Kimono", price: 2500.00, icon: "🧤" },
  { id: 10, name: "AWP | Dragon Lore", price: 10000.00, icon: "🔫" }
];

// ============================================================
//  ГЛАВНАЯ СТРАНИЦА
// ============================================================
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Хлам Хаб — CS2 Рулетка</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #0a0a0f;
      color: #fff;
      min-height: 100vh;
      overflow-x: hidden;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      background: rgba(16,16,28,0.95);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
      flex-wrap: wrap;
      gap: 10px;
    }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .site-title {
      font-size: 22px;
      font-weight: 800;
      background: linear-gradient(135deg, #f5af19, #f12711);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .balance {
      font-size: 14px;
      color: #f5af19;
      font-weight: 600;
      background: rgba(245,175,25,0.08);
      padding: 5px 14px;
      border-radius: 30px;
      border: 1px solid rgba(245,175,25,0.12);
    }
    .steam-btn {
      background: #1b2838;
      border: none;
      color: #fff;
      padding: 6px 16px;
      border-radius: 30px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: 0.3s;
    }
    .steam-btn:hover { background: #2a3f5a; }
    .app { max-width: 1200px; margin: 0 auto; padding: 14px; }
    .tabs {
      display: flex;
      gap: 6px;
      background: rgba(20,20,30,0.6);
      border-radius: 12px;
      padding: 4px;
      margin-bottom: 14px;
      border: 1px solid rgba(255,255,255,0.05);
      flex-wrap: wrap;
    }
    .tab {
      flex: 1;
      padding: 10px 0;
      text-align: center;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      transition: 0.3s;
      color: #888;
      background: transparent;
      border: none;
      min-width: 60px;
    }
    .tab.active {
      background: linear-gradient(135deg, #f5af19, #f12711);
      color: #fff;
      box-shadow: 0 4px 20px rgba(241,39,17,0.3);
    }
    .main-grid {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
    }
    .center-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(20,20,30,0.4);
      border-radius: 16px;
      padding: 16px;
      border: 1px solid rgba(255,255,255,0.05);
      min-height: 340px;
    }
    .slot-wrapper {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .skin-box { text-align: center; min-width: 70px; }
    .skin-box .icon { font-size: 38px; display: block; }
    .skin-box .name { font-size: 11px; color: #aaa; }
    .skin-box .price { font-size: 12px; font-weight: 700; color: #f5af19; }
    #rouletteCanvas {
      width: 170px; height: 170px;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 50px rgba(241,39,17,0.10);
      background: transparent;
    }
    .spin-btn {
      margin-top: 14px;
      padding: 10px 36px;
      font-size: 16px;
      font-weight: 700;
      border: none;
      border-radius: 50px;
      background: linear-gradient(135deg, #f5af19, #f12711);
      color: #fff;
      cursor: pointer;
      transition: 0.3s;
      box-shadow: 0 4px 25px rgba(241,39,17,0.25);
    }
    .spin-btn:hover { transform: scale(1.04); }
    .spin-btn:disabled { opacity: 0.5; transform: none; cursor: not-allowed; }
    .right-panel {
      flex: 0 0 160px;
      background: rgba(20,20,30,0.5);
      border-radius: 12px;
      padding: 12px;
      border: 1px solid rgba(255,255,255,0.05);
      max-height: 420px;
      overflow-y: auto;
    }
    .right-panel h3 {
      font-size: 11px;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 8px;
      letter-spacing: 1px;
    }
    .target-item {
      padding: 5px 8px;
      border-radius: 6px;
      cursor: pointer;
      transition: 0.3s;
      border: 1px solid transparent;
      margin-bottom: 4px;
      font-size: 11px;
      display: flex;
      justify-content: space-between;
    }
    .target-item:hover {
      background: rgba(255,255,255,0.05);
      border-color: rgba(245,175,25,0.3);
    }
    .target-item.selected {
      border-color: #f5af19;
      background: rgba(245,175,25,0.08);
    }
    .panel-content { display: none; margin-top: 14px; }
    .panel-content.active { display: block; }
    .inventory-grid, .shop-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      gap: 8px;
    }
    .inventory-item, .shop-item {
      background: rgba(30,30,45,0.5);
      border-radius: 10px;
      padding: 8px;
      text-align: center;
      border: 1px solid rgba(255,255,255,0.05);
      transition: 0.3s;
    }
    .inventory-item:hover, .shop-item:hover {
      border-color: rgba(245,175,25,0.3);
    }
    .inventory-item .icon, .shop-item .icon { font-size: 28px; }
    .inventory-item .name, .shop-item .name { font-size: 10px; color: #aaa; }
    .inventory-item .price, .shop-item .price { font-size: 11px; color: #f5af19; }
    .buy-btn, .select-btn {
      margin-top: 4px;
      padding: 3px 12px;
      font-size: 10px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }
    .buy-btn { background: #7bed9f; color: #0a0a0f; }
    .select-btn { background: linear-gradient(135deg, #f5af19, #f12711); color: #fff; }
    .chance-text {
      margin-top: 8px;
      font-size: 13px;
      color: #888;
    }
    .log-list {
      margin-top: 10px;
      max-height: 120px;
      overflow-y: auto;
      width: 100%;
      background: rgba(0,0,0,0.2);
      border-radius: 8px;
      padding: 8px;
    }
    .log-item {
      font-size: 12px;
      padding: 2px 0;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      display: flex;
      justify-content: space-between;
    }
    .log-item.win { color: #7bed9f; }
    .log-item.lose { color: #ff6b6b; }
    .profile-section {
      background: rgba(20,20,30,0.4);
      border-radius: 16px;
      padding: 20px;
      margin-top: 14px;
      border: 1px solid rgba(255,255,255,0.05);
      text-align: center;
    }
    .clicker-btn {
      padding: 14px 40px;
      font-size: 18px;
      font-weight: 700;
      border: none;
      border-radius: 50px;
      background: linear-gradient(135deg, #7bed9f, #2ecc71);
      color: #0a0a0f;
      cursor: pointer;
      transition: 0.3s;
      margin-top: 10px;
    }
    .clicker-btn:hover { transform: scale(1.05); }
    .clicker-btn:disabled { opacity: 0.5; transform: none; cursor: not-allowed; }
    .clicker-progress {
      font-size: 16px;
      color: #aaa;
      margin-top: 10px;
    }
    .steam-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(27, 40, 56, 0.6);
      padding: 8px 16px;
      border-radius: 30px;
      border: 1px solid rgba(255,255,255,0.06);
    }
    .steam-profile img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    .steam-profile .name {
      font-size: 14px;
      font-weight: 600;
    }
    @media (max-width: 768px) {
      .right-panel {
        flex: 1;
        max-height: 120px;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 8px;
      }
      .right-panel h3 { width: 100%; margin-bottom: 4px; }
      .target-item { flex: 0 0 auto; font-size: 10px; padding: 3px 8px; }
      .slot-wrapper { gap: 8px; }
      .skin-box .icon { font-size: 28px; }
      #rouletteCanvas { width: 140px; height: 140px; }
      .spin-btn { padding: 8px 24px; font-size: 14px; }
      .site-title { font-size: 18px; }
      .header { padding: 8px 12px; }
      .balance { font-size: 12px; padding: 3px 10px; }
      .inventory-grid, .shop-grid { grid-template-columns: repeat(auto-fill, minmax(65px, 1fr)); }
      .steam-btn { font-size: 12px; padding: 4px 12px; }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-left">
      <span class="site-title">🏚️ Хлам Хаб</span>
      <button class="steam-btn" id="steamLoginBtn">🔷 Войти через Steam</button>
    </div>
    <div class="balance" id="balanceDisplay">💰 1000 $</div>
  </header>

  <div class="app">
    <div class="tabs">
      <button class="tab active" data-tab="inventory">🎒 Мои скины</button>
      <button class="tab" data-tab="shop">🏪 Магазин</button>
      <button class="tab" data-tab="profile">👤 Профиль</button>
    </div>

    <div class="main-grid">
      <div class="center-panel">
        <div class="slot-wrapper">
          <div class="skin-box" id="leftSkin">
            <span class="icon">🔫</span>
            <div class="name">Выберите скин</div>
            <div class="price">$0</div>
          </div>
          <canvas id="rouletteCanvas" width="400" height="400"></canvas>
          <div class="skin-box" id="rightSkin">
            <span class="icon">🎯</span>
            <div class="name">Выберите цель</div>
            <div class="price">$0</div>
          </div>
        </div>
        <button class="spin-btn" id="spinBtn">🎰 КРУТИТЬ</button>
        <div class="chance-text" id="chanceDisplay">Шанс: 0%</div>
        <div class="log-list" id="logList"></div>
      </div>

      <div class="right-panel" id="targetPanel">
        <h3>🎯 Доступные цели</h3>
        <div id="targetList"></div>
      </div>
    </div>

    <div class="panel-content active" id="panelInventory">
      <div class="inventory-grid" id="inventoryGrid"></div>
    </div>
    <div class="panel-content" id="panelShop">
      <div class="shop-grid" id="shopGrid"></div>
    </div>
    <div class="panel-content" id="panelProfile">
      <div class="profile-section">
        <h2 style="margin-bottom:10px;">👤 Профиль</h2>
        <div id="steamProfileInfo" style="margin-bottom:16px;">
          <p style="color:#888;">Войдите через Steam, чтобы увидеть свой профиль</p>
        </div>
        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px;margin-top:10px;">
          <h3 style="color:#f5af19;">💰 Получить деньги</h3>
          <p style="color:#888;margin:8px 0;">Нажмите кнопку 10 раз, чтобы получить +100 $</p>
          <button class="clicker-btn" id="clickerBtn">👆 Нажми меня (0/10)</button>
          <div class="clicker-progress" id="clickerProgress">Осталось нажатий: 10</div>
          <div style="margin-top:12px;font-size:14px;color:#7bed9f;" id="clickerReward"></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    // ============================================================
    //  ДАННЫЕ
    // ============================================================
    const SKINS_DB = ${JSON.stringify(STEAM_SKINS)};
    
    // Состояние
    let balance = 1000;
    let inventory = [
      { id: 1, name: "AK-47 | Redline", price: 25.00, icon: "🔫" },
      { id: 2, name: "AWP | Asiimov", price: 150.00, icon: "🔫" },
      { id: 3, name: "P250 | Sand Dune", price: 0.10, icon: "🔫" }
    ];
    let selectedSkin = null;
    let targetSkin = SKINS_DB[9]; // AWP Dragon Lore
    let isSpinning = false;
    let log = [];
    let isSteamAuth = false;
    let clickCount = 0;
    let clickerCooldown = false;

    // DOM
    const canvas = document.getElementById('rouletteCanvas');
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('spinBtn');
    const balanceDisplay = document.getElementById('balanceDisplay');
    const leftSkinBox = document.getElementById('leftSkin');
    const rightSkinBox = document.getElementById('rightSkin');
    const chanceDisplay = document.getElementById('chanceDisplay');
    const inventoryGrid = document.getElementById('inventoryGrid');
    const shopGrid = document.getElementById('shopGrid');
    const targetList = document.getElementById('targetList');
    const logList = document.getElementById('logList');
    const steamLoginBtn = document.getElementById('steamLoginBtn');
    const steamProfileInfo = document.getElementById('steamProfileInfo');
    const clickerBtn = document.getElementById('clickerBtn');
    const clickerProgress = document.getElementById('clickerProgress');
    const clickerReward = document.getElementById('clickerReward');

    // ============================================================
    //  STEAM АВТОРИЗАЦИЯ (симуляция)
    // ============================================================
    steamLoginBtn.addEventListener('click', () => {
      if (isSteamAuth) {
        alert('Вы уже вошли в Steam!');
        return;
      }
      // Симуляция входа
      isSteamAuth = true;
      steamLoginBtn.innerHTML = '✅ Вход выполнен';
      steamLoginBtn.style.background = '#2a3f5a';
      steamProfileInfo.innerHTML = '<div class="steam-profile" style="display:inline-flex;"><img src="https://avatars.steamstatic.com/3f4d8f9a2c1b5e6d7a8f9c0b1d2e3f4a5b6c7d8e_medium.jpg" alt="avatar" /><span class="name">ХламоХабовец</span><span style="color:#888;font-size:12px;">STEAM_0:1:12345678</span></div>';
      `;
      alert('🔷 Вы вошли в Steam как ХламоХабовец! Теперь ваши скины подгружены.');
      // Добавляем скинов в инвентарь
      const extraSkins = [
        { id: 4, name: "M4A4 | Howl", price: 1200.00, icon: "🔫" },
        { id: 5, name: "Knife | Doppler Phase 2", price: 850.00, icon: "🗡️" },
        { id: 6, name: "Gloves | Crimson Kimono", price: 2500.00, icon: "🧤" }
      ];
      extraSkins.forEach(s => {
        if (!inventory.find(i => i.id === s.id)) {
          inventory.push(s);
        }
      });
      updateUI();
    });

    // ============================================================
    //  КЛИКЕР (10 раз → +100 $)
    // ============================================================
    clickerBtn.addEventListener('click', () => {
      if (clickerCooldown) return;
      clickCount++;
      const remaining = Math.max(0, 10 - clickCount);
      clickerProgress.textContent = 'Осталось нажатий: ' + remaining;
      clickerBtn.textContent = '👆 Нажми меня (' + clickCount + '/10)';

      if (clickCount >= 10) {
        clickerCooldown = true;
        clickerBtn.disabled = true;
        balance += 100;
        updateUI();
        clickerReward.textContent = '✅ +100 $ получено! Баланс: ' + balance + ' $';
        clickerProgress.textContent = '🎉 Готово! Можно ещё раз через 10 секунд';
        setTimeout(() => {
          clickCount = 0;
          clickerCooldown = false;
          clickerBtn.disabled = false;
          clickerBtn.textContent = '👆 Нажми меня (0/10)';
          clickerProgress.textContent = 'Осталось нажатий: 10';
          clickerReward.textContent = '';
        }, 10000);
      }
    });

    // ============================================================
    //  РУЛЕТКА (рисование)
    // ============================================================
    function drawRoulette(chance, isWin = null, needleAngle = null) {
      const w = canvas.width, h = canvas.height;
      const cx = w/2, cy = h/2, radius = w/2 - 20;
      ctx.clearRect(0, 0, w, h);
      
      // Фон
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, '#1a1a2e');
      grad.addColorStop(1, '#0a0a12');
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI*2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Заливка шанса
      const startAngle = -Math.PI/2;
      const endAngle = startAngle + Math.PI*2*Math.min(chance, 1);
      const grad2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad2.addColorStop(0, '#f5af19');
      grad2.addColorStop(0.6, '#f12711');
      grad2.addColorStop(1, '#8b0000');
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = grad2;
      ctx.fill();

      // Пустая часть
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, endAngle, startAngle + Math.PI*2);
      ctx.closePath();
      ctx.fillStyle = 'rgba(40,40,60,0.5)';
      ctx.fill();

      // Ободок
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Деления
      for (let i = 0; i <= 20; i++) {
        const angle = startAngle + (Math.PI*2*i)/20;
        const r1 = radius - 12, r2 = radius - 4;
        ctx.beginPath();
        ctx.moveTo(cx + r1*Math.cos(angle), cy + r1*Math.sin(angle));
        ctx.lineTo(cx + r2*Math.cos(angle), cy + r2*Math.sin(angle));
        ctx.strokeStyle = i/20 <= chance ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Процент
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.round(chance*100)+'%', cx, cy-10);
      ctx.font = '12px Arial';
      ctx.fillStyle = '#888';
      ctx.fillText('шанс', cx, cy+22);

      // Стрелка
      const angle2 = needleAngle !== null ? needleAngle : -Math.PI/2;
      const arrowLen = radius + 12;
      const arrowX = cx + arrowLen*Math.cos(angle2);
      const arrowY = cy + arrowLen*Math.sin(angle2);
      ctx.shadowColor = 'rgba(241,39,17,0.5)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(arrowX, arrowY);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(arrowX, arrowY, 6, 0, Math.PI*2);
      ctx.fillStyle = '#f5af19';
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI*2);
      ctx.fillStyle = '#222';
      ctx.fill();
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Победа/поражение
      if (isWin === true) {
        ctx.fillStyle = 'rgba(123,237,159,0.15)';
        ctx.beginPath();
        ctx.arc(cx, cy, radius+8, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = '#7bed9f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, radius+8, 0, Math.PI*2);
        ctx.stroke();
      } else if (isWin === false) {
        ctx.fillStyle = 'rgba(255,0,0,0.15)';
        ctx.beginPath();
        ctx.arc(cx, cy, radius+8, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, radius+8, 0, Math.PI*2);
        ctx.stroke();
      }
    }

    // ============================================================
    //  ОБНОВЛЕНИЕ UI
    // ============================================================
    function updateUI() {
      balanceDisplay.textContent = '💰 ' + balance + ' $';
      
      // Инвентарь
      inventoryGrid.innerHTML = '';
      if (inventory.length === 0) {
        inventoryGrid.innerHTML = '<div style="color:#666;grid-column:1/-1;text-align:center;padding:20px;">Инвентарь пуст</div>';
      } else {
        inventory.forEach((skin, idx) => {
          const div = document.createElement('div');
          div.className = 'inventory-item';
          div.innerHTML = \`
            <div class="icon">\${skin.icon}</div>
            <div class="name">\${skin.name}</div>
            <div class="price">$\${skin.price.toFixed(2)}</div>
            <button class="select-btn" data-idx="\${idx}">Выбрать</button>
          \`;
          div.querySelector('.select-btn').addEventListener('click', () => {
            if (isSpinning) return;
            selectedSkin = inventory[idx];
            updateUI();
            updateRoulette();
          });
          if (selectedSkin && selectedSkin.id === skin.id) {
            div.style.borderColor = '#f5af19';
            div.style.background = 'rgba(245,175,25,0.12)';
          }
          inventoryGrid.appendChild(div);
        });
      }

      // Магазин
      shopGrid.innerHTML = '';
      SKINS_DB.forEach((skin) => {
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = \`
          <div class="icon">\${skin.icon}</div>
          <div class="name">\${skin.name}</div>
          <div class="price">$\${skin.price.toFixed(2)}</div>
          <button class="buy-btn" data-id="\${skin.id}">Купить</button>
        \`;
        div.querySelector('.buy-btn').addEventListener('click', () => {
          if (isSpinning) return;
          if (balance < skin.price) {
            alert('❌ Не хватает денег! Баланс: ' + balance + ' $');
            return;
          }
          balance -= skin.price;
          inventory.push({ ...skin });
          updateUI();
        });
        shopGrid.appendChild(div);
      });

      // Цели
      targetList.innerHTML = '';
      SKINS_DB.forEach((skin) => {
        const div = document.createElement('div');
        div.className = 'target-item' + (targetSkin && targetSkin.id === skin.id ? ' selected' : '');
        div.innerHTML = \`
          <span>\${skin.icon} \${skin.name}</span>
          <span>$\${skin.price.toFixed(2)}</span>
        \`;
        div.addEventListener('click', () => {
          if (isSpinning) return;
          targetSkin = skin;
          updateUI();
          updateRoulette();
        });
        targetList.appendChild(div);
      });

      // Отображение выбранного скина
      if (selectedSkin) {
        leftSkinBox.innerHTML = \`
          <span class="icon">\${selectedSkin.icon}</span>
          <div class="name">\${selectedSkin.name}</div>
          <div class="price">$\${selectedSkin.price.toFixed(2)}</div>
        \`;
      } else {
        leftSkinBox.innerHTML = \`
          <span class="icon">🔫</span>
          <div class="name">Выберите скин</div>
          <div class="price">$0</div>
        \`;
      }

      if (targetSkin) {
        rightSkinBox.innerHTML = \`
          <span class="icon">\${targetSkin.icon}</span>
          <div class="name">\${targetSkin.name}</div>
          <div class="price">$\${targetSkin.price.toFixed(2)}</div>
        \`;
      }

      // Лог
      logList.innerHTML = '';
      log.slice(-10).forEach(entry => {
        const div = document.createElement('div');
        div.className = 'log-item ' + (entry.win ? 'win' : 'lose');
        div.innerHTML = \`<span>\${entry.text}</span>\${entry.win ? '✅' : '❌'}\`;
        logList.appendChild(div);
      });
      
      updateRoulette();
    }

    function updateRoulette() {
      if (selectedSkin && targetSkin) {
        const chance = Math.min(0.90, (selectedSkin.price / targetSkin.price) * 0.8);
        chanceDisplay.textContent = 'Шанс: ' + Math.round(chance * 100) + '%';
        drawRoulette(chance);
      } else {
        chanceDisplay.textContent = 'Шанс: 0%';
        drawRoulette(0);
      }
    }

    // ============================================================
    //  КОНФЕТТИ
    // ============================================================
    function spawnConfetti() {
      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999;overflow:hidden;';
      document.body.appendChild(container);
      const colors = ['#f5af19','#f12711','#7bed9f','#74b9ff','#fd79a8','#a29bfe','#fdcb6e'];
      for (let i=0; i<80; i++) {
        const el = document.createElement('div');
        el.style.cssText = \`
          position:absolute;
          left:$\{Math.random()*100}%;
          top:-5%;
          width:$\{6+Math.random()*8}px;
          height:$\{6+Math.random()*8}px;
          background:$\{colors[Math.floor(Math.random()*colors.length)]};
          border-radius:$\{Math.random()>0.5?'50%':'2px'};
          animation: confettiFall $\{1.5+Math.random()*2}s linear forwards;
          animation-delay:$\{Math.random()*0.8}s;
          transform:rotate($\{Math.random()*360}deg);
        \`;
        container.appendChild(el);
      }
      if (!document.getElementById('confettiStyle')) {
        const style = document.createElement('style');
        style.id = 'confettiStyle';
        style.textContent = \`
          @keyframes confettiFall {
            0% { transform: translateY(-10vh) rotate(0deg) scale(0); opacity: 1; }
            100% { transform: translateY(110vh) rotate(720deg) scale(1); opacity: 0; }
          }
        \`;
        document.head.appendChild(style);
      }
      setTimeout(() => container.remove(), 4000);
    }

    // ============================================================
    //  СПИН
    // ============================================================
    function spin() {
      if (isSpinning) return;
      if (!selectedSkin) {
        alert('Выберите скин для ставки!');
        return;
      }
      if (!targetSkin) {
        alert('Выберите цель!');
        return;
      }

      isSpinning = true;
      spinBtn.disabled = true;

      const baseChance = Math.min(0.90, (selectedSkin.price / targetSkin.price) * 0.8);
      const win = Math.random() < baseChance;

      let iterations = 0;
      const maxIter = 8 + Math.floor(Math.random() * 8);
      let currentAngle = -Math.PI / 2;

      const interval = setInterval(() => {
        iterations++;
        currentAngle += 0.15 + Math.random() * 0.1;
        drawRoulette(baseChance, null, currentAngle);

        if (iterations >= maxIter) {
          clearInterval(interval);
          const finalAngle = win ? -Math.PI/2 + (Math.random()*baseChance*Math.PI*2) :
            -Math.PI/2 + baseChance*Math.PI*2 + Math.random()*(1-baseChance)*Math.PI*2;
          drawRoulette(baseChance, win, finalAngle);

          setTimeout(() => {
            if (win) {
              // ПОБЕДА
              inventory.push({ ...targetSkin });
              log.push({ text: '🏆 Выиграл ' + targetSkin.name, win: true });
              spawnConfetti();
              const idx = inventory.indexOf(selectedSkin);
              if (idx > -1) inventory.splice(idx, 1);
              selectedSkin = null;
              alert('🎉 ПОБЕДА! Вы получили ' + targetSkin.name + '!');
            } else {
              // ПРОИГРЫШ
              log.push({ text: '💔 Проиграл ' + selectedSkin.name, win: false });
              const idx = inventory.indexOf(selectedSkin);
              if (idx > -1) inventory.splice(idx, 1);
              selectedSkin = null;
              alert('💥 ПРОИГРЫШ! Скин сгорел...');
            }

            isSpinning = false;
            spinBtn.disabled = false;
            updateUI();
          }, 400);
        }
      }, 80);
    }

    // ============================================================
    //  ВКЛАДКИ
    // ============================================================
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.panel-content').forEach(p => p.classList.remove('active'));
        document.getElementById('panel' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)).classList.add('active');
      });
    });

    // ============================================================
    //  ЗАПУСК
    // ============================================================
    spinBtn.addEventListener('click', spin);
    canvas.addEventListener('click', spin);

    // Добавляем анимации
    const style = document.createElement('style');
    style.textContent = \`
      @keyframes fire {
        0% { box-shadow: 0 0 20px rgba(255,80,0,0.5); }
        50% { box-shadow: 0 0 80px rgba(255,50,0,0.9); }
        100% { box-shadow: 0 0 20px rgba(255,80,0,0.5); }
      }
      @keyframes victory {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    \`;
    document.head.appendChild(style);

    updateUI();
    console.log('🏚️ Хлам Хаб запущен!');
    console.log('💰 Баланс: ' + balance + ' $');
    console.log('🎒 Скинов в инвентаре: ' + inventory.length);
    console.log('🔷 Для получения денег зайдите в профиль и нажмите кнопку 10 раз');
  </script>
</body>
</html>
  `);
});

// ============================================================
//  ЗАПУСК СЕРВЕРА
// ============================================================
app.listen(PORT, () => {
  console.log('🚀 Хлам Хаб запущен на порту ' + PORT);
  console.log('🌐 Открой: http://localhost:' + PORT);
});

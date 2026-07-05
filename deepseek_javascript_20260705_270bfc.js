const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

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
    <title>Хлам Хаб</title>
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
            background: rgba(16, 16, 28, 0.95);
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
        .online-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            color: #7bed9f;
            background: rgba(123,237,159,0.08);
            padding: 4px 14px;
            border-radius: 30px;
            border: 1px solid rgba(123,237,159,0.12);
        }
        .online-dot {
            width: 8px; height: 8px;
            border-radius: 50%;
            background: #7bed9f;
            animation: pulse 1.5s ease-in-out infinite;
            display: inline-block;
        }
        @keyframes pulse {
            0%,100% { opacity:1; transform:scale(1); }
            50% { opacity:0.4; transform:scale(0.8); }
        }
        .header-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .balance {
            font-size: 14px;
            color: #f5af19;
            font-weight: 600;
            background: rgba(245,175,25,0.08);
            padding: 5px 14px;
            border-radius: 30px;
            border: 1px solid rgba(245,175,25,0.12);
        }
        .profile-btn {
            background: rgba(255,255,255,0.06);
            border: none;
            color: #fff;
            padding: 5px 14px;
            border-radius: 30px;
            cursor: pointer;
            font-size: 14px;
            transition: 0.3s;
        }
        .profile-btn:hover { background: rgba(255,255,255,0.12); }
        .app { max-width: 1200px; margin: 0 auto; padding: 14px; }
        .tabs {
            display: flex;
            gap: 6px;
            background: rgba(20,20,30,0.6);
            border-radius: 12px;
            padding: 4px;
            margin-bottom: 14px;
            border: 1px solid rgba(255,255,255,0.05);
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
        .left-panel {
            flex: 0 0 180px;
            background: rgba(20,20,30,0.5);
            border-radius: 12px;
            padding: 12px;
            border: 1px solid rgba(255,255,255,0.05);
            max-height: 420px;
            overflow-y: auto;
            display: none;
        }
        .left-panel h3 {
            font-size: 11px;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }
        .left-panel .log-item {
            font-size: 11px;
            padding: 4px 0;
            border-bottom: 1px solid rgba(255,255,255,0.04);
            color: #aaa;
        }
        .left-panel .log-item.win { color: #7bed9f; }
        .left-panel .log-item.lose { color: #ff6b6b; }
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
        .top-log {
            display: none;
            background: rgba(20,20,30,0.5);
            border-radius: 12px;
            padding: 8px 12px;
            border: 1px solid rgba(255,255,255,0.05);
            max-height: 60px;
            overflow-y: auto;
            margin-bottom: 12px;
        }
        .top-log .log-item { font-size: 11px; color: #aaa; }
        .top-log .log-item.win { color: #7bed9f; }
        .top-log .log-item.lose { color: #ff6b6b; }
        .chance-text {
            margin-top: 8px;
            font-size: 13px;
            color: #888;
        }
        @media (min-width: 769px) {
            .left-panel { display: block !important; }
            .top-log { display: none !important; }
        }
        @media (max-width: 768px) {
            .left-panel { display: none !important; }
            .top-log { display: block !important; }
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
            .online-badge { font-size: 11px; padding: 2px 10px; }
            .balance { font-size: 12px; padding: 3px 10px; }
            .inventory-grid, .shop-grid { grid-template-columns: repeat(auto-fill, minmax(65px, 1fr)); }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-left">
            <span class="site-title">🏚️ Хлам Хаб</span>
            <div class="online-badge">
                <span class="online-dot"></span>
                <span id="onlineCounter">0</span> онлайн
            </div>
        </div>
        <div class="header-right">
            <span class="balance" id="balanceDisplay">💰 ∞</span>
            <button class="profile-btn" id="openProfile">👤 Профиль</button>
        </div>
    </header>
    <div class="app">
        <div class="top-log" id="topLog"></div>
        <div class="tabs">
            <button class="tab active" data-tab="inventory">🎒 Мои скины</button>
            <button class="tab" data-tab="shop">🏪 Магазин</button>
        </div>
        <div class="main-grid">
            <div class="left-panel" id="logPanel">
                <h3>📜 Кто что получил</h3>
                <div id="logList"></div>
            </div>
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
    </div>
    <script>
        // ============================================================
        //  ДАННЫЕ
        // ============================================================
        const SKINS_DB = [
            { id: 1, name: "P250 | Sand Dune", price: 0.10, icon: "🔫" },
            { id: 2, name: "SSG 08 | Acid Fade", price: 1.50, icon: "🔫" },
            { id: 3, name: "AK-47 | Redline", price: 25.0, icon: "🔫" },
            { id: 4, name: "AWP | Asiimov", price: 150.0, icon: "🔫" },
            { id: 5, name: "M4A4 | Howl", price: 1200.0, icon: "🔫" },
            { id: 6, name: "Knife | Doppler", price: 850.0, icon: "🗡️" },
            { id: 7, name: "AWP | Dragon Lore", price: 10000.0, icon: "🔫" },
            { id: 8, name: "Gloves | Crimson", price: 2500.0, icon: "🧤" },
        ];

        // Бесконечные деньги
        let balance = Infinity;
        let inventory = [
            { id: 1, name: "P250 | Sand Dune", price: 0.10, icon: "🔫" },
            { id: 2, name: "SSG 08 | Acid Fade", price: 1.50, icon: "🔫" },
            { id: 3, name: "AK-47 | Redline", price: 25.0, icon: "🔫" }
        ];
        let selectedSkin = null;
        let targetSkin = SKINS_DB[6]; // AWP Dragon Lore
        let isSpinning = false;
        let log = [];
        let totalSpins = 0;
        let wins = 0;
        let losses = 0;

        // ============================================================
        //  DOM
        // ============================================================
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
        const topLog = document.getElementById('topLog');

        // ============================================================
        //  РИСОВАНИЕ РУЛЕТКИ
        // ============================================================
        function drawRoulette(chance, isWin = null, needleAngle = null) {
            const w = canvas.width, h = canvas.height;
            const cx = w/2, cy = h/2, radius = w/2 - 20;
            ctx.clearRect(0, 0, w, h);
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
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, endAngle, startAngle + Math.PI*2);
            ctx.closePath();
            ctx.fillStyle = 'rgba(40,40,60,0.5)';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI*2);
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.lineWidth = 2;
            ctx.stroke();
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
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 28px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(Math.round(chance*100)+'%', cx, cy-10);
            ctx.font = '12px Arial';
            ctx.fillStyle = '#888';
            ctx.fillText('шанс', cx, cy+22);
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
            // Баланс (бесконечность)
            balanceDisplay.textContent = '💰 ∞';

            // Инвентарь
            inventoryGrid.innerHTML = '';
            if (inventory.length === 0) {
                inventoryGrid.innerHTML = '<div style="color:#666;grid-column:1/-1;text-align:center;padding:20px;">Инвентарь пуст</div>';
            } else {
                inventory.forEach((skin, idx) => {
                    const div = document.createElement('div');
                    div.className = 'inventory-item';
                    div.innerHTML = `
                        <div class="icon">${skin.icon}</div>
                        <div class="name">${skin.name}</div>
                        <div class="price">$${skin.price.toFixed(2)}</div>
                        <button class="select-btn" data-idx="${idx}">Выбрать</button>
                    `;
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
                div.innerHTML = `
                    <div class="icon">${skin.icon}</div>
                    <div class="name">${skin.name}</div>
                    <div class="price">$${skin.price.toFixed(2)}</div>
                    <button class="buy-btn" data-id="${skin.id}">Купить</button>
                `;
                div.querySelector('.buy-btn').addEventListener('click', () => {
                    if (isSpinning) return;
                    // Бесконечные деньги — покупаем бесплатно
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
                div.innerHTML = `
                    <span>${skin.icon} ${skin.name}</span>
                    <span class="t-price">$${skin.price.toFixed(2)}</span>
                `;
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
                leftSkinBox.innerHTML = `
                    <span class="icon">${selectedSkin.icon}</span>
                    <div class="name">${selectedSkin.name}</div>
                    <div class="price">$${selectedSkin.price.toFixed(2)}</div>
                `;
            } else {
                leftSkinBox.innerHTML = `
                    <span class="icon">🔫</span>
                    <div class="name">Выберите скин</div>
                    <div class="price">$0</div>
                `;
            }

            if (targetSkin) {
                rightSkinBox.innerHTML = `
                    <span class="icon">${targetSkin.icon}</span>
                    <div class="name">${targetSkin.name}</div>
                    <div class="price">$${targetSkin.price.toFixed(2)}</div>
                `;
            }

            // Лог
            logList.innerHTML = '';
            log.slice(-15).forEach(entry => {
                const div = document.createElement('div');
                div.className = 'log-item ' + (entry.win ? 'win' : 'lose');
                div.textContent = entry.text;
                logList.appendChild(div);
            });

            // Топ-лог (для телефона)
            topLog.innerHTML = '';
            log.slice(-5).forEach(entry => {
                const div = document.createElement('div');
                div.className = 'log-item ' + (entry.win ? 'win' : 'lose');
                div.textContent = entry.text;
                topLog.appendChild(div);
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
        //  КОНФЕТТИ (салют)
        // ============================================================
        function spawnConfetti() {
            const container = document.createElement('div');
            container.id = 'confetti-container';
            container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999;overflow:hidden;';
            document.body.appendChild(container);
            const colors = ['#f5af19','#f12711','#7bed9f','#74b9ff','#fd79a8','#a29bfe','#fdcb6e'];
            for (let i=0; i<80; i++) {
                const el = document.createElement('div');
                el.style.cssText = `
                    position:absolute;
                    left:${Math.random()*100}%;
                    top:-5%;
                    width:${6+Math.random()*8}px;
                    height:${6+Math.random()*8}px;
                    background:${colors[Math.floor(Math.random()*colors.length)]};
                    border-radius:${Math.random()>0.5?'50%':'2px'};
                    animation: confettiFall ${1.5+Math.random()*2}s linear forwards;
                    animation-delay:${Math.random()*0.8}s;
                    transform:rotate(${Math.random()*360}deg);
                `;
                container.appendChild(el);
            }
            // Добавляем ключевые кадры для конфетти
            if (!document.getElementById('confettiStyle')) {
                const style = document.createElement('style');
                style.id = 'confettiStyle';
                style.textContent = `
                    @keyframes confettiFall {
                        0% { transform: translateY(-10vh) rotate(0deg) scale(0); opacity: 1; }
                        100% { transform: translateY(110vh) rotate(720deg) scale(1); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            setTimeout(() => container.remove(), 4000);
        }

        // ============================================================
        //  СПИН (рулетка)
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
                            document.querySelector('.center-panel').classList.add('victory');
                            setTimeout(() => {
                                document.querySelector('.center-panel').classList.remove('victory');
                            }, 900);
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
                            document.querySelector('.center-panel').classList.add('burning');
                            setTimeout(() => {
                                document.querySelector('.center-panel').classList.remove('burning');
                            }, 1500);
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
        style.textContent = `
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
            .burning { animation: fire 0.5s ease-in-out 3; }
            .victory { animation: victory 0.3s ease-in-out 3; }
        `;
        document.head.appendChild(style);

        updateUI();
        console.log('🏚️ Хлам Хаб запущен!');
        console.log('💰 Деньги бесконечны!');

        // Симуляция онлайна
        let online = 0;
        setInterval(() => {
            online = Math.floor(Math.random() * 15) + 3;
            document.getElementById('onlineCounter').textContent = online;
        }, 5000);
    </script>
</body>
</html>
    `);
});

// ============================================================
//  ЗАПУСК
// ============================================================

app.listen(PORT, () => {
    console.log(`🚀 Хлам Хаб запущен на порту ${PORT}`);
    console.log(`🌐 Открой: http://localhost:${PORT}`);
});
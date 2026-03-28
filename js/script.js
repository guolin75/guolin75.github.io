const conversionData = {
    length: {
        title: '📐 長度',
        baseUnit: 'm',
        units: {
            m: { name: '公尺 / 米 (m)', rate: 1 },
            cm: { name: '公分 / 厘米 (cm)', rate: 100 },
            mm: { name: '毫米 (mm)', rate: 1000 },
            km: { name: '公里 (km)', rate: 0.001 },
            in: { name: '英吋 (in)', rate: 39.3700787 },
            ft: { name: '英呎 (ft)', rate: 3.2808399 },
            yd: { name: '碼 (yd)', rate: 1.0936133 },
            mi: { name: '英哩 (mi)', rate: 0.000621371 },
            tw_chi: { name: '台尺', rate: 3.3 },
            tw_tsun: { name: '台寸', rate: 33 }
        }
    },
    weight: {
        title: '⚖️ 重量',
        baseUnit: 'kg',
        units: {
            kg: { name: '公斤 (kg)', rate: 1 },
            g: { name: '公克 (g)', rate: 1000 },
            t: { name: '公噸 (t)', rate: 0.001 },
            lb: { name: '磅 (lb)', rate: 2.20462262 },
            oz: { name: '盎司 (oz)', rate: 35.2739619 },
            tw_jin: { name: '台斤', rate: 1 / 0.6 },
            tw_liang: { name: '台兩', rate: 16 / 0.6 }
        }
    },
    area: {
        title: '🔲 面積',
        baseUnit: 'm2',
        units: {
            m2: { name: '平方公尺 (m²)', rate: 1 },
            km2: { name: '平方公里 (km²)', rate: 0.000001 },
            ha: { name: '公頃 (ha)', rate: 0.0001 },
            ping: { name: '坪', rate: 0.3025 },
            jia: { name: '甲', rate: 1 / 9699.17 },
            acre: { name: '英畝 (acre)', rate: 0.000247105 },
            ft2: { name: '平方英呎 (ft²)', rate: 10.7639104 }
        }
    },
    volume: {
        title: '🧊 體積',
        baseUnit: 'L',
        units: {
            L: { name: '公升 (L)', rate: 1 },
            mL: { name: '毫升 (mL)', rate: 1000 },
            m3: { name: '立方公尺 (m³)', rate: 0.001 },
            gal: { name: '加侖 (gal)', rate: 0.264172 },
            pt: { name: '品脫 (pt)', rate: 2.113376 }
        }
    },
    speed: {
        title: '🚀 速度',
        baseUnit: 'ms',
        units: {
            ms: { name: '公尺/秒 (m/s)', rate: 1 },
            kmh: { name: '公里/小時 (km/h)', rate: 3.6 },
            mph: { name: '英哩/小時 (mph)', rate: 2.236936 },
            mach: { name: '馬赫 (Mach)', rate: 1 / 340.3 },
            knot: { name: '節 (knot)', rate: 1.943844 }
        }
    },
    pressure: {
        title: '🌪️ 壓力',
        baseUnit: 'Pa',
        units: {
            Pa: { name: '帕斯卡 (Pa)', rate: 1 },
            hPa: { name: '百帕 (hPa)', rate: 0.01 },
            bar: { name: '巴 (bar)', rate: 0.00001 },
            atm: { name: '標準大氣壓 (atm)', rate: 1 / 101325 },
            mmHg: { name: '毫米汞柱 (mmHg)', rate: 1 / 133.322 },
            psi: { name: '磅力/平方英寸 (psi)', rate: 0.0001450377 }
        }
    }
};

const temperatureData = {
    title: '🌡️ 溫度',
    units: {
        C: { name: '攝氏 (°C)' },
        F: { name: '華氏 (°F)' },
        K: { name: '克氏 (K)' }
    }
};

function formatValue(value) {
    if (value === 0) return 0;
    // 將計算結果四捨五入到極小位數，避免 JavaScript 浮點數誤差
    // 若數值極小使用科學記號或多保留一些小數
    const rounded = Math.round(value * 1e8) / 1e8;
    // 移除不必要的 .0000
    return rounded.toString();
}

function renderCards() {
    const grid = document.getElementById('converter-grid');
    
    // 渲染一般匯率換算的卡片
    for (const [catKey, catData] of Object.entries(conversionData)) {
        const card = document.createElement('div');
        card.className = 'card glass-panel';
        
        let html = `<h2 class="card-title">${catData.title}</h2><div class="input-group">`;
        
        for (const [unitKey, unitData] of Object.entries(catData.units)) {
            html += `
                <div class="input-wrapper">
                    <label for="${catKey}-${unitKey}">${unitData.name}</label>
                    <input type="number" id="${catKey}-${unitKey}" data-cat="${catKey}" data-unit="${unitKey}" class="unit-input standard-unit" placeholder="0" step="any">
                </div>
            `;
        }
        
        html += `</div>`;
        card.innerHTML = html;
        grid.appendChild(card);
    }

    // 渲染溫度卡片 (計算邏輯不同，獨立處理)
    const tempCard = document.createElement('div');
    tempCard.className = 'card glass-panel';
    let tempHtml = `<h2 class="card-title">${temperatureData.title}</h2><div class="input-group">`;
    for (const [unitKey, unitData] of Object.entries(temperatureData.units)) {
        tempHtml += `
            <div class="input-wrapper">
                <label for="temp-${unitKey}">${unitData.name}</label>
                <input type="number" id="temp-${unitKey}" data-unit="${unitKey}" class="unit-input temp-unit" placeholder="0" step="any">
            </div>
        `;
    }
    tempHtml += `</div>`;
    tempCard.innerHTML = tempHtml;
    grid.appendChild(tempCard);
}

function handleStandardConversion(e) {
    const inputField = e.target;
    const catOuterKey = inputField.dataset.cat;
    const unitInnerKey = inputField.dataset.unit;
    
    if (inputField.value === '') {
        clearCategory(catOuterKey);
        return;
    }

    const value = parseFloat(inputField.value);
    if (isNaN(value)) {
        clearCategory(catOuterKey);
        return;
    }
    
    const category = conversionData[catOuterKey];
    const rateToBase = category.units[unitInnerKey].rate;
    
    // 先換算成該大區的標準基準單位 (baseUnit)
    const baseValue = value / rateToBase;

    // 再將基準單位換算成該大區所有其他單位
    for (const [uKey, uData] of Object.entries(category.units)) {
        if (uKey !== unitInnerKey) {
            const targetInput = document.getElementById(`${catOuterKey}-${uKey}`);
            const convertedValue = baseValue * uData.rate;
            targetInput.value = formatValue(convertedValue);
        }
    }
}

function handleTemperatureConversion(e) {
    const inputField = e.target;
    
    if (inputField.value === '') {
        ['C', 'F', 'K'].forEach(u => {
            if(u !== inputField.dataset.unit) {
                document.getElementById(`temp-${u}`).value = '';
            }
        });
        return;
    }

    const value = parseFloat(inputField.value);
    if (isNaN(value)) return;

    const unitKey = inputField.dataset.unit;
    let tempC = 0;
    
    // 先統一轉為攝氏(Celsius)
    if (unitKey === 'C') {
        tempC = value;
    } else if (unitKey === 'F') {
        tempC = (value - 32) * 5 / 9;
    } else if (unitKey === 'K') {
        tempC = value - 273.15;
    }

    // 再將攝氏轉為其他單位並更新
    if (unitKey !== 'C') {
        document.getElementById('temp-C').value = formatValue(tempC);
    }
    if (unitKey !== 'F') {
        const tempF = tempC * 9 / 5 + 32;
        document.getElementById('temp-F').value = formatValue(tempF);
    }
    if (unitKey !== 'K') {
        const tempK = tempC + 273.15;
        document.getElementById('temp-K').value = formatValue(tempK);
    }
}

function clearCategory(catOuterKey) {
    const inputs = document.querySelectorAll(`input[data-cat="${catOuterKey}"]`);
    inputs.forEach(input => input.value = '');
}

function init() {
    renderCards();
    
    // 綁定事件監聽
    document.querySelectorAll('.standard-unit').forEach(input => {
        input.addEventListener('input', handleStandardConversion);
    });
    
    document.querySelectorAll('.temp-unit').forEach(input => {
        input.addEventListener('input', handleTemperatureConversion);
    });
}

// 當 DOM 載入完成即執行初始化
document.addEventListener('DOMContentLoaded', init);

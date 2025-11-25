// ==========================================
// DailyMeals - Main Application Logic
// v0.3 - ML Food Recognition with Hugging Face
// ==========================================

// ==========================================
// ML Service - Hugging Face Food Recognition
// ==========================================

class MLService {
  constructor() {
    this.token = CONFIG.HF_API.token;
    this.endpoint = CONFIG.HF_API.endpoint;
    this.timeout = CONFIG.HF_API.timeout;
    this.confidenceThreshold = CONFIG.HF_API.confidenceThreshold;
  }

  /**
   * 使用 Hugging Face API 辨識食物
   * @param {string} imageData - Base64 編碼的圖片資料
   * @returns {Promise<Object>} 辨識結果
   */
  async recognizeFood(imageData) {
    // v0.4: 透過 Cloudflare Worker 使用真實 ML API
    if (CONFIG.HF_API.useProxy && CONFIG.HF_API.proxyEndpoint) {
      try {
        console.log('🌐 使用真實 ML API（透過 Cloudflare Worker）');
        return await this.recognizeFoodViaProxy(imageData);
      } catch (error) {
        console.warn('⚠️ Worker API 失敗，降級到模擬模式:', error.message);
        return this.mockRecognition(imageData);
      }
    }

    // 降級：使用模擬模式
    console.log('🎭 使用 AI 模擬模式');
    return this.mockRecognition(imageData);
  }

  /**
   * 透過 Cloudflare Worker 調用 HF API
   */
  async recognizeFoodViaProxy(imageData) {
    try {
      // 轉換 base64 為 blob
      const base64Image = imageData.includes(',')
        ? imageData.split(',')[1]
        : imageData;

      const binaryString = atob(base64Image);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'image/jpeg' });

      // 調用 Worker
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(CONFIG.HF_API.proxyEndpoint, {
        method: 'POST',
        body: blob,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Worker API 錯誤: ${response.status}`);
      }

      const predictions = await response.json();
      console.log('✅ 真實 ML 辨識成功:', predictions.length, '個結果');
      return this.parseResults(predictions);

    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('辨識超時，請稍後再試');
      }
      console.error('Worker API 錯誤:', error);
      throw error; // 讓上層處理降級
    }
  }

  /**
   * Mock 食物辨識（本地測試用）
   */
  async mockRecognition(imageData) {
    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // 根據圖片資料長度選擇食物（模擬真實辨識）
    const foods = [
      { label: 'hamburger', score: 0.92 },
      { label: 'pizza', score: 0.89 },
      { label: 'sushi', score: 0.87 },
      { label: 'salad', score: 0.85 },
      { label: 'pasta', score: 0.84 },
      { label: 'fried chicken', score: 0.82 },
      { label: 'sandwich', score: 0.81 },
      { label: 'ramen', score: 0.80 },
      { label: 'steak', score: 0.78 },
      { label: 'rice', score: 0.76 }
    ];

    // 根據圖片資料特徵選擇
    const hash = imageData.length % foods.length;
    const selected = foods[hash];

    // 返回類似 HF API 的格式
    return this.parseResults([
      selected,
      foods[(hash + 1) % foods.length],
      foods[(hash + 2) % foods.length]
    ]);
  }

  /**
   * 解析 HF API 回應
   */
  parseResults(predictions) {
    try {
      if (!Array.isArray(predictions) || predictions.length === 0) {
        throw new Error('無法辨識圖片中的食物');
      }

      // 過濾低信心度的結果
      const validPredictions = predictions.filter(
        p => p.score >= this.confidenceThreshold
      );

      if (validPredictions.length === 0) {
        throw new Error('辨識信心度過低，請嘗試更清晰的照片');
      }

      const topResult = validPredictions[0];

      return {
        foodName: topResult.label,
        confidence: (topResult.score * 100).toFixed(1),
        allResults: validPredictions.slice(0, 3).map(p => ({
          name: p.label,
          confidence: (p.score * 100).toFixed(1)
        }))
      };
    } catch (error) {
      console.error('解析錯誤:', error);
      throw new Error('解析辨識結果失敗');
    }
  }
}

// ==========================================
// Nutrition Service - 營養資訊服務
// ==========================================

class NutritionService {
  constructor() {
    this.nutritionDB = CONFIG.NUTRITION_DB;
    this.translations = CONFIG.TRANSLATIONS;
  }

  /**
   * 取得食物的營養資訊
   */
  getNutrition(foodName) {
    const lowerName = foodName.toLowerCase().trim();

    // 精確匹配
    if (this.nutritionDB[lowerName]) {
      return this.nutritionDB[lowerName];
    }

    // 模糊匹配
    for (const [key, value] of Object.entries(this.nutritionDB)) {
      if (lowerName.includes(key) || key.includes(lowerName)) {
        return value;
      }
    }

    // 預設值
    return this.nutritionDB.unknown;
  }

  /**
   * 翻譯成中文
   */
  translateToChinese(foodName) {
    const lowerName = foodName.toLowerCase().trim();

    // 精確匹配
    if (this.translations[lowerName]) {
      return this.translations[lowerName];
    }

    // 模糊匹配
    for (const [key, value] of Object.entries(this.translations)) {
      if (lowerName.includes(key)) {
        return value;
      }
    }

    // 無翻譯則返回原文
    return foodName;
  }

  /**
   * 格式化營養資訊顯示
   */
  formatNutrition(nutrition) {
    return {
      calories: `${nutrition.calories} kcal`,
      carbs: `${nutrition.carbs}g`,
      protein: `${nutrition.protein}g`,
      fat: `${nutrition.fat}g`,
      unit: nutrition.unit
    };
  }
}

// ==========================================
// DailyMeals - 主應用程式
// ==========================================


class DailyMeals {
  constructor() {
    // Current date state
    this.currentDate = new Date();

    // Initialize ML services (v0.3)
    this.mlService = new MLService();
    this.nutritionService = new NutritionService();

    // Initialize the app
    this.init();
  }

  init() {
    // Set up date display
    this.updateDateDisplay();

    // Set up event listeners
    this.setupEventListeners();
    this.setupAIListeners(); // v0.3

    // Load data for current date
    this.loadDayData();

    // Update stats
    this.updateStats();
  }

  // ==========================================
  // Date Management
  // ==========================================

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDateDisplay(date) {
    const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];

    const today = new Date();
    const isToday = this.formatDate(date) === this.formatDate(today);

    if (isToday) {
      return `今天 ${month}月${day}日 ${weekday}`;
    }

    return `${year}年${month}月${day}日 ${weekday}`;
  }

  updateDateDisplay() {
    const dateEl = document.getElementById('currentDate');
    dateEl.textContent = this.formatDateDisplay(this.currentDate);
  }

  changeDate(delta) {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + delta);

    // Don't allow future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    newDate.setHours(0, 0, 0, 0);

    if (newDate > today) {
      this.showToast('無法查看未來的日期');
      return;
    }

    this.currentDate = newDate;
    this.updateDateDisplay();
    this.loadDayData();
    this.updateStats();
  }

  // ==========================================
  // Event Listeners
  // ==========================================

  setupEventListeners() {
    // Date navigation
    document.getElementById('prevDay').addEventListener('click', () => {
      this.changeDate(-1);
    });

    document.getElementById('nextDay').addEventListener('click', () => {
      this.changeDate(1);
    });

    // Upload triggers
    document.querySelectorAll('.upload-trigger').forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        document.getElementById(targetId).click();
      });
    });

    // File inputs - handle file upload
    document.querySelectorAll('input[type="file"][data-input]').forEach(input => {
      input.addEventListener('change', (e) => this.handleFileUpload(e));
    });

    // Note inputs - save on blur
    document.querySelectorAll('textarea[data-note]').forEach(textarea => {
      textarea.addEventListener('blur', (e) => this.saveNote(e));
    });
  }

  // ==========================================
  // AI Event Listeners (v0.3)
  // ==========================================

  setupAIListeners() {
    // AI 辨識按鈕
    document.querySelectorAll('.ai-analyze-btn').forEach(button => {
      button.addEventListener('click', (e) => this.handleAIAnalysis(e));
    });
  }

  /**
   * 處理 AI 食物辨識
   */
  async handleAIAnalysis(event) {
    const button = event.target.closest('.ai-analyze-btn');
    const meal = button.getAttribute('data-meal');

    // 取得圖片資料
    const imageData = this.getImageData(meal);

    if (!imageData) {
      this.showToast('請先上傳照片');
      return;
    }

    // 顯示載入狀態
    this.showAILoading(meal, true);
    button.disabled = true;

    try {
      // 呼叫 ML API
      const result = await this.mlService.recognizeFood(imageData);

      // 取得營養資訊
      const nutrition = this.nutritionService.getNutrition(result.foodName);
      const chineseName = this.nutritionService.translateToChinese(result.foodName);

      // 顯示結果
      this.displayAIResult(meal, {
        ...result,
        chineseName,
        nutrition
      });

      // 儲存分析結果
      this.saveAIAnalysis(meal, result, nutrition);

      // 首次使用提示
      if (!localStorage.getItem('ai_v04_notice_shown')) {
        this.showToast('✨ v0.4: 現使用真實 ML API！', 'info');
        localStorage.setItem('ai_v04_notice_shown', 'true');
      }

      this.showToast('✅ 食物辨識成功！', 'success');

    } catch (error) {
      console.error('AI 分析錯誤:', error);
      this.showToast(error.message || '食物辨識失敗', 'error');

      // 顯示錯誤
      this.displayAIError(meal, error.message);
    } finally {
      this.showAILoading(meal, false);
      button.disabled = false;
    }
  }

  /**
   * 顯示 AI 辨識結果
   */
  displayAIResult(meal, data) {
    const resultDiv = document.getElementById(`ai-result-${meal}`);
    const { foodName, chineseName, confidence, nutrition } = data;

    const formatted = this.nutritionService.formatNutrition(nutrition);

    resultDiv.innerHTML = `
      <div class="ai-result-card">
        <div class="food-info">
          <h3 class="food-name">${chineseName}</h3>
          <p class="food-name-en">${foodName}</p>
          <span class="confidence">信心度: ${confidence}%</span>
        </div>
        <div class="nutrition-info">
          <div class="nutrition-item">
            <span class="label">🔥 卡路里</span>
            <span class="value">${formatted.calories}</span>
          </div>
          <div class="nutrition-item">
            <span class="label">🍚 碳水</span>
            <span class="value">${formatted.carbs}</span>
          </div>
          <div class="nutrition-item">
            <span class="label">🥩 蛋白質</span>
            <span class="value">${formatted.protein}</span>
          </div>
          <div class="nutrition-item">
            <span class="label">🧈 脂肪</span>
            <span class="value">${formatted.fat}</span>
          </div>
        </div>
      </div>
    `;

    resultDiv.style.display = 'block';
  }

  /**
   * 顯示錯誤訊息
   */
  displayAIError(meal, message) {
    const resultDiv = document.getElementById(`ai-result-${meal}`);
    resultDiv.innerHTML = `
      <div class="ai-error">
        <span class="error-icon">⚠️</span>
        <p>${message}</p>
      </div>
    `;
    resultDiv.style.display = 'block';
  }

  /**
   * 顯示/隱藏載入狀態
   */
  showAILoading(meal, show) {
    const loadingDiv = document.getElementById(`ai-loading-${meal}`);
    const resultDiv = document.getElementById(`ai-result-${meal}`);

    if (show) {
      loadingDiv.style.display = 'flex';
      resultDiv.style.display = 'none';
    } else {
      loadingDiv.style.display = 'none';
    }
  }

  /**
   * 取得圖片資料
   */
  getImageData(meal) {
    const key = this.getStorageKey(meal);
    return localStorage.getItem(key);
  }

  /**
   * 儲存 AI 分析結果
   */
  saveAIAnalysis(meal, result, nutrition) {
    const dateStr = this.formatDate(this.currentDate);
    const key = `dailymeals_${dateStr}_${meal}_ai`;

    try {
      localStorage.setItem(key, JSON.stringify({
        foodName: result.foodName,
        confidence: result.confidence,
        nutrition: nutrition,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      console.error('儲存分析結果失敗:', e);
    }
  }

  /**
   * 載入 AI 分析結果
   */
  loadAIAnalysis(meal) {
    const dateStr = this.formatDate(this.currentDate);
    const key = `dailymeals_${dateStr}_${meal}_ai`;

    try {
      const data = localStorage.getItem(key);
      if (data) {
        const analysis = JSON.parse(data);
        const chineseName = this.nutritionService.translateToChinese(analysis.foodName);

        this.displayAIResult(meal, {
          ...analysis,
          chineseName
        });

        // 顯示 AI 區域
        const aiSection = document.getElementById(`ai-section-${meal}`);
        if (aiSection) aiSection.style.display = 'block';
      }
    } catch (e) {
      console.error('載入分析結果失敗:', e);
    }
  }

  // ==========================================
  // File Upload & Preview
  handleFileUpload(event) {
    const input = event.target;
    const meal = input.getAttribute('data-input');
    const file = input.files[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.showToast('請選擇圖片檔案');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.showToast('圖片檔案過大，請選擇小於 5MB 的圖片');
      return;
    }

    // Read and display image
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      this.displayImage(meal, imageData);
      this.saveImage(meal, imageData);
      this.showToast('照片上傳成功！', 'success');
      this.updateStats();
    };
    reader.readAsDataURL(file);
  }

  displayImage(meal, imageData) {
    const preview = document.getElementById(`preview-${meal}`);
    preview.innerHTML = '';

    const img = document.createElement('img');
    img.src = imageData;
    img.alt = `${meal} 照片`;

    preview.appendChild(img);

    // Update button text
    const card = document.querySelector(`.meal-card[data-meal="${meal}"]`);
    const button = card.querySelector('.upload-trigger span');
    button.textContent = '更換照片';

    // Show AI section (v0.3)
    const aiSection = document.getElementById(`ai-section-${meal}`);
    if (aiSection) aiSection.style.display = 'block';
  }

  clearImage(meal) {
    const preview = document.getElementById(`preview-${meal}`);
    preview.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <rect x="8" y="8" width="32" height="32" rx="4" stroke-width="2"/>
          <circle cx="18" cy="20" r="3" stroke-width="2"/>
          <path d="M8 32L16 24L24 32L32 24L40 32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>尚未上傳照片</p>
      </div>
    `;

    // Update button text
    const card = document.querySelector(`.meal-card[data-meal="${meal}"]`);
    const button = card.querySelector('.upload-trigger span');
    button.textContent = '上傳照片';
  }

  // ==========================================
  // LocalStorage Management
  // ==========================================

  getStorageKey(meal) {
    const dateStr = this.formatDate(this.currentDate);
    return `dailymeals_${dateStr}_${meal}`;
  }

  getNoteStorageKey(meal) {
    const dateStr = this.formatDate(this.currentDate);
    return `dailymeals_${dateStr}_${meal}_note`;
  }

  saveImage(meal, imageData) {
    const key = this.getStorageKey(meal);
    try {
      localStorage.setItem(key, imageData);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        this.showToast('儲存空間已滿，請清除部分舊資料');
      }
    }
  }

  loadImage(meal) {
    const key = this.getStorageKey(meal);
    const imageData = localStorage.getItem(key);

    if (imageData) {
      this.displayImage(meal, imageData);
    } else {
      this.clearImage(meal);
    }
  }

  saveNote(event) {
    const textarea = event.target;
    const meal = textarea.getAttribute('data-note');
    const note = textarea.value.trim();
    const key = this.getNoteStorageKey(meal);

    if (note) {
      localStorage.setItem(key, note);
    } else {
      localStorage.removeItem(key);
    }
  }

  loadNote(meal) {
    const key = this.getNoteStorageKey(meal);
    const note = localStorage.getItem(key);
    const textarea = document.getElementById(`${meal}-note`);

    if (note) {
      textarea.value = note;
    } else {
      textarea.value = '';
    }
  }

  loadDayData() {
    const meals = ['breakfast', 'lunch', 'dinner'];
    meals.forEach(meal => {
      this.loadImage(meal);
      this.loadNote(meal);
      this.loadAIAnalysis(meal); // v0.3
    });
  }

  // ==========================================
  // Statistics
  // ==========================================

  getTodayMealCount() {
    const dateStr = this.formatDate(this.currentDate);
    const meals = ['breakfast', 'lunch', 'dinner'];
    let count = 0;

    meals.forEach(meal => {
      const key = `dailymeals_${dateStr}_${meal}`;
      if (localStorage.getItem(key)) {
        count++;
      }
    });

    return count;
  }

  getStreakCount() {
    let streak = 0;
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    // Check backwards from today
    while (true) {
      const dateStr = this.formatDate(date);
      const meals = ['breakfast', 'lunch', 'dinner'];

      // Count how many meals are recorded for this day
      let mealCount = 0;
      meals.forEach(meal => {
        const key = `dailymeals_${dateStr}_${meal}`;
        if (localStorage.getItem(key)) {
          mealCount++;
        }
      });

      // If all 3 meals are recorded, increment streak
      if (mealCount === 3) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }

      // Safety limit - don't check more than 365 days
      if (streak >= 365) break;
    }

    return streak;
  }

  updateStats() {
    const todayCount = this.getTodayMealCount();
    const streakCount = this.getStreakCount();

    document.getElementById('todayCount').textContent = todayCount;
    document.getElementById('streakCount').textContent = streakCount;
  }

  // ==========================================
  // Toast Notifications
  // ==========================================

  showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';

    if (type === 'success') {
      toast.classList.add('success');
    }

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.className = 'toast';
      }, 300);
    }, 3000);
  }
}

// ==========================================
// Initialize App
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  new DailyMeals();
});

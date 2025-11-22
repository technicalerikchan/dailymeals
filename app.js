// ==========================================
// DailyMeals - Main Application Logic
// ==========================================

class DailyMeals {
  constructor() {
    // Current date state
    this.currentDate = new Date();
    
    // Initialize the app
    this.init();
  }
  
  init() {
    // Set up date display
    this.updateDateDisplay();
    
    // Set up event listeners
    this.setupEventListeners();
    
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
    
    // File inputs
    document.querySelectorAll('input[type="file"][data-input]').forEach(input => {
      input.addEventListener('change', (e) => this.handleFileUpload(e));
    });
    
    // Note inputs - save on blur
    document.querySelectorAll('textarea[data-note]').forEach(textarea => {
      textarea.addEventListener('blur', (e) => this.saveNote(e));
    });
  }
  
  // ==========================================
  // File Upload & Preview
  // ==========================================
  
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

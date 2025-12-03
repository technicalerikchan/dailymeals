# DailyMeals 專案手冊 v0.4.1

**完整的專案繼承與開發指南**

---

## 📋 目錄

1. [專案概述](#專案概述)
2. [技術架構](#技術架構)
3. [環境設置](#環境設置)
4. [代碼結構](#代碼結構)
5. [開發工作流程](#開發工作流程)
6. [部署指南](#部署指南)
7. [API 文檔](#api-文檔)
8. [未來開發計劃](#未來開發計劃)
9. [故障排除](#故障排除)
10. [維護指南](#維護指南)

---

## 專案概述

### 什麼是 DailyMeals？

DailyMeals 是一個**智能飲食記錄 Web 應用**，讓用戶能夠：
- 📸 記錄每日三餐照片（早餐、午餐、晚餐）
- 🤖 使用 AI 自動辨識食物
- 📊 查看營養資訊（卡路里、蛋白質、碳水、脂肪）
- 📅 瀏覽歷史記錄
- 💬 添加每餐備註

### 專案目標

**核心價值**：
- 簡單：無需註冊，直接使用
- 優雅：現代化 UI 設計
- 智能：AI 食物辨識
- 隱私：本地儲存，無伺服器

### 當前狀態

**版本**：v0.4.1  
**完成度**：85%  
**狀態**：功能完整，ML API 待修復

**已實作功能**：
- ✅ 照片上傳與預覽
- ✅ 日期導航
- ✅ localStorage 資料持久化
- ✅ AI 辨識 UI（Mock 模式運作）
- ✅ 營養資訊顯示
- ✅ 響應式設計
- ✅ Cloudflare Worker API 代理

**待修復**：
- ⚠️ HuggingFace API 410 錯誤
- ⚠️ 真實 ML 辨識功能

---

## 技術架構

### 技術棧

**前端**：
- HTML5, CSS3, Vanilla JavaScript
- 無框架（純前端）
- localStorage 資料儲存
- Google Fonts (Inter)

**後端**：
- Cloudflare Workers (API 代理)
- Serverless 架構
- 免費層級

**ML 服務**：
- HuggingFace Inference API
- Model: Kaludi/food-category-classification-v2.0
- 備用：Mock 模式

**部署**：
- GitHub Pages (前端)
- Cloudflare Workers (API)

### 架構圖

```
┌─────────────────────────────────────────┐
│         用戶瀏覽器                       │
│  ┌──────────────────────────────────┐  │
│  │   DailyMeals Web App             │  │
│  │   (HTML + CSS + JS)              │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
└─────────────────┼───────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
┌─────────────────┐  ┌──────────────────┐
│  localStorage   │  │ Cloudflare Worker│
│  (資料儲存)      │  │  (API 代理)      │
└─────────────────┘  └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │ HuggingFace API  │
                     │  (ML 辨識)       │
                     └──────────────────┘
```

### 資料流程

#### 1. 照片上傳流程
```
用戶選擇照片 
→ File API 讀取
→ 轉換為 Base64
→ 顯示預覽
→ 儲存到 localStorage
→ 顯示 AI 按鈕
```

#### 2. AI 辨識流程
```
用戶點擊 AI 按鈕
→ 顯示 loading
→ 從 localStorage 讀取圖片
→ 轉換為 Blob
→ 發送到 Cloudflare Worker
→ Worker 轉發到 HF API
→ 解析結果
→ 查詢營養資料庫
→ 翻譯中文
→ 顯示結果
→ 儲存到 localStorage
```

#### 3. 資料儲存結構

**localStorage keys**：
```
dailymeals_YYYY-MM-DD_breakfast_image  // Base64 圖片
dailymeals_YYYY-MM-DD_breakfast_note   // 備註文字
dailymeals_YYYY-MM-DD_breakfast_ai     // AI 辨識結果

dailymeals_YYYY-MM-DD_lunch_image
dailymeals_YYYY-MM-DD_lunch_note
dailymeals_YYYY-MM-DD_lunch_ai

dailymeals_YYYY-MM-DD_dinner_image
dailymeals_YYYY-MM-DD_dinner_note
dailymeals_YYYY-MM-DD_dinner_ai
```

**AI 辨識結果格式**：
```json
{
  "foodName": "pizza",
  "chineseName": "披薩",
  "confidence": 0.89,
  "nutrition": {
    "calories": 266,
    "protein": 11,
    "carbs": 33,
    "fat": 10
  }
}
```

---

## 環境設置

### 前置需求

**必需**：
- Node.js 18+ (用於 Wrangler CLI)
- Git
- 現代瀏覽器 (Chrome, Firefox, Safari)

**選配**：
- Visual Studio Code
- Python 3 (用於本地 http server)

### 快速開始

#### 1. Clone 專案

```bash
git clone https://github.com/technicalerikchan/dailymeals.git
cd dailymeals
```

#### 2. 本地運行

**方法 A：Python**
```bash
python3 -m http.server 8080
```

**方法 B：Node.js**
```bash
npx http-server -p 8080
```

**方法 C：VS Code Live Server**
- 安裝 Live Server 擴充
- 右鍵 index.html → Open with Live Server

訪問：http://localhost:8080

#### 3. 設置 Cloudflare Worker（選配）

**安裝 Wrangler**：
```bash
npm install -g wrangler
```

**登入 Cloudflare**：
```bash
cd dailymeals-api
wrangler login
```

**部署 Worker**：
```bash
wrangler deploy
```

**設定 HF Token**：
```bash
wrangler secret put HF_TOKEN
# 輸入您的 HuggingFace token
```

#### 4. 更新前端配置

編輯 `config.js`：
```javascript
ML_API: {
  useProxy: true,
  proxyEndpoint: 'https://your-worker.workers.dev',
  ...
}
```

---

## 代碼結構

### 檔案組織

```
dailymeals/
├── index.html              # 主頁面
├── style.css              # 全局樣式
├── app.js                 # 主應用邏輯
├── config.js              # 配置文件
├── README.md              # 專案說明
├── PROJECT_HANDBOOK.md    # 本文件
└── test_upload.html       # 測試頁面

dailymeals-api/            # Worker 目錄
├── worker.js              # Worker 代碼
├── wrangler.toml          # Worker 配置
└── README.md              # Worker 說明
```

### 核心文件說明

#### index.html

**結構**：
```html
<header>          <!-- 標題與標語 -->
<main>
  <section>       <!-- 日期導航 -->
  <section>       <!-- 早餐卡片 -->
  <section>       <!-- 午餐卡片 -->
  <section>       <!-- 晚餐卡片 -->
</main>
```

**關鍵元素**：
- `.meal-card` - 餐別卡片容器
- `.image-preview` - 照片預覽區
- `.ai-section` - AI 辨識區域
- `#app-version` - 版本號顯示

#### style.css

**CSS 變數**：
```css
:root {
  --color-bg: #0f0f23;           /* 背景色 */
  --color-text: #e6e6e6;         /* 文字色 */
  --color-accent: #667eea;       /* 強調色 */
  --color-card: #1a1a2e;         /* 卡片背景 */
  --gradient-primary: ...        /* 主漸層 */
}
```

**主要區塊**：
1. CSS Reset & Base
2. Header Styles
3. Container & Layout
4. Meal Cards
5. AI Components
6. Responsive Design
7. Version Display

#### app.js

**類別結構**：

```javascript
// ML 服務
class MLService {
  recognizeFood()        // 主辨識方法
  recognizeFoodViaProxy() // Worker API 調用
  mockRecognition()      // Mock 模式
  parseResults()         // 解析結果
}

// 營養服務
class NutritionService {
  getNutrition()         // 查詢營養
  translateToChinese()   // 翻譯中文
}

// 主應用
class DailyMeals {
  // 初始化
  init()
  setupEventListeners()
  setupAIListeners()
  
  // 日期管理
  updateDateDisplay()
  changeDate()
  formatDate()
  
  // 檔案處理
  handleFileUpload()
  displayImage()
  getImageData()
  
  // AI 辨識
  handleAIAnalysis()
  displayAIResult()
  displayAIError()
  showAILoading()
  
  // 資料儲存
  saveImage()
  loadImage()
  saveNote()
  loadNote()
  saveAIAnalysis()
  loadAIAnalysis()
  loadDayData()
  
  // UI 工具
  showToast()
}
```

#### config.js

**配置項**：
```javascript
const CONFIG = {
  VERSION: '0.4.1',
  APP_NAME: 'DailyMeals',
  
  HF_API: {
    useProxy: true,
    proxyEndpoint: '...',
    timeout: 15000,
    confidenceThreshold: 0.3
  },
  
  NUTRITION_DB: {
    // 50+ 食物營養資料
  },
  
  TRANSLATIONS: {
    // 中英翻譯對照
  },
  
  UI: {
    TOAST_DURATION: 3000
  }
}
```

#### worker.js

**結構**：
```javascript
export default {
  async fetch(request, env) {
    // CORS 預檢
    if (OPTIONS) return handleCORS();
    
    // Origin 驗證
    if (!allowedOrigins.includes(origin)) 
      return 403;
    
    // 讀取圖片
    const imageBlob = await request.blob();
    
    // 調用 HF API
    const hfResponse = await fetch(HF_API, {
      headers: { 'Authorization': Bearer ${env.HF_TOKEN} },
      body: imageBlob
    });
    
    // 返回結果（加 CORS headers）
    return jsonResponse(result, 200, origin);
  }
}
```

---

## 開發工作流程

### 日常開發

#### 1. 啟動本地伺服器

```bash
cd dailymeals
python3 -m http.server 8080
```

#### 2. 修改代碼

**前端修改**：
- 編輯 `index.html`, `style.css`, `app.js`
- 儲存後重新整理瀏覽器即可看到變化

**Worker 修改**：
```bash
cd dailymeals-api
# 編輯 worker.js
wrangler deploy
```

#### 3. 測試

**手動測試**：
1. 上傳照片
2. 點擊 AI 辨識
3. 檢查 Console 輸出
4. 確認 localStorage

**Console 測試**：
```javascript
// 查看 localStorage
Object.keys(localStorage).filter(k => k.startsWith('dailymeals'))

// 清除特定日期資料
const date = '2025-11-26';
['breakfast', 'lunch', 'dinner'].forEach(meal => {
  localStorage.removeItem(`dailymeals_${date}_${meal}_image`);
  localStorage.removeItem(`dailymeals_${date}_${meal}_note`);
  localStorage.removeItem(`dailymeals_${date}_${meal}_ai`);
});

// 測試 AI 辨識
const app = new DailyMeals();
```

#### 4. Commit 與推送

```bash
git add .
git commit -m "feat: 描述您的更改"
git push origin main
```

### 版本管理

#### 版本號規則

**格式**：`v主版本.次版本.修復版本`

**範例**：
- `v0.4.1` - 當前版本
- `v0.5.0` - 下一個功能版本
- `v0.4.2` - 下一個修復版本

#### 更新版本號步驟

1. **更新 config.js**：
```javascript
VERSION: '0.5.0'
```

2. **更新 index.html**：
```html
<span class="version" id="app-version">v0.5.0</span>
```

3. **提交並創建 tag**：
```bash
git add config.js index.html
git commit -m "chore: bump version to v0.5.0"
git tag -a v0.5.0 -m "Release v0.5.0"
git push origin main --tags
```

### Git 工作流程

**分支策略**：
```
main          # 生產環境
└── feature/* # 功能開發分支
```

**開發新功能**：
```bash
# 創建分支
git checkout -b feature/new-feature

# 開發...

# 提交
git add .
git commit -m "feat: 新功能描述"

# 推送
git push origin feature/new-feature

# 合併到 main
git checkout main
git merge feature/new-feature
git push origin main
```

---

## 部署指南

### GitHub Pages 部署

**自動部署**：
- Push 到 `main` 分支
- GitHub Pages 自動構建
- 2-5 分鐘後上線

**手動觸發**：
1. 訪問 GitHub repo
2. Settings → Pages
3. 重新部署

**URL**：https://technicalerikchan.github.io/dailymeals/

### Cloudflare Worker 部署

**初次部署**：
```bash
cd dailymeals-api
wrangler login
wrangler deploy
```

**更新部署**：
```bash
wrangler deploy
```

**查看部署歷史**：
```bash
wrangler deployments list
```

**回滾**：
```bash
wrangler rollback --version-id <VERSION_ID>
```

### 環境變數管理

**設定 Secret**：
```bash
wrangler secret put HF_TOKEN
```

**列出 Secrets**：
```bash
wrangler secret list
```

**刪除 Secret**：
```bash
wrangler secret delete HF_TOKEN
```

---

## API 文檔

### localStorage API

#### 儲存圖片

```javascript
const key = `dailymeals_${dateStr}_${meal}_image`;
localStorage.setItem(key, base64Image);
```

#### 讀取圖片

```javascript
const key = `dailymeals_${dateStr}_${meal}_image`;
const imageData = localStorage.getItem(key);
```

#### 儲存 AI 結果

```javascript
const key = `dailymeals_${dateStr}_${meal}_ai`;
const data = {
  foodName: 'pizza',
  confidence: 0.89,
  nutrition: {...}
};
localStorage.setItem(key, JSON.stringify(data));
```

### Cloudflare Worker API

**Endpoint**：`https://dailymeals-api.dailymeals-api.workers.dev/`

**Request**：
```http
POST / HTTP/2
Origin: https://technicalerikchan.github.io
Content-Type: application/octet-stream

<binary image data>
```

**Response (Success)**：
```json
HTTP/2 200
Content-Type: application/json

[
  {
    "label": "pizza",
    "score": 0.89
  },
  {
    "label": "pasta",
    "score": 0.05
  }
]
```

**Response (Error)**：
```json
HTTP/2 410
Content-Type: application/json

{
  "error": "ML API failed",
  "status": 410,
  "details": "..."
}
```

### HuggingFace API

**Endpoint**：`https://api-inference.huggingface.co/models/Kaludi/food-category-classification-v2.0`

**Request**：
```http
POST /models/Kaludi/... HTTP/1.1
Authorization: Bearer hf_xxx
Content-Type: application/octet-stream

<binary image data>
```

**Response**：
```json
[
  {"label": "Dessert", "score": 0.92},
  {"label": "Bread", "score": 0.05}
]
```

---

## 未來開發計劃

### v0.5 - ML API 修復與增強

**優先級：高**

**任務**：
- [ ] 修復 HF API 410 錯誤
  - [ ] 測試新 endpoint
  - [ ] 更新 Worker 代碼
  - [ ] 驗證真實 ML 辨識
- [ ] 改進錯誤處理
  - [ ] 更友善的錯誤訊息
  - [ ] 重試機制
- [ ] 添加 loading 狀態改善

**預估時間**：1-2 天

### v0.6 - 多物體辨識

**優先級：中**

**功能**：
- 一張照片辨識多個食物
- 顯示多個結果
- 累計營養資訊

**技術**：
- 使用物體偵測 model
- UI 改為列表顯示

**預估時間**：3-5 天

### v0.7 - 資料匯出與統計

**優先級：中**

**功能**：
- 每週/每月報告
- 營養趨勢圖表
- CSV 匯出
- 圖表視覺化

**技術**：
- Chart.js 或 D3.js
- 資料聚合邏輯

**預估時間**：5-7 天

### v0.8 - PWA 支援

**優先級：中**

**功能**：
- 離線使用
- 安裝到主畫面
- 推送通知
- Service Worker

**技術**：
- manifest.json
- Service Worker API
- Cache API

**預估時間**：3-4 天

### v1.0 - 正式發布

**優先級：低**

**完成項目**：
- [ ] 所有核心功能
- [ ] 完整測試覆蓋
- [ ] 文檔完善
- [ ] SEO 優化
- [ ] 效能優化
- [ ] 多語言支援

**預估時間**：2-3 週

### 功能候選清單

**UI/UX**：
- [ ] 深色/淺色模式切換
- [ ] 自訂主題顏色
- [ ] 動畫效果改善
- [ ] 手勢操作（滑動切換日期）

**功能**：
- [ ] 相機直接拍照
- [ ] 份量估算
- [ ] 食譜建議
- [ ] 社群分享
- [ ] 目標設定
- [ ] 提醒功能

**技術**：
- [ ] TypeScript 重構
- [ ] 單元測試
- [ ] E2E 測試
- [ ] CI/CD 自動化
- [ ] 效能監控

---

## 故障排除

### 常見問題

#### Q1: 照片上傳後看不到

**症狀**：點擊上傳，選擇照片後沒反應

**可能原因**：
1. File input 事件監聽器未綁定
2. FileReader API 錯誤
3. localStorage 已滿

**解決方法**：
```javascript
// 檢查 Console 是否有錯誤
console.log('File upload working?');

// 檢查 localStorage 空間
const used = JSON.stringify(localStorage).length;
console.log(`localStorage used: ${used} bytes`);

// 清除舊資料
localStorage.clear();
```

#### Q2: AI 辨識一直顯示 loading

**症狀**：點擊 AI 辨識，loading 不消失

**可能原因**：
1. Worker API 沒回應
2. 網路問題
3. JavaScript 錯誤

**解決方法**：
```javascript
// 檢查 Network 標籤
// 查看 Worker API 請求狀態

// 檢查 Console 錯誤

// 手動測試 Worker
fetch('https://your-worker.workers.dev/', {
  method: 'POST', 
  body: new Blob(['test'])
})
```

#### Q3: 版本號看不到

**症狀**：標題只顯示 "DailyMeals"

**可能原因**：
1. CSS 字體太小
2. 顏色對比度不足
3. HTML 未更新

**解決方法**：
```css
/* 檢查 style.css */
.version {
  font-size: 0.8em;    /* 確認不是 0.5em */
  opacity: 0.95;       /* 確認不是 0.7 */
  color: #ffffff;      /* 確認是白色 */
}
```

#### Q4: Worker 返回 410 錯誤

**症狀**：AI 辨識失敗，Console 顯示 410

**可能原因**：
1. HF API endpoint 已棄用
2. Model 不可用
3. Token 問題

**解決方法**：
```bash
# 測試 HF API
curl -X POST \
  https://api-inference.huggingface.co/models/Kaludi/... \
  -H "Authorization: Bearer $TOKEN" \
  --data-binary "@test.jpg"

# 檢查 Model 頁面
# https://huggingface.co/Kaludi/food-category-classification-v2.0
```

#### Q5: GitHub Pages 沒更新

**症狀**：推送代碼後，網站沒變化

**可能原因**：
1. GitHub Pages 構建延遲
2. 瀏覽器快取
3. CDN 快取

**解決方法**：
```bash
# 等待 3-5 分鐘

# 強制重新整理
# Mac: Cmd+Shift+R
# Windows: Ctrl+Shift+R

# 清除瀏覽器快取

# 無痕模式測試
```

### 除錯工具

**Chrome DevTools**：
```
Console  - 查看 JavaScript 錯誤
Network  - 查看 API 請求
Application - 查看 localStorage
Sources - 設置斷點
```

**Console 指令**：
```javascript
// 查看當前版本
CONFIG.VERSION

// 查看所有 localStorage
Object.keys(localStorage)

// 清除特定餐別
localStorage.removeItem('dailymeals_2025-11-26_breakfast_image')

// 測試 API
const blob = new Blob(['test']);
fetch('https://worker-url/', {method: 'POST', body: blob})
```

---

## 維護指南

### 定期維護任務

**每週**：
- [ ] 檢查 GitHub Issues
- [ ] 測試核心功能
- [ ] 查看 Console 錯誤報告

**每月**：
- [ ] 更新依賴（如有）
- [ ] 檢查 Worker 使用量
- [ ] 審查效能指標
- [ ] 備份重要資料

**每季**：
- [ ] 審查架構設計
- [ ] 評估新技術
- [ ] 規劃下個版本
- [ ] 更新文檔

### 效能優化

**圖片優化**：
```javascript
// 壓縮圖片 before 儲存
function compressImage(base64, maxWidth) {
  const img = new Image();
  img.src = base64;
  
  const canvas = document.createElement('canvas');
  const scale = maxWidth / img.width;
  canvas.width = maxWidth;
  canvas.height = img.height * scale;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL('image/jpeg', 0.8);
}
```

**localStorage 清理**：
```javascript
// 刪除超過 30 天的資料
function cleanOldData() {
  const now = new Date();
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (!key.startsWith('dailymeals_')) return;
    
    const dateStr = key.split('_')[1];
    const date = new Date(dateStr);
    const days = (now - date) / (1000 * 60 * 60 * 24);
    
    if (days > 30) {
      localStorage.removeItem(key);
    }
  });
}
```

### 安全性檢查

**定期檢查**：
- [ ] 檢查 dependencies 安全性
- [ ] 審查 Worker 日誌
- [ ] 驗證 CORS 設定
- [ ] 檢查 Token 有效性

**最佳實踐**：
```javascript
// 輸入驗證
function sanitizeInput(text) {
  return text.replace(/<script>/gi, '');
}

// XSS 防護
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

---

## 聯絡資訊

**專案維護者**：Erik Chan
**GitHub**：https://github.com/technicalerikchan/dailymeals
**Email**：technicalerikchan@gmail.com

**資源連結**：
- [GitHub Repository](https://github.com/technicalerikchan/dailymeals)
- [Live Demo](https://technicalerikchan.github.io/dailymeals/)
- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [HuggingFace Model](https://huggingface.co/Kaludi/food-category-classification-v2.0)

---

## 附錄

### 推薦工具

**開發**：
- VS Code
- Chrome DevTools
- Postman (API 測試)
- Git

**設計**：
- Figma
- ColorHunt (配色)
- Google Fonts

**測試**：
- BrowserStack (跨瀏覽器)
- Lighthouse (效能)
- WAVE (無障礙)

### 學習資源

**JavaScript**：
- MDN Web Docs
- JavaScript.info
- You Don't Know JS

**Cloudflare Workers**：
- Cloudflare Docs
- Workers Examples

**ML/AI**：
- HuggingFace Docs
- TensorFlow.js

### 授權

MIT License - 自由使用、修改、分發

---

**文檔版本**：v1.0  
**最後更新**：2025-12-03  
**作者**：Erik Chan with AI Assistant

祝開發順利！🚀

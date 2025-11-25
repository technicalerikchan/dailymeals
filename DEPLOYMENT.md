# DailyMeals - GitHub Pages 部署指南

## 📋 部署步驟

您的專案已經準備就緒！請按照以下步驟完成 GitHub Pages 部署：

### 步驟 1: 在 GitHub 創建新的 Repository

1. 前往 [GitHub](https://github.com/new)
2. 填寫以下資訊：
   - **Repository name**: `dailymeals`（或您喜歡的名稱）
   - **Description**: `每日三餐飲食紀錄 Web 應用程式`
   - **Visibility**: Public（必須是 Public 才能使用免費的 GitHub Pages）
   - **❌ 不要勾選** "Initialize this repository with a README"
3. 點擊 **Create repository**

### 步驟 2: 連接本地 Repository 到 GitHub

在終端機執行以下命令（將 `YOUR_USERNAME` 替換為您的 GitHub 用戶名）：

```bash
cd /Users/erik/.gemini/antigravity/scratch/dailymeals

# 添加遠端 repository
git remote add origin https://github.com/YOUR_USERNAME/dailymeals.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步驟 3: 啟用 GitHub Pages

1. 在 GitHub repository 頁面，點擊 **Settings**
2. 在左側選單找到 **Pages**
3. 在 **Build and deployment** 區段：
   - **Source**: 選擇 `Deploy from a branch`
   - **Branch**: 選擇 `main` 和 `/ (root)`
   - 點擊 **Save**

### 步驟 4: 等待部署完成

- GitHub 會自動開始構建和部署
- 大約 1-2 分鐘後，您的網站就會上線
- 您的網址會是: `https://YOUR_USERNAME.github.io/dailymeals/`

---

## 🎉 完成！

部署成功後，您可以：

✅ 在任何裝置上訪問您的應用程式  
✅ 分享網址給朋友或家人  
✅ 在手機上添加到主畫面當作 PWA 使用  

---

## 🔄 未來更新

當您修改程式碼後，只需執行：

```bash
cd /Users/erik/.gemini/antigravity/scratch/dailymeals
git add .
git commit -m "描述您的更新"
git push
```

GitHub Pages 會自動重新部署！

---

## 📱 在手機上使用

### iOS (Safari)
1. 開啟您的 GitHub Pages 網址
2. 點擊分享按鈕
3. 選擇「加入主畫面」
4. 現在可以像 App 一樣使用！

### Android (Chrome)
1. 開啟您的 GitHub Pages 網址
2. 點擊選單（三個點）
3. 選擇「加入主畫面」
4. 現在可以像 App 一樣使用！

---

## ⚠️ 重要提醒

- **資料儲存**: 所有資料仍然儲存在瀏覽器的 localStorage 中
- **不同裝置**: 每個裝置的資料是獨立的（不會同步）
- **清除資料**: 如果清除瀏覽器資料，記錄會被刪除
- **隱私**: 所有資料都在本地，不會上傳到任何伺服器

---

## 🔧 故障排除

### 如果 GitHub Pages 沒有顯示正確內容：

1. 確認 repository 是 Public
2. 確認 Settings > Pages 已正確設定
3. 等待幾分鐘讓 GitHub 完成部署
4. 檢查 Actions 頁面查看部署狀態

### 如果遇到 404 錯誤：

- 確認網址格式: `https://username.github.io/dailymeals/`
- 注意大小寫要完全正確

---

## 📞 需要幫助？

如果遇到任何問題，請隨時詢問！

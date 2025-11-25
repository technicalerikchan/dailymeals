# 🚀 快速部署到 GitHub Pages

## 步驟 1: 在 GitHub 創建 Repository

我已經看到您有 GitHub 登入頁面打開。請按照以下步驟操作：

1. **登入 GitHub** 後，前往：https://github.com/new

2. **填寫 Repository 資訊**：
   ```
   Repository name: dailymeals
   Description: 每日三餐飲食紀錄 Web 應用程式
   Visibility: ✅ Public (必須)
   
   ❌ 不要勾選 "Add a README file"
   ❌ 不要勾選 ".gitignore"  
   ❌ 不要勾選 "Choose a license"
   ```

3. **點擊綠色的 "Create repository" 按鈕**

---

## 步驟 2: 推送程式碼到 GitHub

創建 repository 後，GitHub 會顯示一些指令。**請忽略它們**，改用以下指令：

```bash
cd /Users/erik/.gemini/antigravity/scratch/dailymeals

# 替換 YOUR_USERNAME 為您的 GitHub 用戶名
git remote add origin https://github.com/YOUR_USERNAME/dailymeals.git
git push -u origin main
```

如果出現要求輸入密碼，請使用 **Personal Access Token**（不是密碼）。

---

## 步驟 3: 啟用 GitHub Pages

1. 在 repository 頁面，點擊 **Settings** (在上方選單列)
2. 左側選單找到並點擊 **Pages**  
3. 在 **Build and deployment** 區域：
   - **Source**: `Deploy from a branch`
   - **Branch**: 選擇 `main` + `/ (root)`
   - 點擊 **Save**

4. 等待 1-2 分鐘，重新整理頁面

5. 您會看到一個綠色通知顯示：
   ```
   Your site is live at https://YOUR_USERNAME.github.io/dailymeals/
   ```

---

## 🎉 完成！

您的 DailyMeals 現在可以在任何裝置訪問了！

**您的網址**: `https://YOUR_USERNAME.github.io/dailymeals/`

---

## 📱 在手機上使用

### 方法 1: 直接在瀏覽器使用
在手機瀏覽器輸入您的 GitHub Pages 網址即可！

### 方法 2: 加入主畫面（像 App 一樣）

**iOS (Safari)**:
1. 開啟網址
2. 點擊分享按鈕 📤
3. 選擇「加入主畫面」
4. 完成！現在可以像 App 一樣點擊圖標打開

**Android (Chrome)**:
1. 開啟網址  
2. 點擊選單 ⋮
3. 選擇「加入主畫面」
4. 完成！

---

## 🔐 關於 GitHub Personal Access Token

如果推送時需要密碼，請：

1. 前往：https://github.com/settings/tokens
2. 點擊 "Generate new token" → "Generate new token (classic)"
3. 勾選 `repo` 權限
4. 點擊 "Generate token"
5. **複製 token**（只會顯示一次！）
6. 在終端機輸入 token 當作密碼

---

## ❓ 需要幫助？

如果您遇到任何問題，請告訴我具體的錯誤訊息！

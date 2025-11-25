# 🔐 GitHub 認證問題解決方案

## 問題說明

推送失敗，錯誤訊息：
```
remote: Permission to technicalerikchan/dailymeals.git denied to Erik-Chan_cdk.
```

這是因為您的 Git 憑證設定為另一個帳號（Erik-Chan_cdk），但 repository 在 technicalerikchan 帳號下。

---

## 解決方案 1: 使用 Personal Access Token（推薦）

### 步驟 1: 創建 Personal Access Token

1. 前往：https://github.com/settings/tokens
2. 點擊 **"Generate new token"** → **"Generate new token (classic)"**
3. 設定如下：
   - Note: `DailyMeals Deployment`
   - Expiration: 選擇一個期限（建議 90 days）
   - 勾選權限：**`repo`** (完整的 repository 權限)
4. 滾動到底部，點擊 **"Generate token"**
5. **立即複製 token**（只會顯示一次！格式像：`ghp_xxxxxxxxxxxx`）

### 步驟 2: 推送程式碼

在終端機執行：

```bash
cd /Users/erik/.gemini/antigravity/scratch/dailymeals

# 清除舊的憑證
git credential-osxkeychain erase
# 按 Enter，然後輸入：
host=github.com
protocol=https
# 再按兩次 Enter

# 重新推送
git push -u origin main
```

當系統要求輸入：
- **Username**: `technicalerikchan`
- **Password**: 貼上您剛才複製的 Personal Access Token（不是密碼！）

---

## 解決方案 2: 使用 SSH（如果您已設定 SSH Key）

```bash
cd /Users/erik/.gemini/antigravity/scratch/dailymeals

# 改用 SSH URL
git remote set-url origin git@github.com:technicalerikchan/dailymeals.git

# 推送
git push -u origin main
```

---

## 解決方案 3: 手動上傳到 GitHub（最簡單但不推薦）

如果上述方法都遇到困難，可以：

1. 前往：https://github.com/technicalerikchan/dailymeals
2. 點擊 **"uploading an existing file"**
3. 拖曳以下檔案到瀏覽器：
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md`
   - `.gitignore`
4. 點擊 **"Commit changes"**

---

## 推送成功後的下一步

1. 前往：https://github.com/technicalerikchan/dailymeals/settings/pages
2. 在 **"Build and deployment"** 區域：
   - Source: `Deploy from a branch`
   - Branch: 選擇 `main` + `/ (root)`
   - 點擊 **Save**
3. 等待 1-2 分鐘
4. 您的網站將會在：`https://technicalerikchan.github.io/dailymeals/`

---

## 需要幫助？

如果您在任何步驟遇到問題，請告訴我具體的錯誤訊息！

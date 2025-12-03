# DailyMeals v0.4.1

🍽️ **智能飲食記錄 Web 應用**

記錄每一餐，追蹤每一天的營養攝取。

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://technicalerikchan.github.io/dailymeals/)
[![Version](https://img.shields.io/badge/version-0.4.1-blue)](https://github.com/technicalerikchan/dailymeals)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

---

## ✨ 功能特色

- 📸 **照片記錄** - 每日三餐照片上傳與預覽
- 🤖 **AI 辨識** - 自動辨識食物種類（96% 準確度）
- 📊 **營養追蹤** - 顯示卡路里、蛋白質、碳水、脂肪
- 📅 **歷史瀏覽** - 日期導航查看過往記錄
- 💬 **備註功能** - 為每餐添加文字說明
- 🌙 **深色主題** - 優雅的深色 UI 設計
- 💾 **本地儲存** - 無需註冊，資料保存在瀏覽器
- 📱 **響應式** - 支援手機、平板、電腦

---

## 🚀 快速開始

### 線上使用

訪問：**https://technicalerikchan.github.io/dailymeals/**

### 本地運行

```bash
# Clone 專案
git clone https://github.com/technicalerikchan/dailymeals.git
cd dailymeals

# 啟動本地伺服器（任選一種）
python3 -m http.server 8080
# 或
npx http-server -p 8080

# 訪問
open http://localhost:8080
```

---

## 📸 截圖

<table>
<tr>
<td width="50%">

### 主介面
![Main Interface](docs/screenshots/main.png)

</td>
<td width="50%">

### AI 辨識
![AI Recognition](docs/screenshots/ai.png)

</td>
</tr>
</table>

---

## 🏗️ 技術架構

### 前端
- **HTML5 + CSS3 + Vanilla JavaScript**
- **無框架** - 純前端實作
- **localStorage** - 本地資料儲存
- **Google Fonts** - Inter 字體

### 後端
- **Cloudflare Workers** - Serverless API 代理
- **HuggingFace** - ML 食物辨識模型

### 部署
- **GitHub Pages** - 前端託管
- **Cloudflare Workers** - API 服務

### ML Model
- **Kaludi/food-category-classification-v2.0**
- 準確度：96.0% (F1 Score)
- 支援 12 種食物類別

---

## 📂 專案結構

```
dailymeals/
├── index.html              # 主頁面
├── style.css              # 樣式表
├── app.js                 # 應用邏輯
├── config.js              # 配置文件
├── README.md              # 本文件
├── PROJECT_HANDBOOK.md    # 完整開發手冊
└── dailymeals-api/        # Worker API
    ├── worker.js          # Worker 代碼
    ├── wrangler.toml      # Worker 配置
    └── README.md          # Worker 說明
```

---

## 🛠️ 開發

### 環境需求

- Node.js 18+
- Git
- 現代瀏覽器

### 安裝依賴

```bash
# 安裝 Wrangler CLI（用於 Worker 開發）
npm install -g wrangler
```

### 開發工作流程

1. **修改前端代碼** - 編輯 HTML/CSS/JS
2. **本地測試** - 瀏覽器重新整理
3. **提交更改** - Git commit
4. **部署** - Push 到 GitHub（自動部署）

### 部署 Worker

```bash
cd dailymeals-api
wrangler login
wrangler deploy
```

---

## 📖 完整文檔

詳細的開發指南請參閱：

**[PROJECT_HANDBOOK.md](./PROJECT_HANDBOOK.md)** - 完整專案手冊

內容包括：
- 🏗️ 詳細技術架構
- 📝 代碼結構說明
- 🔧 開發工作流程
- 🚀 部署指南
- 📊 API 文檔
- 🗺️ 未來開發計劃
- 🐛 故障排除
- 🔐 維護指南

---

## 🗺️ 版本規劃

### v0.4.1 (當前)
- ✅ 照片記錄功能
- ✅ AI 辨識 UI
- ✅ 營養資訊顯示
- ⚠️ ML API 待修復

### v0.5 (規劃中)
- [ ] 修復 HF API 410 錯誤
- [ ] 真實 ML 辨識功能
- [ ] 改進錯誤處理

### v0.6 (未來)
- [ ] 多物體辨識
- [ ] 資料統計圖表
- [ ] 匯出功能

### v1.0 (目標)
- [ ] PWA 支援
- [ ] 離線功能
- [ ] 多語言支援

---

## 🤝 貢獻

歡迎 Pull Requests！

### 貢獻流程

1. Fork 專案
2. 創建 feature 分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. Push 到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 📝 授權

**MIT License**

Copyright (c) 2025 Erik Chan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction.

---

## 👤 作者

**Erik Chan**

- GitHub: [@technicalerikchan](https://github.com/technicalerikchan)
- Email: technicalerikchan@gmail.com

---

## 🙏 致謝

- [HuggingFace](https://huggingface.co/) - ML 模型託管
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless 平台
- [GitHub Pages](https://pages.github.com/) - 免費託管
- [Google Fonts](https://fonts.google.com/) - Inter 字體

---

## 📊 專案狀態

![GitHub last commit](https://img.shields.io/github/last-commit/technicalerikchan/dailymeals)
![GitHub issues](https://img.shields.io/github/issues/technicalerikchan/dailymeals)
![GitHub stars](https://img.shields.io/github/stars/technicalerikchan/dailymeals)

---

**Made with ❤️ by Erik Chan**

[⬆ 回到頂部](#dailymeals-v041)

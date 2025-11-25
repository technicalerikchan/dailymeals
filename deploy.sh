#!/bin/bash

# DailyMeals - GitHub Pages 快速部署腳本
# 此腳本將幫助您快速推送程式碼到 GitHub

echo "🚀 DailyMeals GitHub Pages 部署腳本"
echo "======================================"
echo ""

# 顏色定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 檢查是否已設定 remote
if git remote | grep -q 'origin'; then
    echo -e "${GREEN}✓${NC} 已找到 remote origin"
    REMOTE_URL=$(git remote get-url origin)
    echo "  Remote URL: $REMOTE_URL"
else
    echo -e "${YELLOW}!${NC} 尚未設定 remote origin"
    echo ""
    echo "請先在 GitHub 創建 repository，然後執行："
    echo ""
    echo -e "${BLUE}  git remote add origin https://github.com/YOUR_USERNAME/dailymeals.git${NC}"
    echo ""
    echo "將 YOUR_USERNAME 替換為您的 GitHub 用戶名"
    exit 1
fi

echo ""
echo "準備推送到 GitHub..."
echo ""

# 確認當前分支
CURRENT_BRANCH=$(git branch --show-current)
echo "當前分支: $CURRENT_BRANCH"

# 推送到 GitHub
echo ""
echo "正在推送..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ 成功推送到 GitHub！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "下一步："
    echo "1. 前往您的 GitHub repository"
    echo "2. 點擊 Settings > Pages"
    echo "3. 在 Build and deployment 選擇 'main' 分支"
    echo "4. 點擊 Save"
    echo ""
    echo "您的網站將在幾分鐘內上線！"
    echo ""
else
    echo ""
    echo -e "${YELLOW}推送失敗！${NC}"
    echo ""
    echo "可能的原因："
    echo "1. 需要先在 GitHub 創建 repository"
    echo "2. 需要登入 GitHub（使用 Personal Access Token）"
    echo "3. Remote URL 設定錯誤"
    echo ""
    echo "請查看 DEPLOYMENT.md 獲取詳細說明"
fi

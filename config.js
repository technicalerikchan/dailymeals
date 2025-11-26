/**
 * DailyMeals v0.3 Configuration
 * ML Food Recognition using Hugging Face API
 */

const CONFIG = {
    // Application Info
    VERSION: '0.4.1',
    APP_NAME: 'DailyMeals',

    // Hugging Face API Settings (v0.4)
    HF_API: {
        enabled: true,
        // v0.4: 使用 Cloudflare Worker 代理
        useProxy: true,
        proxyEndpoint: 'https://dailymeals-api.dailymeals-api.workers.dev',

        // 備用設定
        token: '', // 不再需要（Worker 管理）
        model: 'nateraw/food',
        directEndpoint: 'https://api-inference.huggingface.co/models/nateraw/food',

        timeout: 15000, // 15秒超時
        confidenceThreshold: 0.3 // 信心度門檻 30%
    },

    // Feature Flags
    FEATURES: {
        aiRecognition: true,
        nutritionTracking: true,
        manualInput: true, // 允許手動輸入
        showConfidence: true
    },

    // UI Settings
    UI: {
        showMultipleResults: false, // 只顯示最佳結果
        animationDuration: 300,
        loadingMinDuration: 1000 // 最小載入時間
    },

    // Nutrition Database - 常見食物熱量資料
    NUTRITION_DB: {
        // 西式主食
        'pizza': { calories: 266, carbs: 33, protein: 11, fat: 10, unit: 'per slice' },
        'hamburger': { calories: 295, carbs: 25, protein: 17, fat: 14, unit: 'per burger' },
        'sandwich': { calories: 320, carbs: 42, protein: 13, fat: 11, unit: 'each' },
        'hot dog': { calories: 290, carbs: 24, protein: 10, fat: 17, unit: 'each' },
        'burrito': { calories: 450, carbs: 50, protein: 20, fat: 18, unit: 'each' },
        'taco': { calories: 170, carbs: 13, protein: 9, fat: 10, unit: 'each' },
        'pasta': { calories: 350, carbs: 65, protein: 12, fat: 5, unit: 'per bowl' },
        'spaghetti': { calories: 380, carbs: 70, protein: 14, fat: 6, unit: 'per bowl' },

        // 亞洲料理
        'rice': { calories: 206, carbs: 45, protein: 4, fat: 0.4, unit: 'per bowl' },
        'fried rice': { calories: 350, carbs: 52, protein: 8, fat: 13, unit: 'per bowl' },
        'noodles': { calories: 300, carbs: 56, protein: 10, fat: 4, unit: 'per bowl' },
        'ramen': { calories: 436, carbs: 63, protein: 17, fat: 12, unit: 'per bowl' },
        'sushi': { calories: 350, carbs: 60, protein: 15, fat: 8, unit: 'per serving' },
        'dumpling': { calories: 40, carbs: 4, protein: 2, fat: 2, unit: 'each' },

        // 早餐
        'pancake': { calories: 227, carbs: 28, protein: 6, fat: 9, unit: 'each' },
        'waffle': { calories: 218, carbs: 25, protein: 6, fat: 11, unit: 'each' },
        'toast': { calories: 80, carbs: 15, protein: 3, fat: 1, unit: 'per slice' },
        'egg': { calories: 72, carbs: 0.4, protein: 6, fat: 5, unit: 'each' },
        'bacon': { calories: 43, carbs: 0, protein: 3, fat: 3, unit: 'per strip' },
        'oatmeal': { calories: 150, carbs: 27, protein: 5, fat: 3, unit: 'per bowl' },

        // 肉類
        'chicken': { calories: 165, carbs: 0, protein: 31, fat: 3.6, unit: 'per 100g' },
        'steak': { calories: 271, carbs: 0, protein: 25, fat: 19, unit: 'per 100g' },
        'pork': { calories: 242, carbs: 0, protein: 27, fat: 14, unit: 'per 100g' },
        'fish': { calories: 206, carbs: 0, protein: 22, fat: 12, unit: 'per 100g' },
        'fried chicken': { calories: 320, carbs: 12, protein: 20, fat: 21, unit: 'per piece' },

        // 蔬菜、沙拉
        'salad': { calories: 50, carbs: 10, protein: 2, fat: 0.5, unit: 'per bowl' },
        'vegetable': { calories: 50, carbs: 10, protein: 2, fat: 0.3, unit: 'per serving' },
        'soup': { calories: 120, carbs: 15, protein: 6, fat: 4, unit: 'per bowl' },

        // 速食
        'french fries': { calories: 312, carbs: 41, protein: 4, fat: 15, unit: 'per serving' },
        'onion ring': { calories: 276, carbs: 31, protein: 4, fat: 16, unit: 'per serving' },

        // 甜點飲料
        'cake': { calories: 257, carbs: 38, protein: 3, fat: 11, unit: 'per slice' },
        'ice cream': { calories: 207, carbs: 24, protein: 4, fat: 11, unit: 'per scoop' },
        'cookie': { calories: 49, carbs: 7, protein: 0.5, fat: 2, unit: 'each' },
        'donut': { calories: 269, carbs: 31, protein: 4, fat: 15, unit: 'each' },
        'coffee': { calories: 2, carbs: 0, protein: 0, fat: 0, unit: 'per cup' },

        // 預設值（未知食物）
        'unknown': { calories: 250, carbs: 30, protein: 10, fat: 10, unit: 'estimated' }
    },

    // 中文翻譯
    TRANSLATIONS: {
        'pizza': '披薩',
        'hamburger': '漢堡',
        'sandwich': '三明治',
        'hot dog': '熱狗',
        'burrito': '墨西哥捲餅',
        'taco': '墨西哥玉米餅',
        'pasta': '義大利麵',
        'spaghetti': '義大利麵',
        'rice': '米飯',
        'fried rice': '炒飯',
        'noodles': '麵條',
        'ramen': '拉麵',
        'sushi': '壽司',
        'dumpling': '餃子',
        'pancake': '鬆餅',
        'waffle': '格子鬆餅',
        'toast': '吐司',
        'egg': '雞蛋',
        'bacon': '培根',
        'oatmeal': '燕麥',
        'chicken': '雞肉',
        'steak': '牛排',
        'pork': '豬肉',
        'fish': '魚',
        'fried chicken': '炸雞',
        'salad': '沙拉',
        'vegetable': '蔬菜',
        'soup': '湯',
        'french fries': '薯條',
        'onion ring': '洋蔥圈',
        'cake': '蛋糕',
        'ice cream': '冰淇淋',
        'cookie': '餅乾',
        'donut': '甜甜圈',
        'doughnut': '甜甜圈',
        'coffee': '咖啡'
    },

    // Daily Nutrition Goals
    DAILY_GOALS: {
        calories: 2000,
        carbs: 250,    // g
        protein: 80,   // g
        fat: 65        // g
    }
};

// 防止配置被修改
if (typeof Object.freeze === 'function') {
    Object.freeze(CONFIG.HF_API);
    Object.freeze(CONFIG.FEATURES);
    Object.freeze(CONFIG.UI);
    Object.freeze(CONFIG.NUTRITION_DB);
    Object.freeze(CONFIG.TRANSLATIONS);
    Object.freeze(CONFIG.DAILY_GOALS);
    Object.freeze(CONFIG);
}

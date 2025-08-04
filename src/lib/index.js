export const getProgress = (value, max = 100) => {
    return Math.min(100, Math.max(0, (value / max) * 100));
};

export const getProgresspH = (value, max = 14) => {
    return Math.min(100, Math.max(0, (value / max) * 100));
};


export const getProgressRain = (value, max = 100) => {
    return Math.min(100, Math.max(0, (value / max) * 100));
};

export const getProgressHumidity = (value, max = 100) => {
    return Math.min(100, Math.max(0, (value / max) * 100));
};

export const getProgressNutrition = (value, max = 2000) => {
    return Math.min(100, Math.max(0, (value / max) * 100));
};

export const getProgressWaterHeigt = (value, max = 200) => {
    return Math.min(100, Math.max(0, (value / max) * 100));
};
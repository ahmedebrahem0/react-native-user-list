const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export const getAvatarColor = (id: number) => COLORS[id % COLORS.length];

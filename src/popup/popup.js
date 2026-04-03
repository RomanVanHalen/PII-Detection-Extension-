import { ACTIONS } from '../utils/constants.js';

document.addEventListener('DOMContentLoaded', async () => {
    const countEl = document.getElementById('stat-count');
    
    // Fetch stats from local storage
    const data = await chrome.storage.local.get(['total_blocked']);
    countEl.textContent = data.total_blocked || 0;

    document.getElementById('clear-btn').onclick = async () => {
        await chrome.storage.local.set({ total_blocked: 0 });
        countEl.textContent = 0;
    };
});
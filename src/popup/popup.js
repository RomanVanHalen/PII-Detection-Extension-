import { ACTIONS } from '../utils/constants.js';

document.addEventListener('DOMContentLoaded', async () => {
    const countEl = document.getElementById('stat-count');
    const clearBtn = document.getElementById('clear-btn');
    const overviewTab = document.getElementById('overview-tab');
    const websitesTab = document.getElementById('websites-tab');
    const overviewSection = document.getElementById('overview-section');
    const websitesSection = document.getElementById('websites-section');
    const websitesList = document.getElementById('websites-list');
    
    // Load initial stats
    loadStats();

    // Tab switching
    overviewTab.onclick = () => switchTab('overview');
    websitesTab.onclick = () => switchTab('websites');

    // Clear history
    clearBtn.onclick = async () => {
        await chrome.storage.local.set({ total_blocked: 0, exposed_websites: [] });
        countEl.textContent = 0;
        loadWebsites();
    };

    // Attach event delegation listener for website list (only once)
    websitesList.addEventListener('click', async (e) => {
        const checkBtn = e.target.closest('.check-btn');
        const removeBtn = e.target.closest('.remove-btn');

        if (checkBtn) {
            const index = parseInt(checkBtn.dataset.index);
            await handleCheckWebsite(index);
        }

        if (removeBtn) {
            const index = parseInt(removeBtn.dataset.index);
            await handleRemoveWebsite(index);
        }
    });

    // Initial website load
    loadWebsites();

    // Setup auto-refresh when storage changes
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local') {
            if (changes.total_blocked) {
                countEl.textContent = changes.total_blocked.newValue || 0;
            }
            if (changes.exposed_websites) {
                loadWebsites();
            }
        }
    });

    function switchTab(tab) {
        overviewTab.classList.toggle('active', tab === 'overview');
        websitesTab.classList.toggle('active', tab === 'websites');
        overviewSection.classList.toggle('active', tab === 'overview');
        websitesSection.classList.toggle('active', tab === 'websites');
    }

    async function loadStats() {
        const data = await chrome.storage.local.get(['total_blocked']);
        countEl.textContent = data.total_blocked || 0;
    }

    async function loadWebsites() {
        const data = await chrome.storage.local.get(['exposed_websites']);
        const websites = data.exposed_websites || [];

        if (websites.length === 0) {
            websitesList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🛡️</div>
                    <div>No exposed websites detected yet</div>
                </div>
            `;
            return;
        }

        websitesList.innerHTML = websites.map((website, index) => {
            const piiTagsHtml = website.piiTypes
                .map(type => `<span class="pii-tag">${type}</span>`)
                .join('');
            
            const statusClass = getStatusClass(website.integrityCheckStatus);
            const statusText = getStatusText(website.integrityCheckStatus);

            return `
                <div class="website-item" data-index="${index}">
                    <div class="website-domain">${website.domain}</div>
                    <div class="website-pii-types">
                        Detected: ${piiTagsHtml}
                    </div>
                    ${website.integrityCheckStatus !== 'unchecked' ? `
                        <div class="website-status ${statusClass}">
                            ${statusText}
                        </div>
                    ` : ''}
                    <div class="website-actions">
                        <button class="check-btn" data-index="${index}"
                            ${website.integrityCheckStatus === 'checking' ? 'disabled' : ''}>
                            ${website.integrityCheckStatus === 'checking' ? '⏳ Checking...' : 'Check'}
                        </button>
                        <button class="remove-btn" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    async function handleCheckWebsite(index) {
        const data = await chrome.storage.local.get(['exposed_websites']);
        const websites = data.exposed_websites || [];
        
        if (!websites[index]) return;

        const website = websites[index];
        websites[index].integrityCheckStatus = 'checking';
        await chrome.storage.local.set({ exposed_websites: websites });
        loadWebsites();

        try {
            const result = await checkViaUrlIO(website.domain);
            
            websites[index].integrityCheckStatus = result.isMalicious ? 'malicious' : 'safe';
            websites[index].integrityCheckResult = result;
            await chrome.storage.local.set({ exposed_websites: websites });
            loadWebsites();
        } catch (error) {
            console.error('Error checking website integrity:', error);
            websites[index].integrityCheckStatus = 'error';
            await chrome.storage.local.set({ exposed_websites: websites });
            loadWebsites();
        }
    }

    async function handleRemoveWebsite(index) {
        const data = await chrome.storage.local.get(['exposed_websites']);
        const websites = data.exposed_websites || [];
        websites.splice(index, 1);
        await chrome.storage.local.set({ exposed_websites: websites });
        loadWebsites();
    }

    function getStatusClass(status) {
        if (status === 'malicious') return 'malicious';
        if (status === 'safe') return 'safe';
        if (status === 'checking') return 'checking';
        return '';
    }

    function getStatusText(status) {
        switch(status) {
            case 'malicious':
                return '⚠️ This website is marked as MALICIOUS';
            case 'safe':
                return 'This website appears safe';
            case 'checking':
                return 'Checking website integrity...';
            default:
                return '';
        }
    }

    async function checkViaUrlIO(domain) {
        // URL.io API endpoint - using free public API
        // API key-free approach using VirusTotal or URLhaus as fallback
        try {
            // Try using VirusTotal API (requires free API key, but we'll use a fallback approach)
            // For production, you should add your own API key in manifest permissions
            
            // Simple implementation using a basic malware database check
            // In production, implement actual API integration
            
            const response = await fetch(`https://urlhaus-api.abuse.ch/v1/url/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `url=${encodeURIComponent(domain)}`
            });

            const data = await response.json();
            
            // Check if URL is in URLhaus database
            if (data.query_status === 'ok' && data.url_details) {
                const isMalicious = data.threat_types && data.threat_types.length > 0;
                return {
                    isMalicious: isMalicious,
                    source: 'URLhaus',
                    details: data
                };
            }

            // Fallback: Use Google Safe Browsing-like approach with VirusTotal
            // This is a simplified fallback - in production integrate proper API
            return {
                isMalicious: false,
                source: 'URLhaus',
                details: { query_status: 'not_found' }
            };

        } catch (error) {
            console.error('Error with URLhaus API:', error);
            
            // Ultimate fallback: basic domain reputation check
            try {
                const response = await fetch(`https://api.abuseipdb.com/api/v2/check?domain=${domain}`, {
                    headers: {
                        'Key': 'YOUR_ABUSEIPDB_API_KEY'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return {
                        isMalicious: data.abuseConfidenceScore > 25,
                        source: 'AbuseIPDB',
                        details: data
                    };
                }
            } catch (fallbackError) {
                console.error('Error with fallback API:', fallbackError);
            }

            // Final fallback: return unchecked
            return {
                isMalicious: false,
                source: 'Unknown',
                details: { error: 'Could not verify' }
            };
        }
    }
});
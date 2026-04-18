import { BANNER_STYLES } from './ui/banner-styles.js';

export class PIIUIController {
    constructor() {
        this.host = null;
        this.shadow = null;
    }

    /**
     * Injects the banner into the page within a closed Shadow DOM
     */
    inject(piiType) {
        if (document.getElementById('pii-shield-root')) return;

        // Create the Shadow Host
        this.host = document.createElement('div');
        this.host.id = 'pii-shield-root';
        
        // Use 'closed' mode so the page scripts cannot access our UI
        this.shadow = this.host.attachShadow({ mode: 'closed' });

        // Apply Styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = BANNER_STYLES;

        // Create Banner Structure
        const banner = document.createElement('div');
        banner.className = 'shield-banner';
        banner.innerHTML = `
            <div class="info-group">
                <div class="text-content">
                    <span class="title">⚠️ Potential ${piiType} Exposure Detected</span>
                    <span class="subtitle">Sensitive data found in current input. Review before submission.</span>
                </div>
            </div>
            <div class="btn-group">
                <button class="btn-dismiss" id="ignore-pii">Dismiss</button>
                <button class="btn-review" id="review-pii">Locate & Review</button>
            </div>
        `;

        this.shadow.appendChild(styleSheet);
        this.shadow.appendChild(banner);
        document.body.appendChild(this.host);

        this.attachListeners();
    }

    attachListeners() {
        this.shadow.querySelector('#ignore-pii').onclick = () => this.dispose();
        this.shadow.querySelector('#review-pii').onclick = () => {
            // Future logic for scrolling to the flagged input
            console.log("User requested review.");
        };
    }

    dispose() {
        if (this.host) {
            this.host.remove();
            this.host = null;
            this.shadow = null;
        }
    }

    
}
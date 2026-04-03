/**
 * REQ-UI-1: Injects a Sandboxed Warning Banner using a Closed Shadow Root.
 * This ensures the host website's CSS does not interfere with the alert.
 */
function injectPIIWarning() {
    // 1. Create the Host Container
    const host = document.createElement('div');
    host.id = 'pii-shield-root';
    
    // 2. Attach a CLOSED Shadow Root for maximum security isolation
    const shadow = host.attachShadow({ mode: 'closed' });

    // 3. Define the Figma-inspired CSS Styles
    const style = document.createElement('style');
    style.textContent = `
        :host {
            all: initial; /* Reset all inherited styles from the webpage */
        }
        .banner-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #FFF5F5; /* Light Red Warning Tint */
            border-bottom: 2px solid #E53E3E;
            padding: 12px 24px;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            z-index: 2147483647; /* Maximum possible Z-index */
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            box-sizing: border-box;
            animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
        }
        .content-group {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .warning-icon {
            font-size: 20px;
            color: #E53E3E;
        }
        .text-group {
            display: flex;
            flex-direction: column;
        }
        .main-msg {
            font-weight: 700;
            color: #2D3748;
            font-size: 14px;
        }
        .sub-msg {
            font-size: 12px;
            color: #4A5568;
        }
        .action-group {
            display: flex;
            gap: 12px;
        }
        button {
            cursor: pointer;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            padding: 8px 16px;
            transition: all 0.2s ease;
            border: none;
        }
        .btn-review {
            background-color: #E53E3E;
            color: white;
        }
        .btn-review:hover {
            background-color: #C53030;
        }
        .btn-dismiss {
            background-color: transparent;
            color: #718096;
            border: 1px solid #E2E8F0;
        }
        .btn-dismiss:hover {
            background-color: #F7FAFC;
        }
    `;

    // 4. Create the HTML Structure
    const banner = document.createElement('div');
    banner.className = 'banner-wrapper';
    banner.innerHTML = `
        <div class="content-group">
            <span class="warning-icon">⚠️</span>
            <div class="text-group">
                <span class="main-msg">Potential PII/NIC Exposure Detected</span>
                <span class="sub-msg">The system identified sensitive information in the current input field.</span>
            </div>
        </div>
        <div class="action-group">
            <button class="btn-dismiss" id="dismiss-btn">Dismiss</button>
            <button class="btn-review" id="review-btn">Review Input</button>
        </div>
    `;

    // 5. Logic for Buttons (REQ-UI-3 & REQ-UI-5)
    banner.querySelector('#dismiss-btn').onclick = () => {
        host.remove();
        // Add logic here to store dismissal in chrome.storage.local
    };

    banner.querySelector('#review-btn').onclick = () => {
        // Find the input and scroll to it
        // Note: You would pass the element reference here
        console.log("Reviewing input...");
    };

    // 6. Assemble and Inject
    shadow.appendChild(style);
    shadow.appendChild(banner);
    document.body.appendChild(host);
}

// Trigger the injection for testing
injectPIIWarning();
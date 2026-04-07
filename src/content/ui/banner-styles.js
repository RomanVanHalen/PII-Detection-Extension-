export const BANNER_STYLES = `
    :host { all: initial; } /* Resets all inherited styles from the webpage */
    
    .shield-banner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #FFF5F5;
        border-bottom: 2px solid #E53E3E;
        padding: 12px 24px;
        position: fixed;
        top: 0; left: 0;
        width: 100%;
        z-index: 2147483647; /* Maximum possible z-index */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        font-family: 'Inter', -apple-system, sans-serif;
        box-sizing: border-box;
        animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideDown {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
    }

    .info-group { display: flex; align-items: center; gap: 12px; }
    
    .text-content { display: flex; flex-direction: column; }
    
    .title { font-weight: 700; color: #2D3748; font-size: 14px; }
    
    .subtitle { font-size: 12px; color: #4A5568; margin-top: 2px; }

    .btn-group { display: flex; gap: 12px; align-items: center; }

    .btn-review { 
        background: #E53E3E; color: white; border: none; 
        padding: 8px 16px; border-radius: 4px; font-weight: 600; 
        cursor: pointer; font-size: 13px; transition: 0.2s;
    }
    
    .btn-review:hover { background: #C53030; }

    .btn-dismiss { 
        background: transparent; color: #718096; border: none; 
        cursor: pointer; font-size: 13px; font-weight: 400;
    }
    
    .btn-dismiss:hover { color: #2D3748; text-decoration: underline; }
`;
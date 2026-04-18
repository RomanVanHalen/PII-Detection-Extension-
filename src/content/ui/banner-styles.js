export const BANNER_STYLES = `
  :host { 
    all: initial; 
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2147483647;
  }

  .sec-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 80px;
    background: #FFF5F5;
    border-bottom: 2px solid #E53E3E;
    padding: 0 28px;
    gap: 16px;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    box-sizing: border-box;
    animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideDown {
    from { transform: translateY(-100%); }
    to { transform: translateY(0); }
  }

  .sec-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
  }

  .sec-icon { width: 36px; height: 36px; flex-shrink: 0; }

  .sec-text { display: flex; flex-direction: column; gap: 2px; }

  .sec-primary {
    font-size: 14px;
    font-weight: 600;
    color: #2D3748;
  }

  .sec-secondary {
    font-size: 12px;
    font-weight: 400;
    color: #4A5568;
  }

  .sec-actions { display: flex; gap: 8px; }

  .btn-primary {
    background: #E53E3E;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
  }

  .btn-primary:hover { background: #C53030; }

  .btn-ghost {
    background: transparent;
    color: #718096;
    border: none;
    padding: 8px 12px;
    font-size: 13px;
    cursor: pointer;
  }

  .btn-ghost:hover { color: #4A5568; }
`;
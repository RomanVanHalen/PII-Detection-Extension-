export const BANNER_STYLES = `
  :host { 
    all: initial; 
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  }

  .shield-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: #FFFFFF;
    border-bottom: 1px solid #E5E7EB;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 16px 24px;
    gap: 20px;
    box-sizing: border-box;
    animation: slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideDown {
    from { 
      transform: translateY(-100%);
      opacity: 0;
    }
    to { 
      transform: translateY(0);
      opacity: 1;
    }
  }

  .info-group {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .text-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .title {
    font-size: 14px;
    font-weight: 600;
    color: #1F2937;
    line-height: 1.4;
  }

  .subtitle {
    font-size: 12px;
    color: #6B7280;
    line-height: 1.4;
  }

  .btn-group {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
  }

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
    white-space: nowrap;
  }

  .btn-dismiss {
    background: #F3F4F6;
    color: #374151;
    border: 1px solid #D1D5DB;
  }

  .btn-dismiss:hover {
    background: #E5E7EB;
    border-color: #9CA3AF;
  }

  .btn-dismiss:active {
    background: #D1D5DB;
  }

  .btn-review {
    background: #DC2626;
    color: #FFFFFF;
  }

  .btn-review:hover {
    background: #B91C1C;
    box-shadow: 0 2px 6px rgba(220, 38, 38, 0.3);
  }

  .btn-review:active {
    background: #991B1B;
  }

  @media (max-width: 640px) {
    .shield-banner {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
      padding: 12px 16px;
    }

    .btn-group {
      width: 100%;
    }

    button {
      flex: 1;
    }
  }
`;
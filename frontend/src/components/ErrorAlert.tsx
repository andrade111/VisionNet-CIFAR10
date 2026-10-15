import React, { useState } from 'react';
import type { ApiError } from '../types/api';
import { AlertTriangle, RefreshCw, Terminal, Check, X, ServerCrash } from 'lucide-react';

interface ErrorAlertProps {
  error: ApiError;
  onRetry: () => void;
  onDismiss: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  onRetry,
  onDismiss,
}) => {
  const [copied, setCopied] = useState(false);

  const commandText = 'python run.py';

  const handleCopy = () => {
    navigator.clipboard.writeText(commandText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`error-alert-wrapper ${error.isOffline ? 'offline-mode' : ''}`}>
      <div className="error-alert-content">
        <div className="error-icon-box">
          {error.isOffline ? (
            <ServerCrash size={24} className="error-icon" />
          ) : (
            <AlertTriangle size={24} className="error-icon" />
          )}
        </div>

        <div className="error-text-group">
          <div className="error-header-row">
            <h4 className="error-title">{error.message}</h4>
            {error.statusCode && (
              <span className="error-code-badge">HTTP {error.statusCode}</span>
            )}
          </div>

          <p className="error-detail">{error.detail}</p>

          {error.isOffline && (
            <div className="error-troubleshoot">
              <span className="troubleshoot-label">
                Inicie o servidor de inferência no terminal:
              </span>
              <div className="command-box">
                <Terminal size={14} className="terminal-icon" />
                <code className="cmd-text">{commandText}</code>
                <button
                  type="button"
                  className="copy-cmd-btn"
                  onClick={handleCopy}
                  title="Copiar comando"
                >
                  {copied ? <Check size={14} color="#10b981" /> : 'Copiar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="error-actions-group">
        <button type="button" className="retry-btn" onClick={onRetry}>
          <RefreshCw size={14} />
          <span>Tentar Novamente</span>
        </button>

        <button
          type="button"
          className="dismiss-btn"
          onClick={onDismiss}
          title="Fechar aviso"
          aria-label="Fechar"
        >
          <X size={16} />
        </button>
      </div>

      <style>{`
        .error-alert-wrapper {
          background: rgba(244, 63, 94, 0.08);
          border: 1px solid rgba(244, 63, 94, 0.35);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          animation: slideUp 0.25s ease-out;
          box-shadow: 0 4px 16px rgba(244, 63, 94, 0.15);
        }

        .offline-mode {
          background: rgba(245, 158, 11, 0.08);
          border-color: rgba(245, 158, 11, 0.35);
          box-shadow: 0 4px 16px rgba(245, 158, 11, 0.15);
        }

        .offline-mode .error-icon-box {
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.3);
        }

        .offline-mode .error-icon {
          color: var(--accent-amber);
        }

        .error-alert-content {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          flex: 1;
        }

        .error-icon-box {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          background: rgba(244, 63, 94, 0.15);
          border: 1px solid rgba(244, 63, 94, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .error-icon {
          color: var(--accent-rose);
        }

        .error-text-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .error-header-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .error-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .error-code-badge {
          font-size: 0.7rem;
          font-family: var(--font-mono);
          padding: 0.1rem 0.4rem;
          border-radius: var(--radius-xs);
          background: rgba(244, 63, 94, 0.2);
          color: var(--accent-rose);
        }

        .error-detail {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .error-troubleshoot {
          margin-top: 0.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .troubleshoot-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .command-box {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #040711;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xs);
          padding: 0.35rem 0.65rem;
          max-width: fit-content;
        }

        .terminal-icon {
          color: var(--accent-cyan);
        }

        .cmd-text {
          font-family: var(--font-mono);
          font-size: 0.825rem;
          color: #38bdf8;
        }

        .copy-cmd-btn {
          font-size: 0.72rem;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-xs);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .copy-cmd-btn:hover {
          color: var(--text-primary);
          border-color: var(--border-medium);
        }

        .error-actions-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .retry-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.45rem 0.75rem;
          border-radius: var(--radius-sm);
          background: var(--bg-surface);
          border: 1px solid var(--border-medium);
          color: var(--text-primary);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .retry-btn:hover {
          background: var(--bg-surface-elevated);
          border-color: var(--accent-cyan);
        }

        .dismiss-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dismiss-btn:hover {
          color: var(--text-primary);
        }

        @media (max-width: 640px) {
          .error-alert-wrapper {
            flex-direction: column;
          }
          .error-actions-group {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

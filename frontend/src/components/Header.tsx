import React from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { HealthResponse } from '../types/api';
import { API_BASE_URL } from '../services/api';

interface HeaderProps {
  health: HealthResponse | null;
  isLoadingHealth: boolean;
  onRefreshHealth: () => void;
  onOpenArchitecture: () => void;
  latencyMs: number | null;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  isLoadingHealth,
  onRefreshHealth,
  onOpenArchitecture,
  latencyMs,
}) => {
  const isHealthy = health?.status === 'healthy';
  const deviceName = health?.device?.name || (health?.device?.cuda_available ? 'CUDA' : 'CPU');

  return (
    <header className="header-container">
      <div className="header-brand">
        <div className="logo-badge">
          <Layers className="logo-icon" size={24} />
          <span className="logo-pulse"></span>
        </div>
        <div>
          <div className="brand-title-wrap">
            <h1 className="brand-title">VisionNet</h1>
            <span className="brand-version">v1.0</span>
          </div>
          <p className="brand-subtitle">Deep Learning CIFAR-10 Vision Classifier</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Backend Status Indicator */}
        <div className={`status-pill ${isHealthy ? 'status-online' : 'status-offline'}`}>
          <span className="status-dot"></span>
          <div className="status-details">
            <span className="status-label">
              {isLoadingHealth
                ? 'Conectando...'
                : isHealthy
                ? 'API Online'
                : 'API Desconectada'}
            </span>
            {isHealthy && (
              <span className="status-meta">
                <Cpu size={12} className="inline-icon" />
                {deviceName}
                {latencyMs !== null && ` • ${latencyMs}ms`}
              </span>
            )}
          </div>

          <button
            type="button"
            className="refresh-btn"
            onClick={onRefreshHealth}
            title="Atualizar status da API"
            disabled={isLoadingHealth}
          >
            <RefreshCw size={13} className={isLoadingHealth ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Architecture Details Trigger */}
        <button
          type="button"
          className="btn-secondary"
          onClick={onOpenArchitecture}
        >
          <Layers size={15} />
          <span>Arquitetura CNN</span>
        </button>

        {/* Swagger Docs Link */}
        <a
          href={`${API_BASE_URL}/docs`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
          title="Abrir documentação interativa Swagger OpenAPI"
        >
          <span>Swagger Docs</span>
          <ExternalLink size={14} />
        </a>
      </div>

      <style>{`
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 2rem;
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(7, 9, 14, 0.85);
          backdrop-filter: blur(16px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-badge {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%);
          border: 1px solid var(--border-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a5b4fc;
        }

        .logo-pulse {
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          opacity: 0.2;
          z-index: -1;
          filter: blur(4px);
        }

        .brand-title-wrap {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .brand-title {
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-version {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-full);
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          border: 1px solid rgba(99, 102, 241, 0.3);
          font-weight: 600;
        }

        .brand-subtitle {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          border: 1px solid var(--border-subtle);
          background: rgba(15, 23, 42, 0.6);
        }

        .status-online {
          border-color: rgba(16, 185, 129, 0.25);
          background: rgba(16, 185, 129, 0.08);
        }

        .status-offline {
          border-color: rgba(244, 63, 94, 0.25);
          background: rgba(244, 63, 94, 0.08);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-online .status-dot {
          background-color: #10b981;
          box-shadow: 0 0 10px #10b981;
        }

        .status-offline .status-dot {
          background-color: #f43f5e;
          box-shadow: 0 0 10px #f43f5e;
        }

        .status-details {
          display: flex;
          flex-direction: column;
        }

        .status-label {
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.1;
        }

        .status-meta {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .inline-icon {
          display: inline;
        }

        .refresh-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          padding: 2px;
          border-radius: 4px;
          transition: color var(--transition-fast);
        }

        .refresh-btn:hover {
          color: var(--text-primary);
        }

        .refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 0.95rem;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--border-light);
          transform: translateY(-1px);
        }

        .btn-ghost {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.82rem;
          text-decoration: none;
          transition: all var(--transition-fast);
        }

        .btn-ghost:hover {
          color: #a5b4fc;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          .header-actions {
            justify-content: space-between;
          }
        }
      `}</style>
    </header>
  );
};

import React from 'react';
import {
  Layers,
  Cpu,
  Moon,
  Sun,
  ExternalLink,
  Settings,
  Info,
} from 'lucide-react';
import type { HealthResponse } from '../types/api';

interface HeaderProps {
  backendHealth: HealthResponse | null;
  isBackendChecking: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenModelInfo: () => void;
  onOpenBackendStatus: () => void;
  apiUrl: string;
}

export const Header: React.FC<HeaderProps> = ({
  backendHealth,
  isBackendChecking,
  theme,
  onToggleTheme,
  onOpenModelInfo,
  onOpenBackendStatus,
  apiUrl,
}) => {
  const isHealthy = backendHealth?.status === 'healthy';
  const deviceName = backendHealth?.device?.name || (backendHealth?.device?.cuda_available ? 'CUDA' : 'CPU');

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
            <span className="brand-version font-mono">CIFAR-10</span>
          </div>
          <p className="brand-subtitle">Plataforma de Classificação de Imagens com Deep Learning</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Backend Status Pill */}
        <button
          type="button"
          className={`status-pill ${
            isBackendChecking
              ? 'status-checking'
              : isHealthy
              ? 'status-online'
              : 'status-offline'
          }`}
          onClick={onOpenBackendStatus}
          title="Clique para inspecionar configurações e status do servidor backend"
        >
          <span className="status-dot"></span>
          <div className="status-details">
            <span className="status-label">
              {isBackendChecking
                ? 'Conectando...'
                : isHealthy
                ? 'API Online'
                : 'API Desconectada'}
            </span>
            {isHealthy && (
              <span className="status-meta font-mono">
                <Cpu size={12} />
                {deviceName}
              </span>
            )}
          </div>
          <Settings size={13} className="status-settings-icon" />
        </button>

        {/* Model Architecture Info Button */}
        <button
          type="button"
          className="btn-header-secondary"
          onClick={onOpenModelInfo}
          title="Ver detalhes da arquitetura convolucional e hiperparâmetros"
        >
          <Info size={15} />
          <span>Arquitetura CNN</span>
        </button>

        {/* Swagger OpenAPI Docs Link */}
        <a
          href={`${apiUrl}/docs`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-header-ghost"
          title="Abrir documentação interativa Swagger OpenAPI"
        >
          <span>Swagger Docs</span>
          <ExternalLink size={14} />
        </a>

        {/* Theme Toggle Button */}
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Mudar para tema Claro' : 'Mudar para tema Escuro'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>

      <style>{`
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.15rem 2rem;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-glass-strong, rgba(7, 9, 14, 0.85));
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
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
          background: linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(139, 92, 246, 0.25) 100%);
          border: 1px solid rgba(0, 240, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-cyan);
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
        }

        .logo-pulse {
          position: absolute;
          inset: -3px;
          border-radius: inherit;
          background: linear-gradient(135deg, #00f0ff, #8b5cf6);
          opacity: 0.15;
          z-index: -1;
          filter: blur(6px);
        }

        .brand-title-wrap {
          display: flex;
          align-items: baseline;
          gap: 0.55rem;
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
          font-size: 0.72rem;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          background: rgba(0, 240, 255, 0.12);
          color: var(--accent-cyan);
          border: 1px solid rgba(0, 240, 255, 0.25);
          font-weight: 600;
          letter-spacing: 0.04em;
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
          gap: 0.65rem;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          border: 1px solid var(--border-subtle);
          background: var(--bg-glass, rgba(15, 23, 42, 0.6));
          cursor: pointer;
          transition: all var(--transition-fast, 0.2s ease);
        }

        .status-pill:hover {
          border-color: var(--border-medium, rgba(255, 255, 255, 0.2));
          transform: translateY(-1px);
        }

        .status-online {
          border-color: rgba(16, 185, 129, 0.3);
          background: rgba(16, 185, 129, 0.08);
        }

        .status-offline {
          border-color: rgba(244, 63, 94, 0.3);
          background: rgba(244, 63, 94, 0.08);
        }

        .status-checking {
          border-color: rgba(245, 158, 11, 0.3);
          background: rgba(245, 158, 11, 0.08);
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

        .status-checking .status-dot {
          background-color: #f59e0b;
          box-shadow: 0 0 10px #f59e0b;
        }

        .status-details {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .status-label {
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.1;
        }

        .status-meta {
          font-size: 0.68rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .status-settings-icon {
          color: var(--text-muted);
          margin-left: 0.2rem;
        }

        .btn-header-secondary {
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
          transition: all var(--transition-fast, 0.2s ease);
        }

        .btn-header-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--border-light, rgba(255, 255, 255, 0.15));
          transform: translateY(-1px);
        }

        .btn-header-ghost {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.82rem;
          text-decoration: none;
          transition: color var(--transition-fast, 0.2s ease);
        }

        .btn-header-ghost:hover {
          color: var(--accent-cyan);
        }

        .theme-toggle-btn {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast, 0.2s ease);
        }

        .theme-toggle-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
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

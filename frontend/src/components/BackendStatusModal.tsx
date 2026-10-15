import React, { useState, useEffect } from 'react';
import type { HealthResponse } from '../types/api';
import {
  Server,
  Activity,
  Cpu,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
} from 'lucide-react';

interface BackendStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: HealthResponse | null;
  isLoading: boolean;
  onRefreshHealth: () => void;
  currentUrl: string;
  onSaveUrl: (newUrl: string) => void;
  onResetUrl: () => void;
}

export const BackendStatusModal: React.FC<BackendStatusModalProps> = ({
  isOpen,
  onClose,
  health,
  isLoading,
  onRefreshHealth,
  currentUrl,
  onSaveUrl,
  onResetUrl,
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl);

  useEffect(() => {
    setUrlInput(currentUrl);
  }, [currentUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isHealthy = health && health.status === 'healthy';
  const device = health?.device;

  const formatUptime = (seconds?: number) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Server size={22} className="modal-icon" />
            <div>
              <h3 className="modal-title">Diagnóstico do Backend & Hardware</h3>
              <p className="modal-subtitle">
                Monitoramento em tempo real do servidor FastAPI e motor PyTorch
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Health Status Banner */}
          <div className={`health-banner ${isHealthy ? 'healthy' : 'degraded'}`}>
            <div className="banner-icon-box">
              {isHealthy ? (
                <CheckCircle2 size={24} className="banner-icon" />
              ) : (
                <AlertCircle size={24} className="banner-icon" />
              )}
            </div>
            <div className="banner-text">
              <h4 className="banner-title">
                {isHealthy ? 'Serviço Operando Normalmente' : 'Serviço Indisponível ou Desconectado'}
              </h4>
              <p className="banner-sub">
                {isHealthy
                  ? `${health?.project} v${health?.version} está respondendo na porta 8000.`
                  : 'O frontend não conseguiu estabelecer conexão com o endpoint de saúde (/api/v1/health).'}
              </p>
            </div>
            <button
              type="button"
              className="refresh-health-btn"
              onClick={onRefreshHealth}
              disabled={isLoading}
              title="Recarregar status"
            >
              <RefreshCw size={16} className={isLoading ? 'spin-icon' : ''} />
            </button>
          </div>

          {/* Device & Hardware Metrics */}
          {isHealthy && device && (
            <div className="tech-section">
              <h4 className="tech-section-title">
                <Cpu size={16} /> Aceleração de Hardware (Inference Engine)
              </h4>
              <div className="device-info-grid">
                <div className="device-item">
                  <span className="device-label">Dispositivo Ativo</span>
                  <span className="device-val highlight">{device.device.toUpperCase()}</span>
                </div>
                <div className="device-item">
                  <span className="device-label">Processador / GPU</span>
                  <span className="device-val">{device.name}</span>
                </div>
                <div className="device-item">
                  <span className="device-label">Suporte NVIDIA CUDA</span>
                  <span className="device-val">
                    {device.cuda_available ? 'Sim (Habilitado)' : 'Não (Executando via CPU)'}
                  </span>
                </div>
                <div className="device-item">
                  <span className="device-label">Tempo de Atividade (Uptime)</span>
                  <span className="device-val">{formatUptime(health?.uptime_seconds)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Config URL Section */}
          <div className="tech-section">
            <h4 className="tech-section-title">
              <Activity size={16} /> Configuração do Endpoint do Servidor
            </h4>
            <div className="url-config-box">
              <label htmlFor="api-url-input" className="url-label">
                URL Base do Backend FastAPI:
              </label>
              <div className="url-input-row">
                <input
                  id="api-url-input"
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="url-input"
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onSaveUrl(urlInput)}
                  title="Salvar nova URL e testar conexão"
                >
                  <Save size={15} />
                  <span>Salvar</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onResetUrl}
                  title="Restaurar padrão http://localhost:8000"
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>

      <style>{`
        .health-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.15rem;
          border-radius: var(--radius-md);
          border: 1px solid;
        }

        .health-banner.healthy {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .health-banner.healthy .banner-icon {
          color: var(--accent-emerald);
        }

        .health-banner.degraded {
          background: rgba(244, 63, 94, 0.08);
          border-color: rgba(244, 63, 94, 0.3);
        }

        .health-banner.degraded .banner-icon {
          color: var(--accent-rose);
        }

        .banner-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          background: var(--bg-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .banner-text {
          flex: 1;
        }

        .banner-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .banner-sub {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-top: 0.15rem;
        }

        .refresh-health-btn {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .refresh-health-btn:hover {
          color: var(--text-primary);
          border-color: var(--border-medium);
        }

        .device-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .device-item {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .device-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .device-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .device-val.highlight {
          color: var(--accent-cyan);
          font-family: var(--font-mono);
        }

        .url-config-box {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .url-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .url-input-row {
          display: flex;
          gap: 0.5rem;
        }

        .url-input {
          flex: 1;
          background: #040711;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          padding: 0.55rem 0.85rem;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 0.85rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .url-input:focus {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 0 2px var(--accent-cyan-subtle);
        }
      `}</style>
    </div>
  );
};

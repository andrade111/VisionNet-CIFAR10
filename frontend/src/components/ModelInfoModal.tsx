import React, { useEffect } from 'react';
import type { ModelInfoResponse } from '../types/api';
import { CIFAR10_CLASSES } from '../data/cifar10Classes';
import { Layers, X, CheckCircle, Box, HardDrive } from 'lucide-react';

interface ModelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelInfo: ModelInfoResponse | null;
  isLoading?: boolean;
}

export const ModelInfoModal: React.FC<ModelInfoModalProps> = ({
  isOpen,
  onClose,
  modelInfo,
}) => {
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Layers size={22} className="modal-icon" />
            <div>
              <h3 className="modal-title">Arquitetura VisionNet-CIFAR10</h3>
              <p className="modal-subtitle">
                Especificações Técnicas da Rede Neural Convolucional em PyTorch
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
          {/* Key Metric Cards */}
          <div className="model-stats-grid">
            <div className="model-stat-card">
              <span className="stat-label">Arquitetura</span>
              <span className="stat-value">VisionNet CNN</span>
              <span className="stat-sub">3 Blocos Convolucionais</span>
            </div>

            <div className="model-stat-card">
              <span className="stat-label">Total de Parâmetros</span>
              <span className="stat-value">
                {modelInfo ? modelInfo.total_parameters.toLocaleString('pt-BR') : '1.25M+'}
              </span>
              <span className="stat-sub">100% Treináveis</span>
            </div>

            <div className="model-stat-card">
              <span className="stat-label">Dimensão de Entrada</span>
              <span className="stat-value">3 × 32 × 32</span>
              <span className="stat-sub">RGB Normalizado [-1, 1]</span>
            </div>

            <div className="model-stat-card">
              <span className="stat-label">Classes de Saída</span>
              <span className="stat-value">10 Categorias</span>
              <span className="stat-sub">CIFAR-10 Benchmark</span>
            </div>
          </div>

          {/* Model Weights & File Details */}
          <div className="tech-section">
            <h4 className="tech-section-title">
              <HardDrive size={16} /> Pesos e Armazenamento
            </h4>
            <div className="tech-detail-box">
              <div className="tech-row">
                <span className="tech-label">Arquivo de Pesos:</span>
                <code className="tech-code">
                  {modelInfo?.weights_path || 'backend/weights/visionnet_cifar10.pth'}
                </code>
              </div>
              <div className="tech-row">
                <span className="tech-label">Status dos Pesos:</span>
                <span className="badge badge-success">
                  <CheckCircle size={12} /> Carregados com Sucesso
                </span>
              </div>
              <div className="tech-row">
                <span className="tech-label">Função de Ativação:</span>
                <span className="tech-val">ReLU + BatchNorm + Dropout(0.25)</span>
              </div>
            </div>
          </div>

          {/* 10 Classes Catalog */}
          <div className="tech-section">
            <h4 className="tech-section-title">
              <Box size={16} /> Categorias Canônicas do CIFAR-10
            </h4>
            <div className="classes-grid">
              {CIFAR10_CLASSES.map((c) => (
                <div key={c.index} className="class-item-pill">
                  <span className="class-item-index">#{c.index}</span>
                  <span className="class-item-emoji">{c.emoji}</span>
                  <div className="class-item-names">
                    <span className="class-item-pt">{c.namePt}</span>
                    <span className="class-item-en">{c.label}</span>
                  </div>
                </div>
              ))}
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
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .modal-icon {
          color: var(--accent-cyan);
        }

        .modal-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .modal-subtitle {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.35rem;
          border-radius: var(--radius-sm);
        }

        .modal-close-btn:hover {
          color: var(--text-primary);
          background: var(--bg-surface-elevated);
        }

        .modal-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .model-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.85rem;
        }

        .model-stat-card {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: var(--accent-cyan);
        }

        .stat-sub {
          font-size: 0.72rem;
          color: var(--text-secondary);
        }

        .tech-section {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .tech-section-title {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .tech-section-title svg {
          color: var(--accent-cyan);
        }

        .tech-detail-box {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .tech-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.825rem;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .tech-label {
          color: var(--text-muted);
        }

        .tech-code {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          background: #040711;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-xs);
          color: #38bdf8;
          border: 1px solid var(--border-subtle);
        }

        .tech-val {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .classes-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .class-item-pill {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          padding: 0.45rem 0.75rem;
          border-radius: var(--radius-sm);
        }

        .class-item-index {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
          width: 20px;
        }

        .class-item-emoji {
          font-size: 1.1rem;
        }

        .class-item-names {
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
        }

        .class-item-pt {
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .class-item-en {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: flex-end;
        }

        @media (max-width: 580px) {
          .model-stats-grid,
          .classes-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

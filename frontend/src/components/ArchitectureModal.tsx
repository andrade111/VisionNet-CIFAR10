import React from 'react';
import { X, Layers, Cpu, Database, CheckCircle2, Sliders } from 'lucide-react';
import { ModelInfoResponse } from '../types/api';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelInfo: ModelInfoResponse | null;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
  modelInfo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="modal-title">Arquitetura VisionNet CNN</h2>
              <p className="modal-subtitle">Especificações Técnicas e Topologia da Rede Neural</p>
            </div>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quick Metrics Cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Parâmetros Totais</span>
              <span className="metric-value font-mono">
                {modelInfo?.total_parameters?.toLocaleString('pt-BR') || '62.006'}
              </span>
              <span className="metric-note">100% Treináveis</span>
            </div>

            <div className="metric-card">
              <span className="metric-label">Entrada da Rede</span>
              <span className="metric-value font-mono">3 × 32 × 32</span>
              <span className="metric-note">Tensores RGB Padronizados</span>
            </div>

            <div className="metric-card">
              <span className="metric-label">Classes de Saída</span>
              <span className="metric-value font-mono">
                {modelInfo?.num_classes || 10} Categorias
              </span>
              <span className="metric-note">Dataset CIFAR-10</span>
            </div>

            <div className="metric-card">
              <span className="metric-label">Pesos Carregados</span>
              <span className="metric-value font-mono text-emerald">
                {modelInfo?.weights_loaded ? 'Sim (Ativo)' : 'Inicializados'}
              </span>
              <span className="metric-note">visionnet_cifar10.pth</span>
            </div>
          </div>

          {/* Neural Pipeline Diagram */}
          <div className="section-title">Topologia de Camadas (Forward Pass)</div>
          <div className="pipeline-container font-mono">
            <div className="pipeline-step">
              <div className="step-tag tag-input">INPUT</div>
              <div className="step-desc">
                <strong>Imagem de Entrada</strong>: 3 canais RGB (32x32), normalização [-1, 1]
              </div>
            </div>

            <div className="pipeline-arrow">↓ Conv2D (in=3, out=6, kernel=5x5) + ReLU + MaxPool2d (2x2, stride=2)</div>

            <div className="pipeline-step">
              <div className="step-tag tag-conv">CONV 1</div>
              <div className="step-desc">
                <strong>Feature Map 1</strong>: 6 canais × 14 × 14 pixels (1.176 ativações)
              </div>
            </div>

            <div className="pipeline-arrow">↓ Conv2D (in=6, out=16, kernel=5x5) + ReLU + MaxPool2d (2x2, stride=2)</div>

            <div className="pipeline-step">
              <div className="step-tag tag-conv">CONV 2</div>
              <div className="step-desc">
                <strong>Feature Map 2</strong>: 16 canais × 5 × 5 pixels (400 features extraídas)
              </div>
            </div>

            <div className="pipeline-arrow">↓ Flatten (16 * 5 * 5 = 400)</div>

            <div className="pipeline-step">
              <div className="step-tag tag-fc">FC 1</div>
              <div className="step-desc">
                <strong>Camada Linear 1</strong>: 400 entradas → 120 neurônios + ReLU
              </div>
            </div>

            <div className="pipeline-arrow">↓ Linear (120 → 84) + ReLU</div>

            <div className="pipeline-step">
              <div className="step-tag tag-fc">FC 2</div>
              <div className="step-desc">
                <strong>Camada Linear 2</strong>: 120 entradas → 84 neurônios + ReLU
              </div>
            </div>

            <div className="pipeline-arrow">↓ Linear (84 → 10) + Softmax Normalizer</div>

            <div className="pipeline-step step-output">
              <div className="step-tag tag-output">OUTPUT</div>
              <div className="step-desc">
                <strong>Distribuição de Probabilidade</strong>: 10 logits normalizados em [0, 1]
              </div>
            </div>
          </div>

          {/* Normalization & Hyperparameters Details */}
          <div className="hyperparams-grid">
            <div className="hyperparam-box">
              <span className="hp-title">Pré-Processamento & Normalização</span>
              <p className="hp-desc">
                Média: <code>(0.5, 0.5, 0.5)</code> | Desvio Padrão: <code>(0.5, 0.5, 0.5)</code>.
                Mapeamento de pixels [0, 255] para espaço normalizado [-1, 1].
              </p>
            </div>
            <div className="hyperparam-box">
              <span className="hp-title">Hiperparâmetros de Treinamento</span>
              <p className="hp-desc">
                Otimizador: <code>Adam (lr=0.001)</code> | Perda: <code>CrossEntropyLoss</code> | Lote: <code>64</code> | Épocas: <code>10</code>.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(3, 7, 18, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1.5rem;
          animation: fadeIn 0.2s ease;
        }

        .modal-container {
          width: 720px;
          max-width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          background: #0d121f;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .modal-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .modal-icon-badge {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: rgba(99, 102, 241, 0.15);
          color: #a5b4fc;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: flex;
        }

        .close-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
        }

        .modal-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }

        .metric-card {
          padding: 0.85rem;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .metric-label {
          font-size: 0.72rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .metric-value {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .text-emerald {
          color: #34d399;
        }

        .metric-note {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .section-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pipeline-container {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          background: rgba(8, 12, 22, 0.6);
          padding: 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          font-size: 0.8rem;
        }

        .pipeline-step {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          padding: 0.6rem 0.85rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .step-tag {
          font-size: 0.68rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 700;
        }

        .tag-input {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
        }

        .tag-conv {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
        }

        .tag-fc {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
        }

        .tag-output {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }

        .step-desc {
          color: var(--text-secondary);
        }

        .pipeline-arrow {
          font-size: 0.7rem;
          color: var(--text-muted);
          padding-left: 1.5rem;
        }

        .hyperparams-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .hyperparam-box {
          background: rgba(15, 23, 42, 0.4);
          padding: 0.85rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }

        .hp-title {
          font-size: 0.78rem;
          font-weight: 600;
          color: #a5b4fc;
          display: block;
          margin-bottom: 0.35rem;
        }

        .hp-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: flex-end;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #ffffff;
          border: none;
          padding: 0.55rem 1.25rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 640px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .hyperparams-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

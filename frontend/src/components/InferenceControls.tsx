import React from 'react';
import { Loader2, Zap, Sliders, CheckSquare, Square } from 'lucide-react';

interface InferenceControlsProps {
  onRunInference: () => void;
  isLoading: boolean;
  hasImage: boolean;
  topK: number;
  onChangeTopK: (val: number) => void;
  autoClassify: boolean;
  onToggleAutoClassify: () => void;
}

export const InferenceControls: React.FC<InferenceControlsProps> = ({
  onRunInference,
  isLoading,
  hasImage,
  topK,
  onChangeTopK,
  autoClassify,
  onToggleAutoClassify,
}) => {
  return (
    <div className="inference-controls-wrapper">
      <div className="controls-options-row">
        {/* Top-K Selector */}
        <div className="top-k-group">
          <Sliders size={14} className="control-icon" />
          <span className="control-label">Retornar Top-K:</span>
          <div className="top-k-pills">
            {[3, 5, 10].map((k) => (
              <button
                key={k}
                type="button"
                className={`top-k-pill ${topK === k ? 'active' : ''}`}
                onClick={() => onChangeTopK(k)}
                disabled={isLoading}
              >
                Top {k}
              </button>
            ))}
          </div>
        </div>

        {/* Auto Classify Checkbox */}
        <button
          type="button"
          className="auto-classify-btn"
          onClick={onToggleAutoClassify}
          title="Classificar imagem automaticamente assim que selecionada"
          disabled={isLoading}
        >
          {autoClassify ? (
            <CheckSquare size={16} className="checkbox-icon checked" />
          ) : (
            <Square size={16} className="checkbox-icon" />
          )}
          <span>Auto-classificar ao carregar</span>
        </button>
      </div>

      {/* Primary Submit Button */}
      <button
        type="button"
        className="btn-inference-submit"
        onClick={onRunInference}
        disabled={!hasImage || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="spin-icon" />
            <span>Processando com VisionNet...</span>
          </>
        ) : (
          <>
            <Zap size={20} className="zap-icon" />
            <span>Classificar Imagem</span>
            <span className="kbd-shortcut">↵ Enter</span>
          </>
        )}
      </button>

      <style>{`
        .inference-controls-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          width: 100%;
        }

        .controls-options-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding: 0.5rem 0.25rem;
        }

        .top-k-group {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.825rem;
          color: var(--text-secondary);
        }

        .control-icon {
          color: var(--accent-cyan);
        }

        .control-label {
          font-weight: 500;
        }

        .top-k-pills {
          display: flex;
          gap: 0.25rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          padding: 2px;
          border-radius: var(--radius-sm);
        }

        .top-k-pill {
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-xs);
          font-size: 0.75rem;
          font-weight: 600;
          font-family: var(--font-mono);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .top-k-pill:hover:not(:disabled) {
          color: var(--text-primary);
        }

        .top-k-pill.active {
          background: var(--accent-cyan);
          color: #040711;
          box-shadow: 0 0 10px var(--accent-cyan-subtle);
        }

        .auto-classify-btn {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.825rem;
          font-weight: 500;
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        .auto-classify-btn:hover {
          color: var(--text-primary);
        }

        .checkbox-icon {
          color: var(--text-muted);
        }

        .checkbox-icon.checked {
          color: var(--accent-cyan);
        }

        .btn-inference-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          padding: 0.95rem 1.5rem;
          border-radius: var(--radius-md);
          background: var(--gradient-brand);
          color: #ffffff;
          font-size: 1.05rem;
          font-weight: 700;
          font-family: var(--font-main);
          letter-spacing: -0.01em;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px var(--accent-cyan-glow);
          transition: all var(--transition-base);
          position: relative;
          overflow: hidden;
        }

        .btn-inference-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px var(--accent-cyan-glow);
          filter: brightness(1.1);
        }

        .btn-inference-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-inference-submit:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
          filter: grayscale(40%);
        }

        .zap-icon {
          color: #00f0ff;
          filter: drop-shadow(0 0 4px #00f0ff);
        }

        .kbd-shortcut {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          background: rgba(0, 0, 0, 0.25);
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-xs);
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-left: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </div>
  );
};

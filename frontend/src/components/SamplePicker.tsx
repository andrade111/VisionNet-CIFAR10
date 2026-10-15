import React from 'react';
import { SAMPLE_IMAGES, svgSampleToFile } from '../data/sampleImages';
import type { SampleImage } from '../data/sampleImages';
import { Sparkles } from 'lucide-react';

interface SamplePickerProps {
  onSelectSample: (file: File) => void;
  isLoading: boolean;
}

export const SamplePicker: React.FC<SamplePickerProps> = ({
  onSelectSample,
  isLoading,
}) => {
  const handleSampleClick = async (sample: SampleImage) => {
    if (isLoading) return;
    try {
      const file = await svgSampleToFile(sample);
      onSelectSample(file);
    } catch (err) {
      console.error('Erro ao converter sample SVG:', err);
    }
  };

  return (
    <div className="sample-picker-container">
      <div className="sample-picker-header">
        <div className="sample-picker-title">
          <Sparkles size={16} className="sparkle-icon" />
          <span>Amostras Rápidas CIFAR-10 (Teste com 1 Clique)</span>
        </div>
        <span className="sample-picker-hint">10 classes</span>
      </div>

      <div className="sample-grid">
        {SAMPLE_IMAGES.map((sample) => (
          <button
            key={sample.id}
            type="button"
            className="sample-chip"
            onClick={() => handleSampleClick(sample)}
            disabled={isLoading}
            title={`Carregar amostra de teste: ${sample.namePt} (${sample.label})`}
          >
            <span className="sample-emoji">{sample.emoji}</span>
            <span className="sample-name">{sample.namePt}</span>
          </button>
        ))}
      </div>

      <style>{`
        .sample-picker-container {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-top: 0.25rem;
        }

        .sample-picker-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sample-picker-title {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .sparkle-icon {
          color: var(--accent-cyan);
        }

        .sample-picker-hint {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
        }

        .sample-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
        }

        @media (max-width: 640px) {
          .sample-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .sample-chip {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 0.65rem;
          border-radius: var(--radius-sm);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
          user-select: none;
          text-align: left;
        }

        .sample-chip:hover:not(:disabled) {
          background: var(--bg-surface-elevated);
          border-color: var(--accent-cyan);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--accent-cyan-subtle);
        }

        .sample-chip:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .sample-emoji {
          font-size: 1.05rem;
          line-height: 1;
        }

        .sample-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
};

import React, { useState } from 'react';
import type { PredictionResponse, ClassProbability } from '../types/api';
import { CIFAR10_CLASSES } from '../data/cifar10Classes';
import { BarChart3, ArrowDownUp, CheckCircle } from 'lucide-react';

interface ConfidenceBarsProps {
  predictionResponse: PredictionResponse;
}

export const ConfidenceBars: React.FC<ConfidenceBarsProps> = ({
  predictionResponse,
}) => {
  const [sortBy, setSortBy] = useState<'probability' | 'index'>('probability');

  const { prediction } = predictionResponse;
  const topIndex = prediction.predicted_class_index;

  // Build the complete 10-class list from all_probabilities or top_k
  const allClassesData: (ClassProbability & {
    emoji: string;
    accentColor: string;
    isWinner: boolean;
  })[] = CIFAR10_CLASSES.map((c) => {
    const rawProb = prediction.all_probabilities[c.label] ?? 0;
    const pct = rawProb * 100;
    const isWinner = c.index === topIndex;

    return {
      class_index: c.index,
      label: c.label,
      display_name: c.nameEn,
      display_pt: c.namePt,
      probability: rawProb,
      confidence_percentage: pct,
      emoji: c.emoji,
      accentColor: c.accentColor,
      isWinner,
    };
  });

  // Sort based on user toggle
  const sortedClasses = [...allClassesData].sort((a, b) => {
    if (sortBy === 'probability') {
      return b.confidence_percentage - a.confidence_percentage;
    }
    return a.class_index - b.class_index;
  });

  return (
    <div className="confidence-bars-card">
      <div className="bars-header">
        <div className="bars-title-group">
          <BarChart3 size={18} className="bars-header-icon" />
          <h3 className="bars-title">Distribuição de Probabilidades (10 Classes)</h3>
        </div>

        {/* Sort Toggle */}
        <button
          type="button"
          className="sort-toggle-btn"
          onClick={() => setSortBy(sortBy === 'probability' ? 'index' : 'probability')}
          title="Alternar ordenação entre maior probabilidade e ordem padrão CIFAR-10"
        >
          <ArrowDownUp size={13} />
          <span>
            {sortBy === 'probability' ? 'Maior Probabilidade' : 'Ordem Padrão (0-9)'}
          </span>
        </button>
      </div>

      <div className="bars-list">
        {sortedClasses.map((item) => {
          const widthPct = Math.max(item.confidence_percentage, 0.5);

          return (
            <div
              key={item.label}
              className={`bar-row-item ${item.isWinner ? 'winner-row' : ''}`}
            >
              <div className="bar-label-group">
                <span className="bar-class-index">#{item.class_index}</span>
                <span className="bar-emoji">{item.emoji}</span>
                <div className="bar-names">
                  <span className="bar-name-pt">{item.display_pt}</span>
                  <span className="bar-name-en">({item.label})</span>
                </div>
              </div>

              {/* Progress Track & Fill */}
              <div className="bar-progress-container">
                <div className="bar-progress-track">
                  <div
                    className="bar-progress-fill"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: item.accentColor,
                      boxShadow: item.isWinner
                        ? `0 0 14px ${item.accentColor}88`
                        : undefined,
                    }}
                  />
                </div>
              </div>

              {/* Numerical Value */}
              <div className="bar-value-group">
                <span className={`bar-value ${item.isWinner ? 'highlight-winner' : ''}`}>
                  {item.confidence_percentage.toFixed(2)}%
                </span>
                {item.isWinner && (
                  <CheckCircle size={14} className="winner-check-icon" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .confidence-bars-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .bars-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.65rem;
          border-bottom: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .bars-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .bars-header-icon {
          color: var(--accent-cyan);
        }

        .bars-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .sort-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-sm);
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .sort-toggle-btn:hover {
          color: var(--text-primary);
          border-color: var(--border-medium);
        }

        .bars-list {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .bar-row-item {
          display: grid;
          grid-template-columns: 170px 1fr 85px;
          align-items: center;
          gap: 0.85rem;
          padding: 0.35rem 0.5rem;
          border-radius: var(--radius-sm);
          transition: background-color var(--transition-fast);
        }

        .bar-row-item:hover {
          background: var(--bg-surface-elevated);
        }

        .winner-row {
          background: rgba(0, 240, 255, 0.05);
          border: 1px solid rgba(0, 240, 255, 0.2);
        }

        .bar-label-group {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          overflow: hidden;
        }

        .bar-class-index {
          font-size: 0.68rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
          width: 22px;
          flex-shrink: 0;
        }

        .bar-emoji {
          font-size: 1.1rem;
          line-height: 1;
          flex-shrink: 0;
        }

        .bar-names {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bar-name-pt {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .bar-name-en {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .bar-progress-container {
          width: 100%;
        }

        .bar-progress-track {
          width: 100%;
          height: 10px;
          background: var(--bg-surface-elevated);
          border-radius: var(--radius-full);
          overflow: hidden;
          position: relative;
        }

        .bar-progress-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bar-value-group {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.35rem;
        }

        .bar-value {
          font-size: 0.825rem;
          font-family: var(--font-mono);
          font-weight: 600;
          color: var(--text-secondary);
        }

        .highlight-winner {
          color: var(--accent-cyan);
          font-weight: 700;
        }

        .winner-check-icon {
          color: var(--accent-cyan);
        }

        @media (max-width: 600px) {
          .bar-row-item {
            grid-template-columns: 130px 1fr 65px;
            gap: 0.5rem;
          }
          .bar-name-en {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

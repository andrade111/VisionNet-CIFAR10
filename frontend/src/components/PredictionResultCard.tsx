import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Clock,
  Cpu,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';
import { PredictionResponse } from '../types/api';
import { getClassByLabel, getClassByIndex } from '../data/cifar10Classes';

interface PredictionResultCardProps {
  result: PredictionResponse;
  networkLatencyMs?: number | null;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  result,
  networkLatencyMs,
}) => {
  const [showAllClasses, setShowAllClasses] = useState(false);

  const topPrediction = result.prediction;
  const classMeta =
    getClassByLabel(topPrediction.predicted_label) ||
    getClassByIndex(topPrediction.predicted_class_index);

  const isVehicle = classMeta.category === 'vehicle';
  const accentColor = classMeta.accentColor || '#6366f1';

  // Format all classes sorted by probability
  const sortedAllClasses = Object.entries(topPrediction.all_probabilities)
    .map(([label, prob]) => {
      const meta = getClassByLabel(label);
      return {
        label,
        namePt: meta?.namePt || label,
        nameEn: meta?.nameEn || label,
        emoji: meta?.emoji || '🏷️',
        color: meta?.accentColor || '#64748b',
        probability: prob,
        percentage: prob * 100,
      };
    })
    .sort((a, b) => b.probability - a.probability);

  return (
    <div className="result-card glass-panel">
      {/* Top Prediction Hero Banner */}
      <div className="hero-banner" style={{ '--accent': accentColor } as React.CSSProperties}>
        <div className="hero-left">
          <div className="prediction-emoji-badge">
            <span className="emoji-display">{classMeta.emoji}</span>
            <div className="emoji-halo"></div>
          </div>

          <div className="prediction-meta">
            <div className="prediction-category-pill">
              {isVehicle ? '🚗 Veículo' : '🐾 Animal'}
            </div>
            <h3 className="prediction-title-pt">{topPrediction.display_pt}</h3>
            <span className="prediction-title-en font-mono">
              CIFAR-10: <strong>{topPrediction.predicted_label}</strong> ({topPrediction.display_name})
            </span>
          </div>
        </div>

        <div className="hero-right">
          <span className="confidence-label">Confiança do Modelo</span>
          <div className="confidence-value-wrap">
            <span className="confidence-number font-mono">
              {topPrediction.confidence_percentage.toFixed(1)}
            </span>
            <span className="confidence-symbol">%</span>
          </div>
          <div className="confidence-track">
            <div
              className="confidence-fill"
              style={{ width: `${topPrediction.confidence_percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Latency & Device Performance Pills */}
      <div className="metrics-strip">
        <div className="metric-item">
          <Zap size={14} className="metric-icon text-amber" />
          <span className="metric-title">Inferência PyTorch:</span>
          <span className="metric-val font-mono">{result.inference_time_ms.toFixed(2)} ms</span>
        </div>

        {networkLatencyMs !== undefined && networkLatencyMs !== null && (
          <div className="metric-item">
            <Clock size={14} className="metric-icon text-indigo" />
            <span className="metric-title">Round-trip HTTP:</span>
            <span className="metric-val font-mono">{networkLatencyMs} ms</span>
          </div>
        )}

        <div className="metric-item">
          <Cpu size={14} className="metric-icon text-emerald" />
          <span className="metric-title">Dispositivo:</span>
          <span className="metric-val font-mono uppercase">{result.device}</span>
        </div>

        <div className="metric-item">
          <Maximize2 size={14} className="metric-icon text-cyan" />
          <span className="metric-title">Tensor CNN:</span>
          <span className="metric-val font-mono">32×32 RGB</span>
        </div>
      </div>

      {/* Probability Distribution List (Top-K) */}
      <div className="prob-section">
        <div className="prob-header">
          <div className="prob-title-wrap">
            <BarChart3 size={16} className="text-indigo" />
            <h4 className="prob-title">Distribuição de Probabilidades (Top {topPrediction.top_k.length})</h4>
          </div>

          <button
            type="button"
            className="toggle-all-btn"
            onClick={() => setShowAllClasses(!showAllClasses)}
          >
            <span>{showAllClasses ? 'Ocultar Todas' : 'Ver Todas as 10 Classes'}</span>
            {showAllClasses ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <div className="prob-list">
          {topPrediction.top_k.map((item, index) => {
            const meta = getClassByLabel(item.label) || getClassByIndex(item.class_index);
            const isTop = index === 0;

            return (
              <div key={item.label} className={`prob-row ${isTop ? 'prob-row-top' : ''}`}>
                <div className="prob-info">
                  <span className="prob-rank font-mono">#{index + 1}</span>
                  <span className="prob-emoji">{meta.emoji}</span>
                  <div className="prob-name-wrap">
                    <span className="prob-name-pt">{item.display_pt}</span>
                    <span className="prob-name-en font-mono">({item.label})</span>
                  </div>
                </div>

                <div className="prob-bar-container">
                  <div className="prob-bar-track">
                    <div
                      className="prob-bar-fill"
                      style={{
                        width: `${item.confidence_percentage}%`,
                        backgroundColor: meta.accentColor || '#6366f1',
                      }}
                    ></div>
                  </div>
                  <span className="prob-pct font-mono">
                    {item.confidence_percentage.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expandable 10-Class Full Distribution */}
        {showAllClasses && (
          <div className="all-classes-panel">
            <div className="all-classes-title">Ranking Completo dos 10 Logits:</div>
            <div className="all-classes-grid">
              {sortedAllClasses.map((item, idx) => (
                <div key={item.label} className="class-grid-item">
                  <div className="grid-item-head">
                    <span className="grid-rank font-mono">#{idx + 1}</span>
                    <span className="grid-emoji">{item.emoji}</span>
                    <span className="grid-label">{item.namePt}</span>
                  </div>
                  <div className="grid-item-bar-track">
                    <div
                      className="grid-item-bar-fill"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                  <span className="grid-pct font-mono">{item.percentage.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .result-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border-color: rgba(99, 102, 241, 0.2);
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-radius: var(--radius-md);
          background: linear-gradient(
            135deg,
            rgba(15, 23, 42, 0.8) 0%,
            rgba(30, 41, 59, 0.6) 100%
          );
          border: 1px solid var(--border-light);
          position: relative;
          overflow: hidden;
        }

        .hero-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--accent);
          box-shadow: 0 0 12px var(--accent);
        }

        .hero-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .prediction-emoji-badge {
          position: relative;
          width: 72px;
          height: 72px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .emoji-display {
          font-size: 2.2rem;
        }

        .emoji-halo {
          position: absolute;
          inset: -4px;
          border-radius: inherit;
          background: var(--accent);
          opacity: 0.15;
          filter: blur(8px);
          z-index: -1;
        }

        .prediction-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }

        .prediction-category-pill {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .prediction-title-pt {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          line-height: 1.15;
        }

        .prediction-title-en {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .hero-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .confidence-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
        }

        .confidence-value-wrap {
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .confidence-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }

        .confidence-symbol {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--accent);
        }

        .confidence-track {
          width: 140px;
          height: 6px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.1);
          overflow: hidden;
          margin-top: 0.25rem;
        }

        .confidence-fill {
          height: 100%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
          border-radius: inherit;
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .metrics-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }

        .metric-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid var(--border-subtle);
          font-size: 0.8rem;
        }

        .metric-title {
          color: var(--text-secondary);
        }

        .metric-val {
          font-weight: 600;
          color: var(--text-primary);
          margin-left: auto;
        }

        .text-amber { color: #f59e0b; }
        .text-indigo { color: #818cf8; }
        .text-emerald { color: #10b981; }
        .text-cyan { color: #06b6d4; }

        .prob-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-subtle);
        }

        .prob-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .prob-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .prob-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .toggle-all-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: transparent;
          border: none;
          color: #a5b4fc;
          font-size: 0.78rem;
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        .toggle-all-btn:hover {
          color: #ffffff;
        }

        .prob-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .prob-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.85rem;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          transition: background var(--transition-fast);
        }

        .prob-row:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .prob-row-top {
          background: rgba(99, 102, 241, 0.08);
          border-color: rgba(99, 102, 241, 0.25);
        }

        .prob-info {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          width: 220px;
        }

        .prob-rank {
          font-size: 0.75rem;
          color: var(--text-muted);
          width: 22px;
        }

        .prob-emoji {
          font-size: 1.1rem;
        }

        .prob-name-wrap {
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
        }

        .prob-name-pt {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .prob-name-en {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .prob-bar-container {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          max-width: 480px;
        }

        .prob-bar-track {
          flex: 1;
          height: 8px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        .prob-bar-fill {
          height: 100%;
          border-radius: inherit;
          transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .prob-pct {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
          width: 60px;
          text-align: right;
        }

        .all-classes-panel {
          padding: 1rem;
          border-radius: var(--radius-md);
          background: rgba(8, 12, 22, 0.6);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          animation: fadeIn 0.2s ease;
        }

        .all-classes-title {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          font-weight: 600;
        }

        .all-classes-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .class-grid-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.4rem 0.6rem;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.02);
          font-size: 0.78rem;
        }

        .grid-item-head {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          width: 110px;
        }

        .grid-rank {
          color: var(--text-muted);
          font-size: 0.7rem;
        }

        .grid-emoji {
          font-size: 0.9rem;
        }

        .grid-label {
          color: var(--text-primary);
          font-weight: 500;
        }

        .grid-item-bar-track {
          flex: 1;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }

        .grid-item-bar-fill {
          height: 100%;
        }

        .grid-pct {
          font-size: 0.72rem;
          color: var(--text-secondary);
          width: 48px;
          text-align: right;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
          }
          .hero-right {
            align-items: flex-start;
            width: 100%;
          }
          .confidence-track {
            width: 100%;
          }
          .metrics-strip {
            grid-template-columns: repeat(2, 1fr);
          }
          .all-classes-grid {
            grid-template-columns: 1fr;
          }
          .prob-info {
            width: 160px;
          }
        }
      `}</style>
    </div>
  );
};

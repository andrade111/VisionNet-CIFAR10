import React from 'react';
import type { PredictionResponse } from '../types/api';
import { getClassByIndex } from '../data/cifar10Classes';
import { Award, Zap, Clock, Cpu, ShieldCheck } from 'lucide-react';

interface PredictionHeroProps {
  predictionResponse: PredictionResponse;
}

export const PredictionHero: React.FC<PredictionHeroProps> = ({
  predictionResponse,
}) => {
  const { prediction, inference_time_ms, total_time_ms, device } = predictionResponse;
  const classDef = getClassByIndex(prediction.predicted_class_index);

  const confidencePct = prediction.confidence_percentage;
  const strokeDashoffset = 283 - (283 * confidencePct) / 100;

  return (
    <div className="hero-prediction-card">
      <div className="hero-top-badge-row">
        <div className="prediction-winner-badge">
          <Award size={15} />
          <span>Predição Principal VisionNet</span>
        </div>
        <span className="class-index-tag">CIFAR-10 #{prediction.predicted_class_index}</span>
      </div>

      <div className="hero-main-content">
        {/* Left: Class Identity & Emoji */}
        <div className="class-identity-group">
          <div
            className="class-avatar"
            style={{
              borderColor: classDef.accentColor,
              boxShadow: `0 0 24px ${classDef.accentColor}33`,
            }}
          >
            <span className="class-avatar-emoji">{classDef.emoji}</span>
          </div>

          <div className="class-names-group">
            <div className="class-name-pt-row">
              <h2 className="class-name-pt">{prediction.display_pt}</h2>
              <span
                className="category-pill"
                style={{
                  color: classDef.accentColor,
                  borderColor: `${classDef.accentColor}44`,
                  background: `${classDef.accentColor}15`,
                }}
              >
                {classDef.category === 'vehicle' ? 'Veículo' : 'Animal'}
              </span>
            </div>
            <p className="class-name-en">
              Nome canônico: <strong>{prediction.predicted_label}</strong> ({prediction.display_name})
            </p>
            <p className="class-desc-micro">{classDef.description}</p>
          </div>
        </div>

        {/* Right: Circular Confidence Radial Gauge */}
        <div className="confidence-gauge-group">
          <div className="gauge-svg-container">
            <svg className="gauge-svg" viewBox="0 0 100 100">
              <circle
                className="gauge-track"
                cx="50"
                cy="50"
                r="45"
                strokeWidth="8"
              />
              <circle
                className="gauge-fill"
                cx="50"
                cy="50"
                r="45"
                strokeWidth="8"
                stroke={classDef.accentColor}
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="gauge-center-text">
              <span className="gauge-val">{confidencePct.toFixed(1)}%</span>
              <span className="gauge-sub">Confiança</span>
            </div>
          </div>
        </div>
      </div>

      {/* Latency & Hardware Metrics Footer */}
      <div className="hero-metrics-footer">
        <div className="metric-pill">
          <Clock size={13} className="metric-icon" />
          <span className="metric-lbl">Inference:</span>
          <span className="metric-val">{inference_time_ms.toFixed(2)} ms</span>
        </div>

        <div className="metric-divider" />

        <div className="metric-pill">
          <Zap size={13} className="metric-icon" />
          <span className="metric-lbl">Total API:</span>
          <span className="metric-val">{total_time_ms.toFixed(2)} ms</span>
        </div>

        <div className="metric-divider" />

        <div className="metric-pill">
          <Cpu size={13} className="metric-icon" />
          <span className="metric-lbl">Dispositivo:</span>
          <span className="metric-val highlight">{device.toUpperCase()}</span>
        </div>

        <div className="metric-divider" />

        <div className="metric-pill">
          <ShieldCheck size={13} className="metric-icon status-ok" />
          <span className="metric-lbl">Status:</span>
          <span className="metric-val status-ok">Verificado</span>
        </div>
      </div>

      <style>{`
        .hero-prediction-card {
          position: relative;
          background: linear-gradient(135deg, rgba(24, 34, 61, 0.9) 0%, rgba(14, 20, 36, 0.95) 100%);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-lg), 0 0 32px rgba(0, 240, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }

        .hero-prediction-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--gradient-brand);
        }

        .hero-top-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .prediction-winner-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--accent-cyan);
          background: var(--accent-cyan-subtle);
          border: 1px solid rgba(0, 240, 255, 0.3);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
        }

        .class-index-tag {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
          background: var(--bg-surface);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-xs);
          border: 1px solid var(--border-subtle);
        }

        .hero-main-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .class-identity-group {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex: 1;
          min-width: 240px;
        }

        .class-avatar {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-lg);
          background: var(--bg-surface-elevated);
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform var(--transition-base);
        }

        .class-avatar-emoji {
          font-size: 2.25rem;
          line-height: 1;
        }

        .class-names-group {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .class-name-pt-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .class-name-pt {
          font-size: 1.85rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          line-height: 1.1;
        }

        .category-pill {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          border: 1px solid;
        }

        .class-name-en {
          font-size: 0.88rem;
          color: var(--text-secondary);
        }

        .class-desc-micro {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }

        .confidence-gauge-group {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gauge-svg-container {
          position: relative;
          width: 96px;
          height: 96px;
        }

        .gauge-svg {
          transform: rotate(-90deg);
          width: 100%;
          height: 100%;
        }

        .gauge-track {
          fill: none;
          stroke: var(--bg-surface-elevated);
        }

        .gauge-fill {
          fill: none;
          transition: stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gauge-center-text {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .gauge-val {
          font-size: 1.1rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: var(--text-primary);
          line-height: 1.1;
        }

        .gauge-sub {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .hero-metrics-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(8, 12, 22, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.65rem 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .metric-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.76rem;
        }

        .metric-icon {
          color: var(--accent-cyan);
        }

        .metric-icon.status-ok {
          color: var(--accent-emerald);
        }

        .metric-lbl {
          color: var(--text-muted);
        }

        .metric-val {
          font-family: var(--font-mono);
          font-weight: 600;
          color: var(--text-secondary);
        }

        .metric-val.highlight {
          color: var(--accent-cyan);
        }

        .metric-val.status-ok {
          color: var(--accent-emerald);
        }

        .metric-divider {
          width: 1px;
          height: 14px;
          background: var(--border-subtle);
        }

        @media (max-width: 600px) {
          .metric-divider {
            display: none;
          }
          .hero-metrics-footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

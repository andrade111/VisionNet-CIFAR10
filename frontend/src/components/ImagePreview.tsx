import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Grid,
  FileImage,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface ImagePreviewProps {
  file: File;
  previewUrl: string;
  isLoading: boolean;
  onClear: () => void;
  onReselect: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  previewUrl,
  isLoading,
  onClear,
  onReselect,
}) => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [showPixelated, setShowPixelated] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = previewUrl;
  }, [previewUrl]);

  const formattedFileSize =
    file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${(file.size / 1024).toFixed(1)} KB`;

  return (
    <div className="preview-card-wrapper">
      <div className="preview-card-header">
        <div className="preview-header-title">
          <FileImage size={18} className="preview-icon" />
          <span className="file-name-truncated" title={file.name}>
            {file.name}
          </span>
        </div>

        <div className="preview-actions">
          {/* Toggle Pixel Matrix View */}
          <button
            type="button"
            className={`preview-pill-btn ${showPixelated ? 'active' : ''}`}
            onClick={() => setShowPixelated(!showPixelated)}
            title="Alternar entre visualização original e resolução CIFAR-10 (32x32)"
            disabled={isLoading}
          >
            <Grid size={14} />
            <span>32x32 Matrix</span>
          </button>

          {/* Reselect */}
          <button
            type="button"
            className="preview-pill-btn"
            onClick={onReselect}
            title="Escolher outra imagem"
            disabled={isLoading}
          >
            <RefreshCw size={14} />
            <span>Trocar</span>
          </button>

          {/* Clear */}
          <button
            type="button"
            className="preview-pill-btn preview-btn-danger"
            onClick={onClear}
            title="Remover imagem atual"
            disabled={isLoading}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="preview-viewport">
        {/* Computer Vision Scanner Overlay when processing */}
        {isLoading && (
          <div className="scanner-overlay">
            <div className="scanner-line" />
            <div className="scanner-grid" />
            <div className="scanner-pulse-tag">
              <Sparkles size={14} className="spin-icon" />
              <span>VisionNet Analisando Tensores...</span>
            </div>
          </div>
        )}

        <img
          src={previewUrl}
          alt="Visualização prévia para classificação"
          className={`preview-img ${showPixelated ? 'pixelated-mode' : ''}`}
        />

        {/* Bounding box reticles for AI aesthetics */}
        <div className="reticle top-left" />
        <div className="reticle top-right" />
        <div className="reticle bottom-left" />
        <div className="reticle bottom-right" />
      </div>

      {/* Image Metadata Bar */}
      <div className="preview-meta-bar">
        <div className="meta-item">
          <span className="meta-label">Dimensões Originais:</span>
          <span className="meta-val">
            {dimensions ? `${dimensions.width} × ${dimensions.height} px` : 'Calculando...'}
          </span>
        </div>

        <div className="meta-divider" />

        <div className="meta-item">
          <span className="meta-label">Entrada da CNN:</span>
          <span className="meta-val highlight">32 × 32 × 3</span>
        </div>

        <div className="meta-divider" />

        <div className="meta-item">
          <span className="meta-label">Tamanho:</span>
          <span className="meta-val">{formattedFileSize}</span>
        </div>
      </div>

      <style>{`
        .preview-card-wrapper {
          background: var(--bg-surface);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          position: relative;
          overflow: hidden;
        }

        .preview-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding-bottom: 0.65rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .preview-header-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
          overflow: hidden;
        }

        .file-name-truncated {
          max-width: 220px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .preview-icon {
          color: var(--accent-cyan);
          flex-shrink: 0;
        }

        .preview-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .preview-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-sm);
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .preview-pill-btn:hover:not(:disabled) {
          color: var(--text-primary);
          border-color: var(--border-medium);
          background: rgba(255, 255, 255, 0.08);
        }

        .preview-pill-btn.active {
          background: var(--accent-cyan-subtle);
          color: var(--accent-cyan);
          border-color: rgba(0, 240, 255, 0.4);
        }

        .preview-btn-danger:hover:not(:disabled) {
          color: var(--accent-rose);
          border-color: rgba(244, 63, 94, 0.4);
          background: var(--accent-rose-subtle);
        }

        .preview-viewport {
          position: relative;
          width: 100%;
          height: 280px;
          background: #040711;
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-subtle);
        }

        .preview-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: var(--radius-xs);
          transition: filter var(--transition-base), transform var(--transition-base);
        }

        .pixelated-mode {
          image-rendering: pixelated;
          transform: scale(1.08);
          filter: contrast(110%);
        }

        /* Computer Vision Reticles */
        .reticle {
          position: absolute;
          width: 16px;
          height: 16px;
          border-color: var(--accent-cyan);
          pointer-events: none;
          opacity: 0.6;
        }

        .top-left {
          top: 10px;
          left: 10px;
          border-top: 2px solid;
          border-left: 2px solid;
        }

        .top-right {
          top: 10px;
          right: 10px;
          border-top: 2px solid;
          border-right: 2px solid;
        }

        .bottom-left {
          bottom: 10px;
          left: 10px;
          border-bottom: 2px solid;
          border-left: 2px solid;
        }

        .bottom-right {
          bottom: 10px;
          right: 10px;
          border-bottom: 2px solid;
          border-right: 2px solid;
        }

        /* Scanner Overlay */
        .scanner-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 240, 255, 0.08);
          z-index: 10;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scanner-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--accent-cyan), transparent);
          box-shadow: 0 0 16px var(--accent-cyan);
          animation: scan 2s linear infinite;
        }

        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .scanner-pulse-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(11, 15, 25, 0.9);
          border: 1px solid var(--accent-cyan);
          border-radius: var(--radius-full);
          color: var(--accent-cyan);
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 600;
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
          animation: pulse-badge 1.5s ease-in-out infinite alternate;
        }

        @keyframes pulse-badge {
          from { transform: scale(0.96); }
          to { transform: scale(1.02); }
        }

        .preview-meta-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-surface-elevated);
          padding: 0.55rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.76rem;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .meta-label {
          color: var(--text-muted);
        }

        .meta-val {
          font-family: var(--font-mono);
          font-weight: 600;
          color: var(--text-secondary);
        }

        .meta-val.highlight {
          color: var(--accent-cyan);
        }

        .meta-divider {
          width: 1px;
          height: 14px;
          background: var(--border-subtle);
        }

        @media (max-width: 480px) {
          .meta-divider {
            display: none;
          }
          .preview-meta-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

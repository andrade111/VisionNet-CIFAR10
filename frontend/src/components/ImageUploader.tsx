import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  X,
  FileCheck,
  AlertCircle,
  Sliders,
} from 'lucide-react';
import { PRESET_SAMPLES, PresetSample } from '../utils/sampleImages';

interface ImageUploaderProps {
  onImageSelected: (file: File | Blob, fileName: string) => void;
  isLoading: boolean;
  selectedPreviewUrl: string | null;
  selectedFileName: string | null;
  onClear: () => void;
  topK: number;
  onTopKChange: (k: number) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  isLoading,
  selectedPreviewUrl,
  selectedFileName,
  onClear,
  topK,
  onTopKChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateAndSelectFile = (file: File) => {
    setDragError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      setDragError('Formato inválido. Use JPEG, PNG, WebP ou BMP.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setDragError('Arquivo excede o limite máximo de 10 MB.');
      return;
    }
    onImageSelected(file, file.name);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndSelectFile(e.dataTransfer.files[0]);
      }
    },
    [onImageSelected]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const handlePresetClick = async (preset: PresetSample) => {
    try {
      const blob = await preset.createBlob();
      onImageSelected(blob, `${preset.label}_sample.png`);
    } catch (err) {
      console.error('Failed to create preset sample blob:', err);
    }
  };

  return (
    <div className="uploader-card glass-panel">
      <div className="uploader-header">
        <div className="section-title-wrap">
          <Upload size={18} className="text-indigo" />
          <h2 className="section-title">Upload de Imagem para Inferência</h2>
        </div>

        {/* Top-K Selector */}
        <div className="topk-selector-wrap">
          <span className="topk-label">Top-K Classes:</span>
          <div className="topk-buttons">
            {[3, 5, 10].map((k) => (
              <button
                key={k}
                type="button"
                className={`topk-btn ${topK === k ? 'topk-btn-active' : ''}`}
                onClick={() => onTopKChange(k)}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        className={`dropzone ${isDragging ? 'dropzone-active' : ''} ${
          selectedPreviewUrl ? 'dropzone-has-file' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedPreviewUrl && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/jpeg,image/png,image/webp,image/bmp"
          className="hidden-input"
        />

        {selectedPreviewUrl ? (
          <div className="preview-container">
            <div className="preview-image-wrap">
              <img
                src={selectedPreviewUrl}
                alt="Selected preview"
                className="preview-img"
              />
              <button
                type="button"
                className="clear-file-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                title="Remover imagem"
              >
                <X size={16} />
              </button>
            </div>

            <div className="preview-details">
              <div className="preview-file-info">
                <FileCheck size={16} className="text-emerald" />
                <span className="preview-filename font-mono">{selectedFileName}</span>
              </div>
              <p className="preview-hint">
                A imagem será automaticamente reescalada para <strong>32×32 pixels</strong> e normalizada pelo pipeline PyTorch.
              </p>
            </div>
          </div>
        ) : (
          <div className="dropzone-content">
            <div className="upload-icon-pulse">
              <ImageIcon size={32} />
            </div>
            <div className="dropzone-text">
              <span className="dropzone-primary-text">
                Arraste uma imagem ou clique para selecionar
              </span>
              <span className="dropzone-secondary-text">
                Formatos aceitos: JPG, PNG, WebP, BMP (máx. 10MB)
              </span>
            </div>
          </div>
        )}
      </div>

      {dragError && (
        <div className="error-banner">
          <AlertCircle size={15} />
          <span>{dragError}</span>
        </div>
      )}

      {/* Preset CIFAR-10 Samples */}
      <div className="presets-section">
        <div className="presets-title-wrap">
          <Sparkles size={14} className="text-amber" />
          <span className="presets-title">Teste Rápido com Exemplos CIFAR-10 (1-Clique):</span>
        </div>

        <div className="presets-grid">
          {PRESET_SAMPLES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="preset-btn"
              onClick={() => handlePresetClick(preset)}
              disabled={isLoading}
              title={preset.description}
            >
              <span className="preset-emoji">{preset.emoji}</span>
              <span className="preset-name">{preset.namePt}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .uploader-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .uploader-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .section-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .text-indigo {
          color: #818cf8;
        }

        .text-emerald {
          color: #10b981;
        }

        .text-amber {
          color: #fbbf24;
        }

        .section-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .topk-selector-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .topk-label {
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .topk-buttons {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 2px;
        }

        .topk-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.2rem 0.6rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .topk-btn-active {
          background: #6366f1;
          color: #ffffff;
        }

        .dropzone {
          border: 2px dashed rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-md);
          padding: 2rem 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all var(--transition-normal);
          background: rgba(8, 12, 22, 0.4);
          position: relative;
        }

        .dropzone:hover {
          border-color: rgba(99, 102, 241, 0.4);
          background: rgba(99, 102, 241, 0.04);
        }

        .dropzone-active {
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
          transform: scale(1.01);
        }

        .dropzone-has-file {
          cursor: default;
          padding: 1.25rem;
          background: rgba(15, 23, 42, 0.5);
          border-style: solid;
          border-color: var(--border-light);
        }

        .hidden-input {
          display: none;
        }

        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.85rem;
        }

        .upload-icon-pulse {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(99, 102, 241, 0.25);
          transition: transform var(--transition-normal);
        }

        .dropzone:hover .upload-icon-pulse {
          transform: translateY(-3px) scale(1.05);
        }

        .dropzone-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .dropzone-primary-text {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .dropzone-secondary-text {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .preview-container {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .preview-image-wrap {
          position: relative;
          width: 90px;
          height: 90px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--border-light);
          background: #000;
          flex-shrink: 0;
        }

        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .clear-file-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.75);
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition-fast);
        }

        .clear-file-btn:hover {
          background: #ef4444;
        }

        .preview-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.4rem;
          text-align: left;
        }

        .preview-file-info {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .preview-filename {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
          word-break: break-all;
        }

        .preview-hint {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.35;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 0.95rem;
          border-radius: var(--radius-sm);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #fca5a5;
          font-size: 0.8rem;
        }

        .presets-section {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-subtle);
        }

        .presets-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .presets-title {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .presets-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.5rem;
        }

        .preset-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.5rem 0.4rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .preset-btn:hover:not(:disabled) {
          background: rgba(99, 102, 241, 0.12);
          border-color: rgba(99, 102, 241, 0.35);
          transform: translateY(-2px);
        }

        .preset-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .preset-emoji {
          font-size: 1rem;
        }

        @media (max-width: 640px) {
          .presets-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

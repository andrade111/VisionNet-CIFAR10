import React, { useRef, useState, useEffect } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { UploadCloud, AlertCircle, FileCheck, Sparkles } from 'lucide-react';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  selectedFile: File | null;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelect,
  isLoading,
  selectedFile,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste listener (Ctrl+V anywhere in document)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isLoading) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            validateAndSelectFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isLoading]);

  const validateAndSelectFile = (file: File) => {
    setErrorMessage(null);

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMessage(
        `Formato inválido (${file.type || 'desconhecido'}). Envie imagens nos formatos PNG, JPEG, WEBP ou BMP.`
      );
      return;
    }

    // Validate File Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        `Imagem muito pesada (${(file.size / (1024 * 1024)).toFixed(1)}MB). O limite máximo suportado pelo backend é 10MB.`
      );
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSelectFile(droppedFile);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="dropzone-container">
      <div
        className={`dropzone-box ${isDragOver ? 'dropzone-active' : ''} ${
          isLoading ? 'dropzone-loading' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        role="button"
        tabIndex={0}
        aria-label="Área para upload de imagem"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            triggerFileInput();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_MIME_TYPES.join(',')}
          className="dropzone-hidden-input"
          onChange={handleInputChange}
          disabled={isLoading}
        />

        <div className="dropzone-glow" />

        <div className="dropzone-content">
          <div className={`dropzone-icon-wrapper ${isDragOver ? 'icon-bounce' : ''}`}>
            {isDragOver ? (
              <Sparkles size={36} className="dropzone-icon dropzone-icon-accent" />
            ) : selectedFile ? (
              <FileCheck size={36} className="dropzone-icon dropzone-icon-success" />
            ) : (
              <UploadCloud size={36} className="dropzone-icon" />
            )}
          </div>

          <div className="dropzone-text-group">
            <h3 className="dropzone-headline">
              {isDragOver
                ? 'Solte a imagem aqui para classificar'
                : 'Arraste & Solte uma imagem aqui'}
            </h3>
            <p className="dropzone-sub">
              ou clique para <span className="highlight-text">selecionar um arquivo</span>
            </p>
          </div>

          <div className="dropzone-meta">
            <span className="meta-tag">PNG, JPG, WEBP, BMP</span>
            <span className="meta-dot">•</span>
            <span className="meta-tag">Até 10MB</span>
            <span className="meta-dot">•</span>
            <span className="meta-tag meta-kbd">Ctrl + V para colar</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="dropzone-error" role="alert">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      <style>{`
        .dropzone-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
        }

        .dropzone-box {
          position: relative;
          background: var(--bg-surface);
          border: 2px dashed var(--border-medium);
          border-radius: var(--radius-lg);
          padding: 2.25rem 1.5rem;
          text-align: center;
          cursor: pointer;
          overflow: hidden;
          transition: all var(--transition-base);
          outline: none;
        }

        .dropzone-box:hover:not(.dropzone-loading) {
          border-color: var(--accent-cyan);
          background: var(--bg-surface-elevated);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--accent-cyan-subtle);
        }

        .dropzone-box:focus-visible {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 0 3px var(--accent-cyan-subtle);
        }

        .dropzone-active {
          border-color: var(--accent-cyan) !important;
          background: rgba(0, 240, 255, 0.08) !important;
          transform: scale(1.01);
          box-shadow: 0 0 32px var(--accent-cyan-glow) !important;
        }

        .dropzone-loading {
          opacity: 0.6;
          cursor: wait;
        }

        .dropzone-hidden-input {
          display: none;
        }

        .dropzone-glow {
          position: absolute;
          inset: 0;
          background: var(--gradient-glow);
          pointer-events: none;
          opacity: 0.5;
        }

        .dropzone-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.9rem;
        }

        .dropzone-icon-wrapper {
          width: 68px;
          height: 68px;
          border-radius: var(--radius-lg);
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-base), border-color var(--transition-base);
        }

        .dropzone-box:hover .dropzone-icon-wrapper {
          border-color: var(--accent-cyan);
          transform: translateY(-3px) scale(1.05);
        }

        .dropzone-icon {
          color: var(--text-secondary);
        }

        .dropzone-icon-accent {
          color: var(--accent-cyan) !important;
        }

        .dropzone-icon-success {
          color: var(--accent-emerald) !important;
        }

        .icon-bounce {
          animation: bounce 0.6s ease infinite alternate;
        }

        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-6px); }
        }

        .dropzone-headline {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .dropzone-sub {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: 0.2rem;
        }

        .highlight-text {
          color: var(--accent-cyan);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .dropzone-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-top: 0.4rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .meta-dot {
          opacity: 0.4;
        }

        .meta-kbd {
          font-family: var(--font-mono);
          padding: 0.15rem 0.4rem;
          border-radius: var(--radius-xs);
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
        }

        .dropzone-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--accent-rose-subtle);
          color: var(--accent-rose);
          border: 1px solid rgba(244, 63, 94, 0.3);
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.9rem;
          font-size: 0.825rem;
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

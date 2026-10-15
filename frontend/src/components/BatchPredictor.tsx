import React, { useState, useRef } from 'react';
import {
  Layers,
  Upload,
  AlertCircle,
  FileCheck,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';
import { BatchPredictionResponse, BatchItemResult } from '../types/api';
import { getApiUrl } from '../services/api';
import { getClassByLabel, getClassByIndex } from '../data/cifar10Classes';

export const BatchPredictor: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ name: string; url: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<BatchPredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setBatchResult(null);

    const validFiles: File[] = [];
    const validPreviews: { name: string; url: string }[] = [];

    Array.from(files).slice(0, 12).forEach((file) => {
      if (['image/jpeg', 'image/png', 'image/webp', 'image/bmp'].includes(file.type)) {
        validFiles.push(file);
        validPreviews.push({
          name: file.name,
          url: URL.createObjectURL(file),
        });
      }
    });

    if (validFiles.length === 0) {
      setError('Nenhuma imagem válida encontrada. Formatos: JPG, PNG, WebP.');
      return;
    }

    setSelectedFiles(validFiles);
    setPreviews(validPreviews);
  };

  const handleRunBatchInference = async () => {
    if (selectedFiles.length === 0) return;
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${getApiUrl('/predict/batch')}?top_k=3`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro na API (${response.status}): ${await response.text()}`);
      }

      const data: BatchPredictionResponse = await response.json();
      setBatchResult(data);
    } catch (err) {
      setError((err as Error).message || 'Falha ao processar lote de imagens.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="batch-container glass-panel">
      <div className="batch-header">
        <div className="batch-title-wrap">
          <Layers size={18} className="text-cyan" />
          <h3 className="batch-title">Inferência Vetorizada em Lote (Batch GPU/CPU)</h3>
        </div>
        <span className="batch-badge font-mono">POST /api/v1/predict/batch</span>
      </div>

      <p className="batch-desc">
        Envie até 12 imagens simultaneamente. O backend agrupa os tensores em um único tensor 4D <code>(N, 3, 32, 32)</code> e executa o cálculo vetorizado em paralelo.
      </p>

      {/* Upload button area */}
      <div className="batch-action-bar">
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/jpeg,image/png,image/webp,image/bmp"
          onChange={(e) => handleFilesSelected(e.target.files)}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="btn-select-files"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={15} />
          <span>Selecionar Múltiplas Imagens ({selectedFiles.length})</span>
        </button>

        {selectedFiles.length > 0 && (
          <button
            type="button"
            className="btn-run-batch"
            onClick={handleRunBatchInference}
            disabled={isLoading}
          >
            <Zap size={15} />
            <span>{isLoading ? 'Processando Lote...' : 'Classificar Lote Inteiro'}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Batch Metrics Strip */}
      {batchResult && (
        <div className="batch-metrics-strip font-mono">
          <div className="batch-metric">
            <span className="metric-lbl">Total Imagens:</span>
            <span className="metric-val">{batchResult.total_images}</span>
          </div>
          <div className="batch-metric">
            <span className="metric-lbl">Tempo de Inferência:</span>
            <span className="metric-val">{batchResult.inference_time_ms.toFixed(2)} ms</span>
          </div>
          <div className="batch-metric">
            <span className="metric-lbl">Média / Imagem:</span>
            <span className="metric-val">
              {(batchResult.inference_time_ms / batchResult.total_images).toFixed(2)} ms
            </span>
          </div>
          <div className="batch-metric">
            <span className="metric-lbl">Dispositivo:</span>
            <span className="metric-val uppercase">{batchResult.device}</span>
          </div>
        </div>
      )}

      {/* Preview and Results Grid */}
      {previews.length > 0 && (
        <div className="batch-grid">
          {previews.map((preview, idx) => {
            const resultItem: BatchItemResult | undefined = batchResult?.results[idx];
            const meta = resultItem
              ? getClassByLabel(resultItem.predicted_label) ||
                getClassByIndex(resultItem.predicted_class_index)
              : null;

            return (
              <div key={idx} className="batch-item-card">
                <div className="item-img-wrap">
                  <img src={preview.url} alt={preview.name} className="item-img" />
                  <span className="item-index font-mono">#{idx + 1}</span>
                </div>

                <div className="item-info">
                  <span className="item-filename font-mono" title={preview.name}>
                    {preview.name}
                  </span>

                  {resultItem && meta ? (
                    <div className="item-prediction">
                      <div className="item-pred-top">
                        <span className="item-emoji">{meta.emoji}</span>
                        <span className="item-label-pt">{resultItem.display_pt}</span>
                      </div>
                      <div className="item-confidence font-mono">
                        {resultItem.confidence_percentage.toFixed(1)}%
                      </div>
                    </div>
                  ) : (
                    <span className="item-pending">
                      {isLoading ? 'Aguardando processamento...' : 'Pronto para classificar'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .batch-container {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .batch-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .batch-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .text-cyan {
          color: #06b6d4;
        }

        .batch-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .batch-badge {
          font-size: 0.72rem;
          color: #06b6d4;
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.25);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-sm);
        }

        .batch-desc {
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .batch-desc code {
          background: rgba(255, 255, 255, 0.06);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          color: #a5b4fc;
        }

        .batch-action-bar {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .btn-select-files {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.1rem;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-select-files:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .btn-run-batch {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius-sm);
          background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
          border: none;
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform var(--transition-fast);
        }

        .btn-run-batch:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .btn-run-batch:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .batch-metrics-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          padding: 0.85rem;
          border-radius: var(--radius-sm);
          background: rgba(6, 182, 212, 0.06);
          border: 1px solid rgba(6, 182, 212, 0.2);
          font-size: 0.78rem;
        }

        .batch-metric {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .metric-lbl {
          color: var(--text-secondary);
        }

        .metric-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
        }

        .batch-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.85rem;
        }

        .batch-item-card {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .item-img-wrap {
          position: relative;
          height: 120px;
          background: #000;
        }

        .item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-index {
          position: absolute;
          top: 6px;
          left: 6px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .item-info {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .item-filename {
          font-size: 0.72rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-prediction {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.04);
          padding: 0.35rem 0.5rem;
          border-radius: 4px;
        }

        .item-pred-top {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .item-emoji {
          font-size: 1rem;
        }

        .item-label-pt {
          font-size: 0.8rem;
          font-weight: 600;
          color: #fff;
        }

        .item-confidence {
          font-size: 0.75rem;
          font-weight: 700;
          color: #38bdf8;
        }

        .item-pending {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .batch-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .batch-metrics-strip {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

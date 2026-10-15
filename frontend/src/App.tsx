import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Dropzone } from './components/Dropzone';
import { SamplePicker } from './components/SamplePicker';
import { ImagePreview } from './components/ImagePreview';
import { InferenceControls } from './components/InferenceControls';
import { PredictionHero } from './components/PredictionHero';
import { ConfidenceBars } from './components/ConfidenceBars';
import { ErrorAlert } from './components/ErrorAlert';
import { ModelInfoModal } from './components/ModelInfoModal';
import { BackendStatusModal } from './components/BackendStatusModal';

import { apiService } from './services/api';
import type { PredictionResponse, HealthResponse, ModelInfoResponse, ApiError } from './types/api';
import { CIFAR10_CLASSES } from './data/cifar10Classes';
import { Brain } from 'lucide-react';

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('visionnet_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  // Image & Preview state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Inference state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [topK, setTopK] = useState<number>(10);
  const [autoClassify, setAutoClassify] = useState<boolean>(true);

  // Error & Backend state
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(true);
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);

  // Modals state
  const [isModelInfoOpen, setIsModelInfoOpen] = useState<boolean>(false);
  const [isBackendStatusOpen, setIsBackendStatusOpen] = useState<boolean>(false);

  // Apply theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('visionnet_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check health and load initial model metadata
  const verifyBackend = useCallback(async () => {
    setIsCheckingHealth(true);
    try {
      const health = await apiService.checkHealth();
      setBackendHealth(health);
      setApiError(null);

      // Attempt to load model info
      try {
        const info = await apiService.getModelInfo();
        setModelInfo(info);
      } catch {
        // Non-critical if model info fails
      }
    } catch (err) {
      setBackendHealth(null);
      setApiError(err as ApiError);
    } finally {
      setIsCheckingHealth(false);
    }
  }, []);

  useEffect(() => {
    verifyBackend();
  }, [verifyBackend]);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Execute inference on the given file
  const runInferenceOnFile = async (file: File, k: number = topK) => {
    if (isLoading) return;
    setIsLoading(true);
    setApiError(null);

    try {
      const result = await apiService.predictImage(file, k);
      setPredictionResult(result);
    } catch (err) {
      setApiError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new file selection
  const handleFileSelect = (file: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const newUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(newUrl);
    setPredictionResult(null);
    setApiError(null);

    if (autoClassify) {
      runInferenceOnFile(file, topK);
    }
  };

  const handleClearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setPredictionResult(null);
    setApiError(null);
  };

  // Global Enter shortcut to trigger inference
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selectedFile && !isLoading) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          runInferenceOnFile(selectedFile, topK);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFile, isLoading, topK]);

  const handleSaveApiUrl = (newUrl: string) => {
    apiService.setBaseUrl(newUrl);
    verifyBackend();
    setIsBackendStatusOpen(false);
  };

  const handleResetApiUrl = () => {
    apiService.resetBaseUrl();
    verifyBackend();
  };

  return (
    <div className="app-wrapper">
      {/* Background atmospheric glows */}
      <div className="app-atmosphere" />

      {/* Header with live status, theme toggle, and docs link */}
      <Header
        backendHealth={backendHealth}
        isBackendChecking={isCheckingHealth}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenModelInfo={() => setIsModelInfoOpen(true)}
        onOpenBackendStatus={() => setIsBackendStatusOpen(true)}
        apiUrl={apiService.getBaseUrl()}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Error Alert Banner if an issue occurs */}
        {apiError && (
          <div style={{ marginBottom: '1.5rem' }}>
            <ErrorAlert
              error={apiError}
              onRetry={() => {
                if (selectedFile) {
                  runInferenceOnFile(selectedFile, topK);
                } else {
                  verifyBackend();
                }
              }}
              onDismiss={() => setApiError(null)}
            />
          </div>
        )}

        {/* Dashboard Grid (Upload & Preview vs Results) */}
        <div className="dashboard-grid">
          {/* Left Column: Image Ingestion & Stage */}
          <div className="dashboard-column left-column">
            <section className="glass-panel" aria-labelledby="section-upload-title">
              <div className="card-header">
                <div className="card-title" id="section-upload-title">
                  <Brain size={20} />
                  <span>Entrada de Imagem</span>
                </div>
                <span className="card-badge">Tensor 3x32x32</span>
              </div>

              {!selectedFile ? (
                <div className="uploader-flow">
                  <Dropzone
                    onFileSelect={handleFileSelect}
                    isLoading={isLoading}
                    selectedFile={selectedFile}
                  />

                  {/* 1-Click CIFAR-10 Samples */}
                  <SamplePicker
                    onSelectSample={handleFileSelect}
                    isLoading={isLoading}
                  />
                </div>
              ) : (
                <div className="preview-stage-flow">
                  <ImagePreview
                    file={selectedFile}
                    previewUrl={previewUrl!}
                    isLoading={isLoading}
                    onClear={handleClearImage}
                    onReselect={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/jpeg,image/png,image/webp,image/bmp';
                      input.onchange = (e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.files && target.files[0]) {
                          handleFileSelect(target.files[0]);
                        }
                      };
                      input.click();
                    }}
                  />

                  {/* Controls: Submit & Settings */}
                  <InferenceControls
                    onRunInference={() => runInferenceOnFile(selectedFile, topK)}
                    isLoading={isLoading}
                    hasImage={Boolean(selectedFile)}
                    topK={topK}
                    onChangeTopK={(k) => {
                      setTopK(k);
                      if (selectedFile) runInferenceOnFile(selectedFile, k);
                    }}
                    autoClassify={autoClassify}
                    onToggleAutoClassify={() => setAutoClassify(!autoClassify)}
                  />

                  {/* Quick switch to another sample */}
                  <SamplePicker
                    onSelectSample={handleFileSelect}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Prediction Intelligence & Probabilities */}
          <div className="dashboard-column right-column">
            {predictionResult ? (
              <section className="results-container" aria-label="Resultados da Classificação">
                {/* Top Prediction Winner Hero */}
                <PredictionHero predictionResponse={predictionResult} />

                {/* 10 Classes Probability Distribution */}
                <ConfidenceBars predictionResponse={predictionResult} />
              </section>
            ) : isLoading ? (
              /* Skeleton Loading State */
              <div className="glass-panel loading-skeleton-panel">
                <div className="skeleton-header">
                  <div className="skeleton skeleton-title" />
                  <div className="skeleton skeleton-badge" />
                </div>
                <div className="skeleton skeleton-hero" />
                <div className="skeleton-bars">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton skeleton-bar-row" />
                  ))}
                </div>
              </div>
            ) : (
              /* Idle Standby / Explanatory Card */
              <section className="glass-panel idle-guide-panel" aria-label="Visão Geral do Modelo">
                <div className="idle-hero-icon-box">
                  <Brain size={48} className="idle-brain-icon" />
                  <div className="idle-icon-ring" />
                </div>

                <div className="idle-guide-text">
                  <h3 className="idle-title">Aguardando Imagem para Inferência</h3>
                  <p className="idle-description">
                    Carregue uma imagem ou clique em uma das <strong>10 amostras rápidas</strong> à esquerda para avaliar a rede neural convolucional VisionNet em tempo real.
                  </p>
                </div>

                {/* CIFAR-10 Overview Pills */}
                <div className="idle-classes-preview">
                  <span className="preview-label">Classes Reconhecidas pelo VisionNet:</span>
                  <div className="classes-tags-cloud">
                    {CIFAR10_CLASSES.map((c) => (
                      <span
                        key={c.label}
                        className="cifar-tag"
                        style={{ borderColor: `${c.accentColor}44` }}
                      >
                        <span className="tag-emoji">{c.emoji}</span>
                        <span className="tag-name">{c.namePt}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="idle-info-footer">
                  <div className="info-stat">
                    <span className="info-val">32 × 32 px</span>
                    <span className="info-lbl">Resolução CIFAR</span>
                  </div>
                  <div className="info-stat">
                    <span className="info-val">10</span>
                    <span className="info-lbl">Classes Canônicas</span>
                  </div>
                  <div className="info-stat">
                    <span className="info-val">PyTorch</span>
                    <span className="info-lbl">CNN Engine</span>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <ModelInfoModal
        isOpen={isModelInfoOpen}
        onClose={() => setIsModelInfoOpen(false)}
        modelInfo={modelInfo}
        isLoading={isCheckingHealth}
      />

      <BackendStatusModal
        isOpen={isBackendStatusOpen}
        onClose={() => setIsBackendStatusOpen(false)}
        health={backendHealth}
        isLoading={isCheckingHealth}
        onRefreshHealth={verifyBackend}
        currentUrl={apiService.getBaseUrl()}
        onSaveUrl={handleSaveApiUrl}
        onResetUrl={handleResetApiUrl}
      />

      <style>{`
        .uploader-flow,
        .preview-stage-flow {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .results-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* Idle State Panel */
        .idle-guide-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 3rem 2rem;
          gap: 1.75rem;
        }

        .idle-hero-icon-box {
          position: relative;
          width: 90px;
          height: 90px;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(121, 40, 202, 0.25) 100%);
          border: 1px solid rgba(0, 240, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 32px var(--accent-cyan-subtle);
        }

        .idle-brain-icon {
          color: var(--accent-cyan);
          position: relative;
          z-index: 2;
        }

        .idle-icon-ring {
          position: absolute;
          inset: -8px;
          border-radius: var(--radius-xl);
          border: 2px dashed rgba(0, 240, 255, 0.25);
          animation: spin 20s linear infinite;
        }

        .idle-guide-text {
          max-width: 440px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .idle-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .idle-description {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .idle-classes-preview {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          max-width: 520px;
        }

        .preview-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .classes-tags-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          justify-content: center;
        }

        .cifar-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.65rem;
          background: var(--bg-surface-elevated);
          border: 1px solid;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .idle-info-footer {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 100%;
          max-width: 460px;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-subtle);
        }

        .info-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .info-val {
          font-size: 1.1rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: var(--accent-cyan);
        }

        .info-lbl {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        /* Skeleton Loading */
        .loading-skeleton-panel {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 2rem;
        }

        .skeleton-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .skeleton-title {
          width: 160px;
          height: 24px;
        }

        .skeleton-badge {
          width: 80px;
          height: 24px;
          border-radius: var(--radius-full);
        }

        .skeleton-hero {
          width: 100%;
          height: 140px;
          border-radius: var(--radius-md);
        }

        .skeleton-bars {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .skeleton-bar-row {
          width: 100%;
          height: 32px;
          border-radius: var(--radius-sm);
        }
      `}</style>
    </div>
  );
};

export default App;

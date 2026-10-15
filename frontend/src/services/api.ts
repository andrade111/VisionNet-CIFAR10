/**
 * VisionNet REST API Service Client.
 * Centralized HTTP service managing communication with the FastAPI backend.
 */

import type {
  PredictionResponse,
  HealthResponse,
  ModelInfoResponse,
  ModelClassesResponse,
  ApiError,
} from '../types/api';

const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const STORAGE_KEY_BASE_URL = 'visionnet_api_base_url';

export class VisionNetApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = localStorage.getItem(STORAGE_KEY_BASE_URL) || DEFAULT_API_URL;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string): void {
    const cleanUrl = url.trim().replace(/\/+$/, '');
    this.baseUrl = cleanUrl;
    localStorage.setItem(STORAGE_KEY_BASE_URL, cleanUrl);
  }

  public resetBaseUrl(): void {
    this.baseUrl = DEFAULT_API_URL;
    localStorage.removeItem(STORAGE_KEY_BASE_URL);
  }

  /**
   * Health check endpoint to verify backend status, GPU availability, and model readiness.
   */
  public async checkHealth(): Promise<HealthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      return (await response.json()) as HealthResponse;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  /**
   * Execute image classification with VisionNet CNN model.
   * Sends image as multipart/form-data.
   */
  public async predictImage(file: File | Blob, topK: number = 10): Promise<PredictionResponse> {
    try {
      const formData = new FormData();
      const fileName = file instanceof File ? file.name : 'image.png';
      formData.append('file', file, fileName);

      const url = new URL(`${this.baseUrl}/api/v1/predict`);
      url.searchParams.set('top_k', topK.toString());

      const response = await fetch(url.toString(), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      return (await response.json()) as PredictionResponse;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  /**
   * Retrieve architectural parameters and parameter count of the VisionNet model.
   */
  public async getModelInfo(): Promise<ModelInfoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/model/info`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      return (await response.json()) as ModelInfoResponse;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  /**
   * Retrieve canonical list of CIFAR-10 classes and multilingual descriptions.
   */
  public async getModelClasses(): Promise<ModelClassesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/model/classes`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      return (await response.json()) as ModelClassesResponse;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  /**
   * Internal helper to normalize and enrich error objects.
   */
  private async handleErrorResponse(response: Response): Promise<ApiError> {
    let detail = '';
    try {
      const data = await response.json();
      detail = data.detail || data.error || JSON.stringify(data);
    } catch {
      detail = response.statusText || 'Erro desconhecido retornado pelo servidor.';
    }

    return {
      message: `Erro no servidor (${response.status})`,
      detail,
      statusCode: response.status,
      isOffline: false,
    };
  }

  private normalizeError(error: unknown): ApiError {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const err = error as { message?: string; detail?: string; statusCode?: number; isOffline?: boolean };

      if (err.isOffline) {
        return err as ApiError;
      }

      // Detect Failed to fetch / connection refused
      if (
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('NetworkError') ||
        err.message?.includes('Load failed') ||
        err.message?.includes('fetch failed')
      ) {
        return {
          message: 'Backend VisionNet Indisponível',
          detail: `Não foi possível conectar ao servidor em ${this.baseUrl}. Verifique se o FastAPI está em execução (ex: python run.py ou uvicorn app.main:app).`,
          isOffline: true,
        };
      }

      return {
        message: err.message || 'Erro inesperado na requisição.',
        detail: err.detail,
        statusCode: err.statusCode,
        isOffline: false,
      };
    }

    return {
      message: 'Falha de comunicação inesperada.',
      detail: String(error),
      isOffline: false,
    };
  }
}

export const apiService = new VisionNetApiService();

// Export convenient standalone methods
export const checkHealth = () => apiService.checkHealth();
export const predictImage = (file: File | Blob, topK = 10) => apiService.predictImage(file, topK);
export const getModelInfo = () => apiService.getModelInfo();
export const getModelClasses = () => apiService.getModelClasses();

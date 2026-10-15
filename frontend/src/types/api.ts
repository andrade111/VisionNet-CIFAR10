/**
 * TypeScript type definitions for VisionNet-CIFAR10 API models.
 * Perfectly mirrors backend FastAPI Pydantic schemas.
 */

export interface ClassProbability {
  class_index: number;
  label: string;
  display_name: string;
  display_pt: string;
  probability: number;
  confidence_percentage: number;
}

export interface PredictionResult {
  predicted_class_index: number;
  predicted_label: string;
  display_name: string;
  display_pt: string;
  confidence: number;
  confidence_percentage: number;
  top_k: ClassProbability[];
  all_probabilities: Record<string, number>;
}

export interface PredictionResponse {
  success: boolean;
  filename: string | null;
  inference_time_ms: number;
  total_time_ms: number;
  device: string;
  original_image_size: [number, number];
  transformed_image_size: [number, number];
  prediction: PredictionResult;
}

export interface DeviceInfo {
  device: string;
  name: string;
  cuda_available: boolean;
  device_count: number;
  current_device: number | null;
  memory_allocated_mb: number | null;
  memory_reserved_mb: number | null;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | string;
  project: string;
  version: string;
  model_loaded: boolean;
  device: DeviceInfo;
  uptime_seconds: number;
}

export interface ModelInfoResponse {
  architecture: string;
  total_parameters: number;
  trainable_parameters: number;
  num_classes: number;
  input_shape: [number, number, number];
  weights_path: string;
  weights_loaded: boolean;
  device: string;
  classes: string[];
}

export interface ClassMetadataItem {
  label: string;
  display_name: string;
  display_pt: string;
}

export interface ModelClassesResponse {
  num_classes: number;
  classes: string[];
  metadata: Record<number, ClassMetadataItem>;
}

export interface ApiError {
  message: string;
  detail?: string;
  statusCode?: number;
  isOffline?: boolean;
}

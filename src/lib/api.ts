// lib/api.ts
function normalizeApiBase(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return 'http://localhost:8000';
  const withProtocol = trimmed.includes('://') ? trimmed : `http://${trimmed}`;
  return withProtocol.replace(/\/+$/, '');
}

function getAutoApiBase(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost:8000';
  }

  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const rawHostname = window.location.hostname || 'localhost';
  const hostname = rawHostname.includes(':') ? `[${rawHostname}]` : rawHostname;
  return `${protocol}://${hostname}:8000`;
}

function resolveApiBase(): string {
  const configured = (process.env.NEXT_PUBLIC_API_BASE ?? '').trim();
  if (configured) {
    return normalizeApiBase(configured);
  }
  return normalizeApiBase(getAutoApiBase());
}

const API_BASE = resolveApiBase();

export type FeatureListResponse = {
  features: string[];
};

export type PredictResponse = {
  melting_wattage: number;
  refining_wattage: number;
  wattage_tmp: number;
  tot_result1?: number | null;
};

export type RecommendResponse = {
  recommended_setting: Record<string, number>;
  melting_wattage: number;
  refining_wattage: number;
  wattage_tmp: number;
  tot_result1?: number | null;
  objective_target: string;
  objective_value: number;
  num_candidates: number;
  num_trials: number;
};

export async function getFeatures(): Promise<FeatureListResponse> {
  const res = await fetch(`${API_BASE}/predict/features`);
  if (!res.ok) throw new Error('Failed to load features');
  return res.json() as Promise<FeatureListResponse>;
}

export async function getControllableFeatures(): Promise<FeatureListResponse> {
  const res = await fetch(`${API_BASE}/predict/controllable-features`);
  if (!res.ok) throw new Error('Failed to load controllable features');
  return res.json() as Promise<FeatureListResponse>;
}

export async function predict(features: Record<string, number>): Promise<PredictResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ features }),
  });
  if (!res.ok) {
    const errorBody = await res.text();
    console.error('Predict failed:', res.status, errorBody);
    throw new Error('Predict failed');
  }
  return res.json() as Promise<PredictResponse>;
}

export async function recommend(
  baseInput: Record<string, number>,
  searchSpace: Record<string, { min: number; max: number; step: number; fixed?: boolean }>,
  nTrials: number,
  options?: {
    earlyStopPatience?: number;
    timeoutSeconds?: number;
    objectiveTarget?: string;
  },
): Promise<RecommendResponse> {
  const res = await fetch(`${API_BASE}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      base_input: baseInput,
      search_space: searchSpace,
      n_trials: nTrials,
      early_stop_patience: options?.earlyStopPatience,
      timeout_seconds: options?.timeoutSeconds,
      objective_target: options?.objectiveTarget,
    }),
  });
  if (!res.ok) {
    const errorBody = await res.text();
    console.error('Recommend failed:', res.status, errorBody);
    throw new Error('Recommend failed');
  }
  return res.json() as Promise<RecommendResponse>;
}

const apiClient = {
  getFeatures,
  getControllableFeatures,
  predict,
  recommend,
};

export default apiClient;

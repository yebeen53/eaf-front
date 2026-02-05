// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000';

export async function getFeatures() {
  const res = await fetch(`${API_BASE}/predict/features`);
  if (!res.ok) throw new Error('Failed to load features');
  return res.json() as Promise<{ features: string[] }>;
}

export async function predict(features: Record<string, number>) {
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
  return res.json() as Promise<{
    melting_wattage: number;
    refining_wattage: number;
    wattage_tmp: number;
  }>;
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
) {
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
  return res.json() as Promise<{
    recommended_setting: Record<string, number>;
    melting_wattage: number;
    refining_wattage: number;
    wattage_tmp: number;
    objective_target: string;
    objective_value: number;
    num_candidates: number;
    num_trials: number;
  }>;
}

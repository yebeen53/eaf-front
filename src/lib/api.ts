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
  if (!res.ok) throw new Error('Predict failed');
  return res.json() as Promise<{ consume_rate: number }>;
}

export async function recommend(baseInput: Record<string, number>) {
  const res = await fetch(`${API_BASE}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base_input: baseInput }),
  });
  if (!res.ok) throw new Error('Recommend failed');
  return res.json() as Promise<{
    recommended_setting: Record<string, number>;
    consume_rate: number;
    num_candidates: number;
  }>;
}

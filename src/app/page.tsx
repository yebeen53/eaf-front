'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import * as apiClient from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RadialResult, {
  MetricValueList,
  type MetricKey,
  type ResultMetrics,
} from '@/components/radial-result';
import { SliderControlled, type SliderItem } from '@/components/sliders-panel';
import headerImage from '@/app/image.png';
import { ADJUSTABLE_PARAM_KEYS, PARAM_DEFINITIONS, type ParamDefinition } from '@/lib/params';

const ADJUSTABLE_PARAM_KEY_SET = new Set(ADJUSTABLE_PARAM_KEYS);

const getDefaultParamValue = (param: ParamDefinition) =>
  ADJUSTABLE_PARAM_KEY_SET.has(param.key) ? param.mean : param.median;

function paramsToFeatures(values?: Record<string, number>) {
  const features: Record<string, number> = {};
  for (const p of PARAM_DEFINITIONS) {
    const v = values?.[p.key];
    features[p.key] = Number.isFinite(v) ? v! : getDefaultParamValue(p);
  }
  return features;
}

const buildFeaturePayload = (values: Record<string, number>, allFeatures: string[] | null) => {
  const payload = paramsToFeatures(values);
  if (!allFeatures) {
    return payload;
  }
  const filtered: Record<string, number> = {};
  for (const key of allFeatures) {
    const value = payload[key];
    filtered[key] =
      typeof value === 'number' && Number.isFinite(value)
        ? value
        : (DEFAULT_FEATURE_VALUES[key] ?? 0);
  }
  return filtered;
};

const isScrapKey = (key: string) => key.toLowerCase().startsWith('scrap');

const EXTRA_SLIDER_OVERRIDES: Record<string, { displayLabel?: string }> = {
  Weight_Sum: { displayLabel: 'weight_sum' },
};

const createSliders = (): SliderItem[] => {
  const sliderKeys = Array.from(
    new Set([
      ...ADJUSTABLE_PARAM_KEYS.filter((key) => !isScrapKey(key)),
      ...Object.keys(EXTRA_SLIDER_OVERRIDES),
    ]),
  );

  return sliderKeys.flatMap((key) => {
    const param = PARAM_DEFINITIONS.find((item) => item.key === key);
    if (!param) {
      console.warn(`[params] Missing definition for slider key: ${key}`);
      return [];
    }

    const sliderOverride = EXTRA_SLIDER_OVERRIDES[param.key];

    return [
      {
        label: param.key,
        displayLabel: sliderOverride?.displayLabel,
        min: param.min,
        max: param.max,
        step: param.step ?? 1,
        value: param.mean,
        fixed: false,
      },
    ];
  });
};

const DEFAULT_FEATURE_VALUES = Object.fromEntries(
  PARAM_DEFINITIONS.map((param) => [param.key, getDefaultParamValue(param)]),
) as Record<string, number>;

const buildPayloadFromSliders = (sliders: SliderItem[]) => {
  const sliderValueByKey = Object.fromEntries(
    sliders.map((slider) => [slider.label, slider.value]),
  );
  const payload: Record<string, number> = {};

  PARAM_DEFINITIONS.forEach((param) => {
    const sliderValue = sliderValueByKey[param.key];
    payload[param.key] =
      typeof sliderValue === 'number' && Number.isFinite(sliderValue)
        ? sliderValue
        : getDefaultParamValue(param);
  });

  return payload;
};

const METRIC_RESULT_KEYS: MetricKey[] = ['melting_wattage', 'refining_wattage', 'tot_result1'];
const METRIC_KEY_SET = new Set<MetricKey>([
  'melting_wattage',
  'refining_wattage',
  'wattage_tmp',
  'tot_result1',
]);

const toMetricKey = (value: string): MetricKey | null => {
  if (METRIC_KEY_SET.has(value as MetricKey)) {
    return value as MetricKey;
  }
  return null;
};

const normalizeResult = (data: ResultMetrics): ResultMetrics => {
  if (data.wattage_tmp == null || !Number.isFinite(data.wattage_tmp)) {
    const melting = data.melting_wattage;
    const refining = data.refining_wattage;
    if (
      typeof melting === 'number' &&
      Number.isFinite(melting) &&
      typeof refining === 'number' &&
      Number.isFinite(refining)
    ) {
      return { ...data, wattage_tmp: melting + refining };
    }
  }
  return data;
};

const getFeatureUnavailableMessage = (currentFeatures: string[] | null) =>
  currentFeatures === null
    ? 'feature 목록을 불러오는 중입니다.'
    : 'feature 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';

const normalizeApiBase = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const withProtocol = trimmed.includes('://') ? trimmed : `http://${trimmed}`;
  return withProtocol.replace(/\/+$/, '');
};

const resolveControllableFeaturesUrl = (): string => {
  const configured = normalizeApiBase(process.env.NEXT_PUBLIC_API_BASE ?? '');
  if (configured) {
    return `${configured}/predict/controllable-features`;
  }
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
    const rawHostname = window.location.hostname || 'localhost';
    const hostname = rawHostname.includes(':') ? `[${rawHostname}]` : rawHostname;
    return `${protocol}://${hostname}:8000/predict/controllable-features`;
  }
  return 'http://localhost:8000/predict/controllable-features';
};

const fetchControllableFeatures = async (): Promise<{ features: string[] }> => {
  const res = await fetch(resolveControllableFeaturesUrl());
  if (!res.ok) {
    throw new Error('Failed to load controllable features');
  }
  return res.json() as Promise<{ features: string[] }>;
};

export default function Page() {
  const [sliders, setSliders] = useState<SliderItem[]>(() => createSliders());
  const [features, setFeatures] = useState<string[] | null>(null);
  const [controllableFeatures, setControllableFeatures] = useState<string[] | null>(null);
  const [result, setResult] = useState<ResultMetrics | null>(null);
  const [resultStatusLabel, setResultStatusLabel] = useState<string | null>(null);
  const [objectiveTarget, setObjectiveTarget] = useState<MetricKey | null>(null);
  const [objectiveValue, setObjectiveValue] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictError, setPredictError] = useState<string | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendError, setRecommendError] = useState<string | null>(null);
  const isFeatureReady = Array.isArray(features) && features.length > 0;

  useEffect(() => {
    let mounted = true;
    const loadFeatureLists = async () => {
      try {
        const r = await apiClient.getFeatures();
        if (mounted) {
          setFeatures(r.features);
        }
      } catch (e: unknown) {
        console.error(e);
        if (mounted) {
          setFeatures([]);
        }
      }

      try {
        const r = await fetchControllableFeatures();
        if (mounted) {
          setControllableFeatures(r.features);
        }
      } catch (e: unknown) {
        console.error(e);
        if (mounted) {
          setControllableFeatures([]);
        }
      }
    };

    void loadFeatureLists();
    return () => {
      mounted = false;
    };
  }, []);

  const handlePredict = async () => {
    setPredictError(null);
    const currentFeatures = features;
    if (!currentFeatures || currentFeatures.length === 0) {
      setPredictError(getFeatureUnavailableMessage(currentFeatures));
      return;
    }
    setIsPredicting(true);
    try {
      const payload = buildPayloadFromSliders(sliders);
      const result = await apiClient.predict(buildFeaturePayload(payload, currentFeatures));
      setResult(normalizeResult(result));
      setObjectiveTarget(null);
      setObjectiveValue(null);
      setResultStatusLabel('예측 완료');
    } catch (error) {
      console.error(error);
      setPredictError(
        features === null ? 'feature 목록을 불러오는 중입니다.' : '예측에 실패했습니다.',
      );
    } finally {
      setIsPredicting(false);
    }
  };

  const handleRecommend = async () => {
    setRecommendError(null);
    const currentFeatures = features;
    const currentControllable = controllableFeatures;
    if (!currentFeatures || currentFeatures.length === 0) {
      setRecommendError(getFeatureUnavailableMessage(currentFeatures));
      return;
    }
    setIsRecommending(true);
    try {
      const payload = buildPayloadFromSliders(sliders);
      const allowedSet = new Set(
        currentControllable && currentControllable.length > 0
          ? currentControllable
          : sliders.map((slider) => slider.label),
      );
      const optimizedSliders = sliders.filter((slider) => allowedSet.has(slider.label));
      if (optimizedSliders.length === 0) {
        throw new Error('No controllable features available for optimization');
      }
      const searchSpace = Object.fromEntries(
        optimizedSliders.map((slider) => [
          slider.label,
          {
            min: slider.min,
            max: slider.max,
            step: slider.step,
            fixed: slider.fixed,
          },
        ]),
      );
      const result = await apiClient.recommend(
        buildFeaturePayload(payload, currentFeatures),
        searchSpace,
        200,
      );
      setResult(normalizeResult(result));
      setObjectiveTarget(toMetricKey(result.objective_target));
      setObjectiveValue(result.objective_value);
      setResultStatusLabel('최적화 완료');
      setSliders((prev) =>
        prev.map((slider) => ({
          ...slider,
          value: result.recommended_setting[slider.label] ?? slider.value,
        })),
      );
    } catch (error) {
      console.error(error);
      setRecommendError(
        features === null ? 'feature 목록을 불러오는 중입니다.' : '최적화에 실패했습니다.',
      );
    } finally {
      setIsRecommending(false);
    }
  };

  return (
    <>
      <header className="w-full bg-black">
        <div className="mx-auto w-full max-w-none px-8 py-4">
          <Image src={headerImage} alt="Header logo" priority />
        </div>
      </header>
      <main className="mx-auto w-full max-w-none p-8">
        <div className="mb-4 text-sm">
          features:{' '}
          {features === null ? 'loading...' : features.length === 0 ? 'error' : features.length}
        </div>
        <div className="grid w-full gap-6">
          <div className="grid w-full gap-6 md:grid-cols-2">
            <RadialResult
              result={result}
              selectedMetric="wattage_tmp"
              statusLabel={resultStatusLabel}
              objectiveTarget={objectiveTarget}
              objectiveValue={objectiveValue}
              actions={
                <div className="d-flex flex-column align-items-center justify-content-center gap-3">
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-lg w-100 py-3"
                    style={{ maxWidth: '520px' }}
                    onClick={handlePredict}
                    disabled={isPredicting || !isFeatureReady}
                  >
                    {isPredicting ? '예측 중...' : '예측'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-lg w-100 py-3"
                    style={{ maxWidth: '520px' }}
                    onClick={handleRecommend}
                    disabled={isRecommending || !isFeatureReady}
                  >
                    {isRecommending ? '최적화 중...' : '최적화'}
                  </button>
                  {predictError ? <div className="text-danger text-sm">{predictError}</div> : null}
                  {recommendError ? (
                    <div className="text-danger text-sm">{recommendError}</div>
                  ) : null}
                </div>
              }
            />
            <Card className="w-full">
              <CardHeader>
                <CardTitle>추가 지표</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <MetricValueList result={result} metrics={METRIC_RESULT_KEYS} />
              </CardContent>
            </Card>
          </div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>조절 인자</CardTitle>
            </CardHeader>
            <CardContent>
              <SliderControlled sliders={sliders} onChange={(next) => setSliders(next)} />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

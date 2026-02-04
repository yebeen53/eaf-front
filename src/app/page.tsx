'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getFeatures, predict, recommend } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RadialResult, {
  MetricValueList,
  type MetricKey,
  type ResultMetrics,
} from '@/components/radial-result';
import { SliderControlled, type SliderItem } from '@/components/sliders-panel';
import headerImage from '@/app/image.png';
import { PARAM_DEFINITIONS } from '@/lib/params';

function paramsToFeatures(values?: Record<string, number>) {
  const features: Record<string, number> = {};
  for (const p of PARAM_DEFINITIONS) {
    const v = values?.[p.key];
    features[p.key] = Number.isFinite(v) ? v! : p.mean;
  }
  return features;
}

const buildFeaturePayload = (values: Record<string, number>, allFeatures: string[] | null) => {
  const payload = paramsToFeatures(values);
  if (allFeatures) {
    for (const key of allFeatures) {
      if (!(key in payload)) {
        payload[key] = 0;
      }
    }
  }
  return payload;
};

const filterOutScrap = (items: string[]) => {
  return items.filter((key) => !key.toLowerCase().startsWith('scrap'));
};

const createSliders = (): SliderItem[] => {
  return PARAM_DEFINITIONS.map((param) => ({
    label: param.key,
    min: param.min,
    max: param.max,
    step: param.step,
    value: param.mean,
    fixed: false,
  }));
};

const METRIC_RESULT_KEYS: MetricKey[] = [
  'melting_wattage',
  'refining_wattage',
  'tot_result1',
  'tot_result4',
];
const METRIC_KEY_SET = new Set<MetricKey>([
  'melting_wattage',
  'refining_wattage',
  'wattage_tmp',
  'tot_result1',
  'tot_result4',
]);

const toMetricKey = (value: string): MetricKey | null => {
  if (METRIC_KEY_SET.has(value as MetricKey)) {
    return value as MetricKey;
  }
  return null;
};

export default function Page() {
  const [sliders, setSliders] = useState<SliderItem[]>(() => createSliders());
  const [features, setFeatures] = useState<string[] | null>(null);
  const [result, setResult] = useState<ResultMetrics | null>(null);
  const [resultStatusLabel, setResultStatusLabel] = useState<string | null>(null);
  const [objectiveTarget, setObjectiveTarget] = useState<MetricKey | null>(null);
  const [objectiveValue, setObjectiveValue] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictError, setPredictError] = useState<string | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendError, setRecommendError] = useState<string | null>(null);

  useEffect(() => {
    getFeatures()
      .then((r) => setFeatures(filterOutScrap(r.features)))
      .catch((e) => {
        console.error(e);
        setFeatures([]);
      });
  }, []);

  const handlePredict = async () => {
    setIsPredicting(true);
    setPredictError(null);
    try {
      if (features === null) {
        throw new Error('features_not_ready');
      }
      const payload: Record<string, number> = {};
      PARAM_DEFINITIONS.forEach((param, index) => {
        payload[param.key] = sliders[index]?.value ?? param.mean;
      });
      const result = await predict(buildFeaturePayload(payload, features));
      setResult(result);
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
    setIsRecommending(true);
    setRecommendError(null);
    try {
      if (features === null) {
        throw new Error('features_not_ready');
      }
      const payload: Record<string, number> = {};
      PARAM_DEFINITIONS.forEach((param, index) => {
        payload[param.key] = sliders[index]?.value ?? param.mean;
      });
      const searchSpace = Object.fromEntries(
        sliders.map((slider) => [
          slider.label,
          {
            min: slider.min,
            max: slider.max,
            step: slider.step,
            fixed: slider.fixed,
          },
        ]),
      );
      const result = await recommend(buildFeaturePayload(payload, features), searchSpace, 200);
      setResult(result);
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
                    disabled={isPredicting}
                  >
                    {isPredicting ? '예측 중...' : '예측'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-lg w-100 py-3"
                    style={{ maxWidth: '520px' }}
                    onClick={handleRecommend}
                    disabled={isRecommending}
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

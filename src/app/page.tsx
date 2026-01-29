'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getFeatures, predict, recommend } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RadialResult from '@/components/radial-result';
import { SliderControlled, type SliderItem } from '@/components/sliders-panel';
import headerImage from '@/app/image.png';
import { PARAM_DEFINITIONS } from '@/lib/params';

function paramsToFeatures(values?: Record<string, number>) {
  const features: Record<string, number> = {};
  for (const p of PARAM_DEFINITIONS) {
    const v = values?.[p.key];
    features[p.key] = Number.isFinite(v) ? v! : p.mean; // 값 없으면 mean
  }
  return features;
}

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

export default function Page() {
  const [sliders, setSliders] = useState<SliderItem[]>(() => createSliders());
  const [features, setFeatures] = useState<string[] | null>(null);
  const [consumeRate, setConsumeRate] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictError, setPredictError] = useState<string | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendError, setRecommendError] = useState<string | null>(null);

  useEffect(() => {
    getFeatures()
      .then((r) => setFeatures(r.features))
      .catch((e) => {
        console.error(e);
        setFeatures([]);
      });
  }, []);

  const handlePredict = async () => {
    setIsPredicting(true);
    setPredictError(null);
    try {
      const payload: Record<string, number> = {};
      PARAM_DEFINITIONS.forEach((param, index) => {
        payload[param.key] = sliders[index]?.value ?? param.mean;
      });
      const result = await predict(payload);
      setConsumeRate(result.consume_rate);
    } catch (error) {
      console.error(error);
      setPredictError('\uc608\uce21\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.');
    } finally {
      setIsPredicting(false);
    }
  };

  const handleRecommend = async () => {
    setIsRecommending(true);
    setRecommendError(null);
    try {
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
      const result = await recommend(payload, searchSpace, 200);
      setConsumeRate(result.consume_rate);
      setSliders((prev) =>
        prev.map((slider) => ({
          ...slider,
          value: result.recommended_setting[slider.label] ?? slider.value,
        })),
      );
    } catch (error) {
      console.error(error);
      setRecommendError('\ucd5c\uc801\ud654\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.');
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
            <RadialResult value={consumeRate} />
            <Card className="w-full">
              <CardContent
                className="p-8 d-flex flex-column align-items-center justify-content-center gap-3"
                style={{ minHeight: '300px' }}
              >
                <button
                  type="button"
                  className="btn btn-outline-dark btn-lg w-100 py-3"
                  style={{ maxWidth: '520px' }}
                  onClick={handlePredict}
                  disabled={isPredicting}
                >
                  {isPredicting
                    ? '\uc608\uce21 \uc911...'
                    : '\uc804\ub825\uc6d0\ub2e8\uc704 \uc608\uce21'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-dark btn-lg w-100 py-3"
                  style={{ maxWidth: '520px' }}
                  onClick={handleRecommend}
                  disabled={isRecommending}
                >
                  {isRecommending
                    ? '\ucd5c\uc801\ud654 \uc911...'
                    : '\uc804\ub825\uc6d0\ub2e8\uc704 \ucd5c\uc801\ud654'}
                </button>
                {predictError ? <div className="text-danger text-sm">{predictError}</div> : null}
                {recommendError ? (
                  <div className="text-danger text-sm">{recommendError}</div>
                ) : null}
              </CardContent>
            </Card>
          </div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{'\uc870\uc808\uc778\uc790'}</CardTitle>
            </CardHeader>
            <CardContent>
              <SliderControlled sliders={sliders} onChange={setSliders} />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

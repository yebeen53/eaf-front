'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getFeatures, predict } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RadialResult from '@/components/radial-result';
import { SliderControlled, type SliderItem } from '@/components/sliders-panel';
import headerImage from '@/app/image.png';
import { PARAM_DEFINITIONS } from '@/lib/params';

const createSliders = (): SliderItem[] => {
  return PARAM_DEFINITIONS.map((param) => ({
    label: param.key,
    min: param.min,
    max: param.max,
    step: param.step,
    value: param.mean,
  }));
};

export default function Page() {
  const [sliders, setSliders] = useState<SliderItem[]>(() => createSliders());
  const [features, setFeatures] = useState<string[] | null>(null);
  const [consumeRate, setConsumeRate] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictError, setPredictError] = useState<string | null>(null);

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
      const featureNames =
        features && features.length > 0 ? features : sliders.map((slider) => slider.label);
      const payload: Record<string, number> = {};
      featureNames.forEach((name, index) => {
        payload[name] = sliders[index]?.value ?? 0;
      });
      const result = await predict(payload);
      setConsumeRate(result.consume_rate);
    } catch (error) {
      console.error(error);
      setPredictError('예측에 실패했습니다.');
    } finally {
      setIsPredicting(false);
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
                  {isPredicting ? '예측 중...' : '전력원단위 예측'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-dark btn-lg w-100 py-3"
                  style={{ maxWidth: '520px' }}
                >
                  전력원단위 최적화
                </button>
                {predictError ? <div className="text-danger text-sm">{predictError}</div> : null}
              </CardContent>
            </Card>
          </div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>조절인자</CardTitle>
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

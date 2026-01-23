//슬라이더
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export function SliderControlled() {
  const [sliders, setSliders] = React.useState(() => [
    { label: 'Slider 1', min: 0, max: 1, step: 0.1, value: 0.4 },
    { label: 'Slider 2', min: 10, max: 100, step: 5, value: 30 },
    { label: 'Slider 3', min: -50, max: 50, step: 1, value: 0 },
    { label: 'Slider 4', min: 0, max: 500, step: 25, value: 200 },
    { label: 'Slider 5', min: 1, max: 5, step: 1, value: 3 },
    { label: 'Slider 6', min: 0, max: 360, step: 15, value: 90 },
    { label: 'Slider 7', min: 0, max: 1, step: 0.05, value: 0.5 },
    { label: 'Slider 8', min: 100, max: 1000, step: 50, value: 400 },
    { label: 'Slider 9', min: -10, max: 10, step: 0.5, value: 1 },
    { label: 'Slider 10', min: 0, max: 24, step: 1, value: 12 },
  ]);

  return (
    <div className="grid w-full gap-4 md:grid-cols-5">
      {sliders.map((slider, index) => (
        <Card key={index} className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{slider.label}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={`slider-demo-${index + 1}`}>Value</Label>
              <span className="text-muted-foreground text-sm">
                {slider.value}
              </span>
            </div>
            <Slider
              id={`slider-demo-${index + 1}`}
              value={[slider.value]}
              onValueChange={(nextValue) => {
                setSliders((prev) =>
                  prev.map((item, itemIndex) =>
                    itemIndex === index
                      ? { ...item, value: nextValue[0] ?? item.value }
                      : item,
                  ),
                );
              }}
              min={slider.min}
              max={slider.max}
              step={slider.step}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

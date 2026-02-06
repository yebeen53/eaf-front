'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export type SliderItem = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  fixed: boolean;
};

const formatSliderValue = (value: number) => {
  const rounded = Math.round(value * 1000) / 1000;
  return rounded.toFixed(3).replace(/\.?0+$/, '');
};

type SliderControlledProps = {
  sliders: SliderItem[];
  onChange: (nextSliders: SliderItem[]) => void;
};

export function SliderControlled({ sliders, onChange }: SliderControlledProps) {
  return (
    <div className="grid w-full gap-4 md:grid-cols-5">
      {sliders.map((slider, index) => (
        <Card key={index} className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <span>{slider.label}</span>
              {slider.fixed ? (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  고정
                </span>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center justify-end gap-2">
              <span className="text-muted-foreground text-sm">
                {formatSliderValue(slider.value)}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Switch
                id={`slider-fixed-${index + 1}`}
                checked={slider.fixed}
                onCheckedChange={(checked) => {
                  onChange(
                    sliders.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, fixed: checked } : item,
                    ),
                  );
                }}
              />
            </div>
            <Slider
              id={`slider-demo-${index + 1}`}
              value={[slider.value]}
              onValueChange={(nextValue) => {
                onChange(
                  sliders.map((item, itemIndex) =>
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

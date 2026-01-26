'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export type SliderItem = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
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
            <CardTitle className="text-base">{slider.label}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={`slider-demo-${index + 1}`}>값</Label>
              <span className="text-muted-foreground text-sm">{slider.value}</span>
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

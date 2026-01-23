import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RadialResult from '@/components/radial-result';
import { SliderControlled } from '@/components/sliders-panel';
import headerImage from '@/app/image.png';

export default function Home() {
  return (
    <>
      <header className="w-full bg-black">
        <div className="mx-auto w-full max-w-none px-8 py-4">
          <Image src={headerImage} alt="Header logo" priority />
        </div>
      </header>
      <main className="mx-auto w-full max-w-none p-8">
        <div className="grid w-full gap-6">
          <div className="grid w-full gap-6 md:grid-cols-2">
            <RadialResult />
            <Card className="w-full" />
          </div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Sliders</CardTitle>
            </CardHeader>
            <CardContent>
              <SliderControlled />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { adjustPixelRatio, pixelRatioLimit } from '../roomPerformance';

export default function RenderBudget({ isMobile, active }) {
  const { size, setDpr, invalidate } = useThree();
  const samples = useRef({ elapsed: 0, frames: 0, fastWindows: 0, dpr: 1, ceiling: 1 });
  useEffect(() => {
    const ceiling = pixelRatioLimit(size.width, size.height, isMobile);
    samples.current = { elapsed: 0, frames: 0, fastWindows: 0, dpr: ceiling, ceiling };
    setDpr(ceiling);
    invalidate();
  }, [size.width, size.height, isMobile, setDpr, invalidate]);
  useEffect(() => {
    samples.current.elapsed = 0;
    samples.current.frames = 0;
    samples.current.fastWindows = 0;
  }, [active]);
  useFrame((_, delta) => {
    if (!active || delta <= 0) return;
    const sample = samples.current;
    sample.elapsed += Math.min(delta, 0.25);
    sample.frames++;
    // Long sampling windows avoid changing resolution on a single slow frame.
    if (sample.elapsed < 3) return;
    const fps = sample.frames / sample.elapsed;
    sample.fastWindows = fps > 57 ? sample.fastWindows + 1 : 0;
    // Recover detail slowly; sustained slow frames lower the workload sooner.
    const next = fps > 57 && sample.fastWindows < 3 ? sample.dpr : adjustPixelRatio(sample.dpr, sample.ceiling, fps);
    if (next !== sample.dpr) sample.fastWindows = 0;
    if (Math.abs(next - sample.dpr) > 0.01) {
      sample.dpr = next;
      setDpr(next);
    }
    sample.elapsed = 0;
    sample.frames = 0;
  });
  return null;
}

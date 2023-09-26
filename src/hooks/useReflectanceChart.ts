/**
 * Copyright 2023 Eugene Khyst
 * SPDX-License-Identifier: Apache-2.0
 */

import {MutableRefObject, RefCallback, useCallback, useRef} from 'react';
import {ReflectanceChart} from '../services/canvas/chart';

export function useReflectanceChart(): {
  ref: RefCallback<HTMLCanvasElement>;
  reflectanceChartRef: MutableRefObject<ReflectanceChart | undefined>;
} {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reflectanceChartRef = useRef<ReflectanceChart>();
  const ref = useCallback((node: HTMLCanvasElement | null) => {
    reflectanceChartRef.current?.destroy();
    reflectanceChartRef.current = undefined;
    if (node) {
      canvasRef.current = node;
      reflectanceChartRef.current = new ReflectanceChart(node);
    }
  }, []);

  return {
    ref,
    reflectanceChartRef,
  };
}
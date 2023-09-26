/**
 * Copyright 2023 Eugene Khyst
 * SPDX-License-Identifier: Apache-2.0
 */

import {createArray, getIndexForCoord} from '../../utils';

function getIndexInHistogram(histogram: number[], value: number): number {
  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += histogram[i];
    if (sum >= value) {
      return i;
    }
  }
  return 255;
}

export function medianFilter(imageData: ImageData, radius: number, colors = 3): void {
  if (colors !== 1 && colors !== 3) {
    throw new Error('Colors must equal 1 or 3');
  }
  if (radius < 1) {
    return;
  }
  const {data, width, height} = imageData;
  const origData: Uint8ClampedArray = new Uint8ClampedArray(data);
  const kernelSize = 2 * radius;
  const median = (kernelSize * kernelSize) / 2;
  for (let c = 0; c < colors; c++) {
    for (let y = radius; y < height - radius; y++) {
      const hist: number[] = createArray(256, 0);
      for (let j = y - radius; j <= y + radius; j++) {
        for (let i = 0; i <= kernelSize; i++) {
          hist[origData[getIndexForCoord(i, j, width, c)]] += 1;
        }
      }
      for (let x = radius; x < width - radius; x++) {
        for (let k = -radius; k <= radius; k++) {
          hist[origData[getIndexForCoord(x - radius, y + k, width, c)]] -= 1;
          hist[origData[getIndexForCoord(x + radius, y + k, width, c)]] += 1;
        }
        const v = getIndexInHistogram(hist, median);
        const index = getIndexForCoord(x, y, width, c);
        data[index] = v;
        if (colors === 1) {
          data[index + 1] = v;
          data[index + 2] = v;
        }
      }
    }
  }
}
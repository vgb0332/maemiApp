/**
 * @flow
 */

import { Dimensions, PixelRatio } from 'react-native';

const window = Dimensions.get('window');
export const { width, height } = window;

//MIT RESPONSIVE DIMENSIONS

export const Width = (w: number): number => Math.round(width * (w / 100));
export const Height = (h: number): number => Math.round(height * (h / 100));
export const FontSize =
(f: number): number => Math.sqrt((height * height) + (width * width)) * (f / 100);

export const FixedFontSize = (size: number): number => {
  const baseNum = PixelRatio.get();
  const fontNum = PixelRatio.getFontScale();
  const divisionNum = baseNum / fontNum;

  return size * divisionNum;
};

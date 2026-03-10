export const FROZEN_FEATURES = {
  heroSlider: true,
  discounts: true,
} as const;

export type FeatureKey = keyof typeof FROZEN_FEATURES;

export function isFeatureFrozen(feature: FeatureKey): boolean {
  return FROZEN_FEATURES[feature] === true;
}

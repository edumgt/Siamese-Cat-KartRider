import { buildCharacterDriver } from './CharacterDriverBuilder.js';

/**
 * Creates the 1:87 Scale Siamese Cat ("샴 고양이") Kart Driver.
 * Powered by the unified CharacterDriverBuilder.
 */
export function buildSiameseCatDriver(options = {}) {
  return buildCharacterDriver('siamese', options);
}

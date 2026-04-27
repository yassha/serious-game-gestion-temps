import type { Gender } from "../types";

/**
 * Inclusive avatar set using emoji – works on every device, no asset pipeline,
 * easy to swap later for SVG illustrations if desired.
 */
export const AVATARS: Record<Gender, string[]> = {
  femme: ["👩", "👩‍🦰", "👩‍🦱", "👩‍🦳", "👩‍🦲", "👩🏽", "👩🏿", "👩🏻"],
  homme: ["👨", "👨‍🦰", "👨‍🦱", "👨‍🦳", "👨‍🦲", "👨🏽", "👨🏿", "👨🏻"],
  autre: ["🧑", "🧑‍🦰", "🧑‍🦱", "🧑‍🦳", "🧑‍🦲", "🧑🏽", "🧑🏿", "🧑🏻"],
};

export function defaultAvatar(gender: Gender) {
  return AVATARS[gender][0];
}

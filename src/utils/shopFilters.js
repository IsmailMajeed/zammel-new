export const STYLE_FILTERS = [
  { label: 'Oversized Fit', value: 'oversized', description: 'Relaxed drop-shoulder silhouettes' },
  { label: 'Zip-Up', value: 'zipup', description: 'Easy layering classics' },
  { label: 'Minimal Crew', value: 'minimal', description: 'Clean everyday essentials' },
];

export const COLOR_FILTERS = [
  { label: 'Monochrome', value: 'monochrome', description: 'Black, white & charcoal tones' },
  { label: 'Earthy Neutrals', value: 'neutral', description: 'Beige, mocha & camel hues' },
  { label: 'Bold Pop', value: 'bold', description: 'Statement seasonal colours' },
];

export const SEASON_FILTERS = [
  { label: 'Winter Ready', value: 'winter', description: 'Brushed fleece, 320+ GSM' },
  { label: 'All Season', value: 'allseason', description: 'Lightweight layering pieces' },
  { label: 'Summer Evenings', value: 'summer', description: 'Breathable terry fabrics' },
];

export const SHOP_FILTER_GROUPS = [
  { type: 'style', title: 'Shop by Style', options: STYLE_FILTERS },
  { type: 'color', title: 'Shop by Colour', options: COLOR_FILTERS },
  { type: 'season', title: 'Shop by Season', options: SEASON_FILTERS },
];

export const buildShopFilterLink = (type, value) => {
  if (!type || !value || value === 'all') {
    return '/';
  }
  return `/?${type}=${value}`;
};


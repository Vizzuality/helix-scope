export const DEFAULT_SEASON = 3;
export const SEASON_LIST = [
  {
    name: 'Mar/Apr/May',
    slug: 3
  },
  {
    name: 'Jun/Jul/Aug',
    slug: 4
  },
  {
    name: 'Sep/Oct/Nov',
    slug: 1
  },
  {
    name: 'Dec/Jan/Feb',
    slug: 2
  }
];

export function getSeasonTextById(season) {
  switch (season) {
    case 0:
      return 'All/Total';
    case 1:
      return 'Sep/Oct/Nov';
    case 2:
      return 'Dec/Jan/Feb';
    case 3:
      return 'Mar/Apr/May';
    case 4:
      return 'Jun/Jul/Aug';
    default:
      return '';
  }
}

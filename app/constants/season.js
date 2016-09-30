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

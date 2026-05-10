const params = new URLSearchParams(window.location.search);

export const state = {
  comparisons: 0,
  arrayAccesses: 0,
  isSorting: false,
  cancelled: false,
  recentHighlights: new Set(),
  delay: 1,
  stepsPerFrame: 1,
  arraySize: 50,
  color: params.get("colorize") !== false,
  sortName: "",
  randomRangeUpperBound: 0,
}

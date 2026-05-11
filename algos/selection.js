import { state } from '../../state.js';
import { drawSort, sleep, exchange } from '../../visualizer.js';

export const sortName = "Selection Sort";

export function adjustDelayAndSteps() {
  if (state.arraySize <= 50) {
    state.delay = 50;
  } else if (state.arraySize <= 200) {
    state.delay = 25;
  } else if (state.arraySize <= 500) {
    state.delay = 15;
  } else {
    state.delay = 1;
  }
  state.stepsPerFrame = 1 + Math.floor(state.arraySize / 11);
}

export async function sort(A) {
  let step = 0;
  for (let i = 0; i < A.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < A.length; j++) {
      if (state.cancelled) { return; }
      if (A[j] < A[min]) {
        min = j;
      }
      state.comparisons++;
      step++;
      state.recentHighlights.add(i);
      state.recentHighlights.add(j);
      state.recentHighlights.add(min);
      if (step % state.stepsPerFrame === 0) {
        drawSort(A, [...state.recentHighlights]);
        state.recentHighlights.clear();
        await sleep(state.delay);
      }
    }
    state.swaps++;
    exchange(A, i, min);
  }
}

import { state } from '../../state.js';
import { drawSort, sleep, exchange } from '../../visualizer.js';

export const sortName = "Bubble Sort";

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
  for (let i = 1; i < A.length; i++) {
    for (let j = A.length - 1; j >= i; j--) {
      if (state.cancelled) return;
      state.comparisons++;
      state.arrayAccesses += 2;
      if (A[j - 1] > A[j]) {
        exchange(A, j - 1, j);
      }
      state.recentHighlights.add(j - 1);
      state.recentHighlights.add(j);
      step++;
      if (step % state.stepsPerFrame === 0) {
        drawSort(A, [...state.recentHighlights]);
        state.recentHighlights.clear();
        await sleep(state.delay);
      }
    }
  }
}

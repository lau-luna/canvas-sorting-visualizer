import { state } from '../../state.js';
import { drawSort, sleep, exchange } from '../../visualizer.js';

export const sortName = "Quick Sort";

export function adjustDelayAndSteps() {
  if (state.arraySize <= 25) {
    state.delay = 75;
  } else if (state.arraySize <= 50) {
    state.delay = 50;
  } else if (state.arraySize <= 100) {
    state.delay = 25;
  } else if (state.arraySize <= 200) {
    state.delay = 20;
  } else if (state.arraySize <= 350) {
    state.delay = 15;
  } else if (state.arraySize <= 500) {
    state.delay = 10;
  } else if (state.arraySize <= 800) {
    state.delay = 5;
  } else {
    state.delay = 1;
  }
  state.stepsPerFrame = 1 + Math.floor(state.arraySize / 200);
}

export async function sort(A) {
  await quickSort(A, 0, A.length - 1);
}

async function quickSort(A, p, r) {
  let step = 0;
  if (p < r) {
    let i = p - 1;
    for (let j = p; j < r; j++) {
      if (state.cancelled) return;
      if (A[j] <= A[r]) {
        i++;
        state.swaps++;
        exchange(A, i, j);
      }
      state.comparisons++;
      state.arrayAccesses += 2;
      state.recentHighlights.add(j);
      state.recentHighlights.add(r);
      step++;
      if (step % state.stepsPerFrame === 0) {
        drawSort(A, [...state.recentHighlights]);
        state.recentHighlights.clear();
        await sleep(state.delay);
      }
    }
    state.recentHighlights.clear();
    let q = i + 1;
    exchange(A, q, r);
    state.swaps++;
    state.recentHighlights.add(q);
    state.recentHighlights.add(r);
    await quickSort(A, p, q - 1);
    await quickSort(A, q + 1, r);
  }
}

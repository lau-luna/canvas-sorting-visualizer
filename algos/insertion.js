import { state } from '../../state.js';
import { drawSort, sleep, exchange } from '../../visualizer.js';

export const sortName = "Insertion Sort";

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
  let step = 0
  for (let i = 1; i < A.length; i++) {
    let key = A[i];
    state.arrayAccesses += 1;
    let j = i - 1;
    while (j >= 0 && A[j] > key) {
      if (state.cancelled) return;
      A[j + 1] = A[j];
      state.comparisons += 1;
      state.arrayAccesses += 2;
      j--;
      state.recentHighlights.add(j);
      state.recentHighlights.add(i);
      step++;
      if (step % state.stepsPerFrame === 0) {
        drawSort(A, [...state.recentHighlights]);
        state.recentHighlights.clear();
        await sleep(state.delay);
      }
    }
    A[j + 1] = key;
    state.arrayAccesses += 1;
  }
}

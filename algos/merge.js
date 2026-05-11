import { state } from '../state.js';
import { drawSort, sleep, exchange } from '../visualizer.js';

export const sortName = "Merge Sort";

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
  await mergeSort(A, 0, A.length - 1);
}


let step = 0;

async function mergeSort(A, p, r) {
  if (p < r) {
    let mid = Math.floor((p + r) / 2);

    await mergeSort(A, p, mid);
    await mergeSort(A, mid + 1, r);

    await merge(A, p, mid, r);
  }
}

async function merge(A, p, mid, r) {
  let left = A.slice(p, mid + 1);
  let right = A.slice(mid + 1, r + 1);

  let i = 0, j = 0, k = p;

  while (i < left.length && j < right.length) {
    if (state.cancelled) { return; }
    if (left[i] < right[j]) {
      A[k] = left[i++];
    } else {
      A[k] = right[j++];
    }
    state.comparisons++;
    state.arrayAccesses += 4;
    state.recentHighlights.add(p + i);
    state.recentHighlights.add(mid + 1 + j);
    state.recentHighlights.add(k);
    step++;
    if (step % state.stepsPerFrame === 0) {
      drawSort(A, [...state.recentHighlights]);
      state.recentHighlights.clear();
      await sleep(state.delay);
    }
    k++;
  }
  if (i < left.length) {
    while (i < left.length) {
      if (state.cancelled) { return; }
      A[k] = left[i];
      state.arrayAccesses += 2;
      k++;
      i++;
      step++;
      state.recentHighlights.add(i);
      state.recentHighlights.add(k);
      if (step % state.stepsPerFrame === 0) {
        drawSort(A, [...state.recentHighlights]);
        state.recentHighlights.clear();
        await sleep(state.delay);
      }
    }
  }
  if (j < right.length) {
    while (j < right.length) {
      if (state.cancelled) { return; }
      A[k] = right[j];
      state.arrayAccesses += 2;
      k++;
      j++;
      step++;
      state.recentHighlights.add(i);
      state.recentHighlights.add(k);
      if (step % state.stepsPerFrame === 0) {
        drawSort(A, [...state.recentHighlights]);
        state.recentHighlights.clear();
        await sleep(state.delay);
      }
    }
  }
}


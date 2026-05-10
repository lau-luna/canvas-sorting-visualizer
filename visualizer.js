import { state } from './state.js';

export const canvas = document.getElementById("algo");
export const ctx = canvas.getContext("2d");

state.randomRangeUpperBound = canvas.height - 100;

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createRandomArray(elems) {
  let arr = [];
  for (let i = 0; i < elems; i++) {
    arr.push(getRandomInt(1, state.randomRangeUpperBound));
  }
  return arr;
}

export function sliderToValue(sliderVal, min, max) {
  let ratio = sliderVal / 2000;
  return Math.round(min * Math.pow(max / min, ratio));
}

export function valueToColor(value, min, max) {
  let ratio = (value - min) / (max - min);
  let hue = ratio * 330;
  return `hsl(${hue}, 95%, 50%)`;
}

export function drawFrame(A, highlight = []) {
  let startWidth = 20;
  let endWidth = canvas.width - 20;
  let startHeight = canvas.height - 10;
  let elemWidth = (endWidth - startWidth) / A.length;
  let x = startWidth;
  for (let i = 0; i < A.length; i++) {
    let elemHeight = A[i];
    if (state.color) {
      ctx.fillStyle = highlight.includes(i) ? "white" : valueToColor(A[i], 1, state.randomRangeUpperBound);
    } else {
      ctx.fillStyle = highlight.includes(i) ? "#FF69B4" : "white";
    }
    ctx.fillRect(x, startHeight - elemHeight, elemWidth, elemHeight);
    x += elemWidth;
  }
}

export function template(numElements) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "32px serif";
  ctx.fillText(state.sortName, 10, 35);
  ctx.font = "14px serif";
  ctx.fillText("A in {1, ..., " + numElements + "}^" + state.randomRangeUpperBound, 175, 34);
  ctx.fillText(state.comparisons + " comparisons.", 10, 60);
  ctx.fillText(state.arrayAccesses + " array accesses.", 140, 60);
  ctx.fillText("1 frame = " + state.delay + " ms", canvas.width - 108, 35);
  ctx.fillText(state.stepsPerFrame + " steps/frame.", canvas.width - 100, 60);
}

export function draw(A) {
  template(A.length);
  drawFrame(A, []);
}

export function drawSort(A, highlight = []) {
  template(A.length);
  drawFrame(A, highlight);
}

export function drawCheck(A, highlight = []) {
  template(A.length);
  drawFrame(A, highlight);
}

export async function check(A) {
    state.recentHighlights.clear();
    const totalDuration = 2000;
    const stepsPerFrame = Math.max(1, Math.floor(A.length / (totalDuration / 16)));
    let i = 0;
    while (i < A.length - 1) {
        for (let s = 0; s < stepsPerFrame && i < A.length - 1; s++) {
            state.recentHighlights.add(i);
            state.recentHighlights.add(i + 1);
            i++;
        }
        drawCheck(A, [...state.recentHighlights]);
        await sleep(16);
    }

    await sleep(200);
    state.recentHighlights.clear();
}

export function exchange(A, i, j) {
  let aux = A[i];
  A[i] = A[j];
  A[j] = aux;
  state.arrayAccesses += 4;
}

export function initVisualizer(sortFn, adjustFn) {
  const sortingDiv = document.getElementById("sorting");
  const controlsDiv = document.createElement("div");

  const sortButton = document.createElement("button");
  sortButton.innerText = "SORT";
  sortButton.style.width = "100px";
  sortButton.style.height = "50px";

  const newArrayButton = document.createElement("button");
  newArrayButton.innerText = "New random array";
  newArrayButton.style.width = "100px";
  newArrayButton.style.height = "50px";

  const colorButton = document.createElement("button");
  colorButton.innerText = "Colorize";
  colorButton.style.width = "75px";
  colorButton.style.height = "50px";

  const sliderDiv = document.createElement("div");
  sliderDiv.style.display = "block";

  const sizeParagraph = document.createElement("p");
  sizeParagraph.innerText = "Array size:";
  sizeParagraph.style.margin = "0";

  const sizeSlider = document.createElement("input");
  const sliderWidth = canvas.width - 340;
  sizeSlider.type = "range";
  sizeSlider.min = 10;
  sizeSlider.max = 2000;
  sizeSlider.value = 600;
  sizeSlider.style.width = `${sliderWidth}px`;

  sliderDiv.appendChild(sizeParagraph);
  sliderDiv.appendChild(sizeSlider);
  controlsDiv.appendChild(sortButton);
  controlsDiv.appendChild(newArrayButton);
  controlsDiv.appendChild(sliderDiv);
  controlsDiv.appendChild(colorButton);

  controlsDiv.style.display = "flex";
  controlsDiv.style.alignItems = "center";
  controlsDiv.style.gap = "20px";
  controlsDiv.style.marginBottom = "1%";

  sortingDiv.insertBefore(controlsDiv, canvas);

  let arr = createRandomArray(state.arraySize);
  draw(arr);

  newArrayButton.addEventListener("click", () => {
    if (!state.isSorting) {
      arr = createRandomArray(state.arraySize);
      draw(arr);
    }
  });

  sortButton.addEventListener("click", async () => {
    if (!state.isSorting) {
      state.isSorting = true;
      state.cancelled = false;
      sortButton.innerText = "STOP";
      sizeSlider.disabled = true;
      newArrayButton.disabled = true;
      state.comparisons = 0;
      state.arrayAccesses = 0;
      await sortFn(arr);
      if (!state.cancelled) await check(arr);
      draw(arr);
      state.isSorting = false;
      sortButton.innerText = "SORT";
      sizeSlider.disabled = false;
      newArrayButton.disabled = false;
    } else {
      state.cancelled = true;
    }
  });

  sizeSlider.addEventListener("input", (event) => {
    if (!state.isSorting) {
      state.arraySize = sliderToValue(event.target.value, 10, 2000);
      arr = createRandomArray(state.arraySize);
      adjustFn();
      draw(arr);
    }
  });

  colorButton.addEventListener("click", () => {
    colorButton.innerText = state.color ? "Colorize" : "Decolorize";
    state.color = !state.color;
    draw(arr);
  });
}

import { sortName } from './algos/insertion.js';
import { state } from './state.js';

export let canvas, ctx;



const params = new URLSearchParams(window.location.search);
let showSelect = params.get("showSelect") || "true";



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

function calcWidth(text) {
  return Math.floor(ctx.measureText(text).width);
}

export function template(numElements) {
  const marginLeftPx = 10;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";

  ctx.font = "32px serif";
  ctx.fillText(state.sortName, marginLeftPx, 35);
  let sortNameWidthPx = calcWidth(state.sortName);

  let text = "";
  let lastWidthPx;
  ctx.font = "14px serif";
  ctx.fillText("A in {1, ..., " + state.randomRangeUpperBound + "}^" + numElements, 10 + marginLeftPx + sortNameWidthPx, 34);

  let x = 10;

  text = state.comparisons + " comparisons.";
  lastWidthPx = calcWidth(text);
  ctx.fillText(text, x, 60);
  x += lastWidthPx + 10;

  text = state.arrayAccesses + " array accesses.";
  lastWidthPx = calcWidth(text);
  ctx.fillText(text, x, 60);
  x += lastWidthPx + 10;

  text = state.swaps + " swaps.";
  lastWidthPx = calcWidth(text);
  ctx.fillText(text, x, 60);
  x += lastWidthPx + 10;

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

export async function initVisualizer(sortFn, adjustFn, onAlgoChange) {
  const response = await fetch("./algorithms.json");
  const algorithms = await response.json();

  canvas = document.getElementById("algo");
  ctx = canvas.getContext("2d");

  canvas.width = canvas.dataset.width || canvas.parentElement.clientWidth;
  canvas.height = canvas.dataset.height || window.innerHeight * 0.812;

  state.randomRangeUpperBound = canvas.height - 100;

  function makeButton(text) {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.style.padding = "0 15px";
    btn.style.height = "50px";
    btn.style.flexShrink = "0";
    btn.style.whiteSpace = "nowrap";
    return btn;
  }

  const sortingDiv = document.getElementById("sorting");

  let form = document.getElementById("form");
  if (form != null) {
    document.body.removeChild(form);
  }
  form = document.createElement("form");
  form.id = "form";
  form.style.marginBottom = "2%";

  const label = document.createElement("label");
  label.innerText = "Select a sorting algorithm";
  label.htmlFor = "algoSelect";

  const select = document.createElement("select");
  select.id = "algoSelect";


  // Create the form
  algorithms.forEach((algo) => {
    const option = document.createElement("option");
    option.value = algo.value;
    option.innerText = algo.text;
    select.appendChild(option);
  });

  form.appendChild(label);
  form.appendChild(select);
  if (showSelect == "true") {
    document.body.insertBefore(form, sortingDiv);
  }


  let controlsDiv = document.getElementById("controlsDiv");

  if (controlsDiv != null) {
    sortingDiv.removeChild(controlsDiv);
  }

  controlsDiv = document.createElement("div");
  controlsDiv.id = "controlsDiv";

  const sortButton = makeButton("SORT");
  const newArrayButton = makeButton("New Array");
  const colorButton = makeButton("Decolorize");

  const sliderDiv = document.createElement("div");
  sliderDiv.style.display = "block";
  sliderDiv.style.flex = "1"; // ocupa el espacio restante

  const sizeParagraph = document.createElement("p");
  sizeParagraph.innerText = "Array size:";
  sizeParagraph.style.margin = "0";

  const sizeSlider = document.createElement("input");
  sizeSlider.type = "range";
  sizeSlider.min = 10;
  sizeSlider.max = 2000;
  sizeSlider.value = 600;
  sizeSlider.style.width = "100%"; // ocupa todo el sliderDiv

  sliderDiv.appendChild(sizeParagraph);
  sliderDiv.appendChild(sizeSlider);
  controlsDiv.appendChild(sortButton);
  controlsDiv.appendChild(newArrayButton);
  controlsDiv.appendChild(sliderDiv);
  controlsDiv.appendChild(colorButton);

  controlsDiv.style.display = "flex";
  controlsDiv.style.alignItems = "center";
  controlsDiv.style.gap = "20px";
  controlsDiv.style.marginBottom = "25px";

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
      state.swaps = 0;
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

  select.addEventListener("change", (e) => {
    onAlgoChange(e.target.value);
  });
}

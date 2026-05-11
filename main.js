import { initVisualizer } from './visualizer.js';
import { state } from './state.js';

const params = new URLSearchParams(window.location.search);
let algo = params.get("algo") || "bubble";
const transparent = params.get("transparent") === "true";

export async function loadAlgorithm(name) {
  let module = await import(`./algos/${name}.js`);
  state.sortName = module.sortName;
  module.adjustDelayAndSteps();
  await initVisualizer(module.sort, module.adjustDelayAndSteps, loadAlgorithm);
}

window.onload = async function() {

  await loadAlgorithm(algo);
  console.log(algo)

  if (transparent) {
    document.body.style.backgroundColor = "transparent";
    document.body.style.backgroundImage = "none";
  }
}

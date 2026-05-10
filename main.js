import { state } from './state.js';
import { initVisualizer } from './visualizer.js';

window.onload = async function() {
  const select = document.getElementById("algoSelect");

  async function loadAlgorithm(name) {
    const module = await import(`./algos/${name}/main.js`);
    console.log(module);
    module.init();
  }

  select.addEventListener("change", (e) => {
    loadAlgorithm(e.target.value);
  });

  loadAlgorithm(select.value);
}


const params = new URLSearchParams(window.location.search);
let algo = params.get("algo") || "bubble";
let showSelect = params.get("showSelect") || "true";
const transparent = params.get("transparent") === "true";

export async function loadAlgorithm(name) {
  let module = await import(`./algos/${name}/main.js`);
  module.init();
}

window.onload = async function() {
  await loadAlgorithm(algo); // ← await para que el select ya exista

  select.addEventListener("change", (e) => {
    loadAlgorithm(e.target.value);
  });

  if (showSelect != "true") {
    document.getElementById("form").remove();
  }

  if (transparent) {
    document.body.style.backgroundColor = "transparent";
    document.body.style.backgroundImage = "none";
  }
}

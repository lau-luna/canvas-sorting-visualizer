
const params = new URLSearchParams(window.location.search);
let algo = params.get("algo") || "bubble";
const transparent = params.get("transparent") === "true";

export async function loadAlgorithm(name) {
  let module = await import(`./algos/${name}/main.js`);
  // console.log(module);
  module.init();
}

window.onload = async function() {
  await loadAlgorithm(algo);

  if (transparent) {
    document.body.style.backgroundColor = "transparent";
    document.body.style.backgroundImage = "none";
  }
}

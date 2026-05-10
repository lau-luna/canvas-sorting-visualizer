
const params = new URLSearchParams(window.location.search);
let algo = params.get("algo");
let showSelect = params.get("showSelect") || "true";

window.onload = async function() {

  const select = document.getElementById("algoSelect");

  async function loadAlgorithm(name) {
    let module = await import(`./algos/${name}/main.js`);
    // console.log(module);
    module.init();
  }

  select.addEventListener("change", (e) => {
    loadAlgorithm(e.target.value);
  });

  if (algo != null) {
    loadAlgorithm(algo);
  } else {
    loadAlgorithm(select.value);
  }

  if (showSelect != "true") {
    document.getElementById("form").remove();
  }
}

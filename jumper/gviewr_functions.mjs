var g_height = 0;
let entities_captured = {};
let entities_height = {};

async function pushImagesToViewer(array_of_imags, quid) {
  entities_captured[quid] = true;
  entities_height[quid] = g_height;

  let nodes_to_append = [];
  array_of_imags.forEach((image, i) => {
    let entityEl = document.createElement("a-box");

    console.log(image);
    console.log(i);

    const r = 4 + array_of_imags.length / 10; //radius of the scene
    const angle = ((2 * Math.PI) / array_of_imags.length) * i;
    entityEl.setAttribute(
      "position",
      `${r * Math.sin(angle)} ${g_height} ${r * Math.cos(angle)}`
    );
    entityEl.setAttribute("width", "2");
    entityEl.setAttribute("depth", "0.2");
    entityEl.setAttribute("height", "2");
    // entityEl.setAttribute('color','');
    entityEl.setAttribute("static-body", "true");
    entityEl.setAttribute("look-at", "#camera");
    entityEl.setAttribute("material", `src: url(${image})`);
    nodes_to_append.push(entityEl);
  });
  document.getElementById("theScene").append(...nodes_to_append);
  g_height += 2;
  document
    .getElementById("rig")
    .setAttribute("position", `0 ${1.6 + g_height} 0`);
}

async function jumpToAHeight(quid) {
  let height = entities_height[quid];
  document
    .getElementById("rig")
    .setAttribute("position", `0 ${1.6 + height} 0`);
}

function entityInGraphCheck(quid) {
  console.log("testing", entities_captured[quid]);
  console.log("values:", !!entities_captured[quid]);
  return (!!entities_captured[quid]);
}

async function showMicAtLevel() {
  document.getElementById("theMic").setAttribute("gltf-model", "#mic-asset");
  document
    .getElementById("theMic")
    .setAttribute("position", `2 ${g_height} -2`);
}

async function showSessionEnd() {
  document
    .getElementById("theMic")
    .setAttribute("gltf-model", "#type-person-boy");
}

async function showSessionError() {
  document
    .getElementById("theMic")
    .setAttribute("gltf-model", "#type-person-boy");
}

export {
  pushImagesToViewer,
  jumpToAHeight,
  entityInGraphCheck,
  showMicAtLevel,
  showSessionEnd,
  showSessionError
};

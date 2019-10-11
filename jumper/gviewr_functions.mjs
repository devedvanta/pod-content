var g_height = 0;
let entities_captured = {};
let entities_height = {};
let entities_length = {};

const camera_rigs = ['camera', 'camera2'];
let switch_count = 0;

const PER_IMAGE_MIN_TIMI_MILLS = 420;
function determineRadiusBasedOnCount(count) {
  return 4 + count/7;
}

async function pushImagesToViewer(array_of_imags, quid) {
  entities_captured[quid] = true;
  entities_height[quid] = g_height;
  entities_length[quid] = array_of_imags.length;

  let nodes_to_append = [];
  array_of_imags.forEach((image, i) => {
    let entityEl = document.createElement("a-box");

    console.log(image);
    console.log(i);

    const r = determineRadiusBasedOnCount(array_of_imags.length);

    const angle = ((2 * Math.PI) / array_of_imags.length) * i;
    const positionString = `${(r * Math.sin(angle))} ${g_height} ${(r * Math.cos(angle))}`;
    entityEl.setAttribute(
      "position",
      positionString
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
  
  autoRotatingCamera1(array_of_imags.length, g_height);
  autoRotatingCamera2(length, g_height);
  
  updateGHeightAndNeedful();
}

async function updateGHeightAndNeedful() {
  g_height += 2;
  document.getElementById('focusPoint').setAttribute('position', `0 ${g_height/2} 0`);
}
async function jumpToAHeight(quid) {
  let height = entities_height[quid];
  let length = entities_length[quid];
  document
    .getElementById("rig")
    .setAttribute("position", `0 ${1.6 + height} 0`);


    //also set along path of that height
    autoRotatingCamera1(length, height);
    // autoRotatingCamera2(length, g_height);
}

async function autoRotatingCamera1(length, height) {
  let camera_path = 'path:';
  console.log('jumping and now with length of', length );
  let r = determineRadiusBasedOnCount(length);
  for(let i=0;i<length; i++) {
    const angle = ((2 * Math.PI) / length) * i;
    camera_path += ` ${r * Math.sin(angle)},${height},${r * Math.cos(angle) + 2}`;
  }
    document.getElementById("rig").removeAttribute("alongpath");

    let camera_speed = PER_IMAGE_MIN_TIMI_MILLS * length;
    camera_speed = camera_speed > 20000 ? camera_speed : 20000;
    console.log(camera_speed);
    camera_path += `; closed:true; dur:${camera_speed}`;
    console.log(camera_path);
    document
      .getElementById("rig")
      .setAttribute("alongpath", camera_path);
}
async function autoRotatingCamera2(length, height) {
  let camera_path = 'path:';
  
  let r = height/2 + 2;
  console.log('rig2| vert radius', r );

  for(let i=0;i<(r*10); i++) {
    

    const angle = ((2 * Math.PI) / (r*10)) * i;
    camera_path += ` ${0},${(height/2) + (r * Math.sin(angle))},${r * Math.cos(angle) + 2}`;
    console.log(`rig2| ${angle} => ${0},${(height/2)} + ${(r * Math.sin(angle))},${r * Math.cos(angle) + 2}`  );
  }
    document.getElementById("rig2").removeAttribute("alongpath");

    let camera_speed = 35000;
    
    camera_path += `; closed:true; dur:${camera_speed}`;
    console.log('rig2 ', camera_path);
    document
      .getElementById("rig2")
      .setAttribute("alongpath", camera_path);
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

async function switchCamera() {
  let cam_id = camera_rigs[++switch_count%(camera_rigs.length)];
  document.getElementById(cam_id).setAttribute('camera', 'active', true);
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

async function showTextFeedbackToUserForContext(string) {
  const toShow = `Last message: ${string}`;
  document.getElementById('overlay-text').innerHTML = toShow;
}

export {
  pushImagesToViewer,
  jumpToAHeight,
  entityInGraphCheck,
  showMicAtLevel,
  showSessionEnd,
  showSessionError,
  showTextFeedbackToUserForContext,
  switchCamera
};

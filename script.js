import * as T from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import gsap from "gsap";

// GUI
const gui = new GUI();
const debugObj = {
  color: "#ff0000",
  spin() {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 });
  },
};

const canvas = document.querySelector("canvas.webgl");
const sizes = { width: window.innerWidth, height: window.innerHeight };

// Resize
window.addEventListener("resize", () => {
  //1. Update Size Object
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //2. Update Renderer
  renderer.setSize(sizes.width, sizes.height);

  //3. Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // 5. when user chnage diffrent screen
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Double Click
window.addEventListener("dblclick", () => {
  const fullScreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullScreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

// Cursor
// const cursor = { x: 0, y: 0 };
// window.addEventListener("mousemove", (e) => {
//   cursor.y = e.clientY / sizes.height - 0.5;
//   cursor.x = -(e.clientX / sizes.width - 0.5);
// });

// Scene
const scene = new T.Scene();

// Object
const geometry = new T.BoxGeometry(1, 1, 1);
const material = new T.MeshBasicMaterial({
  color: debugObj.color,
});

const mesh = new T.Mesh(geometry, material);
scene.add(mesh);

// Camera
const camera = new T.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new T.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

// Tweaks
gui.add(material, "wireframe").name("wires");
gui.addColor(debugObj, "color").onChange((val) => {
  material.color.set(debugObj.color);
});
gui.add(debugObj, "spin");

// let clock = new T.Clock();

const tick = () => {
  //   const elapsedTime = clock.getElapsedTime();

  //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
  //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
  //   camera.position.y = cursor.y * 10;

  //   camera.lookAt(mesh.position);

  control.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, 900 / 400, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = "robot";

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    object.position.y = 0; // Move the model downward
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(900, 400);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);
//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "robot" ? 3 : 0;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(
  0x333333,
  objToRender === "robot" ? 5 : 1
);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
// if (objToRender === "house") {
//   controls = new OrbitControls(camera, renderer.domElement);
// }

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  //Make the eye move
  if (object && objToRender === "robot") {
    //I've played with the constants here until it looked good
    object.rotation.y = -3 + (mouseX / window.innerWidth) * 3;
    object.rotation.x = -1.2 + (mouseY * 2.5) / window.innerHeight;
  }
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
// window.addEventListener("resize", function () {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

//Start the 3D rendering
animate();

// Function to generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  console.log(`Generated color: ${color}`); // Debug: Log the generated color
  return color;
}

// Select elements
const heading = document.querySelector(".fallback-text");
const heading2 = document.querySelector(".heading-container");

// Create and append the circle mask element
const circleMask = document.createElement("div");
circleMask.classList.add("circle-mask");
document.body.appendChild(circleMask);

// Store the current random color
let currentColor = getRandomColor();

// Function to apply the current color to the heading
function applyCurrentColor() {
  console.log(`Applying color: ${currentColor}`); // Debug: Log the color being applied
  heading.style.background = `linear-gradient(to right, ${currentColor}, ${currentColor})`;
  heading.style.webkitBackgroundClip = "text";
  heading.style.color = "transparent"; // Make the text transparent to show the gradient
}

// Event listener: Change color on mouseover
heading2.addEventListener("mouseover", () => {
  console.log("Mouse entered the <h1>");
  currentColor = getRandomColor();
  applyCurrentColor();
});

// Event listener: Update the circle mask position based on mouse movement
document.addEventListener("mousemove", (e) => {
  const maskSize = 300; // Diameter of the circle
  const maskX = e.clientX; // Cursor's X position relative to the viewport
  const maskY = e.clientY; // Cursor's Y position relative to the viewport

  // Update the circle mask position
  circleMask.style.left = `${maskX}px`;
  circleMask.style.top = `${maskY}px`;

  // Get the bounding box of the <h1> element
  const rect = heading.getBoundingClientRect();
  const relativeX = e.clientX - rect.left; // X position relative to the <h1>
  const relativeY = e.clientY - rect.top; // Y position relative to the <h1>

  // Check if the cursor is within the <h1> element
  if (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  ) {
    heading.style.clipPath = `circle(${
      maskSize / 2
    }px at ${relativeX}px ${relativeY}px)`;
    heading.style.webkitClipPath = `circle(${
      maskSize / 2
    }px at ${relativeX}px ${relativeY}px)`;
    heading.style.color = "transparent"; // Keep the text transparent to show the gradient
  } else {
    // Reset the clip-path effect
    heading.style.clipPath = `circle(${
      maskSize / 2
    }px at ${relativeX}px ${relativeY}px)`;
    heading.style.webkitClipPath = `circle(${
      maskSize / 2
    }px at ${relativeX}px ${relativeY}px)`;
  }
});

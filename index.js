import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

// Init the canvas, scene, etc.

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const container = document.querySelector('#thinkingHead');
const {width, height} = container.getBoundingClientRect(); // use the actual size of the canvas for the renderer

const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer.toneMapping = THREE.ACESFilmicToneMapping; // better colors
renderer.setPixelRatio(window.devicePixelRatio); // better resolution
renderer.setSize(width, height);

container.appendChild(renderer.domElement);

addEventListener('resize', () => {
    const {width, height} = container.getBoundingClientRect();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// Add some lights

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.x = 0.5;
dirLight.position.z = 1;
scene.add(dirLight);

const frontDirLight = new THREE.DirectionalLight(0xffffff);
frontDirLight.position.x = 0.1;
frontDirLight.position.z = 0.5;
scene.add(frontDirLight);

const light = new THREE.AmbientLight(0xffffff, 2);
scene.add(light);

// Move the camera to better see the model

camera.position.y = -0.05;
camera.position.z = 0.75;

// Load the model

const loader = new GLTFLoader();
let model = null; // we store the model globally so we can update its rotation later

loader.load(
    '/assets/thinking_emoji.glb',
    function (gltf) {
        // store the model and add it to the scene
        model = gltf.scene;
        scene.add(gltf.scene);
        renderer.render(scene, camera);
    },
    undefined,
    function (error) {
        console.error(error);
    },
);

addEventListener('mousemove', (event) => {
    // if the model is loaded, we update its rotation according to the mouse position
    if (model) {
        model.rotation.x = event.clientY / innerHeight - 0.1; // easier to look down than up 😅
        model.rotation.y = event.clientX / innerWidth - 0.5;
        // ps: we divide the position by innerWidth to have a normalized value (between 0 and 1 instead of pixels)
        renderer.render(scene, camera);
    }
});

// Handle switch between light and dark mode

const colorSchemeBtn = document.querySelector('#colorScheme');

const colorScheme = document.documentElement.getAttribute('color-scheme');
colorSchemeBtn.className = colorScheme;

// fix lighting for mode
light.intensity = colorScheme === 'dark' ? 1 : 2;
renderer.render(scene, camera);

colorSchemeBtn.addEventListener('click', () => {
    const colorScheme = document.documentElement.getAttribute('color-scheme');
    document.documentElement.setAttribute('color-scheme', colorScheme === 'dark' ? 'light' : 'dark');
    localStorage.setItem('colorScheme', colorScheme === 'dark' ? 'light' : 'dark');

    colorSchemeBtn.className = colorScheme === 'dark' ? 'light' : 'dark';

    // fix lighting for mode
    light.intensity = colorScheme === 'dark' ? 1 : 2;
    renderer.render(scene, camera);
});

import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

// 3D Stuffs

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const container = document.querySelector('#thinkingHead');
const {width, height} = container.getBoundingClientRect();

const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);

container.appendChild(renderer.domElement);

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.x = 0.5;
dirLight.position.z = 0.5;
scene.add(dirLight);

const frontDirLight = new THREE.DirectionalLight(0xffffff);
frontDirLight.position.x = 0.1;
frontDirLight.position.z = 0.5;
scene.add(frontDirLight);

const light = new THREE.AmbientLight(0xffffff, 2);
scene.add(light);

camera.position.z = 0.75;

const loader = new GLTFLoader();
let model = null;

loader.load(
    '/assets/thinking_emoji.glb',
    function (gltf) {
        model = gltf.scene;
        console.log(gltf.scene);
        scene.add(gltf.scene);
        renderer.render(scene, camera);
    },
    undefined,
    function (error) {
        console.error(error);
    },
);

addEventListener('mousemove', (event) => {
    if (model) {
        model.rotation.x = event.clientY / innerHeight - 0.3;
        model.rotation.y = event.clientX / innerWidth - 0.5;
    }
    renderer.render(scene, camera);
});

// Dark mode

const media = matchMedia('(prefers-color-scheme: dark)');
media.addEventListener('change', applyTheme);

const colorSchemeBtn = document.querySelector('#colorScheme');

applyTheme(media);
colorSchemeBtn.addEventListener('click', () => {
    applyTheme({matches: colorSchemeBtn.className === 'light'});
});

function applyTheme({matches}) {
    colorSchemeBtn.className = matches ? 'dark' : 'light';
    document.documentElement.setAttribute('color-scheme', !matches ? 'light' : 'dark');

    // fix lighting for mode
    light.intensity = matches ? 1 : 2;
    renderer.render(scene, camera);
}

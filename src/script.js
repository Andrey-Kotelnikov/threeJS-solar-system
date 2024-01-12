import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import init from './init';
import Stats from 'stats.js';
import * as dat from 'lil-gui';
// import ColorGUIHelper from './ColorGUIHelper';
import './style.css';

const { sizes, camera, scene, canvas, controls, renderer } = init();

// FPS на экран
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const gui = new dat.GUI();

camera.position.set(0, 5000, 15000);

// Текстуры
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
	console.log('loading started');
};

loadingManager.onLoad = () => {
	console.log('loading finished');
};

loadingManager.onProgress = () => {
	console.log('loading progressing');
};

loadingManager.onError = () => {
	console.log('loading error');
};

const textureLoader = new THREE.TextureLoader(loadingManager);

const grassTexture = textureLoader.load('/textures/grass.jpg');

grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(10, 10);

const brickWallTexture = textureLoader.load('/textures/brick-8.jpg');

brickWallTexture.wrapS = THREE.RepeatWrapping;
brickWallTexture.wrapT = THREE.RepeatWrapping;
brickWallTexture.repeat.set(6, 1);

const earthTexture = textureLoader.load('/textures/Earth.jpg');
const moonTexture = textureLoader.load('/textures/moon.jpg');
const sunTexture = textureLoader.load('/textures/sun.jpg');


// const heightTexture = textureLoader.load('/textures/Door/height.png');
// const normalTexture = textureLoader.load('/textures/Door/normal.jpg');

// Оси координат
const axesHelper = new THREE.AxesHelper(5000)
scene.add(axesHelper);

// Создание пола
const floorGeometry = new THREE.PlaneGeometry(10000, 10000, 10, 10);
const floorMaterial = new THREE.MeshPhongMaterial({
	// color: 'gray',
	// wireframe: true,
	map: grassTexture,
	side: THREE.DoubleSide,
});
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

// Свет
const lightParameters = {
	skyColor: 0xFFFFFF,
	groundColor: 0x222222,
	intensity: 2,
}

// const hemiLight = new THREE.HemisphereLight(lightParameters.skyColor, lightParameters.groundColor, lightParameters.intensity);
// console.log(hemiLight)
// hemiLight.position.set(6000, 5000, 6000);
// scene.add(hemiLight);

// const light = new THREE.DirectionalLight(0xffffff, 2);
// light.position.set(2000, 2000, 2000)
// scene.add(light);

//----------------------------------

// Создание направленного источника света
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5000, 10000, 5000).normalize();
scene.add(light);

// Визуальное представление вектора направления света
const arrowHelper = new THREE.ArrowHelper(
  light.position,
  light.position.clone().add(light.position.clone().normalize().multiplyScalar(5)),
  5000,
  0x0000ff
);
scene.add(arrowHelper);

// Создание вспомогательного объекта для камеры
const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
scene.add(cameraHelper);










//------------------------------------




// const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
// scene.add(cameraHelper);

// console.log(light.target)
// const arrowHelper = new THREE.ArrowHelper(
// 	light.position,
// 	light.position.clone().add(light.position.normalize().multiplyScalar(5)),
// 	2000,
// 	0x005fff
// );
// scene.add(arrowHelper)


// const dirLight = new THREE.DirectionalLight(0xffffff, 0,54);
// dirLight.position.set(-8000, 12000, 8000);
// dirLight.castShadow = true;
// dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
// scene.add(dirLight);

// gui.addColor(new ColorGUIHelper(hemiLight, 'color'), 'value').name('skyColor');
// gui.addColor(new ColorGUIHelper(hemiLight, 'groundColor'), 'value').name('skyColor');
// gui.add(light, 'intensity').min(0).max(5).step(0.01)





// Создание стен
const wallGeometry = new THREE.PlaneGeometry(10000, 1000, 10, 10)
const wallMaterial = new THREE.MeshPhongMaterial({
	// color: 'gray',
	// wireframe: true,
	map: brickWallTexture,
	side: THREE.DoubleSide,
});
const wallMesh1 = new THREE.Mesh(wallGeometry, wallMaterial);
wallMesh1.position.set(0, 500, 5000)
const wallMesh2 = new THREE.Mesh(wallGeometry, wallMaterial);
wallMesh2.position.set(0, 500, -5000)
const wallMesh3 = new THREE.Mesh(wallGeometry, wallMaterial);
wallMesh3.position.set(5000, 500, 0);
wallMesh3.rotation.y = Math.PI / 2;
const wallMesh4 = new THREE.Mesh(wallGeometry, wallMaterial);
wallMesh4.position.set(-5000, 500, 0)
wallMesh4.rotation.y = Math.PI / 2;

scene.add(wallMesh1, wallMesh2, wallMesh3, wallMesh4);

// Создание группы для вращения луны вокруг земли
const moonContainer = new THREE.Group();
moonContainer.position.set(2000, 800, 0);
scene.add(moonContainer);

// Создание группы для вращения земли вокруг солнца
const earthContainer = new THREE.Group();
earthContainer.position.set(0, 0, 0);
scene.add(earthContainer);

// Создание Земли
const earthGeometry = new THREE.SphereGeometry(200);
const earthMaterial = new THREE.MeshPhongMaterial({
	// color: 'gray',
	// wireframe: true,
	map: earthTexture,
});
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
console.log(earthMesh)
earthMesh.position.set(2000, 800, 0);

earthContainer.add(earthMesh, moonContainer);

// scene.add(earthMesh);

// Создание Луны
const moonGeometry = new THREE.SphereGeometry(100);
const moonMaterial = new THREE.MeshPhongMaterial({
	// color: 'gray',
	// wireframe: true,
	map: moonTexture,
});
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.position.set(0, 0, 500);

moonContainer.add(moonMesh)
// scene.add(moonMesh);

// Создание Солнца
const sunGeometry = new THREE.SphereGeometry(500);
const sunMaterial = new THREE.MeshPhongMaterial({
	// color: 'gray',
	// wireframe: true,
	map: sunTexture,
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.position.set(0, 800, 0)
scene.add(sunMesh);



//------------------------------------------------
earthMesh.castShadow = true;
earthMesh.receiveShadow = true;

moonMesh.castShadow = true;
moonMesh.receiveShadow = true;

sunMesh.castShadow = true;
sunMesh.receiveShadow = true

light.castShadow = true;

floorMesh.receiveShadow=true;

wallMesh1.castShadow = true;
wallMesh1.receiveShadow = true;

wallMesh2.castShadow = true;
wallMesh2.receiveShadow = true;

wallMesh3.castShadow = true;
wallMesh3.receiveShadow = true;

wallMesh4.castShadow = true;
wallMesh4.receiveShadow = true;

light.shadow.mapSize.x = 5000;
light.shadow.mapSize.y = 5000;
console.log(light)
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 50000;






//-------------------------------------------------



// Добавим 3d модель

const loader = new GLTFLoader();

let mixer = null;
loader.load(
	'/models/BrainStem/BrainStem.gltf',
	(gltf) => {
		mixer = new THREE.AnimationMixer(gltf.scene);
		const action = mixer.clipAction(gltf.animations[0]);
		action.play();
		gltf.scene.scale.set(300, 300, 300);
		gltf.scene.position.set(4000, 0, -4000)
		scene.add(gltf.scene)
	}
);






// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const geometry = new THREE.TorusGeometry(1000, 500, 16, 40);
// const material = new THREE.MeshBasicMaterial({
// 	color: 'gray',
// 	wireframe: true,
// });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

const clock = new THREE.Clock();
const tick = () => {
	stats.begin();
	const delta = clock.getDelta();

	moonContainer.rotation.y += delta;
	moonContainer.rotation.x += delta * 0.2;
	earthContainer.rotation.y += delta * 0.1;
	earthMesh.rotation.y += delta * 1.5;

	if (mixer) {
		mixer.update(delta * 0.5);
	}

	controls.update();
	renderer.render(scene, camera);

	stats.end();
	window.requestAnimationFrame(tick);
};
tick();

// Базовые обработчики событий длы поддержки ресайза
window.addEventListener('resize', () => {
	// Обновляем размеры
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Обновляем соотношение сторон камеры
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Обновляем renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});

window.addEventListener('dblclick', () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'


const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
scene.fog = new THREE.Fog('#262837', 1, 15)

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: '#a9c388' })
)
floor.rotation.x = -Math.PI * 0.5
floor.receiveShadow = true
scene.add(floor)

// House group
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({ color: '#ac8e82' })
)
walls.position.y = 1.25
walls.castShadow = true
house.add(walls)

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.position.y = 3
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2),
  new THREE.MeshStandardMaterial({ color: '#aa7b7b' })
)
door.position.set(0, 1, 2.01)
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.castShadow = true
house.add(bush1)

// Graves
const graves = new THREE.Group()
scene.add(graves)
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })
for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2
  const radius = 3 + Math.random() * 6
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.position.set(x, 0.3, z)
  grave.rotation.y = (Math.random() - 0.5) * 0.4
  grave.castShadow = true
  graves.add(grave)
}

// Lights
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
scene.add(ambientLight)
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, -2)
moonLight.castShadow = true
scene.add(moonLight)
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
doorLight.castShadow = true
house.add(doorLight)

// Ghosts
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost1, ghost2, ghost3)

// GUI
const gui = new GUI({ width: 310 })
const lightFolder = gui.addFolder('Lighting')

const params = {
  ambientIntensity: ambientLight.intensity,
  moonIntensity: moonLight.intensity,
  doorIntensity: doorLight.intensity,
  fogNear: scene.fog.near,
  fogFar: scene.fog.far
}

lightFolder.add(params, 'ambientIntensity', 0, 1, 0.01).name('Ambient Light').onChange(v => ambientLight.intensity = v)
lightFolder.add(params, 'moonIntensity', 0, 1, 0.01).name('Moon Light').onChange(v => moonLight.intensity = v)
lightFolder.add(params, 'doorIntensity', 0, 2, 0.01).name('Door Light').onChange(v => doorLight.intensity = v)

const fogFolder = gui.addFolder('Fog Settings')
fogFolder.addColor({ color: scene.fog.color.getHex() }, 'color').name('Fog Color').onChange(v => scene.fog.color.set(v))
fogFolder.add(params, 'fogNear', 0, 5, 0.1).onChange(v => scene.fog.near = v)
fogFolder.add(params, 'fogFar', 5, 30, 0.1).onChange(v => scene.fog.far = v)

lightFolder.open()
fogFolder.open()


// Camera, Renderer, Controls
const sizes = { width: window.innerWidth, height: window.innerHeight }
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 2, 5)
scene.add(camera)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true

// Animation
const clock = new THREE.Clock()
function animate() {
  const elapsed = clock.getElapsedTime()
  ghost1.position.set(Math.cos(elapsed * 0.5) * 4, Math.sin(elapsed * 3), Math.sin(elapsed * 0.5) * 4)
  ghost2.position.set(Math.cos(-elapsed * 0.32) * 5, Math.sin(elapsed * 4), Math.sin(-elapsed * 0.32) * 5)
  ghost3.position.set(Math.cos(-elapsed * 0.18) * 7, Math.sin(elapsed * 2.5), Math.sin(-elapsed * 0.18) * 7)
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

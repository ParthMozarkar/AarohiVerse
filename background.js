// -----------------------------------------------------
// 3D BACKGROUND: STARFIELD FOR LANDING PAGE
// -----------------------------------------------------

const canvas = document.getElementById("bg");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.z = 5;

// Create starfield
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.5,
  transparent: true,
  opacity: 0.8
});

const starsVertices = [];
const starCount = 3000;

for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;
  starsVertices.push(x, y, z);
}

starsGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starsVertices, 3)
);

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Add some glowing particles
const particleGeometry = new THREE.BufferGeometry();
const particleMaterial = new THREE.PointsMaterial({
  color: 0xffb4d9,
  size: 1.5,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending
});

const particleVertices = [];
const particleCount = 100;

for (let i = 0; i < particleCount; i++) {
  const x = (Math.random() - 0.5) * 1000;
  const y = (Math.random() - 0.5) * 1000;
  const z = (Math.random() - 0.5) * 1000;
  particleVertices.push(x, y, z);
}

particleGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(particleVertices, 3)
);

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Gentle rotation
function animate() {
  requestAnimationFrame(animate);
  
  stars.rotation.y += 0.0002;
  particles.rotation.y -= 0.0003;
  
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();


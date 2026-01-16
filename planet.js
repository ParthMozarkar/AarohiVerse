// -----------------------------------------------------
// 3D WORLD: EARTH + ORBS + CAMERA + INTERACTION
// -----------------------------------------------------

let scene, camera, renderer;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let stars; // Store stars for animation
let portals = []; // clickable portals

// -----------------------------------------------------
// INITIALIZE SCENE
// -----------------------------------------------------
function init() {
  const canvas = document.getElementById("worldCanvas");
  
  if (!canvas) {
    console.error("Canvas element 'worldCanvas' not found!");
    setTimeout(init, 100); // Retry after 100ms
    return;
  }
  
  try {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false // Make background visible
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x03030a, 1); // Dark tinted background

    // Stars background - procedural
    scene.background = new THREE.Color(0x000000);
    addStars();

    // Add portals
    createPortals();
    
    // Mouse Events
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onMouseClick);

    // Hide loading screen after scene is ready
    setTimeout(() => {
      const loadingScreen = document.getElementById("loading-screen");
      if (loadingScreen) {
        loadingScreen.style.display = "none";
      }
    }, 500);

    animate();
  } catch (error) {
    console.error("Error initializing 3D scene:", error);
  }
}

// -----------------------------------------------------
// CREATE PORTALS (three floating premium gates)
// -----------------------------------------------------
function createPortals() {
  const portalData = [
    {
      color: 0xff66cc, // Melody
      label: "label-melody",
      name: "melody",
      position: new THREE.Vector3(-3, 0, 0),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      color: 0x9fd8ff, // Art
      label: "label-art",
      name: "art",
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0)
    },
    {
      color: 0xffd899, // Memory
      label: "label-memory",
      name: "memory",
      position: new THREE.Vector3(3, 0, 0),
      rotation: new THREE.Euler(0, 0, 0)
    }
  ];

  portalData.forEach((p) => {
    // Main rectangular portal plane (rounded-feel with gradients)
    const planeGeo = new THREE.PlaneGeometry(1.6, 2.4);
    const planeMat = new THREE.MeshBasicMaterial({
      color: p.color,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);

    // Outer curved frame (Doctor Strange ring style)
    const frameGeo = new THREE.RingGeometry(0.95, 1.1, 96);
    const frameMat = new THREE.MeshBasicMaterial({
      color: p.color,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);

    const portalMesh = new THREE.Group();
    portalMesh.add(plane);
    portalMesh.add(frame);

    portalMesh.position.copy(p.position);
    portalMesh.rotation.copy(p.rotation);

    // Spark particles around the frame
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = [];
    for (let i = 0; i < 80; i++) {
      const angle = (i / 80) * Math.PI * 2;
      const radius = 1.1;
      sparkPositions.push(
        Math.cos(angle) * radius + (Math.random() - 0.5) * 0.05,
        Math.sin(angle) * radius + (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.02
      );
    }
    sparkGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(sparkPositions, 3)
    );
    const sparkMat = new THREE.PointsMaterial({
      color: p.color,
      size: 0.05,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    portalMesh.add(sparks);

    // Hover pulse
    portalMesh.userData = {
      name: p.name,
      label: p.label,
      pulse: Math.random() * Math.PI * 2
    };

    portals.push(portalMesh);
    scene.add(portalMesh);
  });

  // Soft ambient light to match landing page
  scene.add(new THREE.AmbientLight(0x8888aa, 0.6));
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
  keyLight.position.set(5, 5, 5);
  scene.add(keyLight);
}

// -----------------------------------------------------
// ADD PROCEDURAL STARS - 3D REAL MOVING BACKGROUND
// -----------------------------------------------------
function addStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 10000; // More stars for depth
  const positions = [];
  const velocities = [];
  const sizes = [];

  for (let i = 0; i < starCount; i++) {
    // Distribute stars in a large 3D space
    const x = (Math.random() - 0.5) * 3000;
    const y = (Math.random() - 0.5) * 3000;
    const z = (Math.random() - 0.5) * 3000;
    positions.push(x, y, z);
    
    // Random velocities for 3D movement - FASTER
    velocities.push(
      (Math.random() - 0.5) * 0.5, // Increased speed
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5
    );
    
    // Varying star sizes
    sizes.push(Math.random() * 1.5 + 0.5);
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  starGeometry.setAttribute(
    "size",
    new THREE.Float32BufferAttribute(sizes, 1)
  );
  
  // Store velocities for animation
  starGeometry.userData.velocities = velocities;
  starGeometry.userData.initialPositions = [...positions]; // Store initial positions

  // Premium star material
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });

  stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

// -----------------------------------------------------
// (Removed) CREATE ORBITING PLANETS
// -----------------------------------------------------

// -----------------------------------------------------
// MOUSE ROTATION EFFECT
// -----------------------------------------------------
function onMouseMove(e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

// -----------------------------------------------------
// CLICK HANDLER
// -----------------------------------------------------
function onMouseClick() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(portals);

  if (intersects.length > 0) {
    const clicked = intersects[0].object.userData.name;
    triggerPortal(clicked);
  }
}

// -----------------------------------------------------
// ANIMATION LOOP
// -----------------------------------------------------
function animate() {
  requestAnimationFrame(animate);

  // Slight camera movement based on mouse
  camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
  camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.05;
  camera.lookAt(0, 0, 0);

  // Animate portals (gentle pulse and slow rotation)
  portals.forEach((portal) => {
    portal.userData.pulse += 0.01;
    const scale = 1 + Math.sin(portal.userData.pulse) * 0.05;
    portal.scale.set(scale, scale, scale);
    portal.rotation.z += 0.0015;

    // Update label position for this portal
    const screenPos = portal.position.clone();
    screenPos.y += 0.8; // lift label above portal
    screenPos.project(camera);
    const label = document.getElementById(portal.userData.label);
    if (label) {
      label.style.left = ((screenPos.x + 1) / 2) * window.innerWidth + "px";
      label.style.top = ((-screenPos.y + 1) / 2) * window.innerHeight - 30 + "px";
      label.classList.add("visible");
    }
  });

  // Raycaster hover detection for portals
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(portals);

  portals.forEach((portal) => {
    const label = document.getElementById(portal.userData.label);
    const isHovered = intersects.find(i => i.object === portal);
    if (isHovered) {
      if (label) label.classList.add("visible");
      portal.scale.set(1.12, 1.12, 1.12);
      // Boost opacity of all child materials on hover
      portal.traverse((child) => {
        if (child.material && child.material.opacity !== undefined) {
          child.material.opacity = Math.min(1, child.material.opacity + 0.2);
        }
      });
    } else {
      // Reset opacities when not hovered
      portal.traverse((child) => {
        if (child.material && child.material.opacity !== undefined) {
          if (child.geometry && child.geometry.type === "RingGeometry") {
            child.material.opacity = 0.9;
          } else if (child.type === "Points") {
            child.material.opacity = 0.9;
          } else {
            child.material.opacity = 0.18;
          }
        }
      });
    }
  });

  // Animate stars - 3D REAL MOVING BACKGROUND (FASTER)
  if (stars && stars.geometry) {
    const positions = stars.geometry.attributes.position;
    const velocities = stars.geometry.userData.velocities;
    if (velocities && positions) {
      for (let i = 0; i < positions.count; i++) {
        positions.setX(i, positions.getX(i) + velocities[i * 3]);
        positions.setY(i, positions.getY(i) + velocities[i * 3 + 1]);
        positions.setZ(i, positions.getZ(i) + velocities[i * 3 + 2]);
        if (Math.abs(positions.getX(i)) > 1500 || 
            Math.abs(positions.getY(i)) > 1500 || 
            Math.abs(positions.getZ(i)) > 1500) {
          positions.setX(i, (Math.random() - 0.5) * 1000 - camera.position.x);
          positions.setY(i, (Math.random() - 0.5) * 1000 - camera.position.y);
          positions.setZ(i, (Math.random() - 0.5) * 1000 - camera.position.z);
        }
      }
      positions.needsUpdate = true;
    }
  }

  if (scene && camera && renderer) {
    renderer.render(scene, camera);
  }
}

// -----------------------------------------------------
// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM already loaded
  setTimeout(init, 50); // Small delay to ensure canvas exists
}

// Handle window resize
window.addEventListener('resize', () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});

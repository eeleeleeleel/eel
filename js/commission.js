// ===========================
// Three.js Preview
// ===========================
const canvasWrap = document.getElementById('previewCanvasWrap');
const W = canvasWrap.clientWidth  || 280;
const H = canvasWrap.clientHeight || 400;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(W, H);
renderer.shadowMap.enabled = true;
canvasWrap.appendChild(renderer.domElement);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 200);
camera.position.set(0, 6, 22);
camera.lookAt(0, -1, 0);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
keyLight.position.set(6, 10, 8);
keyLight.castShadow = true;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x8ab4d4, 0.4);
fillLight.position.set(-6, 2, -4);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
rimLight.position.set(0, -4, -8);
scene.add(rimLight);

// ===========================
// Organic table shape
// ===========================
const tableShape = new THREE.Shape();
tableShape.moveTo( 0.29,  4.29);
tableShape.bezierCurveTo( 2.29,  5.00,  4.43,  4.29,  5.14,  2.57);
tableShape.bezierCurveTo( 5.86,  0.86,  5.29, -1.21,  4.21, -2.64);
tableShape.bezierCurveTo( 3.00, -4.29,  0.86, -5.00, -1.14, -4.57);
tableShape.bezierCurveTo(-3.14, -4.14, -4.71, -2.71, -5.14, -0.86);
tableShape.bezierCurveTo(-5.57,  1.00, -4.86,  3.00, -3.14,  3.86);
tableShape.bezierCurveTo(-2.14,  4.36, -1.00,  3.57,  0.29,  4.29);

const extrudeSettings = {
  depth: 0.38,
  bevelEnabled: true,
  bevelThickness: 0.06,
  bevelSize: 0.06,
  bevelSegments: 4,
};

const topGeo = new THREE.ExtrudeGeometry(tableShape, extrudeSettings);
topGeo.center();

const tableMat = new THREE.MeshPhysicalMaterial({
  color: 0xEDE4D0,
  roughness: 0.12,
  metalness: 0.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.08,
  transparent: true,
  opacity: 0.93,
});

const tableMesh = new THREE.Mesh(topGeo, tableMat);
tableMesh.rotation.x = -Math.PI / 2;
tableMesh.position.y = 0;
tableMesh.castShadow = true;

// ===========================
// Leg materials
// ===========================
const legMat = new THREE.MeshStandardMaterial({
  color: 0xB0B0B0,
  roughness: 0.25,
  metalness: 0.9,
});

// 4 Legs group
const legs4Group = new THREE.Group();

const legPositions = [
  [ 3.4,  2.6],
  [-3.1,  2.6],
  [ 3.8, -2.8],
  [-2.8, -2.8],
];

const legH = 5.0;

legPositions.forEach(([x, z], i) => {
  // Tapered leg (slightly wider at top)
  const legGeo = new THREE.CylinderGeometry(0.10, 0.13, legH, 10);
  const leg = new THREE.Mesh(legGeo, legMat);
  // Slight outward angle
  const angleX = (z > 0 ? 0.04 : -0.04);
  const angleZ = (x > 0 ? 0.04 : -0.04);
  leg.rotation.x = angleX;
  leg.rotation.z = angleZ;
  leg.position.set(x, -legH / 2 - 0.18, z);
  leg.castShadow = true;
  legs4Group.add(leg);
});

// Foot discs
legPositions.forEach(([x, z]) => {
  const footGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.06, 12);
  const foot = new THREE.Mesh(footGeo, legMat);
  foot.position.set(x, -legH - 0.18, z);
  legs4Group.add(foot);
});

// Pedestal group
const legs1Group = new THREE.Group();
legs1Group.visible = false;

const postGeo  = new THREE.CylinderGeometry(0.18, 0.28, legH, 16);
const post     = new THREE.Mesh(postGeo, legMat);
post.position.set(0, -legH / 2 - 0.18, 0);
post.castShadow = true;
legs1Group.add(post);

// Base disc
const baseGeo  = new THREE.CylinderGeometry(1.6, 1.8, 0.1, 24);
const base     = new THREE.Mesh(baseGeo, legMat);
base.position.set(0, -legH - 0.18, 0);
legs1Group.add(base);

// Table group
const tableGroup = new THREE.Group();
tableGroup.add(tableMesh);
tableGroup.add(legs4Group);
tableGroup.add(legs1Group);
tableGroup.rotation.x =  0.28;
tableGroup.rotation.y = -0.42;
scene.add(tableGroup);

// ===========================
// Animate
// ===========================
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// ===========================
// Resize
// ===========================
const resizeObserver = new ResizeObserver(() => {
  const w = canvasWrap.clientWidth;
  const h = canvasWrap.clientHeight;
  if (w && h) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
});
resizeObserver.observe(canvasWrap);

// ===========================
// Mouse drag rotation
// ===========================
let dragging = false;
let startX = 0, startY = 0;
let rotX = 0.28, rotY = -0.42;

canvasWrap.addEventListener('mousedown', (e) => {
  dragging = true;
  startX = e.clientX;
  startY = e.clientY;
});

window.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  rotY += (e.clientX - startX) * 0.008;
  rotX += (e.clientY - startY) * 0.008;
  rotX = Math.max(-1.2, Math.min(1.2, rotX));
  tableGroup.rotation.x = rotX;
  tableGroup.rotation.y = rotY;
  startX = e.clientX;
  startY = e.clientY;
});

window.addEventListener('mouseup', () => { dragging = false; });

canvasWrap.addEventListener('touchstart', (e) => {
  dragging = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (!dragging) return;
  rotY += (e.touches[0].clientX - startX) * 0.008;
  rotX += (e.touches[0].clientY - startY) * 0.008;
  rotX = Math.max(-1.2, Math.min(1.2, rotX));
  tableGroup.rotation.x = rotX;
  tableGroup.rotation.y = rotY;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', () => { dragging = false; });

// ===========================
// State
// ===========================
const state = {
  color: null, colorName: null,
  size: null,  sizeRange: null,
  height: null, heightCm: null,
  legs: null,
};

const prevColor  = document.getElementById('prevColor');
const prevSize   = document.getElementById('prevSize');
const prevHeight = document.getElementById('prevHeight');
const prevLegs   = document.getElementById('prevLegs');
const sumColor   = document.getElementById('sumColor');
const sumSize    = document.getElementById('sumSize');
const sumHeight  = document.getElementById('sumHeight');
const sumLegs    = document.getElementById('sumLegs');

function updatePreview() {
  if (state.color) {
    tableMat.color.setStyle(state.color);
    prevColor.textContent = state.colorName;
    sumColor.textContent  = state.colorName;
  }
  if (state.size) {
    const s = state.size === 'S' ? 0.62 : state.size === 'M' ? 0.75 : 0.88;
    tableGroup.scale.setScalar(s);
    const sizeLabel = state.sizeCm
      ? `${state.size}  (${state.sizeCm})`
      : `${state.size}  (${state.sizeRange})`;
    prevSize.textContent = sizeLabel;
    sumSize.textContent  = sizeLabel;

    const pedestalCard = document.getElementById('pedestalCard');
    if (state.size === 'S') {
      pedestalCard.classList.add('disabled');
      pedestalCard.classList.remove('selected');
      if (state.legs === '1') {
        state.legs = null;
        legs1Group.visible = false;
        prevLegs.textContent = '—';
        sumLegs.textContent  = '—';
      }
    } else {
      pedestalCard.classList.remove('disabled');
    }
  }
  if (state.height) {
    const label = `${state.height}  (${state.heightCm})`;
    prevHeight.textContent = label;
    sumHeight.textContent  = label;
  }
  if (state.legs) {
    legs4Group.visible = state.legs === '4';
    legs1Group.visible = state.legs === '1';
    const label = state.legs === '4' ? '4 Legs' : 'Pedestal';
    prevLegs.textContent = label;
    sumLegs.textContent  = label;
  }
}

// ===========================
// Color
// ===========================
document.querySelectorAll('.color-swatch').forEach(swatch => {
  swatch.addEventListener('click', () => {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
    swatch.classList.add('selected');
    state.color     = swatch.dataset.color;
    state.colorName = swatch.dataset.name;
    const nameEl = document.getElementById('colorName');
    nameEl.textContent = swatch.dataset.name;
    nameEl.classList.add('active');
    updatePreview();
  });
});

document.getElementById('customColorBtn').addEventListener('click', () => {
  document.getElementById('customColorField').classList.toggle('open');
});

// ===========================
// Size
// ===========================
document.querySelectorAll('.size-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.classList.contains('size-cm-input')) return;
    document.querySelectorAll('.size-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.size      = card.dataset.size;
    state.sizeRange = card.dataset.range;
    const existingCm = card.querySelector('.size-cm-input').value;
    state.sizeCm = existingCm ? `${existingCm} cm` : null;
    updatePreview();
  });

  card.querySelector('.size-cm-input').addEventListener('input', (e) => {
    e.stopPropagation();
    state.sizeCm = e.target.value ? `${e.target.value} cm` : null;
    if (state.size === card.dataset.size) updatePreview();
  });

  card.querySelector('.size-cm-input').addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.size-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.size      = card.dataset.size;
    state.sizeRange = card.dataset.range;
    state.sizeCm = e.target.value ? `${e.target.value} cm` : null;
    updatePreview();
  });
});

// ===========================
// Height
// ===========================
document.querySelectorAll('.height-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.height-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.height   = card.dataset.height;
    state.heightCm = card.dataset.cm;
    updatePreview();
  });
});

// ===========================
// Legs
// ===========================
document.querySelectorAll('.leg-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.leg-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.legs = card.dataset.legs;
    updatePreview();
  });
});

// ===========================
// Fade-up on scroll
// ===========================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

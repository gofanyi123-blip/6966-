// City2

// Parameters
const GRID_SIZE = 2000;
const POINT_COUNT = 100;
const CUBE_MIN_SIZE = 50;
const CUBE_MAX_SIZE = 500;
const GROWTH_PER_FRAME = 3;
const MAX_TRIES = 1;
const MAX_CUBES = 200;
const ROAD_WIDTH = 40;
const POINT_RADIUS = ROAD_WIDTH / 2;

let intersections = [];
let roads = [];
let cubes = [];
let currentCube = null;
let roadLayer;

let treeGroup = [];

// 新增：UI 變數
let menuDiv, infoDiv, iframeOverlay, iframeEl, closeBtn, iframeOverlay2, iframeEl2, closeBtn2, iframeOverlay3, iframeEl3, closeBtn3, textOverlay, textDiv;

// -----------------------------
// Setup
// -----------------------------
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(RADIANS);
  noStroke();

  generateRNG();
  createRoadLayer();
  setupTrees();

  // 新增：建立左側選單
  createMenu();
  // 新增：建立 iframe 概覽視窗（作品一）
  createIframeOverlay();
  // 新增：建立作品二 iframe 視窗
  createIframeOverlay2();
  // 新增：建立作品三 iframe 視窗
  createIframeOverlay3();
  // 新增：建立自介文字視窗
  createTextOverlay();
}

// 新增：建立左側選單函式（使用 p5 DOM）
function createMenu() {
  // 容器
  menuDiv = createDiv();
  menuDiv.id('sideMenu');
  menuDiv.style('position', 'absolute');
  menuDiv.style('left', '10px');
  menuDiv.style('top', '10px');
  menuDiv.style('width', '200px');
  menuDiv.style('background', 'rgba(255,255,255,0.9)');
  menuDiv.style('padding', '10px');
  menuDiv.style('border-radius', '6px');
  menuDiv.style('box-shadow', '0 2px 8px rgba(0,0,0,0.2)');
  menuDiv.style('z-index', '1000');
  menuDiv.style('font-family', 'sans-serif');
  menuDiv.style('color', '#111');

  // 標題
  const title = createElement('h4', '選單');
  title.parent(menuDiv);
  title.style('margin', '0 0 8px 0');
  title.style('font-size', '16px');

  // 按鈕清單
  const items = ['自介', '作品一', '作品二', '作品三'];
  items.forEach((label, i) => {
    const btn = createButton(label);
    btn.parent(menuDiv);
    btn.style('display', 'block');
    btn.style('width', '100%');
    btn.style('margin', '6px 0');
    btn.style('padding', '6px 8px');
    btn.style('text-align', 'left');
    btn.style('background', '#f5f5f5');
    btn.style('border', '1px solid #ddd');
    btn.mousePressed(() => onMenuSelect(label));
  });

  // 資訊顯示區
  infoDiv = createDiv('請選擇項目');
  infoDiv.parent(menuDiv);
  infoDiv.style('margin-top', '8px');
  infoDiv.style('font-size', '13px');
  infoDiv.style('line-height', '1.4');
}

// 新增：建立 iframe overlay（置中顯示作品一）
function createIframeOverlay() {
  iframeOverlay = createDiv();
  iframeOverlay.id('iframeOverlay');
  iframeOverlay.style('position', 'fixed');
  iframeOverlay.style('left', '50%');
  iframeOverlay.style('top', '50%');
  iframeOverlay.style('transform', 'translate(-50%, -50%)');
  iframeOverlay.style('width', '80vw');
  iframeOverlay.style('height', '70vh');
  iframeOverlay.style('max-width', '1100px');
  iframeOverlay.style('max-height', '800px');
  iframeOverlay.style('background', 'rgba(255,255,255,0.98)');
  iframeOverlay.style('padding', '8px');
  iframeOverlay.style('border-radius', '8px');
  iframeOverlay.style('box-shadow', '0 6px 20px rgba(0,0,0,0.3)');
  iframeOverlay.style('z-index', '2000');
  iframeOverlay.style('display', 'none'); // 預設隱藏

  // 關閉按鈕
  closeBtn = createButton('關閉');
  closeBtn.parent(iframeOverlay);
  closeBtn.style('position', 'absolute');
  closeBtn.style('right', '8px');
  closeBtn.style('top', '8px');
  closeBtn.style('z-index', '2100');
  closeBtn.mousePressed(() => {
    iframeOverlay.style('display', 'none');
    // 停止 iframe 載入（可選）
    if (iframeEl && iframeEl.elt) iframeEl.elt.src = 'about:blank';
  });

  // iframe
  iframeEl = createElement('iframe');
  iframeEl.parent(iframeOverlay);
  iframeEl.attribute('frameborder', '0');
  iframeEl.attribute('allowfullscreen', '');
  iframeEl.style('width', '100%');
  iframeEl.style('height', '100%');
  iframeEl.style('border-radius', '6px');
  iframeEl.style('margin-top', '28px'); // 讓開關閉按鈕空間
}

// 新增：作品二 iframe overlay
function createIframeOverlay2() {
  iframeOverlay2 = createDiv();
  iframeOverlay2.id('iframeOverlay2');
  iframeOverlay2.style('position', 'fixed');
  iframeOverlay2.style('left', '50%');
  iframeOverlay2.style('top', '50%');
  iframeOverlay2.style('transform', 'translate(-50%, -50%)');
  iframeOverlay2.style('width', '80vw');
  iframeOverlay2.style('height', '70vh');
  iframeOverlay2.style('max-width', '1100px');
  iframeOverlay2.style('max-height', '800px');
  iframeOverlay2.style('background', 'rgba(255,255,255,0.98)');
  iframeOverlay2.style('padding', '8px');
  iframeOverlay2.style('border-radius', '8px');
  iframeOverlay2.style('box-shadow', '0 6px 20px rgba(0,0,0,0.3)');
  iframeOverlay2.style('z-index', '2000');
  iframeOverlay2.style('display', 'none');

  closeBtn2 = createButton('關閉');
  closeBtn2.parent(iframeOverlay2);
  closeBtn2.style('position', 'absolute');
  closeBtn2.style('right', '8px');
  closeBtn2.style('top', '8px');
  closeBtn2.style('z-index', '2100');
  closeBtn2.mousePressed(() => {
    iframeOverlay2.style('display', 'none');
    if (iframeEl2 && iframeEl2.elt) iframeEl2.elt.src = 'about:blank';
  });

  iframeEl2 = createElement('iframe');
  iframeEl2.parent(iframeOverlay2);
  iframeEl2.attribute('frameborder', '0');
  iframeEl2.attribute('allowfullscreen', '');
  iframeEl2.style('width', '100%');
  iframeEl2.style('height', '100%');
  iframeEl2.style('border-radius', '6px');
  iframeEl2.style('margin-top', '28px');
}

// 新增：作品三 iframe overlay
function createIframeOverlay3() {
  iframeOverlay3 = createDiv();
  iframeOverlay3.id('iframeOverlay3');
  iframeOverlay3.style('position', 'fixed');
  iframeOverlay3.style('left', '50%');
  iframeOverlay3.style('top', '50%');
  iframeOverlay3.style('transform', 'translate(-50%, -50%)');
  iframeOverlay3.style('width', '80vw');
  iframeOverlay3.style('height', '70vh');
  iframeOverlay3.style('max-width', '1100px');
  iframeOverlay3.style('max-height', '800px');
  iframeOverlay3.style('background', 'rgba(255,255,255,0.98)');
  iframeOverlay3.style('padding', '8px');
  iframeOverlay3.style('border-radius', '8px');
  iframeOverlay3.style('box-shadow', '0 6px 20px rgba(0,0,0,0.3)');
  iframeOverlay3.style('z-index', '2000');
  iframeOverlay3.style('display', 'none');

  closeBtn3 = createButton('關閉');
  closeBtn3.parent(iframeOverlay3);
  closeBtn3.style('position', 'absolute');
  closeBtn3.style('right', '8px');
  closeBtn3.style('top', '8px');
  closeBtn3.style('z-index', '2100');
  closeBtn3.mousePressed(() => {
    iframeOverlay3.style('display', 'none');
    if (iframeEl3 && iframeEl3.elt) iframeEl3.elt.src = 'about:blank';
  });

  iframeEl3 = createElement('iframe');
  iframeEl3.parent(iframeOverlay3);
  iframeEl3.attribute('frameborder', '0');
  iframeEl3.attribute('allowfullscreen', '');
  iframeEl3.style('width', '100%');
  iframeEl3.style('height', '100%');
  iframeEl3.style('border-radius', '6px');
  iframeEl3.style('margin-top', '28px');
}

// 修改：自介文字 overlay（置中顯示文字） - 文字直接顯示於 overlay 中
function createTextOverlay() {
  textOverlay = createDiv();
  textOverlay.id('textOverlay');
  textOverlay.style('position', 'fixed');
  textOverlay.style('left', '50%');
  textOverlay.style('top', '50%');
  textOverlay.style('transform', 'translate(-50%, -50%)');
  textOverlay.style('width', '60vw');
  textOverlay.style('max-width', '700px');
  textOverlay.style('background', 'rgba(255,255,255,0.98)');
  textOverlay.style('padding', '20px');
  textOverlay.style('border-radius', '8px');
  textOverlay.style('box-shadow', '0 6px 20px rgba(0,0,0,0.3)');
  textOverlay.style('z-index', '2000');
  textOverlay.style('display', 'none');
  textOverlay.style('text-align', 'center');

  // 關閉按鈕（放在 overlay 上方）
  closeBtn = createButton('關閉');
  closeBtn.parent(textOverlay);
  closeBtn.style('position', 'absolute');
  closeBtn.style('right', '8px');
  closeBtn.style('top', '8px');
  closeBtn.style('z-index', '2100');
  closeBtn.mousePressed(() => {
    textOverlay.style('display', 'none');
  });

  // 直接在 overlay 上放文字（仍保留為子節點以利樣式）
  textDiv = createDiv(''); // 內容會在選單選取時設定
  textDiv.parent(textOverlay);
  textDiv.style('font-size', '32px');
  textDiv.style('font-weight', '700');
  textDiv.style('padding', '40px 10px');
  textDiv.style('line-height', '1.2');
  textDiv.style('color', '#111');
}

// 修改：選單點選處理（加入自介與作品三 行為）
function onMenuSelect(label) {
  let html = '';
  // 隱藏所有 overlay 的 helper
  const hideAllOverlays = () => {
    if (iframeOverlay) iframeOverlay.style('display', 'none');
    if (iframeOverlay2) iframeOverlay2.style('display', 'none');
    if (iframeOverlay3) iframeOverlay3.style('display', 'none');
    if (textOverlay) textOverlay.style('display', 'none');
  };

  if (label === '自介') {
    html = '<strong>自介</strong><br>請關閉視窗可回到畫面。';
    hideAllOverlays();
    if (textDiv) textDiv.html('41473049許銘緯');
    if (textOverlay) textOverlay.style('display', 'block');
  } else if (label === '作品一') {
    html = '<strong>作品一</strong><br>示範：方塊逐步生長，避開道路與交叉點。';
    hideAllOverlays();
    if (iframeEl && iframeEl.elt) {
      iframeEl.elt.src = 'https://gofanyi123-blip.github.io/20251014-1-/';
      iframeOverlay.style('display', 'block');
    }
  } else if (label === '作品二') {
    html = '<strong>作品二</strong><br>示範：樹狀結構與簡單動畫。';
    hideAllOverlays();
    if (iframeEl2 && iframeEl2.elt) {
      iframeEl2.elt.src = 'https://gofanyi123-blip.github.io/20251014-2-/';
      iframeOverlay2.style('display', 'block');
    }
  } else if (label === '作品三') {
    html = '<strong>作品三</strong><br>示範：文件與說明。';
    hideAllOverlays();
    if (iframeEl3 && iframeEl3.elt) {
      iframeEl3.elt.src = 'https://hackmd.io/@IKJIaL22SuqU6vykGoo7mA/SJszsuk2ge';
      iframeOverlay3.style('display', 'block');
    }
  }
  infoDiv.html(html);
}

// 新增：視窗大小改變時調整畫布（避免選單被重疊處理）
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// -----------------------------
// Draw
// -----------------------------
function draw() {
  background(255);
  orbitControl();
  rotateX(1.2);
  rotateZ(-1 + frameCount / 240);
  scale(0.4);

  drawTrees();

  // Draw road texture
  push();
  texture(roadLayer);
  plane(GRID_SIZE, GRID_SIZE);
  pop();

  // Draw cubes
  cubes.forEach(drawCube);
  if (currentCube) drawCube(currentCube);

  // Update cube growth
  updateCurrentCube();
}

// -----------------------------
// Tree functions
// -----------------------------
function setupTrees() {
  treeGroup = [];
  for (let i = 0; i < 5; i++) {
    const x = GRID_SIZE / 2 * 1.1;
    const y = (i - 2) * 400;
    treeGroup.push({ x, y, seed: random(1e9) });
  }
}

function drawTrees() {
  treeGroup.forEach(t => drawTree(t.x, t.y, t.seed));
  randomSeed(); // reset randomness outside
}

function drawTree(x, y, seed) {
  push();
  translate(x, y);
  fill(0);
  randomSeed(seed);
  branch(0, seed);
  pop();
}

function branch(depth, seed, maxDepth = 4) {
  const BRANCH_LENGTH = 100;
  const BRANCH_SHRINK_RATE = 0.666;

  translate(0, 0, BRANCH_LENGTH / 2);
  box(3, 3, BRANCH_LENGTH);

  if (depth >= maxDepth) return;

  translate(0, 0, BRANCH_LENGTH / 2);
  scale(BRANCH_SHRINK_RATE);

  for (let i = 0; i < 2; i++) {
    push();
    const phase = frameCount * 0.1 + seed;
    rotateX(random(-1, 1) * PI / 4 + 0.05 * sin(phase + seed));
    rotateY(random(-1, 1) * PI / 4 + 0.05 * cos(phase + seed));
    branch(depth + 1, seed, maxDepth);
    pop();
  }
}

// -----------------------------
// RNG generation and roads
// -----------------------------
function generateRNG() {
  const h = GRID_SIZE / 2;
  for (let i = 0; i < POINT_COUNT; i++) {
    intersections.push(createVector(random(-h, h), random(-h, h)));
  }

  for (let i = 0; i < intersections.length; i++) {
    for (let j = i + 1; j < intersections.length; j++) {
      let a = intersections[i];
      let b = intersections[j];
      let dAB = dist(a.x, a.y, b.x, b.y);
      let hasCloser = intersections.some((c, k) =>
        k !== i && k !== j &&
        max(dist(a.x, a.y, c.x, c.y), dist(b.x, b.y, c.x, c.y)) < dAB
      );
      if (!hasCloser) roads.push([i, j]);
    }
  }
}

// -----------------------------
// Road layer
// -----------------------------
function createRoadLayer() {
  const RES = 512;
  roadLayer = createGraphics(RES, RES);
  roadLayer.background(255);
  roadLayer.fill(0);
  roadLayer.noStroke();

  roads.forEach(r => {
    const a = intersections[r[0]];
    const b = intersections[r[1]];
    const angle = atan2(b.y - a.y, b.x - a.x);
    const len = dist(a.x, a.y, b.x, b.y);

    roadLayer.push();
    roadLayer.translate(
      map(a.x, -GRID_SIZE / 2, GRID_SIZE / 2, 0, RES),
      map(a.y, -GRID_SIZE / 2, GRID_SIZE / 2, 0, RES)
    );
    roadLayer.rotate(angle);
    roadLayer.rect(
      0,
      -map(ROAD_WIDTH, 0, GRID_SIZE, 0, RES) / 2,
      map(len, 0, GRID_SIZE, 0, RES),
      map(ROAD_WIDTH, 0, GRID_SIZE, 0, RES)
    );
    roadLayer.pop();
  });

  intersections.forEach(p => {
    roadLayer.ellipse(
      map(p.x, -GRID_SIZE / 2, GRID_SIZE / 2, 0, RES),
      map(p.y, -GRID_SIZE / 2, GRID_SIZE / 2, 0, RES),
      map(POINT_RADIUS * 2, 0, GRID_SIZE, 0, RES)
    );
  });
}

// -----------------------------
// Cube utilities
// -----------------------------
function createCube() {
  const h = GRID_SIZE / 2;
  for (let t = 0; t < MAX_TRIES; t++) {
    const cube = {
      x: random(-h, h),
      y: random(-h, h),
      size: CUBE_MIN_SIZE,
      displaySize: 0,
      angle: random(TWO_PI),
      col: color(255),
      corners: []
    };
    updateCorners(cube);
    if (
      !hitsAny(cube, cubes) &&
      !outOfBounds(cube) &&
      !hitsRoads(cube) &&
      !hitsIntersections(cube)
    ) return cube;
  }
  return null;
}

function updateCurrentCube() {
  if (!currentCube && cubes.length < MAX_CUBES) currentCube = createCube();
  if (!currentCube) return;

  for (let i = 0; i < GROWTH_PER_FRAME; i++) {
    const prevSize = currentCube.size;
    if (currentCube.size >= CUBE_MAX_SIZE) {
      cubes.push(currentCube);
      currentCube = null;
      break;
    }
    currentCube.size += 1;
    updateCorners(currentCube);

    if (
      hitsAny(currentCube, cubes) ||
      outOfBounds(currentCube) ||
      hitsRoads(currentCube) ||
      hitsIntersections(currentCube)
    ) {
      currentCube.size = prevSize;
      updateCorners(currentCube);
      cubes.push(currentCube);
      currentCube = null;
      break;
    }
  }
}

function updateCorners(cube) {
  const base = [
    createVector(-1, -1),
    createVector(1, -1),
    createVector(1, 1),
    createVector(-1, 1)
  ];
  cube.corners = base.map(v => v.copy().mult(cube.size / 2).rotate(cube.angle).add(cube.x, cube.y));
}

function drawCube(cube) {
  cube.displaySize += (cube.size - cube.displaySize) * 0.1;
  push();
  translate(cube.x, cube.y, cube.displaySize / 2);
  rotateZ(cube.angle);
  fill(cube.col);
  stroke(0);
  box(cube.displaySize);
  pop();
}

// -----------------------------
// Collision / bounds
// -----------------------------
function outOfBounds(cube) {
  const half = GRID_SIZE / 2;
  return cube.corners.some(v => abs(v.x) > half || abs(v.y) > half);
}

function hitsAny(cube, others) {
  return others.some(o => intersects(cube, o));
}

function hitsIntersections(cube) {
  const bbox = polyBoundingBox(cube.corners);
  bbox.minX -= POINT_RADIUS;
  bbox.maxX += POINT_RADIUS;
  bbox.minY -= POINT_RADIUS;
  bbox.maxY += POINT_RADIUS;

  for (let i = 0; i < intersections.length; i++) {
    const p = intersections[i];
    if (p.x < bbox.minX || p.x > bbox.maxX || p.y < bbox.minY || p.y > bbox.maxY) continue;
    if (pointInsidePolygon(p.x, p.y, cube.corners)) return true;
    const d = pointToPolygonEdgeDistance(p.x, p.y, cube.corners);
    if (d <= POINT_RADIUS) return true;
  }
  return false;
}

function hitsRoads(cube) {
  return roads.some(r => rectOverlapRoad(cube, intersections[r[0]], intersections[r[1]]));
}

// -----------------------------
// SAT collision
// -----------------------------
function intersects(c1, c2) {
  return SAT(c1.corners, c2.corners) && SAT(c2.corners, c1.corners);
}

function rectOverlapRoad(cube, a, b) {
  const angle = atan2(b.y - a.y, b.x - a.x);
  const len = dist(a.x, a.y, b.x, b.y);
  const halfW = ROAD_WIDTH / 2;
  const roadPoly = [
    createVector(0, -halfW),
    createVector(len, -halfW),
    createVector(len, halfW),
    createVector(0, halfW)
  ].map(v => v.copy().rotate(angle).add(a.x, a.y));
  return SAT(cube.corners, roadPoly) && SAT(roadPoly, cube.corners);
}

function SAT(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    const a = poly1[i];
    const b = poly1[(i + 1) % poly1.length];
    const edge = createVector(b.x - a.x, b.y - a.y);
    const axis = createVector(-edge.y, edge.x);
    const proj1 = project(poly1, axis);
    const proj2 = project(poly2, axis);
    if (proj1.max < proj2.min || proj2.max < proj1.min) return false;
  }
  return true;
}

function project(poly, axis) {
  const dots = poly.map(p => p.x * axis.x + p.y * axis.y);
  return { min: Math.min(...dots), max: Math.max(...dots) };
}

// -----------------------------
// Geometry helpers
// -----------------------------
function polyBoundingBox(poly) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < poly.length; i++) {
    const v = poly[i];
    if (v.x < minX) minX = v.x;
    if (v.x > maxX) maxX = v.x;
    if (v.y < minY) minY = v.y;
    if (v.y > maxY) maxY = v.y;
  }
  return { minX, minY, maxX, maxY };
}

function pointInsidePolygon(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < ((xj - xi) * (py - yi)) / ((yj - yi) === 0 ? 1e-9 : (yj - yi)) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointToPolygonEdgeDistance(px, py, poly) {
  let minDist = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const d = pointToSegmentDistance(px, py, a.x, a.y, b.x, b.y);
    if (d < minDist) minDist = d;
    if (minDist <= 0) return 0;
  }
  return minDist;
}

function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
  const vx = x2 - x1;
  const vy = y2 - y1;
  const wx = px - x1;
  const wy = py - y1;
  const len2 = vx * vx + vy * vy;
  if (len2 === 0) return Math.hypot(px - x1, py - y1);
  let t = (wx * vx + wy * vy) / len2;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * vx;
  const projY = y1 + t * vy;
  return Math.hypot(px - projX, py - projY);
}

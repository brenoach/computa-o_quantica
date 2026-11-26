/**
 * QUANTUMCORE - SIMULADOR E DEMONSTRADOR DE COMPUTAÇÃO QUÂNTICA
 * Fatec ADS - Arquitetura e Organização de Computadores (Grupo 4)
 * Prof. Felipe Cannarozzo Lourenço
 * 
 * Implementação:
 * 1. Fundo Dinâmico de Ondas e Partículas Quânticas
 * 2. Visualizador de Bit Clássico vs Qubit (Moeda Quântica)
 * 3. Esfera de Bloch 3D Interativa com Projeção e Rotação
 * 4. Simulador do Circuito de Bell (Baseado em simulador_quantico.py)
 * 5. Emaranhamento Quântico com Colapso Sincronizado
 * 6. Laboratório Sandbox de Circuitos de 2 Qubits
 * 7. Calculadora de Crescimento Exponencial Quântico
 */

// =============================================================================
// 1. CANVAS DE FUNDO: ONDAS E PARTÍCULAS QUÂNTICAS
// =============================================================================
const bgCanvas = document.getElementById('quantum-bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let bgWidth, bgHeight;
let particles = [];
const PARTICLE_COUNT = 45;

function resizeBgCanvas() {
  bgWidth = bgCanvas.width = window.innerWidth;
  bgHeight = bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBgCanvas);
resizeBgCanvas();

class QuantumParticle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * bgWidth;
    this.y = Math.random() * bgHeight;
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45;
    this.radius = Math.random() * 2.2 + 1.2;
    this.phase = Math.random() * Math.PI * 2;
    this.phaseSpeed = 0.02 + Math.random() * 0.02;
    this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255,' : 'rgba(168, 85, 247,';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.phase += this.phaseSpeed;

    if (this.x < 0) this.x = bgWidth;
    if (this.x > bgWidth) this.x = 0;
    if (this.y < 0) this.y = bgHeight;
    if (this.y > bgHeight) this.y = 0;
  }
  draw(ctx) {
    const alpha = 0.2 + 0.35 * Math.sin(this.phase);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `${this.color} ${Math.max(0.1, alpha)})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00f0ff';
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new QuantumParticle());
}

function animateBg() {
  bgCtx.clearRect(0, 0, bgWidth, bgHeight);

  // Linhas de entrelaçamento entre partículas próximas
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const linkAlpha = (1 - dist / 130) * 0.14;
        bgCtx.beginPath();
        bgCtx.moveTo(particles[i].x, particles[i].y);
        bgCtx.lineTo(particles[j].x, particles[j].y);
        bgCtx.strokeStyle = `rgba(0, 240, 255, ${linkAlpha})`;
        bgCtx.lineWidth = 1;
        bgCtx.stroke();
      }
    }
  }

  particles.forEach(p => {
    p.update();
    p.draw(bgCtx);
  });

  requestAnimationFrame(animateBg);
}
animateBg();


// =============================================================================
// 2. BIT CLÁSSICO VS QUBIT (MOEDA QUÂNTICA)
// =============================================================================
const classicalLamp = document.getElementById('classicalLamp');
const classicalBitValue = document.getElementById('classicalBitValue');
const quantumCoin = document.getElementById('quantumCoin');
const qubitStateText = document.getElementById('qubitStateText');
const btnSpinCoin = document.getElementById('btnSpinCoin');
const btnMeasureCoin = document.getElementById('btnMeasureCoin');

let isCoinSpinning = true;
let currentQubitProb0 = 0.5;

function setClassicalBit(val) {
  if (val === 1) {
    classicalLamp.classList.add('active-1');
    classicalBitValue.textContent = '1';
  } else {
    classicalLamp.classList.remove('active-1');
    classicalBitValue.textContent = '0';
  }
}
window.setClassicalBit = setClassicalBit;

// Inicia a moeda girando
if (quantumCoin) {
  quantumCoin.classList.add('spinning');
}

if (btnSpinCoin) {
  btnSpinCoin.addEventListener('click', () => {
    isCoinSpinning = true;
    quantumCoin.classList.add('spinning');
    qubitStateText.textContent = 'Superposição: (|0⟩ + |1⟩)/√2 (Girando)';
    qubitStateText.style.color = 'var(--color-cyan)';
  });
}

if (btnMeasureCoin) {
  btnMeasureCoin.addEventListener('click', () => {
    isCoinSpinning = false;
    quantumCoin.classList.remove('spinning');
    // Medição estocástica baseada na probabilidade
    const r = Math.random();
    const result = r < currentQubitProb0 ? 0 : 1;
    
    if (result === 0) {
      quantumCoin.style.transform = 'rotateY(0deg)';
      qubitStateText.textContent = 'Colapso na Medição: |0⟩ (Polo Norte)';
      qubitStateText.style.color = '#38bdf8';
    } else {
      quantumCoin.style.transform = 'rotateY(180deg)';
      qubitStateText.textContent = 'Colapso na Medição: |1⟩ (Polo Sul)';
      qubitStateText.style.color = '#c084fc';
    }
  });
}

// Slider de Probabilidade
const qubitProbSlider = document.getElementById('qubitProbSlider');
const lblProb0 = document.getElementById('lblProb0');
const lblProb1 = document.getElementById('lblProb1');
const barSeg0 = document.getElementById('barSeg0');
const barSeg1 = document.getElementById('barSeg1');

if (qubitProbSlider) {
  qubitProbSlider.addEventListener('input', (e) => {
    const val0 = parseInt(e.target.value);
    const val1 = 100 - val0;
    currentQubitProb0 = val0 / 100;

    lblProb0.textContent = `${val0}%`;
    lblProb1.textContent = `${val1}%`;
    barSeg0.style.width = `${val0}%`;
    barSeg1.style.width = `${val1}%`;
    barSeg0.textContent = `|0⟩: ${val0}%`;
    barSeg1.textContent = `|1⟩: ${val1}%`;

    // Atualiza fórmula
    const a = Math.sqrt(currentQubitProb0).toFixed(3);
    const b = Math.sqrt(1 - currentQubitProb0).toFixed(3);
    if (isCoinSpinning) {
      qubitStateText.textContent = `|ψ⟩ = ${a}|0⟩ + ${b}|1⟩`;
    }
  });
}


// =============================================================================
// 3. ESFERA DE BLOCH 3D INTERATIVA
// =============================================================================
const blochCanvas = document.getElementById('blochCanvas');
const bCtx = blochCanvas ? blochCanvas.getContext('2d') : null;

// Ângulos do Qubit (coordenadas esféricas na esfera unitária r=1)
// |psi> = cos(theta/2)|0> + e^(i*phi)*sin(theta/2)|1>
let blochTheta = Math.PI / 2; // Inicia no equador (superposição)
let blochPhi = 0;             // Azimutal

// Ângulos de rotação da câmera (perspectiva 3D do observador)
let camPitch = 0.35; // Rotação vertical
let camYaw = -0.65;  // Rotação horizontal

let isDraggingBloch = false;
let lastMouseX = 0;
let lastMouseY = 0;

if (blochCanvas) {
  blochCanvas.addEventListener('mousedown', (e) => {
    isDraggingBloch = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingBloch) return;
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    camYaw += dx * 0.008;
    camPitch += dy * 0.008;
    // Limita o pitch para não virar de ponta-cabeça
    camPitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, camPitch));
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    renderBlochSphere();
  });

  window.addEventListener('mouseup', () => {
    isDraggingBloch = false;
  });

  // Touch support para celulares/tablets
  blochCanvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDraggingBloch = true;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDraggingBloch || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMouseX;
    const dy = e.touches[0].clientY - lastMouseY;
    camYaw += dx * 0.008;
    camPitch += dy * 0.008;
    camPitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, camPitch));
    lastMouseX = e.touches[0].clientX;
    lastMouseY = e.touches[0].clientY;
    renderBlochSphere();
  });

  window.addEventListener('touchend', () => {
    isDraggingBloch = false;
  });
}

// Projeção 3D isométrica/perspectiva simples
function project3D(x, y, z, cx, cy, radius) {
  // Rotação em Y (Yaw)
  const cosY = Math.cos(camYaw);
  const sinY = Math.sin(camYaw);
  const x1 = x * cosY - y * sinY;
  const y1 = x * sinY + y * cosY;
  const z1 = z;

  // Rotação em X (Pitch)
  const cosP = Math.cos(camPitch);
  const sinP = Math.sin(camPitch);
  const x2 = x1;
  const y2 = y1 * cosP - z1 * sinP;
  const z2 = y1 * sinP + z1 * cosP;

  // Coordenadas na tela 2D
  return {
    px: cx + x2 * radius,
    py: cy - z2 * radius,
    depth: y2
  };
}

function renderBlochSphere() {
  if (!bCtx) return;
  const w = blochCanvas.width;
  const h = blochCanvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.38;

  bCtx.clearRect(0, 0, w, h);

  // 1. Círculo de contorno externo e brilho
  bCtx.beginPath();
  bCtx.arc(cx, cy, radius, 0, Math.PI * 2);
  const grad = bCtx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
  grad.addColorStop(0, 'rgba(16, 24, 48, 0.4)');
  grad.addColorStop(1, 'rgba(56, 189, 248, 0.08)');
  bCtx.fillStyle = grad;
  bCtx.fill();
  bCtx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  bCtx.lineWidth = 1.5;
  bCtx.stroke();

  // 2. Desenhar Equador (Plano X-Y)
  bCtx.beginPath();
  const equatorSegments = 60;
  for (let i = 0; i <= equatorSegments; i++) {
    const angle = (i / equatorSegments) * Math.PI * 2;
    const p = project3D(Math.cos(angle), Math.sin(angle), 0, cx, cy, radius);
    if (i === 0) bCtx.moveTo(p.px, p.py);
    else bCtx.lineTo(p.px, p.py);
  }
  bCtx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  bCtx.lineWidth = 1;
  bCtx.setLineDash([4, 4]);
  bCtx.stroke();
  bCtx.setLineDash([]);

  // 3. Desenhar Meridiano Principal (Plano X-Z)
  bCtx.beginPath();
  for (let i = 0; i <= equatorSegments; i++) {
    const angle = (i / equatorSegments) * Math.PI * 2;
    const p = project3D(Math.cos(angle), 0, Math.sin(angle), cx, cy, radius);
    if (i === 0) bCtx.moveTo(p.px, p.py);
    else bCtx.lineTo(p.px, p.py);
  }
  bCtx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
  bCtx.stroke();

  // 4. Desenhar Eixos Cartesianos: Z (Vertical), X e Y
  function drawAxis(x, y, z, label, color) {
    const o = project3D(0, 0, 0, cx, cy, radius);
    const tip = project3D(x * 1.25, y * 1.25, z * 1.25, cx, cy, radius);
    bCtx.beginPath();
    bCtx.moveTo(o.px, o.py);
    bCtx.lineTo(tip.px, tip.py);
    bCtx.strokeStyle = color;
    bCtx.lineWidth = 1.8;
    bCtx.stroke();

    // Rótulo do Eixo
    bCtx.font = 'bold 12px "Fira Code", monospace';
    bCtx.fillStyle = color;
    bCtx.fillText(label, tip.px + 5, tip.py + 4);
  }

  drawAxis(0, 0, 1, '|0⟩ (+Z)', '#38bdf8');
  drawAxis(0, 0, -1, '|1⟩ (-Z)', '#c084fc');
  drawAxis(1, 0, 0, '|+⟩ (+X)', '#00f0ff');
  drawAxis(0, 1, 0, '|+i⟩ (+Y)', '#10b981');

  // 5. Calcular Coordenadas Cartesianas do Vetor de Estado Quântico
  // x = sin(theta) * cos(phi)
  // y = sin(theta) * sin(phi)
  // z = cos(theta)
  const qx = Math.sin(blochTheta) * Math.cos(blochPhi);
  const qy = Math.sin(blochTheta) * Math.sin(blochPhi);
  const qz = Math.cos(blochTheta);

  const originP = project3D(0, 0, 0, cx, cy, radius);
  const stateP = project3D(qx, qy, qz, cx, cy, radius);
  const projXY = project3D(qx, qy, 0, cx, cy, radius);

  // Linhas guia projetadas no plano XY
  bCtx.beginPath();
  bCtx.moveTo(stateP.px, stateP.py);
  bCtx.lineTo(projXY.px, projXY.py);
  bCtx.lineTo(originP.px, originP.py);
  bCtx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
  bCtx.lineWidth = 1.2;
  bCtx.setLineDash([3, 3]);
  bCtx.stroke();
  bCtx.setLineDash([]);

  // Vetor de Estado |psi> (Flecha Neon Cyan)
  bCtx.beginPath();
  bCtx.moveTo(originP.px, originP.py);
  bCtx.lineTo(stateP.px, stateP.py);
  bCtx.strokeStyle = '#00f0ff';
  bCtx.lineWidth = 3.5;
  bCtx.shadowBlur = 12;
  bCtx.shadowColor = '#00f0ff';
  bCtx.stroke();
  bCtx.shadowBlur = 0;

  // Ponta da Flecha / Esfera na extremidade do estado
  bCtx.beginPath();
  bCtx.arc(stateP.px, stateP.py, 6, 0, Math.PI * 2);
  bCtx.fillStyle = '#ffffff';
  bCtx.shadowBlur = 15;
  bCtx.shadowColor = '#00f0ff';
  bCtx.fill();
  bCtx.shadowBlur = 0;

  // Texto |psi>
  bCtx.font = 'bold 14px "Fira Code", monospace';
  bCtx.fillStyle = '#00f0ff';
  bCtx.fillText('|ψ⟩', stateP.px + 10, stateP.py - 10);
}

// Atualiza o painel lateral com as contas matemáticas do estado
function updateBlochUI() {
  const thetaDeg = ((blochTheta * 180) / Math.PI).toFixed(1);
  const phiDeg = ((((blochPhi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) * 180 / Math.PI).toFixed(1);

  const alpha = Math.cos(blochTheta / 2);
  const beta = Math.sin(blochTheta / 2);

  const prob0 = Math.pow(alpha, 2);
  const prob1 = Math.pow(beta, 2);

  const blochThetaVal = document.getElementById('blochThetaVal');
  const blochPhiVal = document.getElementById('blochPhiVal');
  const blochKetDisplay = document.getElementById('blochKetDisplay');
  const blochPct0 = document.getElementById('blochPct0');
  const blochPct1 = document.getElementById('blochPct1');
  const blochBar0 = document.getElementById('blochBar0');
  const blochBar1 = document.getElementById('blochBar1');

  if (blochThetaVal) blochThetaVal.textContent = `${thetaDeg}°`;
  if (blochPhiVal) blochPhiVal.textContent = `${phiDeg}°`;

  // Exibição em formato ket com notação de fase
  let phaseStr = '';
  if (Math.abs(blochPhi) > 0.05) {
    phaseStr = `e^(${blochPhi.toFixed(2)}i) · `;
  }

  if (blochKetDisplay) {
    blochKetDisplay.innerHTML = `|ψ⟩ = ${alpha.toFixed(4)} |0⟩ + ${phaseStr}${beta.toFixed(4)} |1⟩`;
  }

  if (blochPct0) blochPct0.textContent = `${(prob0 * 100).toFixed(1)}%`;
  if (blochPct1) blochPct1.textContent = `${(prob1 * 100).toFixed(1)}%`;
  if (blochBar0) blochBar0.style.width = `${(prob0 * 100).toFixed(1)}%`;
  if (blochBar1) blochBar1.style.width = `${(prob1 * 100).toFixed(1)}%`;

  renderBlochSphere();
}

function setBlochState(theta, phi, label) {
  blochTheta = theta;
  blochPhi = phi;
  updateBlochUI();
}
window.setBlochState = setBlochState;

function applyBlochGate(gate) {
  if (gate === 'X') {
    // Inverte o eixo Z: theta -> pi - theta
    blochTheta = Math.PI - blochTheta;
    blochPhi = -blochPhi;
  } else if (gate === 'Z') {
    // Adiciona pi à fase
    blochPhi = (blochPhi + Math.PI) % (2 * Math.PI);
  } else if (gate === 'H') {
    // Hadamard: se estiver em |0> vai para |+> (theta = pi/2, phi = 0)
    if (Math.abs(blochTheta) < 0.1) {
      blochTheta = Math.PI / 2;
      blochPhi = 0;
    } else if (Math.abs(blochTheta - Math.PI) < 0.1) {
      blochTheta = Math.PI / 2;
      blochPhi = Math.PI;
    } else {
      blochTheta = 0;
      blochPhi = 0;
    }
  }
  updateBlochUI();
}
window.applyBlochGate = applyBlochGate;

function resetBlochSphere() {
  blochTheta = 0;
  blochPhi = 0;
  camPitch = 0.35;
  camYaw = -0.65;
  updateBlochUI();
}
window.resetBlochSphere = resetBlochSphere;

updateBlochUI();


// =============================================================================
// 4. EMARANHAMENTO QUÂNTICO (CANVAS SINCRONIZADO)
// =============================================================================
const entCanvas = document.getElementById('entanglementCanvas');
const entCtx = entCanvas ? entCanvas.getContext('2d') : null;

let isEntangled = true;
let stateA = null; // null = superposição, 0 ou 1 quando medido
let stateB = null;
let entAngle = 0;

function drawEntanglement() {
  if (!entCtx) return;
  const w = entCanvas.width;
  const h = entCanvas.height;

  entCtx.clearRect(0, 0, w, h);

  const nodeAX = 140;
  const nodeAY = h / 2;
  const nodeBX = w - 140;
  const nodeBY = h / 2;

  entAngle += 0.04;

  // Desenhar canal de emaranhamento entre A e B
  if (isEntangled) {
    const waveCount = 5;
    for (let k = 0; k < waveCount; k++) {
      entCtx.beginPath();
      const phaseOffset = (k * Math.PI) / waveCount;
      const waveAlpha = 0.15 + 0.1 * Math.sin(entAngle * 2 + k);

      for (let x = nodeAX; x <= nodeBX; x += 5) {
        const progress = (x - nodeAX) / (nodeBX - nodeAX);
        const envelope = Math.sin(progress * Math.PI); // Mais largo no meio
        const y = nodeAY + Math.sin(progress * 16 + entAngle * 3 + phaseOffset) * (18 * envelope);
        if (x === nodeAX) entCtx.moveTo(x, y);
        else entCtx.lineTo(x, y);
      }
      entCtx.strokeStyle = `rgba(168, 85, 247, ${waveAlpha})`;
      entCtx.lineWidth = 2;
      entCtx.stroke();
    }

    // Fótons / pulsos correndo entre as partículas
    const pulseProg = (entAngle * 0.4) % 1;
    const pulseX = nodeAX + (nodeBX - nodeAX) * pulseProg;
    const pulseY = nodeAY + Math.sin(pulseProg * 16 + entAngle * 3) * 10;
    entCtx.beginPath();
    entCtx.arc(pulseX, pulseY, 5, 0, Math.PI * 2);
    entCtx.fillStyle = '#00f0ff';
    entCtx.shadowBlur = 12;
    entCtx.shadowColor = '#00f0ff';
    entCtx.fill();
    entCtx.shadowBlur = 0;
  }

  // Desenhar Nó A
  drawQuantumNode(nodeAX, nodeAY, stateA, 'A', '#00f0ff');
  // Desenhar Nó B
  drawQuantumNode(nodeBX, nodeBY, stateB, 'B', '#a855f7');

  requestAnimationFrame(drawEntanglement);
}

function drawQuantumNode(x, y, state, label, glowColor) {
  entCtx.save();
  // Anel orbital giratório
  if (state === null) {
    entCtx.beginPath();
    entCtx.arc(x, y, 42, entAngle * 2, entAngle * 2 + Math.PI * 1.5);
    entCtx.strokeStyle = glowColor;
    entCtx.lineWidth = 2;
    entCtx.stroke();

    entCtx.beginPath();
    entCtx.arc(x, y, 48, -entAngle * 2, -entAngle * 2 + Math.PI);
    entCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    entCtx.lineWidth = 1;
    entCtx.stroke();
  }

  // Esfera central do Qubit
  entCtx.beginPath();
  entCtx.arc(x, y, 32, 0, Math.PI * 2);
  entCtx.fillStyle = state === null ? '#0f172a' : state === 0 ? '#0284c7' : '#7e22ce';
  entCtx.shadowBlur = 18;
  entCtx.shadowColor = glowColor;
  entCtx.fill();
  entCtx.strokeStyle = '#ffffff';
  entCtx.lineWidth = 2;
  entCtx.stroke();
  entCtx.shadowBlur = 0;

  // Texto do valor do nó
  entCtx.font = 'bold 16px "Fira Code", monospace';
  entCtx.fillStyle = '#ffffff';
  entCtx.textAlign = 'center';
  entCtx.textBaseline = 'middle';
  const labelText = state === null ? 'ψ' : `|${state}⟩`;
  entCtx.fillText(labelText, x, y);
  entCtx.restore();
}

if (entCanvas) {
  drawEntanglement();
}

// Botões de Medição do Emaranhamento
const entNodeA = document.getElementById('entangleNodeA');
const entNodeB = document.getElementById('entangleNodeB');
const beamIndicator = document.getElementById('beamIndicator');

function measureEntangledPair(triggerNode) {
  if (stateA !== null) return; // Já foi medido
  // Sorteia 0 ou 1 com 50% de chance cada
  const collapsedVal = Math.random() < 0.5 ? 0 : 1;
  stateA = collapsedVal;
  stateB = collapsedVal; // Instantaneamente idêntico!

  if (entNodeA) {
    entNodeA.textContent = `Medido |${stateA}⟩`;
    entNodeA.style.borderColor = stateA === 0 ? 'var(--color-cyan)' : 'var(--color-violet)';
  }
  if (entNodeB) {
    entNodeB.textContent = `Colapso Instantâneo |${stateB}⟩`;
    entNodeB.style.borderColor = stateB === 0 ? 'var(--color-cyan)' : 'var(--color-violet)';
  }
}

const btnMeasureA = document.getElementById('btnMeasureA');
const btnMeasureB = document.getElementById('btnMeasureB');
const btnResetEntangle = document.getElementById('btnResetEntangle');

if (btnMeasureA) btnMeasureA.addEventListener('click', () => measureEntangledPair('A'));
if (btnMeasureB) btnMeasureB.addEventListener('click', () => measureEntangledPair('B'));
if (btnResetEntangle) {
  btnResetEntangle.addEventListener('click', () => {
    stateA = null;
    stateB = null;
    if (entNodeA) {
      entNodeA.textContent = 'Em Superposição 🌀';
      entNodeA.style.borderColor = 'rgba(0, 240, 255, 0.2)';
    }
    if (entNodeB) {
      entNodeB.textContent = 'Em Superposição 🌀';
      entNodeB.style.borderColor = 'rgba(0, 240, 255, 0.2)';
    }
  });
}


// =============================================================================
// 5. EXAMINADOR DE PORTAS LÓGICAS QUÂNTICAS
// =============================================================================
const gateInspectorDesc = document.getElementById('gateInspectorDesc');
const gateInspectorMath = document.getElementById('gateInspectorMath');

const gateData = {
  'X': {
    desc: 'A Porta Pauli-X atua como o NOT Quântico. Ela inverte as amplitudes da base computacional:',
    math: 'X |0⟩ = |1⟩ &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; X |1⟩ = |0⟩ &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Matriz: [[0, 1], [1, 0]]'
  },
  'Z': {
    desc: 'A Porta Pauli-Z inverte a fase quântica do estado |1⟩, mantendo |0⟩ inalterado:',
    math: 'Z |0⟩ = |0⟩ &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Z |1⟩ = -|1⟩ &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Matriz: [[1, 0], [0, -1]]'
  },
  'H': {
    desc: 'A Porta Hadamard transforma estados da base pura em superposições balanceadas:',
    math: 'H |0⟩ = (|0⟩ + |1⟩)/√2 &nbsp;&nbsp;|&nbsp;&nbsp; H |1⟩ = (|0⟩ - |1⟩)/√2 &nbsp;&nbsp;|&nbsp;&nbsp; Matriz: 1/√2 [[1, 1], [1, -1]]'
  },
  'CNOT': {
    desc: 'A Porta CNOT (Controlled-NOT) é de 2 qubits. Inverte o qubit alvo SOMENTE se o controle for 1:',
    math: 'CNOT |00⟩ = |00⟩ &nbsp;|&nbsp; CNOT |01⟩ = |01⟩ &nbsp;|&nbsp; CNOT |10⟩ = |11⟩ &nbsp;|&nbsp; CNOT |11⟩ = |10⟩'
  }
};

function inspectGate(g) {
  if (!gateData[g]) return;
  if (gateInspectorDesc) gateInspectorDesc.textContent = gateData[g].desc;
  if (gateInspectorMath) gateInspectorMath.innerHTML = gateData[g].math;
}
window.inspectGate = inspectGate;


// =============================================================================
// 6. SIMULADOR DO CIRCUITO DE BELL (FOCO DO GRUPO 4)
// =============================================================================
let currentStep = 0;
let isAutoPlaying = false;
let autoPlayInterval = null;

const stepDetails = [
  {
    stepNum: 'Passo 0 de 3',
    title: 'Estado Inicial: Dois qubits no estado fundamental |00⟩',
    desc: 'Ambos os qubits iniciam no estado computacional clássico |0⟩. O vetor de estado possui amplitude 1.0 no componente |00⟩ e 0.0 em todos os outros.',
    vectorLatex: '|ψ₀⟩ = 1.0000 |00⟩ + 0.0000 |01⟩ + 0.0000 |10⟩ + 0.0000 |11⟩',
    matrixOp: 'Identidade I₄ (Estado Puro Inicial)',
    probs: [1.0, 0.0, 0.0, 0.0],
    activeGates: [],
    out0: 'q₀: |0⟩',
    out1: 'q₁: |0⟩'
  },
  {
    stepNum: 'Passo 1 de 3',
    title: 'Passo 1: Porta Hadamard (H) aplicada ao Qubit q₀',
    desc: 'A porta Hadamard coloca o primeiro qubit em superposição simétrica (|0⟩ + |1⟩)/√2. O sistema é calculado pelo produto tensorial (H ⊗ I). Agora o sistema tem 50% de probabilidade em |00⟩ e 50% em |10⟩.',
    vectorLatex: '|ψ₁⟩ = 0.7071 |00⟩ + 0.0000 |01⟩ + 0.7071 |10⟩ + 0.0000 |11⟩',
    matrixOp: '(H ⊗ I) = 1/√2 · [[1, 0, 1, 0], [0, 1, 0, 1], [1, 0, -1, 0], [0, 1, 0, -1]]',
    probs: [0.5, 0.0, 0.5, 0.0],
    activeGates: ['gateHSlot'],
    out0: 'q₀: (|0⟩+|1⟩)/√2',
    out1: 'q₁: |0⟩'
  },
  {
    stepNum: 'Passo 2 de 3',
    title: 'Passo 2: Porta CNOT (Controle q₀, Alvo q₁)',
    desc: 'A porta CNOT entrelaça os dois qubits! Se q₀ for 0, q₁ permanece 0 (gerando |00⟩). Se q₀ for 1, q₁ inverte de 0 para 1 (gerando |11⟩). O estado resultante é o famoso Estado de Bell maximamente emaranhado |Φ⁺⟩.',
    vectorLatex: '|ψ₂⟩ = 0.7071 |00⟩ + 0.0000 |01⟩ + 0.0000 |10⟩ + 0.7071 |11⟩',
    matrixOp: 'CNOT = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]]',
    probs: [0.5, 0.0, 0.0, 0.5],
    activeGates: ['cnotCtrlSlot', 'cnotTargetSlot'],
    out0: 'q₀: Emaranhado ⚡',
    out1: 'q₁: Emaranhado ⚡'
  },
  {
    stepNum: 'Passo 3 de 3',
    title: 'Passo 3: Medição Estatística na Base Computacional (Shots)',
    desc: 'Ao medir os dois qubits, a função de onda colapsa instantaneamente segundo a Regra de Born (P = |amplitude|²). Conforme simulado no código Python, executamos 1024 medições: os qubits sempre concordam (|00⟩ ou |11⟩) e nunca geram |01⟩ ou |10⟩!',
    vectorLatex: '|ψ⟩ colapsa para |00⟩ (prob. 50%) ou |11⟩ (prob. 50%)',
    matrixOp: 'Operador de Projeção M = |00⟩⟨00| + |11⟩⟨11|',
    probs: [0.5, 0.0, 0.0, 0.5],
    activeGates: ['measure0Slot', 'measure1Slot'],
    out0: 'Medido: 0 ou 1',
    out1: 'Medido: Idêntico a q₀'
  }
];

function updateCircuitUI() {
  const d = stepDetails[currentStep];

  // Elementos textuais
  document.getElementById('stepNumberBadge').textContent = d.stepNum;
  document.getElementById('stepTitle').textContent = d.title;
  document.getElementById('stepDescription').textContent = d.desc;
  document.getElementById('stateVectorLatex').textContent = d.vectorLatex;
  document.getElementById('stepMatrixLatex').textContent = d.matrixOp;

  document.getElementById('outputWire0').textContent = d.out0;
  document.getElementById('outputWire1').textContent = d.out1;

  // Atualizar barras de probabilidades teóricas
  const p00 = (d.probs[0] * 100).toFixed(0);
  const p01 = (d.probs[1] * 100).toFixed(0);
  const p10 = (d.probs[2] * 100).toFixed(0);
  const p11 = (d.probs[3] * 100).toFixed(0);

  document.getElementById('thBar00').style.height = `${p00}%`;
  document.getElementById('thBar01').style.height = `${p01}%`;
  document.getElementById('thBar10').style.height = `${p10}%`;
  document.getElementById('thBar11').style.height = `${p11}%`;

  document.getElementById('thPct00').textContent = `${p00}%`;
  document.getElementById('thPct01').textContent = `${p01}%`;
  document.getElementById('thPct10').textContent = `${p10}%`;
  document.getElementById('thPct11').textContent = `${p11}%`;

  // Atualizar bullets de progresso
  for (let i = 0; i < 4; i++) {
    const bullet = document.getElementById(`bullet${i}`);
    if (bullet) {
      if (i <= currentStep) bullet.classList.add('active');
      else bullet.classList.remove('active');
    }
    const conn = document.getElementById(`conn${i}`);
    if (conn) {
      if (i < currentStep) conn.classList.add('filled');
      else conn.classList.remove('filled');
    }
  }

  // Destaque visual dos slots de portas ativas
  const allGateSlots = document.querySelectorAll('.gate-slot');
  allGateSlots.forEach(el => el.classList.remove('highlight-active'));

  d.activeGates.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('highlight-active');
  });

  // Mostrar caixa de shots no passo 3
  const shotsBox = document.getElementById('shotsBox');
  if (shotsBox) {
    if (currentStep === 3) {
      shotsBox.style.display = 'flex';
      runShotsExperiment(); // Executa simulação estatística automática
    } else {
      shotsBox.style.display = 'none';
    }
  }
}

function goToStep(s) {
  currentStep = Math.max(0, Math.min(3, s));
  updateCircuitUI();
}
window.goToStep = goToStep;

function stepCircuit(delta) {
  let next = currentStep + delta;
  if (next > 3) next = 0;
  if (next < 0) next = 3;
  goToStep(next);
}
window.stepCircuit = stepCircuit;

function toggleAutoPlay() {
  const btn = document.getElementById('btnAutoPlay');
  if (isAutoPlaying) {
    clearInterval(autoPlayInterval);
    isAutoPlaying = false;
    btn.textContent = '▶ Auto Reproduzir';
    btn.classList.remove('btn-primary');
  } else {
    isAutoPlaying = true;
    btn.textContent = '⏸ Pausar';
    btn.classList.add('btn-primary');
    autoPlayInterval = setInterval(() => {
      stepCircuit(1);
    }, 3200);
  }
}
window.toggleAutoPlay = toggleAutoPlay;

function resetCircuit() {
  if (isAutoPlaying) toggleAutoPlay();
  goToStep(0);
}
window.resetCircuit = resetCircuit;

// Execução estocástica de shots (Simulação fiel a simulador_quantico.py)
function runShotsExperiment() {
  const shotsSelect = document.getElementById('shotsSelect');
  const shots = parseInt(shotsSelect.value) || 1024;

  // No estado de Bell, a probabilidade é 50% |00> e 50% |11>
  // Simula sorteios de Bernoulli
  let count00 = 0;
  for (let i = 0; i < shots; i++) {
    if (Math.random() < 0.5) count00++;
  }
  const count11 = shots - count00;
  const count01 = 0;
  const count10 = 0;

  const pct00 = ((count00 / shots) * 100).toFixed(1);
  const pct11 = ((count11 / shots) * 100).toFixed(1);

  document.getElementById('histFill00').style.width = `${pct00}%`;
  document.getElementById('histCount00').textContent = `${count00} (${pct00}%)`;

  document.getElementById('histFill01').style.width = '0%';
  document.getElementById('histCount01').textContent = `0 (0.0%)`;

  document.getElementById('histFill10').style.width = '0%';
  document.getElementById('histCount10').textContent = `0 (0.0%)`;

  document.getElementById('histFill11').style.width = `${pct11}%`;
  document.getElementById('histCount11').textContent = `${count11} (${pct11}%)`;
}
window.runShotsExperiment = runShotsExperiment;

function copyPythonCode() {
  const code = document.getElementById('pythonCodeBlock').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('btnCopyCode');
    const originalText = btn.textContent;
    btn.textContent = '✓ Código Copiado!';
    btn.style.background = 'var(--color-emerald)';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  });
}
window.copyPythonCode = copyPythonCode;


// =============================================================================
// 7. LABORATÓRIO QUÂNTICO (SANDBOX LIVRE)
// =============================================================================
let selectedTool = 'H';
// Grade: [linha][coluna], linha 0 = q0, linha 1 = q1
// 3 slots de tempo cada
let sandboxGrid = [
  ['H', '●', null],
  [null, '⊕', null]
];

function selectPaletteGate(gate) {
  selectedTool = gate;
  document.querySelectorAll('.palette-gate').forEach(btn => {
    if (btn.dataset.gate === gate) btn.classList.add('active');
    else btn.classList.remove('active');
  });
}
window.selectPaletteGate = selectPaletteGate;

function handleSandboxSlotClick(row, col) {
  if (selectedTool === 'CLEAR') {
    sandboxGrid[row][col] = null;
    // Se era CNOT, limpa o par
    if (col === 1 && (sandboxGrid[0][col] === '●' || sandboxGrid[1][col] === '⊕')) {
      sandboxGrid[0][col] = null;
      sandboxGrid[1][col] = null;
    }
  } else if (selectedTool === 'CNOT') {
    // CNOT ocupa controle na linha 0 e alvo na linha 1 na mesma coluna
    sandboxGrid[0][col] = '●';
    sandboxGrid[1][col] = '⊕';
  } else {
    sandboxGrid[row][col] = selectedTool;
  }
  renderSandboxGrid();
  calculateSandboxState();
}
window.handleSandboxSlotClick = handleSandboxSlotClick;

function renderSandboxGrid() {
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const val = sandboxGrid[r][c];
      const el = document.getElementById(`sb-slot-${r}-${c}`);
      if (el) {
        if (val) {
          el.innerHTML = `<span>${val}</span>`;
          el.classList.add('filled');
        } else {
          el.innerHTML = `<span>vazio</span>`;
          el.classList.remove('filled');
        }
      }
    }
  }
}

// Simulador matricial simples de 2 Qubits para o Sandbox
function calculateSandboxState() {
  // Estado inicial |00> = [1, 0, 0, 0]
  let state = [1, 0, 0, 0];

  // Percorre as colunas temporais 0, 1, 2
  for (let c = 0; c < 3; c++) {
    const g0 = sandboxGrid[0][c];
    const g1 = sandboxGrid[1][c];

    // Caso 1: CNOT na coluna
    if (g0 === '●' && g1 === '⊕') {
      // CNOT: se q0=1 (índices 2 e 3 em ordem |00>, |01>, |10>, |11>), troca |10> com |11>
      const temp = state[2];
      state[2] = state[3];
      state[3] = temp;
      continue;
    }

    // Caso 2: Operações de 1 qubit em q0 e q1
    // Monta matriz 2x2 para q0
    let m0 = get1QubitMatrix(g0);
    // Monta matriz 2x2 para q1
    let m1 = get1QubitMatrix(g1);

    // Produto tensorial m0 (x) m1 (4x4)
    let M = tensorProduct4x4(m0, m1);
    // Multiplica M @ state
    state = multiplyMatrixVector4(M, state);
  }

  // Calcula probabilidades P = |amp|^2
  const probs = state.map(a => Math.pow(a, 2));

  // Formata o vetor final
  const vText = `|ψ⟩ = ${state[0].toFixed(3)} |00⟩ + ${state[1].toFixed(3)} |01⟩ + ${state[2].toFixed(3)} |10⟩ + ${state[3].toFixed(3)} |11⟩`;
  document.getElementById('sbVectorText').textContent = vText;

  // Atualiza as 4 barras de probabilidades
  for (let i = 0; i < 4; i++) {
    const key = ['00', '01', '10', '11'][i];
    const pct = (probs[i] * 100).toFixed(0);
    document.getElementById(`sbProbBar${key}`).style.width = `${pct}%`;
    document.getElementById(`sbProbTxt${key}`).textContent = `${pct}%`;
  }
}

function get1QubitMatrix(gate) {
  const invSqrt2 = 1 / Math.sqrt(2);
  if (gate === 'H') {
    return [[invSqrt2, invSqrt2], [invSqrt2, -invSqrt2]];
  }
  if (gate === 'X') {
    return [[0, 1], [1, 0]];
  }
  if (gate === 'Z') {
    return [[1, 0], [0, -1]];
  }
  // Identidade
  return [[1, 0], [0, 1]];
}

function tensorProduct4x4(a, b) {
  let res = [];
  for (let i = 0; i < 4; i++) res.push([0, 0, 0, 0]);

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        for (let l = 0; l < 2; l++) {
          res[i * 2 + k][j * 2 + l] = a[i][j] * b[k][l];
        }
      }
    }
  }
  return res;
}

function multiplyMatrixVector4(M, v) {
  let out = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      out[i] += M[i][j] * v[j];
    }
  }
  return out;
}

function loadSandboxPreset(type) {
  if (type === 'bell') {
    sandboxGrid = [
      ['H', '●', null],
      [null, '⊕', null]
    ];
  } else if (type === 'superposition') {
    sandboxGrid = [
      ['H', null, null],
      ['H', null, null]
    ];
  } else if (type === 'not') {
    sandboxGrid = [
      ['X', null, null],
      [null, null, null]
    ];
  }
  renderSandboxGrid();
  calculateSandboxState();
}
window.loadSandboxPreset = loadSandboxPreset;

function clearSandbox() {
  sandboxGrid = [
    [null, null, null],
    [null, null, null]
  ];
  renderSandboxGrid();
  calculateSandboxState();
}
window.clearSandbox = clearSandbox;

renderSandboxGrid();
calculateSandboxState();


// =============================================================================
// 8. CALCULADORA EXPONENCIAL (2^n)
// =============================================================================
const qubitScaleSlider = document.getElementById('qubitScaleSlider');
const lblQubitCount = document.getElementById('lblQubitCount');
const mStatesVal = document.getElementById('mStatesVal');
const mRamVal = document.getElementById('mRamVal');
const mRealWorldVal = document.getElementById('mRealWorldVal');

if (qubitScaleSlider) {
  qubitScaleSlider.addEventListener('input', (e) => {
    const n = parseInt(e.target.value);
    lblQubitCount.textContent = `${n} Qubits`;

    // 2^n usando BigInt
    const states = BigInt(2) ** BigInt(n);
    mStatesVal.textContent = states.toLocaleString('pt-BR');

    // Cada amplitude complexa leva 16 bytes (8 bytes real float64 + 8 bytes imag)
    const bytesNeeded = states * BigInt(16);

    let ramText = '';
    let compText = '';

    const ONE_KB = 1024n;
    const ONE_MB = ONE_KB * 1024n;
    const ONE_GB = ONE_MB * 1024n;
    const ONE_TB = ONE_GB * 1024n;
    const ONE_PB = ONE_TB * 1024n;
    const ONE_EB = ONE_PB * 1024n;

    if (bytesNeeded < ONE_MB) {
      ramText = `${(Number(bytesNeeded) / 1024).toFixed(1)} Kilobytes`;
      compText = 'Cabe facilmente no chip de um relógio digital ou microcontrolador.';
    } else if (bytesNeeded < ONE_GB) {
      ramText = `${(Number(bytesNeeded) / (1024 * 1024)).toFixed(1)} Megabytes`;
      compText = 'Cabe em qualquer smartphone ou computador básico.';
    } else if (bytesNeeded < ONE_TB) {
      const gb = Number(bytesNeeded / ONE_GB);
      ramText = `~${gb} Gigabytes de RAM`;
      if (gb <= 32) compText = 'Exige um computador desktop gamer com 32GB de RAM.';
      else compText = 'Exige uma estação de trabalho potente com 128GB a 512GB de RAM.';
    } else if (bytesNeeded < ONE_PB) {
      const tb = Number(bytesNeeded / ONE_TB);
      ramText = `~${tb} Terabytes de RAM`;
      compText = 'Exige um cluster de servidores corporativos de grande porte.';
    } else if (bytesNeeded < ONE_EB) {
      const pb = Number(bytesNeeded / ONE_PB);
      ramText = `~${pb} Petabytes de RAM`;
      compText = 'Exige um dos maiores supercomputadores do mundo (como Frontier ou Summit).';
    } else {
      const eb = Number(bytesNeeded / ONE_EB);
      ramText = `~${eb} Exabytes de RAM`;
      compText = 'Impossível para toda a infraestrutura computacional combinada da humanidade!';
    }

    if (n >= 50) {
      compText = 'Limiar da Supremacia Quântica: nenhum supercomputador clássico consegue simular!';
    }

    mRamVal.textContent = ramText;
    mRealWorldVal.textContent = compText;
  });
}


// =============================================================================
// 9. NAVEGAÇÃO MOBILE & SCROLL
// =============================================================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// Inicialização inicial do circuito
updateCircuitUI();

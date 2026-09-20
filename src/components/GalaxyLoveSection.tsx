// @ts-nocheck
/**
 * GalaxyLoveSection.tsx
 *
 * Galaksi 3D interaktif untuk "Dear Nia".
 * Diadaptasi dari proyek Galaxy-love-main (by Miko) dan dirombak total agar:
 *  - Berjalan mulus di dalam React + Vite + TypeScript.
 *  - Tidak ada kebocoran event listener / WebGL context saat unmount.
 *  - Bug "atmosphere di dalam createShootingStar" diperbaiki.
 *  - Tidak ada konflik git merge / variabel belum dideklarasikan.
 *  - Galeri tombol estetik (reset, fullscreen).
 *  - Overlay intro & teks hint yang lebih lembut & romantis.
 *  - Mobile-responsive: tap detection, ResizeObserver, aspect-ratio wrapper.
 *
 * Original galaxy code: Galaxy-love-main (Create by Miko).
 * Refactored for Dear Nia with love.
 */
import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Maximize2, Minimize2, RotateCcw, Sparkles } from "lucide-react";

declare global {
  interface Window {
    dataCCD?: {
      data?: {
        heartImages?: string[];
        ringTexts?: string[];
      };
    };
    textRings?: any[];
  }
}

/* -------------------------------------------------------------------------- */
/*                              GALAXY ENGINE                                 */
/* -------------------------------------------------------------------------- */

function initGalaxy(
  container: HTMLElement,
  handlers: {
    onStarted?: () => void;
  } = {}
) {
  let isDestroyed = false;
  let animFrameId: number | null = null;
  let cameraAnimFrameId: number | null = null;

  // Handler references kept in scope so we can remove them on destroy
  let resizeHandler: (() => void) | null = null;
  let clickHandler: ((e: any) => void) | null = null;
  let touchHandler: ((e: any) => void) | null = null;
  let tapStartHandler: ((e: TouchEvent) => void) | null = null;
  let tapEndHandler: ((e: TouchEvent) => void) | null = null;
  let preventGestureHandler: ((e: Event) => void) | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let visualViewportHandler: (() => void) | null = null;

  /* ---------------------------- SCENE & CAMERA ---------------------------- */
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.0015);

  const camera = new THREE.PerspectiveCamera(
    75,
    (container.clientWidth || window.innerWidth) /
      (container.clientHeight || window.innerHeight),
    0.1,
    100000
  );
  camera.position.set(0, 20, 30);

  /* ------------------------------ RENDERER -------------------------------- */
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(
    container.clientWidth || window.innerWidth,
    container.clientHeight || window.innerHeight
  );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.touchAction = "none";
  container.appendChild(renderer.domElement);

  /* ------------------------------ CONTROLS -------------------------------- */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.enabled = false;
  controls.target.set(0, 0, 0);
  controls.enablePan = false;
  controls.enableRotate = true;
  controls.enableZoom = true;
  controls.minDistance = 15;
  controls.maxDistance = 300;
  controls.zoomSpeed = 0.8;
  controls.rotateSpeed = 0.8;
  // Explicit touch + mouse config (three.js 0.186 — required for reliable mobile drag)
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN,
  };
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };
  controls.update();

  /* Pause autoRotate when user starts dragging, so manual drag feels responsive.
     Don't re-enable on 'end' — user keeps control. Reset button re-enables it. */
  controls.addEventListener("start", () => {
    controls.autoRotate = false;
  });

  /* ----------------------- GLOW MATERIAL FACTORY ------------------------- */
  function createGlowMaterial(color: string, size = 128, opacity = 0.55) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const context = canvas.getContext("2d")!;
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Sprite(material);
  }

  const centralGlow = createGlowMaterial("rgba(255,255,255,0.8)", 156, 0.25);
  centralGlow.scale.set(8, 8, 1);
  scene.add(centralGlow);

  /* ------------------------------- NEBULAE -------------------------------- */
  for (let i = 0; i < 15; i++) {
    const hue = Math.random() * 360;
    const color = `hsla(${hue}, 80%, 50%, 0.6)`;
    const nebula = createGlowMaterial(color, 256);
    nebula.scale.set(100, 100, 1);
    nebula.position.set(
      (Math.random() - 0.5) * 175,
      (Math.random() - 0.5) * 175,
      (Math.random() - 0.5) * 175
    );
    scene.add(nebula);
  }

  /* --------------------------- GALAXY PARAMETERS -------------------------- */
  const galaxyParameters = {
    count: 100000,
    arms: 6,
    radius: 100,
    spin: 0.5,
    randomness: 0.2,
    randomnessPower: 20,
    insideColor: new THREE.Color(0xd63ed6),
    outsideColor: new THREE.Color(0x48b8b8),
  };

  const defaultHeartImages = Array.from(
    { length: 2 },
    (_, i) => `images/img${i + 1}.jpg`
  );

  const heartImages = [
    ...(window.dataCCD?.data?.heartImages || []),
    ...defaultHeartImages,
  ];

  const numGroups = heartImages.length;

  /* ----------- DENSITY BALANCING: keep galaxy rich across group counts ---- */
  const maxDensity = 50000;
  const minDensity = 2000;
  const maxGroupsForScale = 14;
  let pointsPerGroup: number;
  if (numGroups <= 1) {
    pointsPerGroup = maxDensity;
  } else if (numGroups >= maxGroupsForScale) {
    pointsPerGroup = minDensity;
  } else {
    const t = (numGroups - 1) / (maxGroupsForScale - 1);
    pointsPerGroup = Math.floor(maxDensity * (1 - t) + minDensity * t);
  }
  if (pointsPerGroup * numGroups > galaxyParameters.count) {
    pointsPerGroup = Math.floor(galaxyParameters.count / numGroups);
  }

  /* --------------------- CORE GALAXY POINTS (SHADER) --------------------- */
  const positions = new Float32Array(galaxyParameters.count * 3);
  const colors = new Float32Array(galaxyParameters.count * 3);

  let pointIdx = 0;
  for (let i = 0; i < galaxyParameters.count; i++) {
    const radius =
      Math.pow(Math.random(), galaxyParameters.randomnessPower) *
      galaxyParameters.radius;
    const branchAngle =
      ((i % galaxyParameters.arms) / galaxyParameters.arms) * Math.PI * 2;
    const spinAngle = radius * galaxyParameters.spin;

    const randomX =
      (Math.random() - 0.5) * galaxyParameters.randomness * radius;
    const randomY =
      (Math.random() - 0.5) * galaxyParameters.randomness * radius * 1.2;
    const randomZ =
      (Math.random() - 0.5) * galaxyParameters.randomness * radius;
    const totalAngle = branchAngle + spinAngle;

    if (radius < 30 && Math.random() < 0.8) continue;

    const i3 = pointIdx * 3;
    positions[i3] = Math.cos(totalAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(totalAngle) * radius + randomZ;

    const mixedColor = new THREE.Color(0xff66ff);
    mixedColor.lerp(new THREE.Color(0x66ffff), radius / galaxyParameters.radius);
    mixedColor.multiplyScalar(0.7 + 0.3 * Math.random());
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    pointIdx++;
  }

  const galaxyGeometry = new THREE.BufferGeometry();
  galaxyGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions.slice(0, pointIdx * 3), 3)
  );
  galaxyGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors.slice(0, pointIdx * 3), 3)
  );

  const galaxyMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uSize: { value: 50.0 * renderer.getPixelRatio() },
      uRippleTime: { value: -1.0 },
      uRippleSpeed: { value: 40.0 },
      uRippleWidth: { value: 20.0 },
    },
    vertexShader: `
      uniform float uSize;
      uniform float uTime;
      uniform float uRippleTime;
      uniform float uRippleSpeed;
      uniform float uRippleWidth;

      varying vec3 vColor;

      void main() {
        vColor = color;

        vec4 modelPosition = modelMatrix * vec4(position, 1.0);

        // ---- RIPPLE WAVE ----
        if (uRippleTime > 0.0) {
          float rippleRadius = (uTime - uRippleTime) * uRippleSpeed;
          float particleDist = length(modelPosition.xyz);

          float strength = 1.0 - smoothstep(
            rippleRadius - uRippleWidth,
            rippleRadius + uRippleWidth,
            particleDist
          );
          strength *= smoothstep(
            rippleRadius + uRippleWidth,
            rippleRadius - uRippleWidth,
            particleDist
          );

          if (strength > 0.0) {
            vColor += vec3(strength * 2.0);
          }
        }

        vec4 viewPosition = viewMatrix * modelPosition;
        gl_Position = projectionMatrix * viewPosition;
        gl_PointSize = uSize / -viewPosition.z;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        // round soft particles
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, dist);
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    vertexColors: true,
  });

  const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
  scene.add(galaxy);

  /* -------------------- NEON HEART IMAGE POINT GROUPS --------------------- */
  function createNeonTexture(image: HTMLImageElement, size: number) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const aspectRatio = image.width / image.height;
    let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;
    if (aspectRatio > 1) {
      drawWidth = size;
      drawHeight = size / aspectRatio;
      offsetX = 0;
      offsetY = (size - drawHeight) / 2;
    } else {
      drawHeight = size;
      drawWidth = size * aspectRatio;
      offsetX = (size - drawWidth) / 2;
      offsetY = 0;
    }
    ctx.clearRect(0, 0, size, size);
    const cornerRadius = size * 0.1;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(offsetX + cornerRadius, offsetY);
    ctx.lineTo(offsetX + drawWidth - cornerRadius, offsetY);
    ctx.arcTo(
      offsetX + drawWidth,
      offsetY,
      offsetX + drawWidth,
      offsetY + cornerRadius,
      cornerRadius
    );
    ctx.lineTo(offsetX + drawWidth, offsetY + drawHeight - cornerRadius);
    ctx.arcTo(
      offsetX + drawWidth,
      offsetY + drawHeight,
      offsetX + drawWidth - cornerRadius,
      offsetY + drawHeight,
      cornerRadius
    );
    ctx.lineTo(offsetX + cornerRadius, offsetY + drawHeight);
    ctx.arcTo(
      offsetX,
      offsetY + drawHeight,
      offsetX,
      offsetY + drawHeight - cornerRadius,
      cornerRadius
    );
    ctx.lineTo(offsetX, offsetY + cornerRadius);
    ctx.arcTo(
      offsetX,
      offsetY,
      offsetX + cornerRadius,
      offsetY,
      cornerRadius
    );
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  }

  for (let group = 0; group < numGroups; group++) {
    const groupPositions = new Float32Array(pointsPerGroup * 3);
    const groupColorsNear = new Float32Array(pointsPerGroup * 3);
    const groupColorsFar = new Float32Array(pointsPerGroup * 3);
    let validPointCount = 0;

    for (let i = 0; i < pointsPerGroup; i++) {
      const idx = validPointCount * 3;
      const globalIdx = group * pointsPerGroup + i;
      const radius =
        Math.pow(Math.random(), galaxyParameters.randomnessPower) *
        galaxyParameters.radius;
      if (radius < 30) continue;

      const branchAngle =
        ((globalIdx % galaxyParameters.arms) / galaxyParameters.arms) *
        Math.PI *
        2;
      const spinAngle = radius * galaxyParameters.spin;

      const randomX =
        (Math.random() - 0.5) * galaxyParameters.randomness * radius;
      const randomY =
        (Math.random() - 0.5) * galaxyParameters.randomness * radius * 0.5;
      const randomZ =
        (Math.random() - 0.5) * galaxyParameters.randomness * radius;
      const totalAngle = branchAngle + spinAngle;

      groupPositions[idx] = Math.cos(totalAngle) * radius + randomX;
      groupPositions[idx + 1] = randomY;
      groupPositions[idx + 2] = Math.sin(totalAngle) * radius + randomZ;

      const colorNear = new THREE.Color(0xffffff);
      groupColorsNear[idx] = colorNear.r;
      groupColorsNear[idx + 1] = colorNear.g;
      groupColorsNear[idx + 2] = colorNear.b;

      const colorFar = galaxyParameters.insideColor.clone();
      colorFar.lerp(
        galaxyParameters.outsideColor,
        radius / galaxyParameters.radius
      );
      colorFar.multiplyScalar(0.7 + 0.3 * Math.random());
      groupColorsFar[idx] = colorFar.r;
      groupColorsFar[idx + 1] = colorFar.g;
      groupColorsFar[idx + 2] = colorFar.b;

      validPointCount++;
    }

    if (validPointCount === 0) continue;

    const groupGeometryNear = new THREE.BufferGeometry();
    groupGeometryNear.setAttribute(
      "position",
      new THREE.BufferAttribute(groupPositions.slice(0, validPointCount * 3), 3)
    );
    groupGeometryNear.setAttribute(
      "color",
      new THREE.BufferAttribute(groupColorsNear.slice(0, validPointCount * 3), 3)
    );

    const groupGeometryFar = new THREE.BufferGeometry();
    groupGeometryFar.setAttribute(
      "position",
      new THREE.BufferAttribute(groupPositions.slice(0, validPointCount * 3), 3)
    );
    groupGeometryFar.setAttribute(
      "color",
      new THREE.BufferAttribute(groupColorsFar.slice(0, validPointCount * 3), 3)
    );

    const posAttr = groupGeometryFar.getAttribute("position");
    let cx = 0,
      cy = 0,
      cz = 0;
    for (let i = 0; i < posAttr.count; i++) {
      cx += posAttr.getX(i);
      cy += posAttr.getY(i);
      cz += posAttr.getZ(i);
    }
    cx /= posAttr.count;
    cy /= posAttr.count;
    cz /= posAttr.count;
    groupGeometryNear.translate(-cx, -cy, -cz);
    groupGeometryFar.translate(-cx, -cy, -cz);

    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = heartImages[group];
    img.onload = () => {
      if (isDestroyed) return;
      const neonTexture = createNeonTexture(img, 256);

      const materialNear = new THREE.PointsMaterial({
        size: 1.8,
        map: neonTexture,
        transparent: false,
        alphaTest: 0.2,
        depthWrite: true,
        depthTest: true,
        blending: THREE.NormalBlending,
        vertexColors: true,
      });

      const materialFar = new THREE.PointsMaterial({
        size: 1.8,
        map: neonTexture,
        transparent: true,
        alphaTest: 0.2,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      const pointsObject = new THREE.Points(groupGeometryFar, materialFar);
      pointsObject.position.set(cx, cy, cz);
      pointsObject.userData.materialNear = materialNear;
      pointsObject.userData.geometryNear = groupGeometryNear;
      pointsObject.userData.materialFar = materialFar;
      pointsObject.userData.geometryFar = groupGeometryFar;
      scene.add(pointsObject);
    };
  }

  /* -------------------------------- LIGHTS -------------------------------- */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  /* --------------------------- STAR FIELD -------------------------------- */
  const starCount = 20000;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 900;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 900;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 900;
  }
  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3)
  );

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });
  const starField = new THREE.Points(starGeometry, starMaterial);
  starField.name = "starfield";
  starField.renderOrder = 999;
  scene.add(starField);

  /* ---------------------------- SHOOTING STARS --------------------------- */
  let shootingStars: any[] = [];

  function createRandomCurve() {
    const startPoint = new THREE.Vector3(
      -200 + Math.random() * 100,
      -100 + Math.random() * 200,
      -100 + Math.random() * 200
    );
    const endPoint = new THREE.Vector3(
      600 + Math.random() * 200,
      startPoint.y + (-100 + Math.random() * 200),
      startPoint.z + (-100 + Math.random() * 200)
    );
    const controlPoint1 = new THREE.Vector3(
      startPoint.x + 200 + Math.random() * 100,
      startPoint.y + (-50 + Math.random() * 100),
      startPoint.z + (-50 + Math.random() * 100)
    );
    const controlPoint2 = new THREE.Vector3(
      endPoint.x - 200 + Math.random() * 100,
      endPoint.y + (-50 + Math.random() * 100),
      endPoint.z + (-50 + Math.random() * 100)
    );
    return new THREE.CubicBezierCurve3(
      startPoint,
      controlPoint1,
      controlPoint2,
      endPoint
    );
  }

  function createShootingStar() {
    const trailLength = 100;

    const headGeometry = new THREE.SphereGeometry(2, 32, 32);
    const headMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);

    const glowGeometry = new THREE.SphereGeometry(3, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform float time;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(1.0, 1.0, 1.0, intensity * (0.8 + sin(time * 5.0) * 0.2));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    head.add(glow);

    const curve = createRandomCurve();
    const trailPoints: THREE.Vector3[] = [];
    for (let i = 0; i < trailLength; i++) {
      const progress = i / (trailLength - 1);
      trailPoints.push(curve.getPoint(progress));
    }
    const trailGeometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
    const trailMaterial = new THREE.LineBasicMaterial({
      color: 0x99eaff,
      transparent: true,
      opacity: 0.7,
      linewidth: 2,
    });
    const trail = new THREE.Line(trailGeometry, trailMaterial);

    const shootingStarGroup = new THREE.Group();
    shootingStarGroup.add(head);
    shootingStarGroup.add(trail);
    shootingStarGroup.userData = {
      curve,
      progress: 0,
      speed: 0.001 + Math.random() * 0.001,
      life: 0,
      maxLife: 300,
      head,
      trail,
      trailLength,
      trailPoints,
    };
    scene.add(shootingStarGroup);
    shootingStars.push(shootingStarGroup);
  }

  /* --------------------------- PLANET TEXTURE ---------------------------- */
  function createPlanetTexture(size = 512) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size / 8,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0.0, "#f8bbd0");
    gradient.addColorStop(0.12, "#f48fb1");
    gradient.addColorStop(0.22, "#f06292");
    gradient.addColorStop(0.35, "#ffffff");
    gradient.addColorStop(0.5, "#e1aaff");
    gradient.addColorStop(0.62, "#a259f7");
    gradient.addColorStop(0.75, "#b2ff59");
    gradient.addColorStop(1.0, "#3fd8c7");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const spotColors = [
      "#f8bbd0",
      "#f8bbd0",
      "#f48fb1",
      "#f48fb1",
      "#f06292",
      "#f06292",
      "#ffffff",
      "#e1aaff",
      "#a259f7",
      "#b2ff59",
    ];
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = 30 + Math.random() * 120;
      const color = spotColors[Math.floor(Math.random() * spotColors.length)];
      const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      spotGradient.addColorStop(0, color + "cc");
      spotGradient.addColorStop(1, color + "00");
      ctx.fillStyle = spotGradient;
      ctx.fillRect(0, 0, size, size);
    }

    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * size, Math.random() * size);
      ctx.bezierCurveTo(
        Math.random() * size,
        Math.random() * size,
        Math.random() * size,
        Math.random() * size,
        Math.random() * size,
        Math.random() * size
      );
      ctx.strokeStyle =
        "rgba(180, 120, 200, " + (0.12 + Math.random() * 0.18) + ")";
      ctx.lineWidth = 8 + Math.random() * 18;
      ctx.stroke();
    }

    if (ctx.filter !== undefined) {
      ctx.filter = "blur(2px)";
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = "none";
    }
    return new THREE.CanvasTexture(canvas);
  }

  /* ----------------------------- STORM SHADER ---------------------------- */
  const stormShader = {
    uniforms: {
      time: { value: 0.0 },
      baseTexture: { value: null as THREE.Texture | null },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform sampler2D baseTexture;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        float angle = length(uv - vec2(0.5)) * 3.0;
        float twist = sin(angle * 3.0 + time) * 0.1;
        uv.x += twist * sin(time * 0.5);
        uv.y += twist * cos(time * 0.5);
        vec4 texColor = texture2D(baseTexture, uv);
        float noise = sin(uv.x * 10.0 + time) * sin(uv.y * 10.0 + time) * 0.1;
        texColor.rgb += noise * vec3(0.8, 0.4, 0.2);
        gl_FragColor = texColor;
      }
    `,
  };

  /* ------------------------------- PLANET -------------------------------- */
  const planetRadius = 10;
  const planetGeometry = new THREE.SphereGeometry(planetRadius, 48, 48);
  const planetTexture = createPlanetTexture();
  const planetMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      baseTexture: { value: planetTexture },
    },
    vertexShader: stormShader.vertexShader,
    fragmentShader: stormShader.fragmentShader,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.position.set(0, 0, 0);
  scene.add(planet);

  // BUGFIX: Atmosphere diletakkan TEPAT setelah planet dibuat (bukan di dalam createShootingStar).
  const atmosphereGeometry = new THREE.SphereGeometry(planetRadius * 1.05, 48, 48);
  const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0xe0b3ff) },
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      uniform vec3 glowColor;
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(glowColor, 1.0) * intensity;
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  planet.add(atmosphere);

  /* ----------------------------- TEXT RINGS ------------------------------ */
  const ringTexts = [
    "Galaxy of Love · For Nia",
    "I Love You, Nia",
    "♡ Happy Girlfriend Day ♡",
    ...(window.dataCCD && window.dataCCD.data && window.dataCCD.data.ringTexts
      ? window.dataCCD.data.ringTexts
      : []),
  ];

  function createTextRings() {
    const numRings = ringTexts.length;
    const baseRingRadius = planetRadius * 1.1;
    const ringSpacing = 5;
    window.textRings = [];

    for (let i = 0; i < numRings; i++) {
      const text = ringTexts[i % ringTexts.length] + "   ";
      const ringRadius = baseRingRadius + i * ringSpacing;

      const textureHeight = 150;
      const fontSize = Math.max(130, 0.8 * textureHeight);

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d")!;
      tempCtx.font = `bold ${fontSize}px Arial, sans-serif`;
      const singleText = ringTexts[i % ringTexts.length];
      const separator = "   ";
      const repeatedTextSegment = singleText + separator;
      const segmentWidth = tempCtx.measureText(repeatedTextSegment).width;
      const textureWidthCircumference = 2 * Math.PI * ringRadius * 180;
      const repeatCount = Math.ceil(textureWidthCircumference / segmentWidth);

      let fullText = "";
      for (let j = 0; j < repeatCount; j++) {
        fullText += repeatedTextSegment;
      }
      let finalTextureWidth = segmentWidth * repeatCount;
      if (finalTextureWidth < 1 || !fullText) {
        fullText = repeatedTextSegment;
        finalTextureWidth = segmentWidth;
      }

      const textCanvas = document.createElement("canvas");
      textCanvas.width = Math.ceil(Math.max(1, finalTextureWidth));
      textCanvas.height = textureHeight;
      const ctx = textCanvas.getContext("2d")!;
      ctx.clearRect(0, 0, textCanvas.width, textureHeight);
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      ctx.shadowColor = "#e0b3ff";
      ctx.shadowBlur = 18;
      ctx.lineWidth = 7;
      ctx.strokeStyle = "#fff";
      ctx.strokeText(fullText, 0, textureHeight * 0.82);

      ctx.shadowColor = "#ffb3de";
      ctx.shadowBlur = 24;
      ctx.fillStyle = "#fff";
      ctx.fillText(fullText, 0, textureHeight * 0.84);

      const ringTexture = new THREE.CanvasTexture(textCanvas);
      ringTexture.wrapS = THREE.RepeatWrapping;
      ringTexture.repeat.x = finalTextureWidth / textureWidthCircumference;
      ringTexture.needsUpdate = true;

      const ringGeometry = new THREE.CylinderGeometry(
        ringRadius,
        ringRadius,
        1,
        128,
        1,
        true
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        transparent: true,
        side: THREE.DoubleSide,
        alphaTest: 0.01,
        opacity: 1,
        depthWrite: false,
      });
      const textRingMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      textRingMesh.position.set(0, 0, 0);
      textRingMesh.rotation.y = Math.PI / 2;

      const ringGroup = new THREE.Group();
      ringGroup.add(textRingMesh);
      ringGroup.userData = {
        ringRadius,
        angleOffset: 0.15 * Math.PI * 0.5,
        speed: 0.002 + 0.00025,
        tiltSpeed: 0,
        rollSpeed: 0,
        pitchSpeed: 0,
        tiltAmplitude: Math.PI / 3,
        rollAmplitude: Math.PI / 6,
        pitchAmplitude: Math.PI / 8,
        tiltPhase: Math.PI * 2,
        rollPhase: Math.PI * 2,
        pitchPhase: Math.PI * 2,
        isTextRing: true,
      };

      const initialRotationX = (i / numRings) * Math.PI;
      ringGroup.rotation.x = initialRotationX;
      scene.add(ringGroup);
      window.textRings.push(ringGroup);
    }
  }

  createTextRings();

  function updateTextRingsRotation() {
    if (!window.textRings || !camera) return;
    window.textRings.forEach((ringGroup: any) => {
      ringGroup.children.forEach((child: any) => {
        if (child.userData && child.userData.initialAngle !== undefined) {
          const angle = child.userData.initialAngle + ringGroup.userData.angleOffset;
          const x = Math.cos(angle) * child.userData.ringRadius;
          const z = Math.sin(angle) * child.userData.ringRadius;
          child.position.set(x, 0, z);

          const worldPos = new THREE.Vector3();
          child.getWorldPosition(worldPos);
          const lookAtVector = new THREE.Vector3()
            .subVectors(camera.position, worldPos)
            .normalize();
          const rotationY = Math.atan2(lookAtVector.x, lookAtVector.z);
          child.rotation.y = rotationY;
        }
      });
    });
  }

  function animatePlanetSystem() {
    if (!window.textRings) return;
    const time = Date.now() * 0.001;
    window.textRings.forEach((ringGroup: any, index: number) => {
      const userData = ringGroup.userData;
      userData.angleOffset += userData.speed;

      const tilt =
        Math.sin(time * userData.tiltSpeed + userData.tiltPhase) *
        userData.tiltAmplitude;
      const roll =
        Math.cos(time * userData.rollSpeed + userData.rollPhase) *
        userData.rollAmplitude;
      const pitch =
        Math.sin(time * userData.pitchSpeed + userData.pitchPhase) *
        userData.pitchAmplitude;

      ringGroup.rotation.x =
        (index / window.textRings.length) * Math.PI + tilt;
      ringGroup.rotation.z = roll;
      ringGroup.rotation.y = userData.angleOffset + pitch;

      const verticalBob =
        Math.sin(time * (userData.tiltSpeed * 0.7) + userData.tiltPhase) * 0.3;
      ringGroup.position.y = verticalBob;

      const pulse = (Math.sin(time * 1.5 + index) + 1) / 2;
      const textMesh = ringGroup.children[0];
      if (textMesh && textMesh.material) {
        textMesh.material.opacity = 0.7 + pulse * 0.3;
      }
    });
    updateTextRingsRotation();
  }

  /* --------------------------- HINT ICON & TEXT -------------------------- */
  let hintIcon: THREE.Group | null = null;
  let hintText: THREE.Mesh | null = null;

  function createHintIcon() {
    hintIcon = new THREE.Group();
    hintIcon.name = "hint-icon-group";
    scene.add(hintIcon);

    const cursorVisuals = new THREE.Group();
    const cursorShape = new THREE.Shape();
    const h = 1.5;
    const w = h * 0.5;
    cursorShape.moveTo(0, 0);
    cursorShape.lineTo(-w * 0.4, -h * 0.7);
    cursorShape.lineTo(-w * 0.25, -h * 0.7);
    cursorShape.lineTo(-w * 0.5, -h);
    cursorShape.lineTo(w * 0.5, -h);
    cursorShape.lineTo(w * 0.25, -h * 0.7);
    cursorShape.lineTo(w * 0.4, -h * 0.7);
    cursorShape.closePath();

    const backgroundGeometry = new THREE.ShapeGeometry(cursorShape);
    const backgroundMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);

    const foregroundGeometry = new THREE.ShapeGeometry(cursorShape);
    const foregroundMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const foregroundMesh = new THREE.Mesh(foregroundGeometry, foregroundMaterial);
    foregroundMesh.scale.set(0.8, 0.8, 1);
    foregroundMesh.position.z = 0.01;

    cursorVisuals.add(backgroundMesh, foregroundMesh);
    cursorVisuals.position.y = h / 2;
    cursorVisuals.rotation.x = Math.PI / 2;

    const ringGeometry = new THREE.RingGeometry(1.8, 2.0, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    hintIcon.userData.ringMesh = ringMesh;

    hintIcon.add(cursorVisuals);
    hintIcon.add(ringMesh);

    hintIcon.position.set(1.5, 1.5, 15);
    hintIcon.scale.set(0.8, 0.8, 0.8);
    hintIcon.lookAt(planet.position);
    hintIcon.userData.initialPosition = hintIcon.position.clone();
  }

  function animateHintIcon(time: number) {
    if (!hintIcon) return;
    if (!introStarted) {
      hintIcon.visible = true;
      const tapFrequency = 2.5;
      const tapAmplitude = 1.5;
      const tapOffset = Math.sin(time * tapFrequency) * tapAmplitude;

      const direction = new THREE.Vector3();
      hintIcon.getWorldDirection(direction);
      hintIcon.position
        .copy(hintIcon.userData.initialPosition)
        .addScaledVector(direction, -tapOffset);

      const ring = hintIcon.userData.ringMesh;
      const ringScale = 1 + Math.sin(time * tapFrequency) * 0.1;
      ring.scale.set(ringScale, ringScale, 1);
      ring.material.opacity = 0.5 + Math.sin(time * tapFrequency) * 0.2;

      if (hintText) {
        hintText.visible = true;
        hintText.material.opacity = 0.7 + Math.sin(time * 3) * 0.3;
        hintText.position.y = 15 + Math.sin(time * 2) * 0.5;
        hintText.lookAt(camera.position);
      }
    } else {
      hintIcon.visible = false;
      if (hintText) hintText.visible = false;
    }
  }

  function createHintText() {
    const canvasSize = 512;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = canvasSize;
    const context = canvas.getContext("2d")!;
    const fontSize = 50;
    const text = "For You, Nia ♡";
    context.font = `bold ${fontSize}px Arial, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowColor = "#ffb3de";
    context.shadowBlur = 5;
    context.lineWidth = 2;
    context.strokeStyle = "rgba(255, 200, 220, 0.8)";
    context.strokeText(text, canvasSize / 2, canvasSize / 2);
    context.shadowColor = "#e0b3ff";
    context.shadowBlur = 5;
    context.lineWidth = 2;
    context.strokeStyle = "rgba(220, 180, 255, 0.5)";
    context.strokeText(text, canvasSize / 2, canvasSize / 2);
    context.shadowColor = "transparent";
    context.shadowBlur = 0;
    context.fillStyle = "white";
    context.fillText(text, canvasSize / 2, canvasSize / 2);
    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.needsUpdate = true;
    const textMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const planeGeometry = new THREE.PlaneGeometry(16, 8);
    hintText = new THREE.Mesh(planeGeometry, textMaterial);
    hintText.position.set(0, 15, 0);
    scene.add(hintText);
  }

  /* --------------------------- INTRO STATE -------------------------------- */
  let fadeOpacity = 0.1;
  let fadeInProgress = false;
  let introStarted = false;

  /* ----------------- reduce starfield visibility before intro -------------- */
  const originalStarCount = starGeometry.getAttribute("position").count;
  starField.geometry.setDrawRange(0, Math.floor(originalStarCount * 0.1));

  /* ------------------------------- ANIMATE -------------------------------- */
  function animate() {
    animFrameId = requestAnimationFrame(animate);
    const time = performance.now() * 0.001;

    animateHintIcon(time);
    controls.update();
    planet.material.uniforms.time.value = time * 0.5;

    if (fadeInProgress && fadeOpacity < 1) {
      fadeOpacity += 0.025;
      if (fadeOpacity > 1) fadeOpacity = 1;
    }

    if (!introStarted) {
      fadeOpacity = 0.1;
      scene.traverse((obj: any) => {
        if (!obj) return;
        if (obj.name === "starfield") {
          if (obj.material && obj.material.opacity !== undefined) {
            obj.material.transparent = false;
            obj.material.opacity = 1;
          }
          return;
        }
        const isTextRing =
          obj.userData?.isTextRing ||
          (obj.parent && obj.parent.userData && obj.parent.userData.isTextRing);
        if (isTextRing) {
          if (obj.material && obj.material.opacity !== undefined) {
            obj.material.transparent = false;
            obj.material.opacity = 1;
          }
          if (obj.material && obj.material.color) {
            obj.material.color.set(0xffffff);
          }
        } else if (
          obj !== planet &&
          obj !== centralGlow &&
          obj !== hintIcon &&
          obj.type !== "Scene" &&
          obj.parent &&
          !obj.parent.isGroup
        ) {
          if (obj.material && obj.material.opacity !== undefined) {
            obj.material.transparent = true;
            obj.material.opacity = 0.1;
          }
        }
      });
      planet.visible = true;
      centralGlow.visible = true;
    } else {
      scene.traverse((obj: any) => {
        if (!obj) return;
        const isTextRing =
          obj.userData?.isTextRing ||
          (obj.parent && obj.parent.userData && obj.parent.userData.isTextRing) ||
          obj === planet ||
          obj === centralGlow ||
          obj.type === "Scene";
        if (!isTextRing) {
          if (obj.material && obj.material.opacity !== undefined) {
            obj.material.transparent = true;
            obj.material.opacity = fadeOpacity;
          }
        } else {
          if (obj.material && obj.material.opacity !== undefined) {
            obj.material.opacity = 1;
            obj.material.transparent = false;
          }
        }
        if (obj.material && obj.material.color) {
          obj.material.color.set(0xffffff);
        }
      });
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const star = shootingStars[i];
      star.userData.life++;
      let opacity = 1.0;
      if (star.userData.life < 30) {
        opacity = star.userData.life / 30;
      } else if (star.userData.life > star.userData.maxLife - 30) {
        opacity = (star.userData.maxLife - star.userData.life) / 30;
      }
      star.userData.progress += star.userData.speed;
      if (star.userData.progress > 1) {
        scene.remove(star);
        shootingStars.splice(i, 1);
        continue;
      }
      const currentPos = star.userData.curve.getPoint(star.userData.progress);
      star.position.copy(currentPos);
      star.userData.head.material.opacity = opacity;
      star.userData.head.children[0].material.uniforms.time.value = time;

      const trail = star.userData.trail;
      const trailPoints = star.userData.trailPoints;
      trailPoints[0].copy(currentPos);
      for (let j = 1; j < star.userData.trailLength; j++) {
        const trailProgress = Math.max(
          0,
          star.userData.progress - j * 0.01
        );
        trailPoints[j].copy(star.userData.curve.getPoint(trailProgress));
      }
      trail.geometry.setFromPoints(trailPoints);
      trail.material.opacity = opacity * 0.7;
    }

    if (shootingStars.length < 3 && Math.random() < 0.02) {
      createShootingStar();
    }

    scene.traverse((obj: any) => {
      if (!obj) return;
      if (obj.isPoints && obj.userData.materialNear && obj.userData.materialFar) {
        const positionAttr = obj.geometry.getAttribute("position");
        let isClose = false;
        for (let i = 0; i < positionAttr.count; i++) {
          const worldX = positionAttr.getX(i) + obj.position.x;
          const worldY = positionAttr.getY(i) + obj.position.y;
          const worldZ = positionAttr.getZ(i) + obj.position.z;
          const distance = camera.position.distanceTo(
            new THREE.Vector3(worldX, worldY, worldZ)
          );
          if (distance < 10) {
            isClose = true;
            break;
          }
        }
        if (isClose) {
          if (obj.material !== obj.userData.materialNear) {
            obj.material = obj.userData.materialNear;
            obj.geometry = obj.userData.geometryNear;
          }
        } else {
          if (obj.material !== obj.userData.materialFar) {
            obj.material = obj.userData.materialFar;
            obj.geometry = obj.userData.geometryFar;
          }
        }
      }
    });

    planet.lookAt(camera.position);
    animatePlanetSystem();

    if (starField && starField.material && starField.material.opacity !== undefined) {
      starField.material.opacity = 1.0;
      starField.material.transparent = false;
    }

    renderer.render(scene, camera);
  }

  createShootingStar();
  createHintIcon();
  createHintText();
  animate();

  /* ----------------------------- RESIZE ---------------------------------- */
  const handleResize = () => {
    if (isDestroyed) return;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    if (w === 0 || h === 0) return; // skip if container not yet laid out
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    controls.target.set(0, 0, 0);
    controls.update();
  };
  resizeHandler = handleResize;
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", () => setTimeout(handleResize, 200));

  // ResizeObserver catches layout changes that window resize doesn't fire on
  // (e.g. when a sibling section appears/disappears, or fullscreen toggle).
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
  }

  // Mobile browsers show/hide URL bar → visualViewport fires resize reliably
  if (window.visualViewport) {
    visualViewportHandler = () => handleResize();
    window.visualViewport.addEventListener("resize", visualViewportHandler);
  }

  /* --------------------------- FULLSCREEN CAM --------------------------- */
  function startCameraAnimation() {
    const startPos = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    const midPos1 = { x: startPos.x, y: 0, z: startPos.z };
    const midPos2 = { x: startPos.x, y: 0, z: 160 };
    const endPos = { x: -40, y: 100, z: 100 };

    const duration1 = 0.2;
    const duration2 = 0.55;
    const duration3 = 0.4;
    let progress = 0;

    function animatePath() {
      cameraAnimFrameId = requestAnimationFrame(animatePath);
      progress += 0.0025;
      let newPos;
      if (progress < duration1) {
        const t = progress / duration1;
        newPos = {
          x: startPos.x + (midPos1.x - startPos.x) * t,
          y: startPos.y + (midPos1.y - startPos.y) * t,
          z: startPos.z + (midPos1.z - startPos.z) * t,
        };
      } else if (progress < duration1 + duration2) {
        const t = (progress - duration1) / duration2;
        newPos = {
          x: midPos1.x + (midPos2.x - midPos1.x) * t,
          y: midPos1.y + (midPos2.y - midPos1.y) * t,
          z: midPos1.z + (midPos2.z - midPos1.z) * t,
        };
      } else if (progress < duration1 + duration2 + duration3) {
        const t = (progress - duration1 - duration2) / duration3;
        const easedT = 0.5 - 0.5 * Math.cos(Math.PI * t);
        newPos = {
          x: midPos2.x + (endPos.x - midPos2.x) * easedT,
          y: midPos2.y + (endPos.y - midPos2.y) * easedT,
          z: midPos2.z + (endPos.z - midPos2.z) * easedT,
        };
      } else {
        camera.position.set(endPos.x, endPos.y, endPos.z);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();
        controls.enabled = true;
        cameraAnimFrameId = null;
        return;
      }
      camera.position.set(newPos.x, newPos.y, newPos.z);
      camera.lookAt(0, 0, 0);
    }
    controls.enabled = false;
    animatePath();
  }

  /* ----------------------------- INTERACTION ---------------------------- */
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function requestFullScreen() {
    const elem = document.documentElement as any;
    try {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    } catch {
      /* ignore */
    }
  }

  function onCanvasClick(event: any) {
    if (introStarted) return;
    const rect = renderer.domElement.getBoundingClientRect();
    const clientX =
      event.clientX !== undefined
        ? event.clientX
        : event.changedTouches && event.changedTouches[0]
        ? event.changedTouches[0].clientX
        : event.touches && event.touches[0]
        ? event.touches[0].clientX
        : 0;
    const clientY =
      event.clientY !== undefined
        ? event.clientY
        : event.changedTouches && event.changedTouches[0]
        ? event.changedTouches[0].clientY
        : event.touches && event.touches[0]
        ? event.touches[0].clientY
        : 0;
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(planet);
    if (intersects.length > 0) {
      requestFullScreen();
      introStarted = true;
      fadeInProgress = true;
      document.body.classList.add("intro-started");
      handlers.onStarted?.();
      startCameraAnimation();

      if (starField && starField.geometry) {
        starField.geometry.setDrawRange(0, originalStarCount);
      }
    }
  }
  clickHandler = onCanvasClick;
  touchHandler = onCanvasClick;
  renderer.domElement.addEventListener("click", onCanvasClick);

  /* ----------------- TOUCH TAP DETECTION (mobile-friendly) -------------- *
   *  On mobile, "touchend" fires for BOTH taps and drag-end. To prevent
   *  drag-to-rotate-galaxy from accidentally triggering the intro click,
   *  we track touch start position and only fire onCanvasClick when the
   *  finger barely moved (< 10px). Otherwise the touch is treated as a drag.
   */
  let touchStartPos: { x: number; y: number } | null = null;
  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else {
      touchStartPos = null;
    }
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (introStarted || !touchStartPos) {
      touchStartPos = null;
      return;
    }
    const touch = e.changedTouches[0];
    if (!touch) {
      touchStartPos = null;
      return;
    }
    const dx = touch.clientX - touchStartPos.x;
    const dy = touch.clientY - touchStartPos.y;
    // Treat as tap if movement < 10px
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      onCanvasClick({
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
    }
    touchStartPos = null;
  };
  tapStartHandler = onTouchStart;
  tapEndHandler = onTouchEnd;
  renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: true });
  renderer.domElement.addEventListener("touchend", onTouchEnd, { passive: true });

  /* ------------------------ TOUCH BEHAVIOR (SCOPE) ---------------------- *
   *  Only block gesturestart (Safari pinch-zoom) & touchmove on the canvas
   *  container itself (NOT the whole document — that would block scrolling
   *  of the page above/below the galaxy section, and also intercept clicks).
   *  touch-action: none in CSS already handles the gesture suppression for
   *  the canvas, so JS preventDefault here is just a backup for Safari.
   */
  const preventGesture = (event: Event) => event.preventDefault();
  preventGestureHandler = preventGesture;
  container.addEventListener("gesturestart", preventGesture, { passive: false });
  container.addEventListener("gesturechange", preventGesture, { passive: false });
  container.addEventListener("gestureend", preventGesture, { passive: false });

  /* ------------------------- RETURN PUBLIC API -------------------------- */
  return {
    destroy: () => {
      isDestroyed = true;
      if (animFrameId !== null) cancelAnimationFrame(animFrameId);
      if (cameraAnimFrameId !== null) cancelAnimationFrame(cameraAnimFrameId);

      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
      }
      if (clickHandler) {
        renderer.domElement.removeEventListener("click", clickHandler);
      }
      if (touchHandler) {
        renderer.domElement.removeEventListener("touchend", touchHandler);
      }
      if (tapStartHandler) {
        renderer.domElement.removeEventListener("touchstart", tapStartHandler);
      }
      if (tapEndHandler) {
        renderer.domElement.removeEventListener("touchend", tapEndHandler);
      }
      if (preventGestureHandler) {
        container.removeEventListener("gesturestart", preventGestureHandler);
        container.removeEventListener("gesturechange", preventGestureHandler);
        container.removeEventListener("gestureend", preventGestureHandler);
      }
      if (resizeObserver) {
        try {
          resizeObserver.disconnect();
        } catch {
          /* ignore */
        }
        resizeObserver = null;
      }
      if (visualViewportHandler && window.visualViewport) {
        window.visualViewport.removeEventListener("resize", visualViewportHandler);
      }

      try {
        if (scene) {
          scene.traverse((obj: any) => {
            if (obj.geometry) obj.geometry.dispose?.();
            if (obj.material) {
              if (Array.isArray(obj.material)) {
                obj.material.forEach((m) => m.dispose?.());
              } else {
                obj.material.dispose?.();
              }
            }
          });
        }
        if (renderer) {
          renderer.dispose();
          try {
            renderer.forceContextLoss();
          } catch {
            /* ignore */
          }
          if (renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        }
        if (controls && controls.dispose) {
          controls.dispose();
        }
      } catch (e) {
        console.warn("Galaxy cleanup:", e);
      }
    },
    resetCamera: () => {
      camera.position.set(0, 20, 30);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      controls.enabled = false;
      // Re-enable autoRotate for the next intro cycle
      controls.autoRotate = true;
      controls.update();
      introStarted = false;
      fadeInProgress = false;
      if (starField && starField.geometry) {
        starField.geometry.setDrawRange(0, Math.floor(originalStarCount * 0.1));
      }
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                          REACT COMPONENT WRAPPER                           */
/* -------------------------------------------------------------------------- */

export const GalaxyLoveSection: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const galaxyInstanceRef = useRef<{
    destroy: () => void;
    resetCamera: () => void;
  } | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    container.innerHTML = "";

    try {
      const instance = initGalaxy(container, {
        onStarted: () => setHasStarted(true),
      });
      galaxyInstanceRef.current = instance;
    } catch (err) {
      console.warn("Galaxy init error:", err);
    }

    return () => {
      if (galaxyInstanceRef.current) {
        galaxyInstanceRef.current.destroy();
        galaxyInstanceRef.current = null;
      }
    };
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 150);
  }, []);

  const handleResetCamera = useCallback(() => {
    galaxyInstanceRef.current?.resetCamera();
    setHasStarted(false);
  }, []);

  return (
    <section
      id="galaksi-cinta"
      className={`galaxy-section relative transition-all duration-500 overflow-hidden ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-black flex flex-col p-0 m-0 w-screen h-screen"
          : "w-full bg-slate-950 py-4 sm:py-8 px-2 sm:px-4"
      }`}
    >
      {/* Section Heading */}
      {!isFullscreen && (
        <div className="text-center mb-4 sm:mb-6 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-300 text-xs sm:text-sm font-medium tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Galaksi Cinta 3D Interaktif
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white tracking-tight mb-2">
            Sentuh{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-sky-400">
              Planetnya
            </span>{" "}
            untuk Memulai
          </h2>
          <p className="font-body text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Sebuah perjalanan kosmik yang kubuat khusus untukmu. Setiap bintang
            yang berkilau di sini adalah momen yang ingin kubagikan denganmu.
          </p>
        </div>
      )}

      <div
        className={`galaxy-canvas-wrapper relative mx-auto w-full transition-all duration-300 ${
          isFullscreen
            ? "w-full h-full flex-1"
            : "max-w-6xl aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] h-auto min-h-[360px] sm:min-h-[460px] md:min-h-[520px] rounded-2xl sm:rounded-3xl border border-blue-500/20 shadow-2xl shadow-blue-950/60 overflow-hidden bg-black"
        }`}
      >
        <div
          id="galaxy-container"
          ref={mountRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing galaxy-canvas"
        />

        {/* Loading Hint - before intro starts */}
        {!hasStarted && (
          <div className="galaxy-intro-overlay absolute inset-0 z-10 pointer-events-none flex items-end justify-center pb-6 sm:pb-12 px-4">
            <div className="text-center px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 max-w-[90%]">
              <p className="text-white text-sm sm:text-base font-medium tracking-wide">
                Sentuh planetnya untuk memulai perjalanan ✨
              </p>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Bisa drag untuk memutar galaksi setelah mulai
              </p>
            </div>
          </div>
        )}

        {/* Minimal Control Buttons Overlay */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
          {hasStarted && (
            <button
              onClick={handleResetCamera}
              title="Reset Posisi Planet"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-xs hover:bg-slate-800 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Reset Planet</span>
            </button>
          )}

          <button
            onClick={handleToggleFullscreen}
            title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-xs hover:bg-slate-800 transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-pink-400" />
            ) : (
              <Maximize2 className="w-4 h-4 text-sky-400" />
            )}
          </button>
        </div>

        {/* Author attribution from original code */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 pointer-events-none">
          <span className="text-[10px] sm:text-[11px] text-slate-400 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10 font-mono">
            Create by Saputra
          </span>
        </div>
      </div>
    </section>
  );
};

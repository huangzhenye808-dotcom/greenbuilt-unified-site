"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Scenario = {
  id: string;
  label: string;
  name: string;
  location: string;
  description: string;
  crack: number;
  moisture: number;
  temp: number;
};

type VersionMode = "new" | "legacy";

const scenarios: Scenario[] = [
  {
    id: "basement",
    label: "竹科地下壁",
    name: "深基坑連續壁",
    location: "新竹科學園區",
    description:
      "地下水位高、側向應力大，常見 0.6mm 剪力收縮縫；模型以放大倍率呈現真實細裂縫路徑。",
    crack: 0.6,
    moisture: 90,
    temp: 24,
  },
  {
    id: "harbor",
    label: "台中防波堤",
    name: "碼頭防波堤",
    location: "台中港",
    description:
      "潮汐與氯離子侵蝕造成 0.4mm 微裂縫，含水率充足，碳酸鈣晶體會先沿裂縫壁成核。",
    crack: 0.4,
    moisture: 100,
    temp: 28,
  },
  {
    id: "tunnel",
    label: "軌道隧道",
    name: "鐵道隧道頂拱",
    location: "Utrecht, NL",
    description:
      "高震動與低溫環境下的 0.85mm 穿透裂隙，反應較慢，但仍能沿主裂縫形成填補帶。",
    crack: 0.85,
    moisture: 75,
    temp: 14,
  },
];

const newSteps = [
  "混凝土收縮或載重形成細裂縫",
  "水分沿分岔孔隙進入裂縫壁",
  "包埋菌體與孢子在含水區活化",
  "Ca2+ 與 CO3^2- 沉澱為 CaCO3",
  "CaCO3 / limestone 堆積並封堵滲漏",
];

const legacySteps = [
  "正常混凝土基質與骨材",
  "連續細裂縫形成並產生分岔",
  "水與氧氣沿微通道進入",
  "CaCO3 晶體沿裂縫壁成核生長",
  "晶體堆疊，裂縫逐漸封閉",
];

const evidenceCards = [
  {
    label: "PMC 2025 FEM",
    title: "微結構與反應-擴散",
    body:
      "論文把 Micro-CT 裂縫/孔隙幾何、Ca2+ / CO3^2- 擴散與 CaCO3 沉澱耦合；本頁因此把裂縫改為連續、彎曲、分岔的傳輸路徑。",
    href: "https://www.nature.com/articles/s41598-025-99844-6",
  },
  {
    label: "Basilisk",
    title: "工程化自癒流程",
    body:
      "Basilisk 將流程描述為混凝土開裂、漏水/鋼筋腐蝕風險、遇水後微生物產生 limestone、最後封閉裂縫；本頁的 5 步驟依此重排。",
    href: "https://basiliskconcrete.com/en/",
  },
  {
    label: "Model boundary",
    title: "1 mm 顯示邊界",
    body:
      "來源都指向微裂縫尺度最有效：狹縫癒合效率高，接近或超過 1 mm 時需視為工程補強或修復砂漿情境，而非保證完全自癒。",
    href: "https://basiliskconcrete.com/en/",
  },
];

const calibrationRows = [
  {
    term: "術語",
    before: "原頁面只寫 MICP / CaCO3，沒有交代文獻中的 MICCP 說法。",
    after:
      "保留常用 MICP 名稱，並補註 PMC 文章使用 MICCP（microbially induced calcium carbonate precipitation）描述微生物誘導碳酸鈣沉澱。",
  },
  {
    term: "反應式",
    before: "原頁面以晶體數量和癒合率表示反應，化學機理偏隱含。",
    after:
      "新增尿素路徑示意與反應-擴散式：C 的擴散、R(C) 沉澱項，以及 Ca2+ + CO3^2- -> CaCO3(s) 的封縫結果。",
  },
  {
    term: "菌株",
    before: "原頁面用綠色粒子表示微生物，但容易被看成一般螢光效果。",
    after:
      "改成包埋菌體膠囊 + 活化孢子兩層表現；文字避免指定 Basilisk 未公開的商業菌株，只標示 ureolytic / non-ureolytic bacteria 語境。",
  },
  {
    term: "應用場景",
    before: "原頁面列出台灣場域，但沒有對應到漏水、防水、鋼筋腐蝕與維護成本。",
    after:
      "補強地下壁、港灣、防水結構與既有裂縫修復的語境，將 Basilisk 的新建添加劑/既有修復產品思路納入說明。",
  },
];

function computeModel(crack: number, moisture: number, temp: number, day: number, version: VersionMode) {
  const environment =
    version === "legacy"
      ? moisture < 20
        ? 0
        : Math.round((moisture / 100) * (temp > 15 && temp < 38 ? 98 : 65))
      : Math.round(
          (moisture < 30 ? (moisture / 100) * 0.7 : moisture / 100) *
            THREE.MathUtils.clamp(1 - Math.abs(temp - 30) / 45, 0.25, 1) *
            100,
        );
  const insideLimit = crack <= 1;
  const healing = Math.min(
    100,
    Math.round(day * (environment / 100) * (insideLimit ? 7.5 : 2.5) * (1.2 - crack * 0.4)),
  );
  const load = Math.round(60 + healing * 0.39);
  const leak = Math.round(Math.max(0, 100 - healing * 1.2) * (moisture / 100));
  const density = Math.round(healing * (insideLimit ? 8.3 : 4.1));
  const activeStep =
    version === "legacy"
      ? healing > 82
        ? 4
        : healing > 45
          ? 3
          : day > 0
            ? 2
            : 1
      : healing > 82
        ? 4
        : healing > 45
          ? 3
          : day > 0
            ? 2
            : crack > 0.25
              ? 1
              : 0;

  return { environment, healing, load, leak, density, activeStep, insideLimit };
}

type SceneProps = {
  version: VersionMode;
  crack: number;
  moisture: number;
  temp: number;
  day: number;
  healing: number;
  leak: number;
  showFlow: boolean;
  sectionCut: boolean;
};

type TubeNode = {
  mesh: THREE.Mesh<THREE.TubeGeometry, THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial>;
  curve: THREE.CatmullRomCurve3;
  factor: number;
  segments: number;
};

type PathChoice = {
  curve: THREE.CatmullRomCurve3;
  share: number;
};

type CrystalNode = {
  mesh: THREE.Mesh;
  curve: THREE.CatmullRomCurve3;
  t: number;
  edge: number;
  size: number;
  phase: number;
  threshold: number;
};

type FlowNode = {
  mesh: THREE.Mesh;
  curve: THREE.CatmullRomCurve3;
  t: number;
  speed: number;
  phase: number;
};

type SporeNode = {
  mesh: THREE.Mesh;
  curve: THREE.CatmullRomCurve3;
  t: number;
  edge: number;
  phase: number;
};

const FRONT_Z = 0.392;

function seeded(index: number) {
  const x = Math.sin(index * 97.13) * 10000;
  return x - Math.floor(x);
}

function v(x: number, y: number, z = FRONT_Z) {
  return new THREE.Vector3(x, y, z);
}

function makeCurve(points: THREE.Vector3[]) {
  return new THREE.CatmullRomCurve3(points, false, "centripetal", 0.5);
}

function curveNormal(curve: THREE.CatmullRomCurve3, t: number) {
  const tangent = curve.getTangent(THREE.MathUtils.clamp(t, 0.001, 0.999));
  return new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
}

function offsetPoints(points: THREE.Vector3[], amount: number) {
  return points.map((point, index) => {
    const prev = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    const tangent = next.clone().sub(prev).normalize();
    const normal = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
    return point.clone().addScaledVector(normal, amount);
  });
}

function pickPath(paths: PathChoice[], value: number) {
  let remaining = value;

  for (const path of paths) {
    if (remaining <= path.share) {
      return path.curve;
    }
    remaining -= path.share;
  }

  return paths[0].curve;
}

function createConcreteTexture(seedOffset: number, bumpOnly = false) {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D context unavailable");
  }

  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      const grain =
        seeded(seedOffset + x * 0.71 + y * 1.93) * 38 +
        seeded(seedOffset + x * 0.13 + y * 0.23) * 18;
      const wave = Math.sin(x * 0.05 + seedOffset) * 5 + Math.cos(y * 0.041) * 5;
      const tone = THREE.MathUtils.clamp(108 + grain + wave, 68, 178);
      image.data[i] = bumpOnly ? tone : tone + 10;
      image.data[i + 1] = bumpOnly ? tone : tone + 14;
      image.data[i + 2] = bumpOnly ? tone : tone + 9;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);

  for (let i = 0; i < 90; i += 1) {
    const x = seeded(seedOffset + i * 11) * size;
    const y = seeded(seedOffset + i * 17) * size;
    const rx = 3 + seeded(seedOffset + i * 23) * 14;
    const ry = 2 + seeded(seedOffset + i * 31) * 10;
    const shade = bumpOnly
      ? 96 + seeded(seedOffset + i * 41) * 80
      : 88 + seeded(seedOffset + i * 43) * 86;
    ctx.fillStyle = bumpOnly
      ? `rgb(${shade}, ${shade}, ${shade})`
      : `rgb(${shade + 8}, ${shade + 10}, ${shade + 6})`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, seeded(seedOffset + i * 47) * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 260; i += 1) {
    const x = seeded(seedOffset + i * 53) * size;
    const y = seeded(seedOffset + i * 59) * size;
    const r = 0.6 + seeded(seedOffset + i * 61) * 1.7;
    const alpha = bumpOnly ? 0.45 : 0.28;
    ctx.fillStyle = `rgba(24, 26, 24, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function MicpThreeViewport({
  version,
  crack,
  moisture,
  temp,
  day,
  healing,
  leak,
  showFlow,
  sectionCut,
}: SceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const propsRef = useRef<SceneProps>({
    version,
    crack,
    moisture,
    temp,
    day,
    healing,
    leak,
    showFlow,
    sectionCut,
  });

  useEffect(() => {
    propsRef.current = { version, crack, moisture, temp, day, healing, leak, showFlow, sectionCut };
  }, [version, crack, moisture, temp, day, healing, leak, showFlow, sectionCut]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b0d0c, 9, 16);

    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 100);
    camera.position.set(2.9, 1.75, 6.4);
    camera.lookAt(0, 0.02, 0.05);

    const rig = new THREE.Group();
    rig.rotation.x = -0.08;
    rig.rotation.y = -0.2;
    scene.add(rig);

    const ambient = new THREE.HemisphereLight(0xf4fff7, 0x1d201b, 2.25);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 3.8);
    key.position.set(2.2, 5.2, 4.2);
    key.castShadow = true;
    scene.add(key);

    const rim = new THREE.PointLight(0x4fd0c5, 24, 10);
    rim.position.set(-2.9, 1.15, 2.9);
    scene.add(rim);

    const concreteTexture = createConcreteTexture(10);
    const concreteBump = createConcreteTexture(400, true);
    const concreteMaterial = new THREE.MeshStandardMaterial({
      color: 0xb5bab1,
      map: concreteTexture,
      bumpMap: concreteBump,
      bumpScale: 0.045,
      roughness: 0.95,
      metalness: 0.02,
    });
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: 0x737970,
      map: concreteTexture,
      bumpMap: concreteBump,
      bumpScale: 0.035,
      roughness: 0.96,
    });
    const crackMaterial = new THREE.MeshStandardMaterial({
      color: 0x111411,
      roughness: 1,
      transparent: true,
      opacity: 0.86,
      depthWrite: false,
    });
    const lipMaterial = new THREE.MeshStandardMaterial({
      color: 0x6f756c,
      roughness: 0.98,
      transparent: true,
      opacity: 0.72,
    });
    const calciteSealMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf3f1dc,
      emissive: 0x4d866a,
      emissiveIntensity: 0.05,
      roughness: 0.38,
      transparent: true,
      opacity: 0,
    });
    const crystalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf7f4dd,
      emissive: 0x5cbf89,
      emissiveIntensity: 0.14,
      roughness: 0.28,
      transparent: true,
      opacity: 0.95,
    });
    const waterMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x62cde6,
      emissive: 0x108097,
      emissiveIntensity: 0.32,
      transparent: true,
      opacity: 0.42,
      roughness: 0.08,
      metalness: 0,
    });
    const sporeMaterial = new THREE.MeshStandardMaterial({
      color: 0x50d076,
      emissive: 0x15914e,
      emissiveIntensity: 0.65,
      roughness: 0.38,
    });
    const capsuleMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x82d9a8,
      emissive: 0x174f3d,
      emissiveIntensity: 0.18,
      transparent: true,
      opacity: 0.58,
      roughness: 0.34,
      metalness: 0,
    });
    const aggregateMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x8d9289, roughness: 0.92 }),
      new THREE.MeshStandardMaterial({ color: 0x6f756c, roughness: 0.94 }),
      new THREE.MeshStandardMaterial({ color: 0xa39b8c, roughness: 0.88 }),
      new THREE.MeshStandardMaterial({ color: 0x5d655d, roughness: 0.96 }),
    ];
    const warningMaterial = new THREE.MeshStandardMaterial({
      color: 0xda8b4d,
      emissive: 0x7a3518,
      emissiveIntensity: 0.28,
      roughness: 0.65,
      transparent: true,
      opacity: 0.92,
    });

    const slabMaterials = [
      sideMaterial,
      sideMaterial,
      sideMaterial,
      sideMaterial,
      concreteMaterial,
      sideMaterial,
    ];
    const slab = new THREE.Mesh(new THREE.BoxGeometry(5.4, 2.45, 0.76, 32, 16, 3), slabMaterials);
    slab.castShadow = true;
    slab.receiveShadow = true;
    rig.add(slab);

    const mainPoints = [
      v(-1.85, 0.92),
      v(-1.48, 0.67),
      v(-1.59, 0.4),
      v(-1.1, 0.2),
      v(-0.82, -0.02),
      v(-0.32, -0.1),
      v(0.1, -0.32),
      v(0.52, -0.27),
      v(0.86, -0.55),
      v(1.28, -0.74),
      v(1.62, -0.98),
    ];
    const branchPointSets = [
      [v(-1.12, 0.21), v(-1.33, 0.02), v(-1.52, -0.26), v(-1.74, -0.4)],
      [v(-0.26, -0.12), v(-0.1, 0.12), v(0.1, 0.32), v(0.22, 0.58)],
      [v(0.67, -0.41), v(0.95, -0.2), v(1.27, -0.12)],
      [v(0.96, -0.64), v(0.78, -0.86), v(0.42, -1.04)],
    ];
    const mainCurve = makeCurve(mainPoints);
    const branchCurves = branchPointSets.map((points) => makeCurve(points));
    const edgeCurves = [
      makeCurve(offsetPoints(mainPoints, 0.032)),
      makeCurve(offsetPoints(mainPoints, -0.032)),
      ...branchPointSets.flatMap((points) => [
        makeCurve(offsetPoints(points, 0.018)),
        makeCurve(offsetPoints(points, -0.018)),
      ]),
    ];
    const allPaths: PathChoice[] = [
      { curve: mainCurve, share: 0.58 },
      ...branchCurves.map((curve) => ({ curve, share: 0.105 })),
    ];

    const tubeNodes: TubeNode[] = [];
    const makeTube = (
      curve: THREE.CatmullRomCurve3,
      factor: number,
      material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
      segments = 150,
    ) => {
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, 0.01 * factor, 8, false), material);
      mesh.renderOrder = material === calciteSealMaterial ? 3 : 1;
      rig.add(mesh);
      const node = { mesh, curve, factor, segments };
      tubeNodes.push(node);
      return node;
    };

    makeTube(mainCurve, 1, crackMaterial, 220);
    branchCurves.forEach((curve) => makeTube(curve, 0.46, crackMaterial, 90));
    edgeCurves.forEach((curve) => makeTube(curve, 0.26, lipMaterial, 90));
    makeTube(mainCurve, 0.76, calciteSealMaterial, 220);
    branchCurves.forEach((curve) => makeTube(curve, 0.36, calciteSealMaterial, 90));

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 4.6),
      new THREE.MeshStandardMaterial({
        color: 0x141713,
        roughness: 0.94,
        metalness: 0.02,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.55;
    floor.position.z = -0.8;
    floor.receiveShadow = true;
    rig.add(floor);

    const grid = new THREE.GridHelper(7, 18, 0x2b7766, 0x252a26);
    grid.position.y = -1.545;
    grid.position.z = -0.8;
    rig.add(grid);

    const surfacePebbleGeometry = new THREE.DodecahedronGeometry(0.045, 0);
    for (let i = 0; i < 72; i += 1) {
      const pebble = new THREE.Mesh(
        surfacePebbleGeometry,
        aggregateMaterials[Math.floor(seeded(i + 80) * aggregateMaterials.length)],
      );
      pebble.position.set((seeded(i + 5) - 0.5) * 4.85, (seeded(i + 13) - 0.5) * 2.05, FRONT_Z + 0.012);
      pebble.scale.set(0.55 + seeded(i + 20) * 1.2, 0.35 + seeded(i + 28) * 0.8, 0.12);
      pebble.rotation.set(0, 0, seeded(i + 32) * Math.PI);
      rig.add(pebble);
    }

    const capsuleGeometry = new THREE.SphereGeometry(0.046, 18, 10);
    const capsules: Array<{ mesh: THREE.Mesh; phase: number }> = [];
    for (let i = 0; i < 34; i += 1) {
      const curve = pickPath(allPaths, seeded(i + 620));
      const t = seeded(i + 640);
      const base = curve.getPoint(t);
      const normal = curveNormal(curve, t);
      const side = seeded(i + 660) > 0.5 ? 1 : -1;
      const mesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
      mesh.position.copy(base).addScaledVector(normal, side * (0.13 + seeded(i + 680) * 0.28));
      mesh.position.z = FRONT_Z + 0.034 + seeded(i + 700) * 0.03;
      mesh.scale.set(0.72, 1.85 + seeded(i + 720) * 0.9, 0.72);
      mesh.rotation.set(seeded(i + 740) * Math.PI, seeded(i + 760) * Math.PI, seeded(i + 780) * Math.PI);
      capsules.push({ mesh, phase: seeded(i + 800) * Math.PI * 2 });
      rig.add(mesh);
    }

    const chipGeometry = new THREE.DodecahedronGeometry(0.035, 0);
    const edgeChips: THREE.Mesh[] = [];
    for (let i = 0; i < 120; i += 1) {
      const curve = pickPath(allPaths, seeded(i + 120));
      const t = seeded(i + 140);
      const base = curve.getPoint(t);
      const normal = curveNormal(curve, t);
      const side = seeded(i + 160) > 0.5 ? 1 : -1;
      const chip = new THREE.Mesh(
        chipGeometry,
        aggregateMaterials[Math.floor(seeded(i + 180) * aggregateMaterials.length)],
      );
      chip.position.copy(base).addScaledVector(normal, side * (0.035 + seeded(i + 190) * 0.075));
      chip.position.z = FRONT_Z + 0.024 + seeded(i + 210) * 0.012;
      chip.scale.set(0.45 + seeded(i + 220), 0.22 + seeded(i + 230) * 0.55, 0.1);
      chip.rotation.set(0.2, 0, seeded(i + 240) * Math.PI);
      edgeChips.push(chip);
      rig.add(chip);
    }

    const waterDrops: FlowNode[] = [];
    const waterGeometry = new THREE.SphereGeometry(0.034, 14, 8);
    for (let i = 0; i < 52; i += 1) {
      const curve = pickPath(allPaths, seeded(i + 300));
      const mesh = new THREE.Mesh(waterGeometry, waterMaterial);
      waterDrops.push({
        mesh,
        curve,
        t: seeded(i + 310),
        speed: 0.045 + seeded(i + 320) * 0.055,
        phase: seeded(i + 330) * Math.PI * 2,
      });
      rig.add(mesh);
    }

    const spores: SporeNode[] = [];
    const sporeGeometry = new THREE.SphereGeometry(0.032, 12, 8);
    for (let i = 0; i < 78; i += 1) {
      const curve = pickPath(allPaths, seeded(i + 400));
      const mesh = new THREE.Mesh(sporeGeometry, sporeMaterial);
      spores.push({
        mesh,
        curve,
        t: seeded(i + 410),
        edge: seeded(i + 420) > 0.5 ? 1 : -1,
        phase: seeded(i + 430) * Math.PI * 2,
      });
      rig.add(mesh);
    }

    const crystals: CrystalNode[] = [];
    const crystalGeometry = new THREE.OctahedronGeometry(0.055, 0);
    for (let i = 0; i < 168; i += 1) {
      const curve = pickPath(allPaths, seeded(i + 500));
      const mesh = new THREE.Mesh(crystalGeometry, crystalMaterial);
      mesh.castShadow = true;
      crystals.push({
        mesh,
        curve,
        t: seeded(i + 510),
        edge: seeded(i + 520) > 0.5 ? 1 : -1,
        size: 0.35 + seeded(i + 530) * 1.15,
        phase: seeded(i + 540) * Math.PI * 2,
        threshold: seeded(i + 550) * 0.82,
      });
      rig.add(mesh);
    }

    const warningRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.42, 0.012, 8, 96),
      warningMaterial,
    );
    warningRing.position.set(0.04, -0.16, FRONT_Z + 0.09);
    warningRing.rotation.set(0, 0, -0.28);
    rig.add(warningRing);

    const scaleBar = new THREE.Group();
    const scaleLineMaterial = new THREE.MeshBasicMaterial({ color: 0xe8f4e8 });
    const scaleLine = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.01, 0.01), scaleLineMaterial);
    scaleBar.add(scaleLine);
    const tickGeometry = new THREE.BoxGeometry(0.012, 0.09, 0.012);
    const tickLeft = new THREE.Mesh(tickGeometry, scaleLineMaterial);
    const tickRight = new THREE.Mesh(tickGeometry, scaleLineMaterial);
    tickLeft.position.x = -0.29;
    tickRight.position.x = 0.29;
    scaleBar.add(tickLeft, tickRight);
    scaleBar.position.set(-2.18, -1.05, FRONT_Z + 0.08);
    rig.add(scaleBar);

    const dragState = {
      active: false,
      x: 0,
      y: 0,
    };

    const onPointerDown = (event: PointerEvent) => {
      dragState.active = true;
      dragState.x = event.clientX;
      dragState.y = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragState.active) {
        return;
      }
      const dx = event.clientX - dragState.x;
      const dy = event.clientY - dragState.y;
      dragState.x = event.clientX;
      dragState.y = event.clientY;
      rig.rotation.y += dx * 0.0055;
      rig.rotation.x = THREE.MathUtils.clamp(rig.rotation.x + dy * 0.0038, -0.42, 0.3);
    };
    const onPointerUp = (event: PointerEvent) => {
      dragState.active = false;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(320, Math.floor(rect.width));
      const height = Math.max(300, Math.floor(rect.height));
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    let frame = 0;
    let lastTubeRadius = -1;
    const startedAt = performance.now();

    const refreshTubeGeometry = (radius: number) => {
      tubeNodes.forEach((node) => {
        node.mesh.geometry.dispose();
        node.mesh.geometry = new THREE.TubeGeometry(
          node.curve,
          node.segments,
          radius * node.factor,
          8,
          false,
        );
      });
      lastTubeRadius = radius;
    };

    const animate = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      const current = propsRef.current;
      const normalizedCrack = THREE.MathUtils.clamp((current.crack - 0.2) / 1.2, 0, 1);
      const microRadius = THREE.MathUtils.lerp(0.0065, 0.023, normalizedCrack);
      const seal = THREE.MathUtils.clamp((current.healing - 38) / 62, 0, 1);
      const waterOpacity =
        current.showFlow && current.moisture > 12
          ? THREE.MathUtils.clamp((current.moisture / 100) * (1 - current.healing / 112), 0, 0.58)
          : 0;
      const sporeActivity = THREE.MathUtils.clamp(current.day / 3, 0, 1) * (current.moisture / 100);

      if (Math.abs(microRadius - lastTubeRadius) > 0.001) {
        refreshTubeGeometry(microRadius);
      }

      crackMaterial.opacity = THREE.MathUtils.lerp(0.9, 0.24, seal);
      lipMaterial.opacity = current.sectionCut ? THREE.MathUtils.lerp(0.74, 0.42, seal) : 0.22;
      calciteSealMaterial.opacity = THREE.MathUtils.lerp(0, 0.82, seal);
      calciteSealMaterial.emissiveIntensity = THREE.MathUtils.lerp(0.02, 0.2, seal);
      waterMaterial.opacity = waterOpacity;
      capsuleMaterial.opacity = current.sectionCut ? 0.58 : 0.18;
      crystalMaterial.emissiveIntensity = THREE.MathUtils.lerp(0.08, 0.42, current.healing / 100);
      concreteMaterial.color.set(current.sectionCut ? 0xb8beb4 : 0xa7ada4);
      warningRing.visible = current.crack > 1;
      warningRing.scale.setScalar(0.98 + Math.sin(elapsed * 3.4) * 0.012);

      capsules.forEach(({ mesh, phase }, index) => {
        mesh.visible = current.version === "new" && (current.sectionCut || index % 4 === 0);
        const pulse = 0.96 + Math.sin(elapsed * 1.7 + phase) * 0.025;
        mesh.scale.set(0.72 * pulse, (1.85 + seeded(index + 720) * 0.9) * pulse, 0.72 * pulse);
      });

      edgeChips.forEach((chip, index) => {
        chip.visible = current.sectionCut || index % 4 !== 0;
        chip.position.z = FRONT_Z + 0.02 + Math.sin(elapsed * 0.9 + index) * 0.002;
      });

      waterDrops.forEach((node, index) => {
        const t = (node.t + elapsed * node.speed) % 1;
        const point = node.curve.getPoint(t);
        const normal = curveNormal(node.curve, t);
        node.mesh.visible = waterOpacity > 0.035 && index / waterDrops.length < current.moisture / 100;
        node.mesh.position
          .copy(point)
          .addScaledVector(normal, Math.sin(node.phase) * microRadius * 1.4);
        node.mesh.position.z = FRONT_Z + 0.058 + Math.sin(elapsed * 5 + node.phase) * 0.004;
        node.mesh.scale.set(
          0.75 + waterOpacity,
          0.45 + waterOpacity * 0.8,
          0.35 + waterOpacity * 0.7,
        );
      });

      spores.forEach((node, index) => {
        const visibleByTime = index / spores.length < 0.16 + sporeActivity * 0.78;
        const point = node.curve.getPoint(node.t);
        const normal = curveNormal(node.curve, node.t);
        node.mesh.visible = sporeActivity > 0.05 && visibleByTime && current.healing < 92;
        node.mesh.position
          .copy(point)
          .addScaledVector(normal, node.edge * (microRadius * 1.9 + 0.026));
        node.mesh.position.z = FRONT_Z + 0.078 + Math.sin(elapsed * 3 + node.phase) * 0.008;
        const pulse = 0.62 + Math.sin(elapsed * 4.6 + node.phase) * 0.11;
        node.mesh.scale.setScalar(pulse);
      });

      crystals.forEach((node) => {
        const activation = current.healing / 100;
        const localGrowth = THREE.MathUtils.clamp((activation - node.threshold) * 4.5, 0, 1);
        const point = node.curve.getPoint(node.t);
        const normal = curveNormal(node.curve, node.t);
        const edgeOffset = node.edge * THREE.MathUtils.lerp(microRadius * 2.4, microRadius * 0.45, localGrowth);

        node.mesh.visible = localGrowth > 0.02;
        node.mesh.position.copy(point).addScaledVector(normal, edgeOffset);
        node.mesh.position.z = FRONT_Z + 0.072 + localGrowth * 0.025;
        const scale = node.size * THREE.MathUtils.lerp(0.08, 1.08, localGrowth);
        node.mesh.scale.set(scale * 0.8, scale * 1.25, scale * 0.72);
        node.mesh.rotation.set(
          elapsed * 0.16 + node.phase,
          elapsed * 0.24 + node.phase * 0.5,
          node.phase,
        );
      });

      if (!dragState.active) {
        rig.rotation.y += 0.0013;
      }
      rig.position.y = Math.sin(elapsed * 0.58) * 0.018;

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
        }
      });
      [
        concreteMaterial,
        sideMaterial,
        crackMaterial,
        lipMaterial,
        calciteSealMaterial,
        crystalMaterial,
        waterMaterial,
        sporeMaterial,
        capsuleMaterial,
        warningMaterial,
        scaleLineMaterial,
        ...aggregateMaterials,
      ].forEach((material) => material.dispose());
      concreteTexture.dispose();
      concreteBump.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="scene-canvas"
      aria-label="可旋轉的 3D 混凝土微裂縫模型，顯示連續裂縫、水分入侵、菌株與碳酸鈣晶體封閉裂縫"
    />
  );
}

export function MicpSimulator3D({ version = "new" }: { version?: VersionMode }) {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [crack, setCrack] = useState(scenarios[0].crack);
  const [moisture, setMoisture] = useState(scenarios[0].moisture);
  const [temp, setTemp] = useState(scenarios[0].temp);
  const [day, setDay] = useState(0);
  const [running, setRunning] = useState(false);
  const [showFlow, setShowFlow] = useState(true);
  const [sectionCut, setSectionCut] = useState(true);

  const scenario = useMemo(
    () => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0],
    [scenarioId],
  );
  const model = useMemo(
    () => computeModel(crack, moisture, temp, day, version),
    [crack, moisture, temp, day, version],
  );
  const steps = version === "legacy" ? legacySteps : newSteps;
  const isNewVersion = version === "new";

  useEffect(() => {
    if (!running) {
      return;
    }
    const timer = window.setInterval(() => {
      setDay((value) => {
        if (value >= 14) {
          setRunning(false);
          return 14;
        }
        return Number(Math.min(14, value + 0.5).toFixed(1));
      });
    }, 520);

    return () => window.clearInterval(timer);
  }, [running]);

  const applyScenario = useCallback((item: Scenario) => {
    setScenarioId(item.id);
    setCrack(item.crack);
    setMoisture(item.moisture);
    setTemp(item.temp);
    setDay(0);
    setRunning(false);
  }, []);

  const startHealing = useCallback(() => {
    setDay(0);
    setRunning(true);
  }, []);

  const reset = useCallback(() => {
    setDay(0);
    setRunning(false);
  }, []);

  return (
    <main className={`micp-app ${isNewVersion ? "version-new" : "version-legacy"}`}>
      <section className="hero-panel" aria-labelledby="site-title">
        <div className="hero-copy">
          <div className="kicker">GreenBuilt MICP 3D Lab</div>
          <h1 id="site-title">
            {isNewVersion ? "生化自癒混凝土 3D 模擬器" : "生化自癒混凝土 3D 舊版"}
          </h1>
          <p>
            {isNewVersion
              ? "將 PMC 2025 FEM 研究的微結構傳輸模型，與 Basilisk 自癒混凝土的工程流程對照；以 600x 微裂縫視角觀察水分、菌體、CaCO3 / limestone 晶體如何逐步封縫。"
              : "保留前一版 3D 微裂縫展示邏輯，聚焦連續裂縫、分岔、水分示蹤與 CaCO3 晶體沿裂縫壁生長，不加入來源校對面板。"}
          </p>
          <nav className="version-switch" aria-label="版本切換">
            <a className={isNewVersion ? "active" : ""} href="/micp-sim">
              新版
            </a>
            <a className={!isNewVersion ? "active" : ""} href="/micp-sim-old">
              舊版
            </a>
          </nav>
        </div>

        <div className="status-strip" aria-label="目前模擬狀態">
          <div>
            <span>癒合率</span>
            <strong>{model.healing}%</strong>
          </div>
          <div>
            <span>承載強度</span>
            <strong>{model.load}%</strong>
          </div>
          <div>
            <span>滲漏率</span>
            <strong>{model.leak}%</strong>
          </div>
          <div>
            <span>CaCO3 晶簇</span>
            <strong>{model.density}</strong>
          </div>
        </div>
      </section>

      <section className="simulator-grid" aria-label="MICP 3D 模擬器">
        <aside className="control-panel" aria-label="模擬控制">
          <div className="scenario-tabs" role="tablist" aria-label="工程場域">
            {scenarios.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={scenarioId === item.id}
                className={scenarioId === item.id ? "active" : ""}
                onClick={() => applyScenario(item)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="scenario-summary">
            <span>{scenario.location}</span>
            <h2>{scenario.name}</h2>
            <p>{scenario.description}</p>
          </div>

          <div className="slider-stack">
            <label>
              <span>
                裂縫寬度 <b>{crack.toFixed(2)}mm</b>
              </span>
              <input
                type="range"
                min="0.2"
                max="1.4"
                step="0.05"
                value={crack}
                onChange={(event) => setCrack(Number(event.target.value))}
              />
            </label>

            <label>
              <span>
                含水率 <b>{moisture}%</b>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={moisture}
                onChange={(event) => setMoisture(Number(event.target.value))}
              />
            </label>

            <label>
              <span>
                溫度 <b>{temp}°C</b>
              </span>
              <input
                type="range"
                min="5"
                max="45"
                step="1"
                value={temp}
                onChange={(event) => setTemp(Number(event.target.value))}
              />
            </label>

            <label>
              <span>
                熟化時間 <b>第 {day.toFixed(1)} 天</b>
              </span>
              <input
                type="range"
                min="0"
                max="14"
                step="0.5"
                value={day}
                onChange={(event) => {
                  setDay(Number(event.target.value));
                  setRunning(false);
                }}
              />
            </label>
          </div>

          <div className="toggle-row">
            <label>
              <input
                type="checkbox"
                checked={sectionCut}
                onChange={(event) => setSectionCut(event.target.checked)}
              />
              裂縫邊緣
            </label>
            <label>
              <input
                type="checkbox"
                checked={showFlow}
                onChange={(event) => setShowFlow(event.target.checked)}
              />
              水流示蹤
            </label>
          </div>

          <div className="action-row">
            <button type="button" className="primary-action" onClick={startHealing}>
              {running ? "模擬中" : "開始癒合"}
            </button>
            <button type="button" className="ghost-action" onClick={reset}>
              重設
            </button>
          </div>

          {!model.insideLimit && (
            <div className="warning" role="status">
              裂縫已超過 1.0mm 顯示邊界；此區應視為修復砂漿、液態修復系統或二次壓漿情境，
              不再用完全自癒來表達。
            </div>
          )}
        </aside>

        <div className="scene-panel">
          <div className="scene-toolbar">
            <span>Micro-crack view · 600x</span>
            <span>實際裂縫 {crack.toFixed(2)} mm</span>
          </div>
          <MicpThreeViewport
            version={version}
            crack={crack}
            moisture={moisture}
            temp={temp}
            day={day}
            healing={model.healing}
            leak={model.leak}
            showFlow={showFlow}
            sectionCut={sectionCut}
          />
          <div className="scene-readout">
            <div>
              <span>環境反應值</span>
              <strong>{model.environment}</strong>
            </div>
            <div>
              <span>裂縫狀態</span>
              <strong>{model.insideLimit ? "細裂縫" : "需補強"}</strong>
            </div>
            <div>
              <span>水分入侵</span>
              <strong>{model.leak === 0 ? "阻斷" : `${model.leak}%`}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="process-band" aria-label="MICP 反應流程">
        {steps.map((step, index) => (
          <article key={step} className={index <= model.activeStep ? "active" : ""}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{step}</p>
          </article>
        ))}
      </section>

      {isNewVersion && (
        <>
          <section className="evidence-band" aria-label="文獻與工程來源對照">
            <div className="section-heading">
              <span>Research x Product Check</span>
              <h2>來源對照與網站內容修正</h2>
            </div>

            <div className="evidence-grid">
              {evidenceCards.map((card) => (
                <article key={card.title} className="evidence-card">
                  <span>{card.label}</span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <a href={card.href} target="_blank" rel="noreferrer">
                    查看來源
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="calibration-grid" aria-label="術語、方程式、菌株與應用校對">
            <article className="calibration-panel">
              <span>Reaction model</span>
              <h2>反應式校準</h2>
              <div className="equation-stack">
                <code>∂C/∂t = D∇²C - R(C)</code>
                <code>R(C) = Kp · min([Ca2+], [CO3^2-])</code>
                <code>Ca2+ + CO3^2- -&gt; CaCO3(s)</code>
              </div>
              <p>
                視覺中的藍色為水分/離子傳輸，綠色為包埋菌體與活化孢子，白色晶簇為 CaCO3
                沉澱；模型不宣稱完整菌代謝動力學，而是用反應-擴散框架呈現封縫趨勢。
              </p>
            </article>

            <article className="calibration-panel">
              <span>Content audit</span>
              <h2>目前內容對比</h2>
              <div className="comparison-list">
                {calibrationRows.map((row) => (
                  <div key={row.term}>
                    <strong>{row.term}</strong>
                    <p>{row.before}</p>
                    <p>{row.after}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </>
      )}
    </main>
  );
}

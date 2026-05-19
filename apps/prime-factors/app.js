import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

const SIMPLE_COLOR_ENTRIES = [
    [1n, "#ffffff"],
    [2n, "#ef0000"],
    [3n, "#0079ea"],
    [5n, "#00ea00"],
    [7n, "#efef00"],
    [11n, "#ef6a00"],
    [13n, "#682600"],
    [17n, "#7700ef"],
    [19n, "#ef00ef"],
    [23n, "#aeff00"],
    [29n, "#00efef"],
    [31n, "#0000ff"],
    [37n, "#515151"],
];

const EXTENDED_COLOR_ENTRIES = [
    ...SIMPLE_COLOR_ENTRIES,
    [41n, "#ef8686"],
    [43n, "#ef86ef"],
    [47n, "#89bcef"],
    [53n, "#89ef89"],
    [59n, "#efefaa"],
    [61n, "#efb989"],
    [67n, "#b6efef"],
    [71n, "#b589ef"],
    [73n, "#8383ef"],
    [79n, "#c9ef89"],
    [83n, "#a0a0a0"],
    [89n, "#6b0000"],
    [97n, "#00366b"],
    [101n, "#006b6b"],
    [103n, "#006b00"],
    [107n, "#406b00"],
    [109n, "#6b6b00"],
    [113n, "#6b006b"],
    [127n, "#2d006b"],
    [131n, "#00006b"],
    [137n, "#282828"],
];

const COLOR_PALETTES = {
    simple: new Map(SIMPLE_COLOR_ENTRIES.map(([factor, color]) => [factor.toString(), color])),
    extended: new Map(EXTENDED_COLOR_ENTRIES.map(([factor, color]) => [factor.toString(), color])),
};
const PRIME_COLOR_SEQUENCES = {
    simple: SIMPLE_COLOR_ENTRIES.filter(([factor]) => factor !== 1n).map(([, color]) => color),
    extended: EXTENDED_COLOR_ENTRIES.filter(([factor]) => factor !== 1n).map(([, color]) => color),
};

const MAX_PRIME = 5_000_000;
const MAX_PRIME_BIGINT = BigInt(MAX_PRIME);
const MAX_PRIME_SQUARED = MAX_PRIME_BIGINT * MAX_PRIME_BIGINT;
const DETERMINISTIC_MILLER_RABIN_MAX = (1n << 64n) - 1n;
const FACTORIZATION_CACHE_MAX_ENTRIES = 8192;
const ASYNC_COFACTOR_QUEUE_LIMIT = 64;
const ASYNC_COFACTOR_TIME_BUDGET_MS = 5000;
const MILLER_RABIN_MAX_DECIMAL_DIGITS = 128;
const DETERMINISTIC_MILLER_RABIN_WITNESSES = [
    2n, 325n, 9375n, 28178n, 450775n, 9780504n, 1795265022n,
];
const MILLER_RABIN_WITNESSES = [
    2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n,
    23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n,
];
const FACTOR_STATUS = Object.freeze({
    EXACT_PRIME: "exact-prime",
    PROBABLE_PRIME: "probable-prime",
    COMPOSITE_COFACTOR: "composite-cofactor",
    UNKNOWN_COFACTOR: "unknown-cofactor",
});

const TUNNEL_FORWARD_LOOP_COUNT = 20;
const TUNNEL_BACK_BUFFER_LOOP_COUNT = 5;
const TUNNEL_LOOP_COUNT = TUNNEL_FORWARD_LOOP_COUNT + TUNNEL_BACK_BUFFER_LOOP_COUNT;
const TUNNEL_RADIUS = 34;
const TUNNEL_PITCH = 14;
const TUNNEL_MAX_BALL_RADIUS = 1.65;
const TUNNEL_MIN_BALL_RADIUS = 0.42;
const TUNNEL_MAX_CLUSTER_DIAMETER = 5.35;
const TUNNEL_CLUSTER_CHORD_FILL = 0.62;
const TUNNEL_RELATIVE_MIN_BALL_RADIUS = 0.3;
const TUNNEL_FACTOR_SIZE_CLOSE_SPREAD = 0.18;
const TUNNEL_FACTOR_SIZE_FULL_SPREAD_ORDERS = 2;
const TUNNEL_FACTOR_SIZE_MAX_RELATIVE_DROP = 0.75;
const TUNNEL_BALL_CONTACT_OVERLAP = 0.04;
const TUNNEL_PACKING_EPSILON = 0.0001;
const TUNNEL_LABEL_OUTER_GAP = 1.2;
const TUNNEL_LABEL_SCREEN_PADDING = 0.12;
const NUMBER_LABEL_BASE_CANVAS_WIDTH = 512;
const NUMBER_LABEL_CANVAS_HEIGHT = 192;
const NUMBER_LABEL_MAX_CANVAS_WIDTH = 4096;
const NUMBER_LABEL_FONT_SIZE = 68;
const NUMBER_LABEL_HORIZONTAL_PADDING = 44;
const NUMBER_LABEL_LINE_WIDTH = 10;
const NUMBER_LABEL_SHADOW_BLUR = 14;
const TUNNEL_NUMBER_LABEL_HEIGHT = 4.4;
const SELECTED_DETAIL_DISTANCE = 34;
const SELECTED_DETAIL_MAX_BALL_RADIUS = 2.25;
const SELECTED_DETAIL_MAX_CLUSTER_DIAMETER = 8.2;
const SELECTED_DETAIL_LABEL_GAP = 1.55;
const SELECTED_DETAIL_LABEL_SCREEN_OFFSET = 0.35;
const SELECTED_DETAIL_NUMBER_LABEL_HEIGHT = 5.4;
const FACTOR_SURFACE_LABEL_Z_OFFSET = 1.025;
const FACTOR_SURFACE_LABEL_HEIGHT = 1.72;
const FACTOR_SURFACE_LABEL_CANVAS_HEIGHT = 128;
const FACTOR_SURFACE_LABEL_FONT_SIZE = 64;
const FACTOR_SURFACE_LABEL_LINE_WIDTH = 9;
const FACTOR_SURFACE_LABEL_EDGE_INSET_PIXELS = 12;
const TUNNEL_ENTRY_Z = -24;
const TUNNEL_VIEW_DEPTH = 310;
const TUNNEL_BACK_CULL_DEPTH = TUNNEL_BACK_BUFFER_LOOP_COUNT * TUNNEL_PITCH + 24;
const TUNNEL_CAMERA_FIT_PADDING = 18;
const TUNNEL_CAMERA_Y_OFFSET = 3.2;
const TUNNEL_SMOOTHING = 14;
const TUNNEL_KEY_REPEAT_DELAY = 0.38;
const TUNNEL_KEY_REPEAT_PER_SECOND = 5;
const TUNNEL_SHIFT_REPEAT_PER_SECOND = 10;
const TUNNEL_WHEEL_STEP_COOLDOWN = 0.16;
const TWO_PI = Math.PI * 2;

const canvas = document.getElementById("three-canvas");
const controls = document.getElementById("controls");
const startNumberInput = document.getElementById("startNumberInput");
const numbersPerLoopInput = document.getElementById("numbersPerLoopInput");
const colorModeSelect = document.getElementById("colorModeSelect");
const tooltip = document.getElementById("tooltip");

const primesArray = [];
const primeIndices = new Map();
const factorizationCache = new Map();
const asyncCofactorFactorizations = new Map();
const pendingAsyncCofactors = new Set();
const asyncCofactorQueue = [];
const tunnelItems = [];
let sphereMeshes = [];
let visibleMeshes = [];
let currentEndNumber = 0n;
let factorizationWorker = null;
let factorizationWorkerUnavailable = false;
let activeAsyncCofactorTask = null;
let nextAsyncCofactorTaskId = 1;
let hoveredMesh = null;
let selectedDetailValue = null;
let tunnelStartNumber = 1n;
let tunnelTravel = 0;
let tunnelTargetTravel = 0;
let tunnelRotation = 0;
let tunnelTargetRotation = 0;
let tunnelAnchorIndex = 0;
let activeNumbersPerLoop = 24;
let activeColorMode = "simple";
let lastTunnelTouchY = null;
let previousRenderTime = 0;
let nextWheelStepTime = 0;
const activeTunnelKeys = new Map();

generatePrimesUpTo(MAX_PRIME);

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
});
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.007);
const contentGroup = new THREE.Group();
scene.add(contentGroup);
const selectedDetailGroup = new THREE.Group();
scene.add(selectedDetailGroup);

const tunnelCamera = new THREE.PerspectiveCamera(72, 1, 0.1, 1500);

const ambientLight = new THREE.HemisphereLight(0xffffff, 0x181818, 1.8);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.7);
keyLight.position.set(-260, 360, 620);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.85);
fillLight.position.set(340, -180, 420);
scene.add(fillLight);

const tunnelHeadLight = new THREE.PointLight(0xffffff, 2.4, 260, 1.2);
scene.add(tunnelHeadLight);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 18);
const selectedOutlineMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.92,
});
const cofactorWireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
});
const probablePrimeWireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
});
const materialCache = new Map();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

window.primeFactors3d = {
    get mode() {
        return "tunnel";
    },
    get tunnelItemCount() {
        return tunnelItems.length;
    },
    get sphereCount() {
        return sphereMeshes.length;
    },
    get visibleSphereCount() {
        return visibleMeshes.length;
    },
    get numbersPerLoop() {
        return getNumbersPerLoop();
    },
    get colorMode() {
        return activeColorMode;
    },
    get tunnelTravel() {
        return tunnelTravel;
    },
    get tunnelTargetTravel() {
        return tunnelTargetTravel;
    },
    get tunnelRotation() {
        return tunnelRotation;
    },
    get selectedTunnelIndex() {
        return getSelectedTunnelIndex();
    },
    get selectedTunnelNumber() {
        return getTunnelValueForIndex(getSelectedTunnelIndex()).toString();
    },
    get selectedDetailNumber() {
        return selectedDetailValue?.toString() ?? "";
    },
    get selectedDetailFactors() {
        return getPrimeFactors(getTunnelValueForIndex(getSelectedTunnelIndex())).map(serializeFactor);
    },
    get pendingAsyncCofactorCount() {
        return pendingAsyncCofactors.size;
    },
    get asyncCofactorQueueLength() {
        return asyncCofactorQueue.length;
    },
    get activeAsyncCofactor() {
        return activeAsyncCofactorTask?.value ?? "";
    },
    get selectedDetailMeshCount() {
        return selectedDetailGroup.children.length;
    },
    get tunnelMinIndex() {
        return tunnelItems.length > 0 ? getTunnelMinIndex() : 0;
    },
    get tunnelMaxIndex() {
        return tunnelItems.length > 0 ? getTunnelMaxIndex() : 0;
    },
};

resizeRenderer();
rebuildCurrentMode(false);
renderer.setAnimationLoop(render);

controls.addEventListener("submit", (event) => {
    event.preventDefault();
    rebuildCurrentMode(true);
});

colorModeSelect.addEventListener("change", () => {
    activeColorMode = getRequestedColorMode();
    updateFactorMaterials();
});

window.addEventListener("resize", () => {
    resizeRenderer();
});

canvas.addEventListener("pointermove", (event) => {
    pickSphere(event);
});

canvas.addEventListener("pointerdown", (event) => {
    handleCanvasPointerDown(event);
});

canvas.addEventListener("pointerleave", () => {
    setHoveredMesh(null);
    hideTooltip();
});

window.addEventListener("wheel", handleTunnelWheel, { passive: false });
window.addEventListener("keydown", handleTunnelKeydown);
window.addEventListener("keyup", handleTunnelKeyup);
window.addEventListener("blur", () => {
    activeTunnelKeys.clear();
});

canvas.addEventListener("touchstart", (event) => {
    if (event.touches.length === 0) {
        return;
    }

    lastTunnelTouchY = event.touches[0].clientY;
}, { passive: true });

canvas.addEventListener("touchmove", (event) => {
    if (event.touches.length === 0 || lastTunnelTouchY === null) {
        return;
    }

    event.preventDefault();
    const nextY = event.touches[0].clientY;
    const deltaY = lastTunnelTouchY - nextY;
    lastTunnelTouchY = nextY;
    applyTunnelScrollDelta(deltaY);
}, { passive: false });

canvas.addEventListener("touchend", () => {
    lastTunnelTouchY = null;
});

function generatePrimesUpTo(max) {
    const sieve = new Uint8Array(max + 1);
    sieve.fill(1);
    sieve[0] = 0;
    sieve[1] = 0;

    for (let i = 2; i * i <= max; i += 1) {
        if (!sieve[i]) {
            continue;
        }

        for (let j = i * i; j <= max; j += i) {
            sieve[j] = 0;
        }
    }

    let index = 1;
    for (let i = 2; i <= max; i += 1) {
        if (sieve[i]) {
            primesArray.push(i);
            primeIndices.set(i, index);
            index += 1;
        }
    }

}

function parseStartNumber(value) {
    const normalized = value.trim().replace(/[,_\s]/g, "");

    if (!/^\d+$/.test(normalized)) {
        return 1n;
    }

    const parsed = BigInt(normalized);
    return parsed < 1n ? 1n : parsed;
}

function getNumbersPerLoop() {
    return activeNumbersPerLoop;
}

function getRequestedNumbersPerLoop() {
    const parsed = Number.parseInt(numbersPerLoopInput.value, 10);

    if (!Number.isFinite(parsed)) {
        return activeNumbersPerLoop;
    }

    return Math.max(6, Math.min(96, parsed));
}

function getRequestedColorMode() {
    return colorModeSelect.value === "extended" ? "extended" : "simple";
}

function rebuildCurrentMode(resetScroll) {
    const startNumber = parseStartNumber(startNumberInput.value);

    activeNumbersPerLoop = getRequestedNumbersPerLoop();
    activeColorMode = getRequestedColorMode();
    numbersPerLoopInput.value = String(activeNumbersPerLoop);
    colorModeSelect.value = activeColorMode;
    generateTunnel(startNumber, activeNumbersPerLoop);

    if (resetScroll) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
}

function generateTunnel(startNumber, numbersPerLoop) {
    clearDynamicContent();
    tunnelStartNumber = startNumber < 1n ? 1n : startNumber;
    tunnelTravel = 0;
    tunnelTargetTravel = 0;
    tunnelRotation = 0;
    tunnelTargetRotation = 0;
    tunnelAnchorIndex = getTunnelTargetMinIndex();
    currentEndNumber = tunnelStartNumber;
    numbersPerLoopInput.value = String(numbersPerLoop);

    const totalNumbers = numbersPerLoop * TUNNEL_LOOP_COUNT;

    for (let index = 0; index < totalNumbers; index += 1) {
        createTunnelItem(tunnelAnchorIndex + index);
    }

    currentEndNumber = getTunnelValueForIndex(tunnelAnchorIndex + totalNumbers - 1);
}

function clearDynamicContent() {
    for (const object of [...contentGroup.children]) {
        disposeMarkedObject(object);
        contentGroup.remove(object);
    }

    tunnelItems.length = 0;
    sphereMeshes = [];
    visibleMeshes = [];
    currentEndNumber = 0n;
    clearSelectedDetailContent();
    setHoveredMesh(null);
    hideTooltip();
}

function disposeMarkedObject(object) {
    object.traverse((child) => {
        if (child.userData.disposeGeometry && child.geometry) {
            child.geometry.dispose();
        }

        if (child.userData.disposeMaterial && child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];

            for (const material of materials) {
                if (material.map) {
                    material.map.dispose();
                }
                material.dispose();
            }
        }
    });
}

function createTunnelItem(globalIndex) {
    const group = new THREE.Group();

    const item = {
        value: 1n,
        factors: [],
        packedFactors: [],
        group,
        meshes: [],
        label: null,
        globalIndex,
    };

    updateTunnelItemContent(item, globalIndex);
    contentGroup.add(group);
    tunnelItems.push(item);
}

function updateTunnelItemContent(item, globalIndex) {
    for (const child of [...item.group.children]) {
        if (child.isMesh) {
            const meshIndex = sphereMeshes.indexOf(child);

            if (meshIndex !== -1) {
                sphereMeshes.splice(meshIndex, 1);
            }
        }

        disposeMarkedObject(child);
        item.group.remove(child);
    }

    const value = getTunnelValueForIndex(globalIndex);
    const factors = getPrimeFactors(value);

    item.globalIndex = globalIndex;
    item.value = value;
    item.factors = factors;
    item.packedFactors = [];
    item.meshes = [];
    item.label = null;

    const count = factors.length;
    const packedFactors = getTunnelPackedFactors(factors);
    item.packedFactors = packedFactors;

    for (let factorIndex = 0; factorIndex < count; factorIndex += 1) {
        const { factor, radius, x, y } = packedFactors[factorIndex];
        const mesh = createFactorMesh(factor, value, radius);
        mesh.position.set(x, y, 0);
        mesh.userData.outline = createSelectedOutlineMesh();
        mesh.add(mesh.userData.outline);
        mesh.userData.tunnelItem = item;
        item.group.add(mesh);
        item.meshes.push(mesh);
    }

    const label = createNumberSprite(formatBigIntWithCommas(value));
    item.group.add(label);
    item.label = label;
}

function getTunnelBallRadius(factors) {
    if (factors.length <= 1) {
        return TUNNEL_MAX_BALL_RADIUS;
    }

    const targetDiameter = getTunnelClusterFitDiameter();
    const maxRadiusDiameter = getPackedFactorDiameter(factors, TUNNEL_MAX_BALL_RADIUS);

    if (maxRadiusDiameter <= targetDiameter) {
        return TUNNEL_MAX_BALL_RADIUS;
    }

    let low = TUNNEL_RELATIVE_MIN_BALL_RADIUS;
    let high = TUNNEL_MAX_BALL_RADIUS;

    for (let step = 0; step < 16; step += 1) {
        const middle = (low + high) / 2;
        const diameter = getPackedFactorDiameter(factors, middle);

        if (diameter <= targetDiameter) {
            low = middle;
        } else {
            high = middle;
        }
    }

    return Math.max(TUNNEL_RELATIVE_MIN_BALL_RADIUS, low);
}

function getTunnelPackedFactors(factors) {
    const ballRadius = getTunnelBallRadius(factors);
    const orderedFactors = getSizedOrderedFactors(factors, ballRadius);

    return packFactorBalls(orderedFactors);
}

function getTunnelClusterFitDiameter() {
    const numbersPerLoop = getNumbersPerLoop();
    const chordSpacing = 2 * TUNNEL_RADIUS * Math.sin(Math.PI / numbersPerLoop);

    return Math.min(TUNNEL_MAX_CLUSTER_DIAMETER, chordSpacing * TUNNEL_CLUSTER_CHORD_FILL);
}

function getPackedFactorDiameter(factors, maxRadius) {
    const packedFactors = packFactorBalls(getSizedOrderedFactors(factors, maxRadius));
    const bounds = getPackedBounds(packedFactors);

    return Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
}

function packFactorBalls(factors) {
    const placed = [];

    for (const factor of factors) {
        const circle = {
            factor: factor.factor,
            radius: factor.radius,
            x: 0,
            y: 0,
        };

        if (placed.length === 0) {
            placed.push(circle);
            continue;
        }

        if (placed.length === 1) {
            circle.x = getPackingContactDistance(placed[0].radius, circle.radius);
            placed.push(circle);
            continue;
        }

        if (placed.length === 2) {
            const position = getSeedTrianglePackingPosition(placed[0], placed[1], circle.radius)
                ?? choosePackingPosition(placed, circle.radius);
            circle.x = position.x;
            circle.y = position.y;
            placed.push(circle);
            continue;
        }

        const position = choosePackingPosition(placed, circle.radius);
        circle.x = position.x;
        circle.y = position.y;
        placed.push(circle);
    }

    return centerPackedFactors(placed);
}

function getSeedTrianglePackingPosition(first, second, radius) {
    const candidates = getTangentPackingPositions(first, second, radius);

    if (candidates.length === 0) {
        return null;
    }

    return candidates.reduce((best, candidate) => {
        if (Math.abs(candidate.y) > Math.abs(best.y) + TUNNEL_PACKING_EPSILON) {
            return candidate;
        }

        if (
            Math.abs(Math.abs(candidate.y) - Math.abs(best.y)) <= TUNNEL_PACKING_EPSILON
            && candidate.y > best.y
        ) {
            return candidate;
        }

        return best;
    }, candidates[0]);
}

function choosePackingPosition(placed, radius) {
    const pairPosition = choosePairPackingPosition(placed, radius);

    if (pairPosition) {
        return pairPosition;
    }

    return chooseSingleContactPackingPosition(placed, radius) ?? getFallbackPackingPosition(placed, radius);
}

function choosePairPackingPosition(placed, radius) {
    const candidates = [];

    for (const [first, second] of getPackingPairsByPriority(placed)) {
        for (const candidate of getTangentPackingPositions(first, second, radius)) {
            if (isPackingPositionClear(placed, radius, candidate)) {
                candidates.push({ first, second, x: candidate.x, y: candidate.y });
            }
        }
    }

    return candidates.length > 0
        ? getBestPairPackingCandidate(placed, radius, candidates)
        : null;
}

function getBestPairPackingCandidate(placed, radius, candidates) {
    let bestCandidate = null;

    for (const candidate of candidates) {
        if (!bestCandidate || comparePairPackingCandidates(placed, radius, candidate, bestCandidate) < 0) {
            bestCandidate = candidate;
        }
    }

    return bestCandidate ? { x: bestCandidate.x, y: bestCandidate.y } : null;
}

function comparePairPackingCandidates(placed, radius, left, right) {
    return comparePackingPairImportance([left.first, left.second], [right.first, right.second])
        || compareDistanceToFirstPlacedBall(placed, left, right)
        || comparePackingCandidateScores(placed, radius, left, right);
}

function comparePackingPairImportance(leftPair, rightPair) {
    const left = [...leftPair].sort(comparePackingCircleImportance);
    const right = [...rightPair].sort(comparePackingCircleImportance);

    return comparePackingCircleImportance(left[0], right[0])
        || comparePackingCircleImportance(left[1], right[1]);
}

function getPackingPairsByPriority(placed) {
    const pairs = [];

    for (let firstIndex = 0; firstIndex < placed.length; firstIndex += 1) {
        for (let secondIndex = firstIndex + 1; secondIndex < placed.length; secondIndex += 1) {
            pairs.push([placed[firstIndex], placed[secondIndex]]);
        }
    }

    return pairs.sort(comparePackingPairs);
}

function comparePackingPairs(leftPair, rightPair) {
    const left = [...leftPair].sort(comparePackingCircleImportance);
    const right = [...rightPair].sort(comparePackingCircleImportance);

    return comparePackingCircleImportance(left[0], right[0])
        || comparePackingCircleImportance(left[1], right[1])
        || Math.hypot(left[0].x, left[0].y) - Math.hypot(right[0].x, right[0].y)
        || Math.hypot(left[1].x, left[1].y) - Math.hypot(right[1].x, right[1].y)
        || getPairCenterDistance(leftPair) - getPairCenterDistance(rightPair);
}

function comparePackingCircleImportance(left, right) {
    return right.radius - left.radius
        || compareFactorDescending(left.factor, right.factor);
}

function comparePackingCirclesDescending(left, right) {
    return comparePackingCircleImportance(left, right)
        || Math.hypot(left.x, left.y) - Math.hypot(right.x, right.y);
}

function getPairCenterDistance(pair) {
    const centerX = (pair[0].x + pair[1].x) / 2;
    const centerY = (pair[0].y + pair[1].y) / 2;
    return Math.hypot(centerX, centerY);
}

function chooseSingleContactPackingPosition(placed, radius) {
    const candidates = [];

    for (const circle of [...placed].sort(comparePackingCirclesDescending)) {
        const distance = getPackingContactDistance(circle.radius, radius);

        for (let step = 0; step < 16; step += 1) {
            const angle = (step / 16) * TWO_PI;
            const candidate = {
                x: circle.x + Math.cos(angle) * distance,
                y: circle.y + Math.sin(angle) * distance,
            };

            if (isPackingPositionClear(placed, radius, candidate)) {
                candidates.push(candidate);
            }
        }

        if (candidates.length > 0) {
            return getBestScoredPackingCandidate(placed, radius, candidates);
        }
    }

    return null;
}

function getBestScoredPackingCandidate(placed, radius, candidates) {
    let bestCandidate = null;

    for (const candidate of candidates) {
        if (!bestCandidate || comparePackingCandidateScores(placed, radius, candidate, bestCandidate) < 0) {
            bestCandidate = candidate;
        }
    }

    return bestCandidate;
}

function comparePackingCandidateScores(placed, radius, left, right) {
    const scoreDelta = getPackingScore(placed, radius, left) - getPackingScore(placed, radius, right);

    if (Math.abs(scoreDelta) > TUNNEL_PACKING_EPSILON) {
        return scoreDelta;
    }

    return compareDistanceToFirstPlacedBall(placed, left, right)
        || left.y - right.y
        || left.x - right.x;
}

function compareDistanceToFirstPlacedBall(placed, left, right) {
    const firstDistanceDelta = getDistanceToFirstPlacedBall(placed, left)
        - getDistanceToFirstPlacedBall(placed, right);

    return Math.abs(firstDistanceDelta) > TUNNEL_PACKING_EPSILON
        ? firstDistanceDelta
        : 0;
}

function getDistanceToFirstPlacedBall(placed, candidate) {
    const first = placed[0];

    if (!first) {
        return Infinity;
    }

    return Math.hypot(candidate.x - first.x, candidate.y - first.y);
}

function getTangentPackingPositions(first, second, radius) {
    const dx = second.x - first.x;
    const dy = second.y - first.y;
    const distance = Math.hypot(dx, dy);

    if (distance < TUNNEL_PACKING_EPSILON) {
        return [];
    }

    const firstDistance = getPackingContactDistance(first.radius, radius);
    const secondDistance = getPackingContactDistance(second.radius, radius);

    if (
        distance > firstDistance + secondDistance + TUNNEL_PACKING_EPSILON
        || distance < Math.abs(firstDistance - secondDistance) - TUNNEL_PACKING_EPSILON
    ) {
        return [];
    }

    const along = (firstDistance ** 2 - secondDistance ** 2 + distance ** 2) / (2 * distance);
    const heightSquared = firstDistance ** 2 - along ** 2;

    if (heightSquared < -TUNNEL_PACKING_EPSILON) {
        return [];
    }

    const height = Math.sqrt(Math.max(0, heightSquared));
    const ux = dx / distance;
    const uy = dy / distance;
    const baseX = first.x + along * ux;
    const baseY = first.y + along * uy;
    const offsetX = -uy * height;
    const offsetY = ux * height;

    if (height <= TUNNEL_PACKING_EPSILON) {
        return [{ x: baseX, y: baseY }];
    }

    return [
        { x: baseX + offsetX, y: baseY + offsetY },
        { x: baseX - offsetX, y: baseY - offsetY },
    ];
}

function isPackingPositionClear(placed, radius, candidate) {
    for (const circle of placed) {
        const distance = Math.hypot(candidate.x - circle.x, candidate.y - circle.y);
        const contactDistance = getPackingContactDistance(circle.radius, radius);

        if (distance < contactDistance - TUNNEL_PACKING_EPSILON) {
            return false;
        }
    }

    return true;
}

function getPackingScore(placed, radius, candidate) {
    const bounds = getPackedBounds([...placed, { radius, x: candidate.x, y: candidate.y }]);
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    const area = width * height;
    const longestSide = Math.max(width, height);
    const aspectPenalty = Math.abs(width - height);
    const centerPenalty = Math.hypot(centerX, centerY);

    return area + longestSide * 0.35 + aspectPenalty * 0.2 + centerPenalty * 0.08;
}

function getFallbackPackingPosition(placed, radius) {
    const bounds = getPackedBounds(placed);
    const maxRadius = Math.max(radius, ...placed.map((circle) => circle.radius));
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;

    for (let ring = 1; ring <= 12; ring += 1) {
        const distance = ring * maxRadius;

        for (let step = 0; step < 24; step += 1) {
            const angle = (step / 24) * TWO_PI;
            const candidate = {
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
            };

            if (isPackingPositionClear(placed, radius, candidate)) {
                return candidate;
            }
        }
    }

    return {
        x: bounds.maxX + radius,
        y: centerY,
    };
}

function centerPackedFactors(placed) {
    const bounds = getPackedBounds(placed);
    const offsetX = (bounds.minX + bounds.maxX) / 2;
    const offsetY = (bounds.minY + bounds.maxY) / 2;

    return placed.map((circle) => ({
        factor: circle.factor,
        radius: circle.radius,
        x: circle.x - offsetX,
        y: circle.y - offsetY,
    }));
}

function getPackedBounds(circles) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const circle of circles) {
        minX = Math.min(minX, circle.x - circle.radius);
        maxX = Math.max(maxX, circle.x + circle.radius);
        minY = Math.min(minY, circle.y - circle.radius);
        maxY = Math.max(maxY, circle.y + circle.radius);
    }

    return { minX, maxX, minY, maxY };
}

function getPackingContactDistance(firstRadius, secondRadius) {
    return Math.max(
        0,
        firstRadius + secondRadius - Math.min(firstRadius, secondRadius) * TUNNEL_BALL_CONTACT_OVERLAP,
    );
}

function getSizedOrderedFactors(factors, maxRadius) {
    const orderedFactors = [...factors].sort(compareFactorDescending);
    const uniqueFactors = [...new Set(orderedFactors.map((factor) => getFactorValue(factor).toString()))]
        .map((factor) => BigInt(factor))
        .sort(compareBigIntDescending);

    if (uniqueFactors.length <= 1) {
        return orderedFactors.map((factor) => ({
            factor,
            radius: maxRadius,
        }));
    }

    const largest = uniqueFactors[0];
    const smallest = uniqueFactors[uniqueFactors.length - 1];
    const largestLog = getBigIntNaturalLog(largest);
    const smallestLog = getBigIntNaturalLog(smallest);
    const logRange = Math.max(0, largestLog - smallestLog);
    const spread = THREE.MathUtils.clamp(
        logRange / (Math.log(10) * TUNNEL_FACTOR_SIZE_FULL_SPREAD_ORDERS),
        TUNNEL_FACTOR_SIZE_CLOSE_SPREAD,
        1,
    );
    const minRadius = Math.min(
        maxRadius,
        Math.max(
            TUNNEL_RELATIVE_MIN_BALL_RADIUS,
            maxRadius * (1 - TUNNEL_FACTOR_SIZE_MAX_RELATIVE_DROP * spread),
        ),
    );
    const radiusRange = Math.max(0.01, maxRadius - minRadius);
    const radiusByFactor = new Map();

    for (let index = 0; index < uniqueFactors.length; index += 1) {
        const factor = uniqueFactors[index];
        const normalizedByValue = logRange === 0
            ? 0
            : (getBigIntNaturalLog(factor) - smallestLog) / logRange;
        const normalizedByRank = uniqueFactors.length === 1
            ? 1
            : 1 - index / (uniqueFactors.length - 1);
        const normalized = THREE.MathUtils.clamp(
            normalizedByValue * 0.88 + normalizedByRank * 0.12,
            0,
            1,
        );

        radiusByFactor.set(factor.toString(), minRadius + radiusRange * normalized);
    }

    return orderedFactors.map((factor) => ({
        factor,
        radius: radiusByFactor.get(getFactorValue(factor).toString()) ?? maxRadius,
    }));
}

function compareFactorDescending(a, b) {
    return compareBigIntDescending(getFactorValue(a), getFactorValue(b));
}

function compareBigIntDescending(a, b) {
    if (a === b) {
        return 0;
    }

    return a > b ? -1 : 1;
}

function getBigIntNaturalLog(value) {
    const text = value.toString();

    if (text.length < 16) {
        return Math.log(Number(value));
    }

    const leadingDigits = Number(text.slice(0, 15));
    return Math.log(leadingDigits) + (text.length - 15) * Math.log(10);
}

function createFactorMesh(factor, value, radius) {
    const mesh = new THREE.Mesh(sphereGeometry, getMaterialForFactor(factor));
    mesh.userData.factor = factor;
    mesh.userData.value = value;
    mesh.userData.baseRadius = radius;
    mesh.userData.tooltipKind = "tunnelFactor";
    mesh.visible = false;
    mesh.scale.setScalar(radius);

    if (isUnresolvedCofactor(factor)) {
        mesh.add(createCofactorWireframeMesh());
    } else if (isProbablePrimeFactor(factor)) {
        mesh.add(createProbablePrimeWireframeMesh());
    }

    sphereMeshes.push(mesh);
    return mesh;
}

function createCofactorWireframeMesh() {
    const wireframe = new THREE.Mesh(sphereGeometry, cofactorWireframeMaterial);
    wireframe.scale.setScalar(1.015);
    return wireframe;
}

function createProbablePrimeWireframeMesh() {
    const wireframe = new THREE.Mesh(sphereGeometry, probablePrimeWireframeMaterial);
    wireframe.scale.setScalar(1.012);
    return wireframe;
}

function createSelectedOutlineMesh() {
    const outline = new THREE.Mesh(sphereGeometry, selectedOutlineMaterial);
    outline.scale.setScalar(1.18);
    outline.visible = false;
    return outline;
}

function createNumberSprite(text) {
    const metrics = getNumberLabelCanvasMetrics(text);
    const canvas2d = document.createElement("canvas");
    canvas2d.width = metrics.width;
    canvas2d.height = NUMBER_LABEL_CANVAS_HEIGHT;

    const context = canvas2d.getContext("2d");
    context.clearRect(0, 0, canvas2d.width, canvas2d.height);
    context.font = `${metrics.fontSize}px Arial, Helvetica, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowColor = "rgba(0, 0, 0, 0.9)";
    context.shadowBlur = NUMBER_LABEL_SHADOW_BLUR;
    context.lineWidth = NUMBER_LABEL_LINE_WIDTH;
    context.strokeStyle = "rgba(0, 0, 0, 0.75)";
    context.strokeText(text, canvas2d.width / 2, canvas2d.height / 2);
    context.fillStyle = "#f1f1f1";
    context.fillText(text, canvas2d.width / 2, canvas2d.height / 2);

    const texture = new THREE.CanvasTexture(canvas2d);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: true,
        depthWrite: false,
    });
    const sprite = new THREE.Sprite(material);
    sprite.userData.disposeMaterial = true;
    sprite.userData.labelCanvasAspect = canvas2d.width / canvas2d.height;
    setNumberSpriteHeight(sprite, TUNNEL_NUMBER_LABEL_HEIGHT);
    return sprite;
}

function getNumberLabelCanvasMetrics(text) {
    const canvas2d = document.createElement("canvas");
    const context = canvas2d.getContext("2d");
    context.font = `${NUMBER_LABEL_FONT_SIZE}px Arial, Helvetica, sans-serif`;

    const measuredWidth = context.measureText(text).width;
    const reservedWidth = NUMBER_LABEL_HORIZONTAL_PADDING * 2
        + NUMBER_LABEL_LINE_WIDTH * 2
        + NUMBER_LABEL_SHADOW_BLUR * 2;
    const requiredWidth = Math.ceil(measuredWidth + reservedWidth);
    const width = getNextPowerOfTwo(Math.min(
        NUMBER_LABEL_MAX_CANVAS_WIDTH,
        Math.max(NUMBER_LABEL_BASE_CANVAS_WIDTH, requiredWidth),
    ));
    const drawableWidth = Math.max(1, width - reservedWidth);
    const fontSize = measuredWidth <= drawableWidth
        ? NUMBER_LABEL_FONT_SIZE
        : Math.max(1, Math.floor(NUMBER_LABEL_FONT_SIZE * (drawableWidth / measuredWidth)));

    return { width, fontSize };
}

function setNumberSpriteHeight(sprite, height) {
    const aspect = sprite.userData.labelCanvasAspect
        ?? NUMBER_LABEL_BASE_CANVAS_WIDTH / NUMBER_LABEL_CANVAS_HEIGHT;

    sprite.scale.set(height * aspect, height, 1);
}

function getNextPowerOfTwo(value) {
    return 2 ** Math.ceil(Math.log2(Math.max(1, value)));
}

function updateSelectedDetailView() {
    const selectedIndex = getSelectedTunnelIndex();
    const value = getTunnelValueForIndex(selectedIndex);

    if (selectedDetailValue !== value) {
        rebuildSelectedDetailContent(selectedIndex, value);
    }

    selectedDetailGroup.position.set(
        0,
        TUNNEL_CAMERA_Y_OFFSET,
        tunnelCamera.position.z - SELECTED_DETAIL_DISTANCE,
    );
}

function rebuildSelectedDetailContent(selectedIndex, value) {
    clearSelectedDetailContent();
    selectedDetailValue = value;

    const factors = getPrimeFactors(value);
    const packedFactors = getSelectedDetailPackedFactors(selectedIndex, factors);
    const bounds = getPackedBounds(packedFactors);

    for (const { factor, radius, x, y } of packedFactors) {
        const mesh = createSelectedDetailFactorMesh(factor, value, radius);
        mesh.position.set(x, y, 0);

        const factorLabel = createFactorSurfaceLabel(formatBigIntWithCommas(getFactorValue(factor)), radius);
        mesh.add(factorLabel);

        selectedDetailGroup.add(mesh);
    }

    const label = createNumberSprite(formatBigIntWithCommas(value));
    setNumberSpriteHeight(label, SELECTED_DETAIL_NUMBER_LABEL_HEIGHT);
    label.position.set(
        0,
        bounds.maxY + SELECTED_DETAIL_LABEL_GAP,
        SELECTED_DETAIL_LABEL_SCREEN_OFFSET,
    );
    selectedDetailGroup.add(label);
}

function getSelectedDetailPackedFactors(selectedIndex, factors) {
    const tunnelItem = getTunnelItemByIndex(selectedIndex);
    const tunnelPackedFactors = tunnelItem?.packedFactors?.length
        ? tunnelItem.packedFactors
        : getTunnelPackedFactors(factors);
    const scale = getSelectedDetailLayoutScale(tunnelPackedFactors);

    return tunnelPackedFactors.map((circle) => ({
        factor: circle.factor,
        radius: circle.radius * scale,
        x: circle.x * scale,
        y: circle.y * scale,
    }));
}

function getSelectedDetailLayoutScale(packedFactors) {
    if (packedFactors.length === 0) {
        return 1;
    }

    const bounds = getPackedBounds(packedFactors);
    const diameter = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
    const maxRadius = Math.max(...packedFactors.map((circle) => circle.radius));
    const radiusScale = maxRadius > 0
        ? SELECTED_DETAIL_MAX_BALL_RADIUS / maxRadius
        : 1;
    const diameterScale = diameter > 0
        ? SELECTED_DETAIL_MAX_CLUSTER_DIAMETER / diameter
        : radiusScale;

    return Math.min(radiusScale, diameterScale);
}

function clearSelectedDetailContent() {
    for (const child of [...selectedDetailGroup.children]) {
        disposeMarkedObject(child);
        selectedDetailGroup.remove(child);
    }

    selectedDetailValue = null;
}

function createSelectedDetailFactorMesh(factor, value, radius) {
    const mesh = new THREE.Mesh(sphereGeometry, getMaterialForFactor(factor));
    mesh.userData.factor = factor;
    mesh.userData.value = value;
    mesh.userData.baseRadius = radius;
    mesh.userData.tooltipKind = "selectedDetailFactor";
    mesh.scale.setScalar(radius);

    if (isUnresolvedCofactor(factor)) {
        mesh.add(createCofactorWireframeMesh());
    } else if (isProbablePrimeFactor(factor)) {
        mesh.add(createProbablePrimeWireframeMesh());
    }

    const outline = createSelectedOutlineMesh();
    outline.visible = true;
    outline.scale.setScalar(1.12);
    mesh.add(outline);

    return mesh;
}

function createFactorSurfaceLabel(text, radius) {
    const metrics = getFactorSurfaceLabelMetrics(text, radius);
    const canvas2d = document.createElement("canvas");
    canvas2d.width = metrics.canvasWidth;
    canvas2d.height = FACTOR_SURFACE_LABEL_CANVAS_HEIGHT;

    const context = canvas2d.getContext("2d");
    context.clearRect(0, 0, canvas2d.width, canvas2d.height);
    context.font = `${FACTOR_SURFACE_LABEL_FONT_SIZE}px Arial, Helvetica, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineWidth = FACTOR_SURFACE_LABEL_LINE_WIDTH;
    context.strokeStyle = "rgba(0, 0, 0, 0.85)";
    context.strokeText(text, canvas2d.width / 2, canvas2d.height / 2);
    context.fillStyle = "#ffffff";
    context.fillText(text, canvas2d.width / 2, canvas2d.height / 2);

    const texture = new THREE.CanvasTexture(canvas2d);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false,
    });
    const sprite = new THREE.Sprite(material);
    const height = FACTOR_SURFACE_LABEL_HEIGHT * metrics.fitScale;
    const width = height * metrics.canvasAspect;
    sprite.scale.set(width / radius, height / radius, height / radius);
    sprite.position.set(0, 0, FACTOR_SURFACE_LABEL_Z_OFFSET);
    sprite.userData.disposeMaterial = true;
    return sprite;
}

function getFactorSurfaceLabelMetrics(text, radius) {
    const canvas2d = document.createElement("canvas");
    canvas2d.height = FACTOR_SURFACE_LABEL_CANVAS_HEIGHT;

    const context = canvas2d.getContext("2d");
    context.font = `${FACTOR_SURFACE_LABEL_FONT_SIZE}px Arial, Helvetica, sans-serif`;
    const textMetrics = context.measureText(text);
    const textWidth = getMeasuredTextInkWidth(textMetrics);
    const strokeWidth = FACTOR_SURFACE_LABEL_LINE_WIDTH;
    const inkWidth = textWidth + strokeWidth;
    const canvasMargin = Math.ceil(strokeWidth + 2);
    const canvasWidth = Math.ceil(inkWidth + canvasMargin * 2);
    const baseWorldTextWidth = (inkWidth / FACTOR_SURFACE_LABEL_CANVAS_HEIGHT)
        * FACTOR_SURFACE_LABEL_HEIGHT;
    const edgeInsetWidth = (FACTOR_SURFACE_LABEL_EDGE_INSET_PIXELS * 2 / FACTOR_SURFACE_LABEL_CANVAS_HEIGHT)
        * FACTOR_SURFACE_LABEL_HEIGHT;
    const fitWidth = Math.max(0.01, radius * 2 - edgeInsetWidth);
    const fitScale = baseWorldTextWidth <= fitWidth
        ? 1
        : fitWidth / baseWorldTextWidth;

    return {
        canvasWidth,
        canvasAspect: canvasWidth / FACTOR_SURFACE_LABEL_CANVAS_HEIGHT,
        fitScale,
    };
}

function getMeasuredTextInkWidth(textMetrics) {
    const inkWidth = textMetrics.actualBoundingBoxLeft + textMetrics.actualBoundingBoxRight;

    if (Number.isFinite(inkWidth) && inkWidth > 0) {
        return inkWidth;
    }

    return textMetrics.width;
}

function getPrimeFactors(value) {
    const cacheKey = value.toString();
    const cachedFactors = factorizationCache.get(cacheKey);
    const factors = expandKnownAsyncCofactors(cachedFactors ?? computePrimeFactors(value));

    rememberFactorization(cacheKey, factors);
    scheduleAsyncCofactorFactorizations(factors);
    return factors;
}

function computePrimeFactors(value) {
    if (value === 1n) {
        return [createFactor(1n, FACTOR_STATUS.EXACT_PRIME)];
    }

    const factors = [];
    let remainder = value;

    for (const primeNumber of primesArray) {
        const prime = BigInt(primeNumber);

        if (prime * prime > remainder) {
            break;
        }

        while (remainder % prime === 0n) {
            factors.push(createFactor(prime, FACTOR_STATUS.EXACT_PRIME));
            remainder /= prime;
        }
    }

    if (remainder > 1n) {
        factors.push(createFactor(remainder, classifyRemainingCofactor(remainder)));
    }

    return factors;
}

function rememberFactorization(cacheKey, factors) {
    factorizationCache.delete(cacheKey);
    factorizationCache.set(cacheKey, factors);

    if (factorizationCache.size <= FACTORIZATION_CACHE_MAX_ENTRIES) {
        return;
    }

    const oldestKey = factorizationCache.keys().next().value;
    factorizationCache.delete(oldestKey);
}

function expandKnownAsyncCofactors(factors) {
    let changed = false;
    const expandedFactors = [];

    for (const factor of factors) {
        const factorValue = getFactorValue(factor);
        const resolvedCofactor = asyncCofactorFactorizations.get(factorValue.toString());

        if (getFactorStatus(factor) === FACTOR_STATUS.COMPOSITE_COFACTOR && resolvedCofactor) {
            changed = true;

            if (resolvedCofactor.status === "resolved") {
                expandedFactors.push(...resolvedCofactor.factors);
            } else {
                expandedFactors.push(createFactor(factorValue, FACTOR_STATUS.UNKNOWN_COFACTOR));
            }

            continue;
        }

        expandedFactors.push(factor);
    }

    return changed ? expandedFactors : factors;
}

function scheduleAsyncCofactorFactorizations(factors) {
    for (const factor of factors) {
        if (getFactorStatus(factor) === FACTOR_STATUS.COMPOSITE_COFACTOR) {
            scheduleAsyncCofactorFactorization(getFactorValue(factor));
        }
    }
}

function scheduleAsyncCofactorFactorization(value) {
    const key = value.toString();

    if (
        asyncCofactorFactorizations.has(key)
        || pendingAsyncCofactors.has(key)
        || pendingAsyncCofactors.size >= ASYNC_COFACTOR_QUEUE_LIMIT
    ) {
        return;
    }

    if (!ensureFactorizationWorker()) {
        return;
    }

    pendingAsyncCofactors.add(key);
    asyncCofactorQueue.push({ value: key });
    pumpAsyncCofactorQueue();
}

function ensureFactorizationWorker() {
    if (factorizationWorker) {
        return factorizationWorker;
    }

    if (factorizationWorkerUnavailable || typeof Worker === "undefined") {
        return null;
    }

    try {
        factorizationWorker = new Worker(new URL("./factor-worker.js", import.meta.url));
    } catch (error) {
        factorizationWorkerUnavailable = true;
        console.warn("Async cofactor factorization is unavailable.", error);
        return null;
    }

    factorizationWorker.addEventListener("message", handleAsyncCofactorMessage);
    factorizationWorker.addEventListener("error", handleAsyncCofactorError);
    return factorizationWorker;
}

function pumpAsyncCofactorQueue() {
    if (activeAsyncCofactorTask || asyncCofactorQueue.length === 0) {
        return;
    }

    const worker = ensureFactorizationWorker();

    if (!worker) {
        return;
    }

    activeAsyncCofactorTask = {
        id: nextAsyncCofactorTaskId,
        value: asyncCofactorQueue.shift().value,
    };
    nextAsyncCofactorTaskId += 1;

    worker.postMessage({
        id: activeAsyncCofactorTask.id,
        value: activeAsyncCofactorTask.value,
        timeBudgetMs: ASYNC_COFACTOR_TIME_BUDGET_MS,
    });
}

function handleAsyncCofactorMessage(event) {
    if (!activeAsyncCofactorTask || event.data?.id !== activeAsyncCofactorTask.id) {
        return;
    }

    const cofactorKey = activeAsyncCofactorTask.value;
    pendingAsyncCofactors.delete(cofactorKey);
    activeAsyncCofactorTask = null;

    if (event.data.status === "resolved" && Array.isArray(event.data.factors) && event.data.factors.length > 0) {
        asyncCofactorFactorizations.set(cofactorKey, {
            status: "resolved",
            factors: event.data.factors.map((factor) => createAsyncResolvedFactor(BigInt(factor))),
        });
    } else {
        asyncCofactorFactorizations.set(cofactorKey, { status: "unknown" });
    }

    refreshFactorizationsForResolvedCofactor(cofactorKey);
    scheduleVisibleCompositeCofactors();
    pumpAsyncCofactorQueue();
}

function handleAsyncCofactorError(error) {
    console.warn("Async cofactor factorization failed.", error);

    if (activeAsyncCofactorTask) {
        const cofactorKey = activeAsyncCofactorTask.value;
        pendingAsyncCofactors.delete(cofactorKey);
        asyncCofactorFactorizations.set(cofactorKey, { status: "unknown" });
        activeAsyncCofactorTask = null;
        refreshFactorizationsForResolvedCofactor(cofactorKey);
    }

    if (factorizationWorker) {
        factorizationWorker.terminate();
    }

    factorizationWorker = null;
    factorizationWorkerUnavailable = true;
}

function createAsyncResolvedFactor(value) {
    return createFactor(
        value,
        getAsyncResolvedPrimeStatus(value),
    );
}

function getAsyncResolvedPrimeStatus(value) {
    if (value <= MAX_PRIME_BIGINT && primeIndices.has(Number(value))) {
        return FACTOR_STATUS.EXACT_PRIME;
    }

    if (
        value <= DETERMINISTIC_MILLER_RABIN_MAX
        && isPrimeWithMillerRabinWitnesses(value, DETERMINISTIC_MILLER_RABIN_WITNESSES)
    ) {
        return FACTOR_STATUS.EXACT_PRIME;
    }

    return FACTOR_STATUS.PROBABLE_PRIME;
}

function refreshFactorizationsForResolvedCofactor(cofactorKey) {
    refreshFactorizationCacheForCofactor(cofactorKey);
    refreshVisibleFactorizationsForCofactor(cofactorKey);
}

function refreshFactorizationCacheForCofactor(cofactorKey) {
    for (const [cacheKey, factors] of factorizationCache) {
        if (!factorsContainCofactor(factors, cofactorKey)) {
            continue;
        }

        factorizationCache.set(cacheKey, expandKnownAsyncCofactors(factors));
    }
}

function refreshVisibleFactorizationsForCofactor(cofactorKey) {
    let refreshedItem = false;

    for (const item of [...tunnelItems]) {
        if (!factorsContainCofactor(item.factors, cofactorKey)) {
            continue;
        }

        updateTunnelItemContent(item, item.globalIndex);
        refreshedItem = true;
    }

    const selectedNeedsRefresh = selectedDetailGroup.children.some((child) => (
        child.isMesh
        && child.userData.factor !== undefined
        && getFactorValue(child.userData.factor).toString() === cofactorKey
    ));

    if (selectedNeedsRefresh && selectedDetailValue !== null) {
        rebuildSelectedDetailContent(getSelectedTunnelIndex(), selectedDetailValue);
    }

    if (refreshedItem || selectedNeedsRefresh) {
        setHoveredMesh(null);
        hideTooltip();
    }
}

function scheduleVisibleCompositeCofactors() {
    for (const item of tunnelItems) {
        scheduleAsyncCofactorFactorizations(item.factors);
    }
}

function factorsContainCofactor(factors, cofactorKey) {
    return factors.some((factor) => (
        getFactorStatus(factor) === FACTOR_STATUS.COMPOSITE_COFACTOR
        && getFactorValue(factor).toString() === cofactorKey
    ));
}

function classifyRemainingCofactor(remainder) {
    if (remainder <= MAX_PRIME_SQUARED) {
        return FACTOR_STATUS.EXACT_PRIME;
    }

    if (remainder <= DETERMINISTIC_MILLER_RABIN_MAX) {
        return isPrimeWithMillerRabinWitnesses(remainder, DETERMINISTIC_MILLER_RABIN_WITNESSES)
            ? FACTOR_STATUS.EXACT_PRIME
            : FACTOR_STATUS.COMPOSITE_COFACTOR;
    }

    if (remainder.toString().length > MILLER_RABIN_MAX_DECIMAL_DIGITS) {
        return FACTOR_STATUS.UNKNOWN_COFACTOR;
    }

    return isProbablePrime(remainder)
        ? FACTOR_STATUS.PROBABLE_PRIME
        : FACTOR_STATUS.COMPOSITE_COFACTOR;
}

function isProbablePrime(value) {
    return isPrimeWithMillerRabinWitnesses(value, MILLER_RABIN_WITNESSES);
}

function isPrimeWithMillerRabinWitnesses(value, witnesses) {
    if (value < 2n) {
        return false;
    }

    if (value === 2n || value === 3n) {
        return true;
    }

    if (value % 2n === 0n) {
        return false;
    }

    let oddPart = value - 1n;
    let powerOfTwo = 0;

    while (oddPart % 2n === 0n) {
        oddPart /= 2n;
        powerOfTwo += 1;
    }

    for (const witness of witnesses) {
        const base = witness % value;

        if (base < 2n) {
            continue;
        }

        if (isMillerRabinCompositeWitness(value, base, oddPart, powerOfTwo)) {
            return false;
        }
    }

    return true;
}

function isMillerRabinCompositeWitness(value, witness, oddPart, powerOfTwo) {
    let x = modPow(witness, oddPart, value);

    if (x === 1n || x === value - 1n) {
        return false;
    }

    for (let step = 1; step < powerOfTwo; step += 1) {
        x = (x * x) % value;

        if (x === value - 1n) {
            return false;
        }
    }

    return true;
}

function modPow(base, exponent, modulus) {
    let result = 1n;
    let currentBase = base % modulus;
    let currentExponent = exponent;

    while (currentExponent > 0n) {
        if (currentExponent % 2n === 1n) {
            result = (result * currentBase) % modulus;
        }

        currentBase = (currentBase * currentBase) % modulus;
        currentExponent /= 2n;
    }

    return result;
}

function createFactor(value, status) {
    return { value, status };
}

function serializeFactor(factor) {
    return {
        value: getFactorValue(factor).toString(),
        status: getFactorStatus(factor),
    };
}

function getFactorValue(factor) {
    return typeof factor === "bigint" ? factor : factor.value;
}

function getFactorStatus(factor) {
    return typeof factor === "bigint" ? FACTOR_STATUS.EXACT_PRIME : factor.status;
}

function isUnresolvedCofactor(factor) {
    const status = getFactorStatus(factor);

    return status === FACTOR_STATUS.COMPOSITE_COFACTOR
        || status === FACTOR_STATUS.UNKNOWN_COFACTOR;
}

function isProbablePrimeFactor(factor) {
    return getFactorStatus(factor) === FACTOR_STATUS.PROBABLE_PRIME;
}

function getMaterialForFactor(factor) {
    const colorScheme = getColorSchemeForFactor(factor);
    const cacheKey = getColorSchemeCacheKey(colorScheme);

    if (materialCache.has(cacheKey)) {
        return materialCache.get(cacheKey);
    }

    const material = colorScheme.kind === "hybrid"
        ? createHybridFactorMaterial(colorScheme.topColor, colorScheme.bottomColor)
        : createSingleFactorMaterial(colorScheme.color);

    materialCache.set(cacheKey, material);
    return material;
}

function createSingleFactorMaterial(color) {
    const isBlack = color === "#000000";

    return new THREE.MeshStandardMaterial({
        color,
        roughness: isBlack ? 0.3 : 0.42,
        metalness: isBlack ? 0.02 : 0.08,
        emissive: isBlack ? new THREE.Color("#050505") : new THREE.Color("#000000"),
    });
}

function createHybridFactorMaterial(topColor, bottomColor) {
    const material = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.42,
        metalness: 0.08,
    });

    material.onBeforeCompile = (shader) => {
        shader.uniforms.topHemisphereColor = { value: new THREE.Color(topColor) };
        shader.uniforms.bottomHemisphereColor = { value: new THREE.Color(bottomColor) };
        shader.vertexShader = `
varying vec3 vFactorObjectPosition;
${shader.vertexShader}
`.replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
vFactorObjectPosition = transformed;`,
        );
        shader.fragmentShader = `
uniform vec3 topHemisphereColor;
uniform vec3 bottomHemisphereColor;
varying vec3 vFactorObjectPosition;
${shader.fragmentShader}
`.replace(
            "#include <color_fragment>",
            `#include <color_fragment>
diffuseColor.rgb *= mix(bottomHemisphereColor, topHemisphereColor, step(0.0, vFactorObjectPosition.y));`,
        );
    };
    material.customProgramCacheKey = () => "factor-hybrid-hemisphere";
    return material;
}

function getColorSchemeCacheKey(colorScheme) {
    return colorScheme.kind === "hybrid"
        ? `hybrid:${colorScheme.topColor}:${colorScheme.bottomColor}`
        : `single:${colorScheme.color}`;
}

function updateFactorMaterials() {
    for (const mesh of sphereMeshes) {
        mesh.material = getMaterialForFactor(mesh.userData.factor);
    }

    selectedDetailGroup.traverse((child) => {
        if (child.isMesh && child.userData.factor !== undefined) {
            child.material = getMaterialForFactor(child.userData.factor);
        }
    });
}

function getColorSchemeForFactor(factor) {
    const factorValue = getFactorValue(factor);

    if (isUnresolvedCofactor(factor)) {
        return {
            kind: "single",
            color: "#777777",
        };
    }

    const palette = COLOR_PALETTES[activeColorMode] ?? COLOR_PALETTES.simple;
    const directColor = palette.get(factorValue.toString());

    if (directColor !== undefined) {
        return {
            kind: "single",
            color: directColor,
        };
    }

    const primeIndex = getExactPrimeIndex(factorValue);

    if (primeIndex === null) {
        return {
            kind: "single",
            color: "#000000",
        };
    }

    const colorSequence = PRIME_COLOR_SEQUENCES[activeColorMode] ?? PRIME_COLOR_SEQUENCES.simple;
    const pairIndex = primeIndex - colorSequence.length - 1;
    const pair = getColorPairByIndex(pairIndex, colorSequence.length);

    if (pair === null) {
        return {
            kind: "single",
            color: "#000000",
        };
    }

    return {
        kind: "hybrid",
        topColor: colorSequence[pair[0]],
        bottomColor: colorSequence[pair[1]],
    };
}

function getColorPairByIndex(pairIndex, colorCount) {
    if (pairIndex < 0 || colorCount < 2) {
        return null;
    }

    let remaining = pairIndex;

    for (let first = 0; first < colorCount - 1; first += 1) {
        const rowLength = colorCount - first - 1;

        if (remaining < rowLength) {
            return [first, first + 1 + remaining];
        }

        remaining -= rowLength;
    }

    return null;
}

function getExactPrimeIndex(factor) {
    const asNumber = Number(getFactorValue(factor));

    if (!Number.isSafeInteger(asNumber)) {
        return null;
    }

    return primeIndices.get(asNumber) ?? null;
}

function resizeRenderer() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);

    tunnelCamera.aspect = width / height;
    tunnelCamera.updateProjectionMatrix();
}

function render(time) {
    const deltaSeconds = previousRenderTime === 0
        ? 1 / 60
        : Math.min(0.05, (time - previousRenderTime) / 1000);
    previousRenderTime = time;

    const lightSweep = time * 0.0004;
    keyLight.position.x = Math.cos(lightSweep) * 260 - 80;
    keyLight.position.y = 360 + Math.sin(lightSweep * 0.7) * 80;

    updateTunnelKeyboardControls(deltaSeconds);
    smoothTunnelMotion(deltaSeconds);
    updateTunnelWindow();
    updateTunnelCamera();
    updateSelectedDetailView();
    updateTunnelVisibility();

    renderer.render(scene, tunnelCamera);
}

function updateTunnelCamera() {
    const localTravel = tunnelTravel - tunnelAnchorIndex;
    const cameraZ = getTunnelCameraStartZ() - (localTravel / getNumbersPerLoop()) * TUNNEL_PITCH;

    tunnelCamera.position.set(0, TUNNEL_CAMERA_Y_OFFSET, cameraZ);
    tunnelCamera.lookAt(0, TUNNEL_CAMERA_Y_OFFSET, cameraZ - 120);
    tunnelHeadLight.position.set(0, TUNNEL_CAMERA_Y_OFFSET, cameraZ + 7);
}

function updateTunnelKeyboardControls(deltaSeconds) {
    if (isInteractiveControl(document.activeElement)) {
        return;
    }

    const now = performance.now() / 1000;
    const isShiftHeld = activeTunnelKeys.has("shift");
    const repeatInterval = 1 / (isShiftHeld ? TUNNEL_SHIFT_REPEAT_PER_SECOND : TUNNEL_KEY_REPEAT_PER_SECOND);

    for (const [key, state] of activeTunnelKeys) {
        if (key === "shift") {
            continue;
        }

        while (state.nextRepeatTime <= now) {
            triggerTunnelKeyStep(key);
            state.nextRepeatTime += repeatInterval;
        }
    }

}

function smoothTunnelMotion(deltaSeconds) {
    const smoothing = 1 - Math.exp(-TUNNEL_SMOOTHING * deltaSeconds);
    tunnelTravel += (tunnelTargetTravel - tunnelTravel) * smoothing;
    tunnelRotation += (tunnelTargetRotation - tunnelRotation) * smoothing;

    if (Math.abs(tunnelTargetTravel - tunnelTravel) < 0.0005) {
        tunnelTravel = tunnelTargetTravel;
    }

    if (Math.abs(tunnelTargetRotation - tunnelRotation) < 0.0005) {
        tunnelRotation = tunnelTargetRotation;
    }
}

function updateTunnelWindow() {
    if (tunnelItems.length === 0) {
        return;
    }

    const numbersPerLoop = getNumbersPerLoop();
    const renderCount = numbersPerLoop * TUNNEL_LOOP_COUNT;
    const targetMinIndex = getTunnelTargetMinIndex();

    if (tunnelItems.length !== renderCount) {
        generateTunnel(tunnelStartNumber, numbersPerLoop);
        return;
    }

    const currentMin = getTunnelMinIndex();
    const currentMax = getTunnelMaxIndex();

    if (Math.abs(targetMinIndex - currentMin) > renderCount) {
        resetTunnelWindow(targetMinIndex);
        return;
    }

    recycleTunnelItems(targetMinIndex, currentMin, currentMax);
    tunnelAnchorIndex = targetMinIndex;
}

function recycleTunnelItems(targetMinIndex, initialMin, initialMax) {
    let currentMin = initialMin;
    let currentMax = initialMax;
    const targetMaxIndex = targetMinIndex + tunnelItems.length - 1;

    while (currentMin < targetMinIndex) {
        const item = getTunnelItemByIndex(currentMin);
        updateTunnelItemContent(item, currentMax + 1);
        currentMin += 1;
        currentMax += 1;
    }

    while (currentMax > targetMaxIndex && currentMin > getTunnelMinimumIndex()) {
        const item = getTunnelItemByIndex(currentMax);
        updateTunnelItemContent(item, currentMin - 1);
        currentMin -= 1;
        currentMax -= 1;
    }

    currentEndNumber = getTunnelValueForIndex(currentMax);
}

function resetTunnelWindow(startIndex) {
    for (let index = 0; index < tunnelItems.length; index += 1) {
        updateTunnelItemContent(tunnelItems[index], startIndex + index);
    }

    tunnelAnchorIndex = startIndex;
    currentEndNumber = getTunnelValueForIndex(startIndex + tunnelItems.length - 1);
}

function getTunnelMinIndex() {
    let minIndex = Infinity;

    for (const item of tunnelItems) {
        minIndex = Math.min(minIndex, item.globalIndex);
    }

    return minIndex;
}

function getTunnelMaxIndex() {
    let maxIndex = -Infinity;

    for (const item of tunnelItems) {
        maxIndex = Math.max(maxIndex, item.globalIndex);
    }

    return maxIndex;
}

function getTunnelItemByIndex(globalIndex) {
    return tunnelItems.find((item) => item.globalIndex === globalIndex);
}

function getTunnelTargetMinIndex() {
    const backBufferNumbers = getNumbersPerLoop() * TUNNEL_BACK_BUFFER_LOOP_COUNT;
    return Math.max(getTunnelMinimumIndex(), Math.floor(tunnelTravel) - backBufferNumbers);
}

function getTunnelMinimumIndex() {
    const numbersPerLoop = getNumbersPerLoop();

    if (tunnelStartNumber <= BigInt(Number.MAX_SAFE_INTEGER)) {
        const previousNumberCount = Number(tunnelStartNumber - 1n);
        return -Math.floor(previousNumberCount / numbersPerLoop) * numbersPerLoop;
    }

    return -Number.MAX_SAFE_INTEGER;
}

function updateTunnelVisibility() {
    visibleMeshes = [];
    const numbersPerLoop = getNumbersPerLoop();
    const selectedIndex = getSelectedTunnelIndex();

    for (const item of tunnelItems) {
        updateTunnelItemTransform(item, numbersPerLoop);
        const distance = item.group.position.z - tunnelCamera.position.z;
        const isVisible = distance < TUNNEL_BACK_CULL_DEPTH && distance > -TUNNEL_VIEW_DEPTH;
        item.group.visible = isVisible;

        if (isVisible) {
            for (const mesh of item.meshes) {
                if (mesh.userData.outline) {
                    mesh.userData.outline.visible = item.globalIndex === selectedIndex;
                }
                mesh.visible = true;
                mesh.scale.setScalar(mesh === hoveredMesh ? mesh.userData.baseRadius * 1.18 : mesh.userData.baseRadius);
                visibleMeshes.push(mesh);
            }
        } else {
            for (const mesh of item.meshes) {
                if (mesh.userData.outline) {
                    mesh.userData.outline.visible = false;
                }
            }
        }
    }

    selectedDetailGroup.traverse((child) => {
        if (child.isMesh && child.userData.tooltipKind === "selectedDetailFactor") {
            visibleMeshes.push(child);
        }
    });
}

function updateTunnelItemTransform(item, numbersPerLoop) {
    const localIndex = item.globalIndex - tunnelAnchorIndex;
    const angle = -(item.globalIndex / numbersPerLoop) * TWO_PI + Math.PI / 2 + tunnelRotation;
    const z = TUNNEL_ENTRY_Z - (localIndex / numbersPerLoop) * TUNNEL_PITCH;
    const radialX = Math.cos(angle);
    const radialY = Math.sin(angle);

    item.group.position.set(radialX * TUNNEL_RADIUS, radialY * TUNNEL_RADIUS, z);
    item.group.rotation.z = angle - Math.PI / 2;

    if (item.label) {
        item.label.position.set(0, getTunnelLabelOffset(item), getTunnelLabelScreenOffset(item));
    }
}

function getTunnelLabelOffset(item) {
    let maxDistance = 0;

    for (const mesh of item.meshes) {
        maxDistance = Math.max(maxDistance, Math.abs(mesh.position.x) + mesh.userData.baseRadius);
    }

    return maxDistance + TUNNEL_LABEL_OUTER_GAP;
}

function getTunnelLabelScreenOffset(item) {
    let maxRadius = 0;

    for (const mesh of item.meshes) {
        maxRadius = Math.max(maxRadius, mesh.userData.baseRadius);
    }

    return maxRadius + TUNNEL_LABEL_SCREEN_PADDING;
}

function getTunnelCameraStartZ() {
    const verticalFov = THREE.MathUtils.degToRad(tunnelCamera.fov);
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * tunnelCamera.aspect);
    const fitDiameter = TUNNEL_RADIUS * 2 + TUNNEL_CAMERA_FIT_PADDING;
    const verticalDistance = fitDiameter / (2 * Math.tan(verticalFov / 2));
    const horizontalDistance = fitDiameter / (2 * Math.tan(horizontalFov / 2));

    return TUNNEL_ENTRY_Z + Math.max(verticalDistance, horizontalDistance);
}

function getTunnelValueForIndex(index) {
    return tunnelStartNumber + BigInt(index);
}

function handleTunnelWheel(event) {
    if (isInteractiveControl(event.target)) {
        return;
    }

    event.preventDefault();
    applyTunnelScrollDelta(normalizeWheelDelta(event));
}

function handleTunnelKeydown(event) {
    if (isInteractiveControl(event.target)) {
        return;
    }

    const key = normalizeTunnelKey(event.key);

    if (isTunnelControlKey(key)) {
        event.preventDefault();

        if (key === "shift") {
            activeTunnelKeys.set(key, { nextRepeatTime: Infinity });
            accelerateHeldTunnelKeys();
            return;
        }

        if (activeTunnelKeys.has(key)) {
            return;
        }

        triggerTunnelKeyStep(key);
        activeTunnelKeys.set(key, {
            nextRepeatTime: performance.now() / 1000 + getTunnelKeyRepeatDelay(),
        });
    }
}

function handleTunnelKeyup(event) {
    activeTunnelKeys.delete(normalizeTunnelKey(event.key));
}

function accelerateHeldTunnelKeys() {
    const now = performance.now() / 1000;

    for (const [key, state] of activeTunnelKeys) {
        if (key !== "shift") {
            state.nextRepeatTime = Math.min(state.nextRepeatTime, now);
        }
    }
}

function getTunnelKeyRepeatDelay() {
    return activeTunnelKeys.has("shift") ? 0 : TUNNEL_KEY_REPEAT_DELAY;
}

function triggerTunnelKeyStep(key) {
    if (key === "w" || key === "arrowup" || key === "pageup") {
        applyTunnelLoopStep(1);
    } else if (key === "s" || key === "arrowdown" || key === "pagedown") {
        applyTunnelLoopStep(-1);
    } else if (key === "a") {
        applyTunnelRotationStep(-1);
    } else if (key === "d") {
        applyTunnelRotationStep(1);
    }
}

function applyTunnelRotationStep(direction) {
    const nextTravel = tunnelTargetTravel + direction;

    if (nextTravel < getTunnelMinimumIndex()) {
        return;
    }

    const rotationDelta = direction * (TWO_PI / getNumbersPerLoop());
    tunnelTargetRotation += rotationDelta;
    applyTunnelTravelDelta(direction);
}

function selectTunnelIndex(globalIndex) {
    const boundedIndex = Math.max(getTunnelMinimumIndex(), globalIndex);
    tunnelTargetTravel = boundedIndex;
    tunnelTargetRotation = getNearestTopRotationForIndex(boundedIndex);
    setHoveredMesh(null);
    hideTooltip();
}

function getNearestTopRotationForIndex(globalIndex) {
    const baseRotation = (globalIndex / getNumbersPerLoop()) * TWO_PI;
    const rotationsFromCurrent = Math.round((tunnelTargetRotation - baseRotation) / TWO_PI);
    return baseRotation + rotationsFromCurrent * TWO_PI;
}

function normalizeTunnelKey(key) {
    if (key === " ") {
        return "space";
    }

    return key.toLowerCase();
}

function isTunnelControlKey(key) {
        return key === "w"
        || key === "s"
        || key === "a"
        || key === "d"
        || key === "arrowup"
        || key === "arrowdown"
        || key === "pageup"
        || key === "pagedown"
        || key === "shift";
}

function normalizeWheelDelta(event) {
    if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        return event.deltaY * 16;
    }

    if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        return event.deltaY * window.innerHeight;
    }

    return event.deltaY;
}

function applyTunnelScrollDelta(deltaY) {
    if (deltaY === 0) {
        return;
    }

    const now = performance.now() / 1000;

    if (now < nextWheelStepTime) {
        return;
    }

    nextWheelStepTime = now + TUNNEL_WHEEL_STEP_COOLDOWN;
    applyTunnelLoopStep(deltaY < 0 ? 1 : -1);
}

function applyTunnelLoopStep(direction) {
    const deltaNumbers = direction * getNumbersPerLoop();
    const nextTravel = tunnelTargetTravel + deltaNumbers;

    if (nextTravel < getTunnelMinimumIndex()) {
        return;
    }

    applyTunnelTravelDelta(deltaNumbers);
}

function applyTunnelTravelDelta(deltaNumbers) {
    const nextTravel = Math.max(getTunnelMinimumIndex(), tunnelTargetTravel + deltaNumbers);

    if (nextTravel === tunnelTargetTravel) {
        return;
    }

    tunnelTargetTravel = nextTravel;
    setHoveredMesh(null);
    hideTooltip();
}

function getSelectedTunnelIndex() {
    return Math.round(tunnelTargetTravel);
}

function isInteractiveControl(target) {
    return target instanceof Element && target.closest("input, select, button, textarea");
}

function getTunnelColumnCount(count) {
    if (count <= 1) {
        return 1;
    }

    if (count <= 4) {
        return 2;
    }

    return 3;
}

function pickSphere(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, tunnelCamera);
    const hits = raycaster.intersectObjects(visibleMeshes, false);

    if (hits.length === 0) {
        setHoveredMesh(null);
        hideTooltip();
        return;
    }

    setHoveredMesh(hits[0].object);
    showTooltip(hits[0].object, event);
}

function handleCanvasPointerDown(event) {
    if (event.button !== 0) {
        return;
    }

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, tunnelCamera);
    const hits = raycaster.intersectObjects(visibleMeshes, false);

    if (hits.length === 0) {
        return;
    }

    const item = hits[0].object.userData.tunnelItem;

    if (item) {
        selectTunnelIndex(item.globalIndex);
    }
}

function setHoveredMesh(mesh) {
    if (hoveredMesh === mesh) {
        return;
    }

    if (hoveredMesh) {
        hoveredMesh.scale.setScalar(hoveredMesh.userData.baseRadius);
    }

    hoveredMesh = mesh;

    if (hoveredMesh) {
        hoveredMesh.scale.setScalar(hoveredMesh.userData.baseRadius * 1.18);
    }
}

function showTooltip(mesh, event) {
    const factor = mesh.userData.factor;
    const value = mesh.userData.value;

    if (mesh.userData.tooltipKind === "tunnelFactor" && !isUnresolvedCofactor(factor)) {
        tooltip.textContent = formatBigIntWithCommas(value);
        tooltip.style.display = "block";
        tooltip.setAttribute("aria-hidden", "false");
        positionTooltip(event);
        return;
    }

    tooltip.textContent = getFactorTooltipLabel(factor);

    tooltip.style.display = "block";
    tooltip.setAttribute("aria-hidden", "false");
    positionTooltip(event);
}

function getFactorTooltipLabel(factor) {
    const factorValue = getFactorValue(factor);
    const factorText = formatBigIntWithCommas(factorValue);
    const status = getFactorStatus(factor);

    if (factorValue === 1n) {
        return "1";
    }

    if (status === FACTOR_STATUS.COMPOSITE_COFACTOR) {
        return `composite cofactor, not fully factored: ${factorText}`;
    }

    if (status === FACTOR_STATUS.UNKNOWN_COFACTOR) {
        return `unknown cofactor, not tested enough: ${factorText}`;
    }

    if (status === FACTOR_STATUS.PROBABLE_PRIME) {
        return `probable prime: ${factorText}`;
    }

    return `p[${getPrimeIndexLabel(factorValue)}], ${factorText}`;
}

function positionTooltip(event) {
    tooltip.style.left = "0";
    tooltip.style.top = "0";

    const rect = tooltip.getBoundingClientRect();
    const left = Math.min(window.innerWidth - rect.width - 8, event.clientX + 12);
    const top = Math.max(8, event.clientY - rect.height - 12);

    tooltip.style.left = `${Math.max(8, left)}px`;
    tooltip.style.top = `${top}px`;
}

function hideTooltip() {
    tooltip.style.display = "none";
    tooltip.setAttribute("aria-hidden", "true");
}

function getPrimeIndexLabel(factor) {
    const factorValue = getFactorValue(factor);
    const exactIndex = getExactPrimeIndex(factorValue);

    if (exactIndex !== null) {
        return exactIndex.toString();
    }

    const asNumber = Number(factorValue);

    if (!Number.isFinite(asNumber) || asNumber <= 2) {
        return "?";
    }

    const log = Math.log(asNumber);
    const estimate = Math.ceil(asNumber / Math.max(1, log - 1));
    return `~${estimate}`;
}

function formatBigIntWithCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

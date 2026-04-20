import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { SpaceObject } from "../types";

type GlobeSceneProps = {
  objects: SpaceObject[];
  onSelect: (id: string) => void;
};

const statusColor: Record<SpaceObject["status"], number> = {
  active: 0x34d399,
  warning: 0xfbbf24,
  offline: 0x94a3b8,
};

const EARTH_RADIUS = 1.58;
const SURFACE_RADIUS = EARTH_RADIUS + 0.06;

const createEarthTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  const ocean = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  ocean.addColorStop(0, "#071a46");
  ocean.addColorStop(0.45, "#075985");
  ocean.addColorStop(1, "#0f172a");
  context.fillStyle = ocean;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const drawLand = (points: Array<[number, number]>, color: string) => {
    context.beginPath();
    points.forEach(([x, y], index) => {
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.closePath();
    context.fillStyle = color;
    context.fill();
    context.strokeStyle = "rgba(167, 243, 208, 0.38)";
    context.lineWidth = 2;
    context.stroke();
  };

  const landColor = "rgba(34, 197, 154, 0.86)";
  const iceColor = "rgba(224, 242, 254, 0.72)";

  // Approximate equirectangular continent silhouettes. They are intentionally
  // lightweight so the globe stays fast without loading external map textures.
  drawLand(
    [
      [129, 112],
      [164, 82],
      [218, 78],
      [258, 104],
      [282, 150],
      [250, 178],
      [214, 166],
      [192, 202],
      [156, 214],
      [126, 176],
      [106, 138],
    ],
    landColor,
  );
  drawLand(
    [
      [236, 226],
      [284, 244],
      [316, 296],
      [304, 344],
      [278, 398],
      [248, 452],
      [220, 392],
      [206, 330],
      [214, 270],
    ],
    landColor,
  );
  drawLand(
    [
      [414, 114],
      [488, 86],
      [574, 96],
      [642, 130],
      [682, 180],
      [648, 222],
      [566, 218],
      [486, 194],
      [426, 158],
    ],
    landColor,
  );
  drawLand(
    [
      [528, 218],
      [584, 224],
      [638, 254],
      [666, 312],
      [646, 382],
      [604, 424],
      [566, 376],
      [536, 310],
    ],
    landColor,
  );
  drawLand(
    [
      [610, 92],
      [710, 72],
      [834, 94],
      [936, 144],
      [992, 206],
      [950, 256],
      [852, 240],
      [760, 214],
      [672, 168],
    ],
    landColor,
  );
  drawLand(
    [
      [744, 184],
      [780, 198],
      [790, 236],
      [760, 266],
      [736, 236],
    ],
    landColor,
  );
  drawLand(
    [
      [812, 316],
      [864, 300],
      [924, 326],
      [944, 372],
      [902, 406],
      [840, 398],
      [790, 360],
    ],
    landColor,
  );
  drawLand(
    [
      [934, 382],
      [946, 388],
      [952, 400],
      [944, 408],
      [932, 402],
    ],
    landColor,
  );
  drawLand(
    [
      [956, 402],
      [970, 412],
      [982, 430],
      [968, 438],
      [954, 422],
    ],
    landColor,
  );
  drawLand(
    [
      [1000, 224],
      [1024, 216],
      [1024, 270],
      [998, 260],
      [986, 238],
    ],
    landColor,
  );
  drawLand(
    [
      [0, 438],
      [134, 420],
      [308, 446],
      [510, 432],
      [736, 452],
      [1024, 436],
      [1024, 512],
      [0, 512],
    ],
    iceColor,
  );
  drawLand(
    [
      [0, 0],
      [1024, 0],
      [1024, 44],
      [850, 34],
      [660, 42],
      [492, 24],
      [288, 40],
      [96, 32],
      [0, 44],
    ],
    iceColor,
  );

  context.fillStyle = "rgba(14, 116, 144, 0.35)";
  for (let index = 0; index < 90; index += 1) {
    const x = Math.random() * canvas.width;
    const y = 56 + Math.random() * (canvas.height - 112);
    context.beginPath();
    context.ellipse(x, y, 18 + Math.random() * 48, 2 + Math.random() * 8, Math.random(), 0, Math.PI * 2);
    context.fill();
  }

  context.strokeStyle = "rgba(186, 230, 253, 0.14)";
  context.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 48) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }
  for (let y = 0; y < canvas.height; y += 42) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const toVector = (latitude: number, longitude: number, radius: number) => {
  const phi = THREE.MathUtils.degToRad(90 - latitude);
  const theta = THREE.MathUtils.degToRad(longitude + 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
};

const createOrbitLine = (radius: number, color: number) => {
  const points: THREE.Vector3[] = [];
  for (let index = 0; index <= 192; index += 1) {
    const angle = (index / 192) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    opacity: 0.24,
    transparent: true,
  });

  return new THREE.Line(geometry, material);
};

export default function GlobeScene({ objects, onSelect }: GlobeSceneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const selectRef = useRef(onSelect);
  const dragRef = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    moved: 0,
    velocityX: 0,
    velocityY: 0,
  });

  useEffect(() => {
    selectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x020617, 9, 18);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.35, 7.6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.width = "100%";
    host.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x7dd3fc, 0.58);
    const keyLight = new THREE.DirectionalLight(0xcffafe, 2.2);
    keyLight.position.set(3.5, 2.4, 4.5);
    const rimLight = new THREE.PointLight(0x22d3ee, 5.2, 12);
    rimLight.position.set(-3.2, -1.4, 3.8);
    scene.add(ambientLight, keyLight, rimLight);

    const globeGroup = new THREE.Group();
    const earthTexture = createEarthTexture();
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS, 96, 96),
      new THREE.MeshStandardMaterial({
        map: earthTexture,
        metalness: 0.08,
        roughness: 0.72,
        emissive: new THREE.Color(0x072b4d),
        emissiveIntensity: 0.22,
      }),
    );
    globeGroup.add(earth);

    const wireframe = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS + 0.015, 48, 48),
      new THREE.MeshBasicMaterial({
        color: 0x67e8f9,
        opacity: 0.1,
        transparent: true,
        wireframe: true,
      }),
    );
    globeGroup.add(wireframe);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS + 0.12, 96, 96),
      new THREE.MeshBasicMaterial({
        blending: THREE.AdditiveBlending,
        color: 0x22d3ee,
        opacity: 0.13,
        side: THREE.BackSide,
        transparent: true,
      }),
    );
    globeGroup.add(atmosphere);
    globeGroup.rotation.y = -1.92;
    scene.add(globeGroup);

    const satelliteGroup = new THREE.Group();
    satelliteGroup.rotation.y = globeGroup.rotation.y;
    const satelliteMeshes: THREE.Mesh[] = [];
    const satelliteIds = new Map<string, string>();

    objects.forEach((object, index) => {
      const color = statusColor[object.status];
      const position = toVector(
        object.globe.latitude,
        object.globe.longitude,
        object.globe.orbitalRadius,
      );

      const marker = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.08, 1),
        new THREE.MeshStandardMaterial({
          color,
          emissive: new THREE.Color(color),
          emissiveIntensity: 1.8,
          metalness: 0.4,
          roughness: 0.28,
        }),
      );
      marker.position.copy(position);
      marker.name = object.id;
      satelliteMeshes.push(marker);
      satelliteIds.set(marker.uuid, object.id);
      satelliteGroup.add(marker);

      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 24, 24),
        new THREE.MeshBasicMaterial({
          color,
          opacity: object.status === "offline" ? 0.12 : 0.18,
          transparent: true,
        }),
      );
      pulse.position.copy(position);
      pulse.name = `${object.id}-pulse`;
      satelliteGroup.add(pulse);

      const lineMaterial = new THREE.LineBasicMaterial({
        color,
        opacity: 0.22,
        transparent: true,
      });
      const path = new THREE.BufferGeometry().setFromPoints([
        toVector(object.globe.latitude, object.globe.longitude, SURFACE_RADIUS),
        position,
      ]);
      satelliteGroup.add(new THREE.Line(path, lineMaterial));

      const orbit = createOrbitLine(object.globe.orbitalRadius, color);
      orbit.rotation.x = THREE.MathUtils.degToRad(66 + (index % 3) * 8);
      orbit.rotation.z = THREE.MathUtils.degToRad(object.globe.longitude / 2);
      satelliteGroup.add(orbit);
    });

    scene.add(satelliteGroup);

    const starsGeometry = new THREE.BufferGeometry();
    const starPositions: number[] = [];
    for (let index = 0; index < 520; index += 1) {
      const radius = 10 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      );
    }
    starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
    scene.add(
      new THREE.Points(
        starsGeometry,
        new THREE.PointsMaterial({
          color: 0xbae6fd,
          opacity: 0.55,
          size: 0.018,
          transparent: true,
        }),
      ),
    );

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const setSize = () => {
      const width = Math.max(host.clientWidth, 320);
      const height = Math.max(host.clientHeight, 420);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, true);
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(satelliteMeshes, false);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragRef.current;
      if (dragState.isDragging) {
        const deltaX = event.clientX - dragState.lastX;
        const deltaY = event.clientY - dragState.lastY;
        dragState.lastX = event.clientX;
        dragState.lastY = event.clientY;
        dragState.moved += Math.abs(deltaX) + Math.abs(deltaY);
        dragState.velocityX = deltaX * 0.0025;
        dragState.velocityY = deltaY * 0.002;
        globeGroup.rotation.y += dragState.velocityX;
        satelliteGroup.rotation.y += dragState.velocityX;
        globeGroup.rotation.x = THREE.MathUtils.clamp(
          globeGroup.rotation.x + dragState.velocityY,
          -0.65,
          0.65,
        );
        satelliteGroup.rotation.x = globeGroup.rotation.x;
        renderer.domElement.style.cursor = "grabbing";
        return;
      }

      const hits = updatePointer(event);
      renderer.domElement.style.cursor = hits.length > 0 ? "pointer" : "grab";
    };

    const handlePointerDown = (event: PointerEvent) => {
      dragRef.current = {
        isDragging: true,
        lastX: event.clientX,
        lastY: event.clientY,
        moved: 0,
        velocityX: 0,
        velocityY: 0,
      };
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    };

    const handlePointerUp = (event: PointerEvent) => {
      const dragState = dragRef.current;
      dragState.isDragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
      renderer.domElement.style.cursor = "grab";

      if (dragState.moved > 8) return;

      const [hit] = updatePointer(event);
      if (!hit) return;

      const id = satelliteIds.get(hit.object.uuid);
      if (id) {
        selectRef.current(id);
      }
    };

    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(host);
    setSize();
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointercancel", handlePointerUp);

    let animationFrame = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const dragState = dragRef.current;
      if (!dragState.isDragging) {
        const spin = 0.0014 + dragState.velocityX * 0.96;
        globeGroup.rotation.y += spin;
        satelliteGroup.rotation.y += spin;
        dragState.velocityX *= 0.94;
        dragState.velocityY *= 0.9;
      }
      satelliteMeshes.forEach((mesh, index) => {
        const scale = 1 + Math.sin(elapsed * 2.2 + index) * 0.16;
        mesh.scale.setScalar(scale);
      });

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointercancel", handlePointerUp);
      host.removeChild(renderer.domElement);
      earthTexture.dispose();
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.Points) {
          child.geometry.dispose();
          const material = child.material;
          if (Array.isArray(material)) {
            material.forEach((item) => item.dispose());
          } else {
            material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [objects]);

  return <div className="h-full min-h-[560px] w-full overflow-hidden" ref={hostRef} />;
}

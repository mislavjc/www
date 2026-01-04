'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Html, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Image from 'next/image';
import * as THREE from 'three';

interface PhotoExif {
  camera: string | null;
  lens: string | null;
  focalLength: string | null;
  aperture: string | null;
  shutterSpeed: string | null;
  iso: string | null;
  location: {
    latitude: number;
    longitude: number;
    altitude?: number;
  } | null;
  dateTime: string | null;
}

interface PhotoData {
  uuid: string;
  w: number;
  h: number;
  exif?: PhotoExif;
}

interface PhotoPlaneProps {
  photo: PhotoData;
  position: [number, number, number];
  rotation: [number, number, number];
  index: number;
}

interface SelectedPhoto {
  photo: PhotoData;
  position: [number, number, number];
  rotation: [number, number, number];
}

interface SphereContextType {
  selected: SelectedPhoto | null;
  setSelected: (s: SelectedPhoto | null) => void;
  cameraRef: React.RefObject<THREE.Camera> | null;
  isFlipped: boolean;
  setIsFlipped: (f: boolean) => void;
}

const selectedPhotoContext = React.createContext<SphereContextType>({
  selected: null,
  setSelected: () => {},
  cameraRef: null,
  isFlipped: false,
  setIsFlipped: () => {},
});

// Reusable geometry instances (created once, shared by all planes)
const planeGeometryCache = new Map<string, THREE.PlaneGeometry>();
const getPlaneGeometry = (width: number, height: number) => {
  const key = `${width.toFixed(2)}-${height.toFixed(2)}`;
  if (!planeGeometryCache.has(key)) {
    planeGeometryCache.set(key, new THREE.PlaneGeometry(width, height));
  }
  return planeGeometryCache.get(key)!;
};

// Reusable vector/matrix objects to avoid GC pressure
const tempVec3 = new THREE.Vector3();
const tempScale = new THREE.Vector3();
const tempMatrix = new THREE.Matrix4();
const tempQuat = new THREE.Quaternion();
const tempEuler = new THREE.Euler();

const PhotoPlane = React.memo(function PhotoPlane({
  photo,
  position,
  rotation,
  index,
}: PhotoPlaneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const textureRef = useRef<THREE.Texture | null>(null);
  const { selected, setSelected, cameraRef, isFlipped, setIsFlipped } =
    React.useContext(selectedPhotoContext);

  // Memoize dimensions
  const { width, height } = useMemo(() => {
    const isPortrait = photo.h > photo.w;
    const aspectRatio = photo.w / photo.h;
    const baseSize = 5;
    return {
      width: isPortrait ? baseSize * aspectRatio : baseSize,
      height: isPortrait ? baseSize : baseSize / aspectRatio,
    };
  }, [photo.w, photo.h]);

  // Get cached geometry
  const geometry = useMemo(
    () => getPlaneGeometry(width, height),
    [width, height],
  );

  const isSelected = selected?.photo.uuid === photo.uuid;

  // Load texture with staggered delay based on index
  useEffect(() => {
    const delay = index * 50; // Reduced delay for faster loading
    let objectUrl: string | null = null;
    let cancelled = false;

    const timer = setTimeout(() => {
      const r2Url = `https://r2.photography.mislavjc.com/variants/grid/jpeg/640/${photo.uuid}.jpeg`;
      const url = `/_next/image?url=${encodeURIComponent(r2Url)}&w=640&q=75`;

      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          if (cancelled) return;
          objectUrl = URL.createObjectURL(blob);
          const img = new window.Image();
          img.onload = () => {
            if (cancelled) {
              if (objectUrl) URL.revokeObjectURL(objectUrl);
              return;
            }
            const tex = new THREE.Texture(img);
            tex.needsUpdate = true;
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.minFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            textureRef.current = tex;

            if (materialRef.current) {
              materialRef.current.map = tex;
              materialRef.current.needsUpdate = true;
              setLoaded(true);
            }
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            objectUrl = null;
          };
          img.src = objectUrl;
        })
        .catch(() => {});
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (textureRef.current) {
        textureRef.current.dispose();
      }
    };
  }, [photo.uuid, index]);

  // Store original position/rotation as refs to avoid recreating objects
  const originalPos = useRef(new THREE.Vector3(...position));
  const originalRot = useRef(new THREE.Euler(...rotation));

  // Target flip rotation - flip shows back (postcard)
  const targetFlipY = isSelected && isFlipped ? Math.PI : 0;

  const targetScale = isSelected ? 1 : hovered ? 1.05 : 1;

  const currentFlipRef = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;

    let targetPos: THREE.Vector3;
    let targetRot: THREE.Euler;

    if (isSelected && cameraRef?.current) {
      const camera = cameraRef.current;
      tempVec3.set(0, 0, -1).applyQuaternion(camera.quaternion);
      targetPos = tempVec3.clone().multiplyScalar(5).add(camera.position);

      tempMatrix.lookAt(camera.position, targetPos, camera.up);
      tempQuat.setFromRotationMatrix(tempMatrix);
      targetRot = tempEuler.setFromQuaternion(tempQuat);
    } else {
      targetPos = originalPos.current;
      targetRot = originalRot.current;
    }

    groupRef.current.position.lerp(targetPos, 0.08);

    if (!isSelected) {
      groupRef.current.position.y +=
        Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.015;
    }

    groupRef.current.rotation.x +=
      (targetRot.x - groupRef.current.rotation.x) * 0.08;
    groupRef.current.rotation.y +=
      (targetRot.y - groupRef.current.rotation.y) * 0.08;
    groupRef.current.rotation.z +=
      (targetRot.z - groupRef.current.rotation.z) * 0.08;

    tempScale.set(targetScale, targetScale, targetScale);
    groupRef.current.scale.lerp(tempScale, 0.1);

    // Animate flip on inner group
    if (innerGroupRef.current) {
      currentFlipRef.current += (targetFlipY - currentFlipRef.current) * 0.1;
      innerGroupRef.current.rotation.y = currentFlipRef.current;
    }
  });

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isSelected) {
        setIsFlipped(!isFlipped);
      } else {
        setIsFlipped(false);
        setSelected({ photo, position, rotation });
      }
    },
    [
      isSelected,
      isFlipped,
      setIsFlipped,
      setSelected,
      photo,
      position,
      rotation,
    ],
  );

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
      renderOrder={isSelected ? 1 : 0}
    >
      {/* Inner group for flip animation */}
      <group ref={innerGroupRef}>
        {/* Front - Photo */}
        <mesh renderOrder={isSelected ? 10 : 0} geometry={geometry}>
          <meshBasicMaterial
            ref={materialRef}
            color={loaded ? '#ffffff' : '#44403c'}
            side={THREE.FrontSide}
            transparent
            depthTest={!isSelected}
            depthWrite={!isSelected}
          />
        </mesh>

        {/* Back - Postcard paper */}
        <mesh renderOrder={isSelected ? 10 : 0} geometry={geometry}>
          <meshBasicMaterial
            color="#f5f2eb"
            side={THREE.BackSide}
            transparent
            depthTest={!isSelected}
            depthWrite={!isSelected}
          />
        </mesh>

        {/* Metadata on back - only visible when flipped */}
        {isSelected && isFlipped && photo.exif && (
          <Html
            position={[0, 0, 0.01]}
            transform
            scale={0.4}
            style={{
              pointerEvents: 'none',
              width: '1px',
              height: '1px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            zIndexRange={[100, 0]}
          >
            <div
              className="font-mono text-stone-700"
              style={{
                transform: 'rotateY(180deg) translate(-20%, 35%)',
                width: '480px',
              }}
            >
              {/* Postcard layout */}
              <div className="flex gap-5">
                {/* Left side - message area */}
                <div className="flex-1 border-r border-stone-300 pr-5">
                  <div className="mb-4 text-xs uppercase tracking-widest text-stone-400">
                    Photo Data
                  </div>
                  {photo.exif.camera && (
                    <div className="text-stone-700 text-sm mb-1">
                      {photo.exif.camera}
                    </div>
                  )}
                  {photo.exif.lens && (
                    <div className="text-stone-500 text-sm mb-3">
                      {photo.exif.lens}
                    </div>
                  )}
                  {(photo.exif.focalLength ||
                    photo.exif.aperture ||
                    photo.exif.shutterSpeed) && (
                    <div className="text-stone-500 text-xs">
                      {[
                        photo.exif.focalLength,
                        photo.exif.aperture,
                        photo.exif.shutterSpeed,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                  )}
                  {photo.exif.iso && (
                    <div className="text-stone-500 text-xs">
                      ISO {photo.exif.iso}
                    </div>
                  )}
                </div>

                {/* Right side - stamp & address area */}
                <div className="flex-1 pl-3">
                  {/* Stamp area */}
                  <div className="flex justify-end mb-4">
                    <div className="w-14 h-16 border-2 border-dashed border-stone-300 flex items-center justify-center">
                      <span className="text-[10px] text-stone-400">STAMP</span>
                    </div>
                  </div>

                  {/* Date as "address" */}
                  {photo.exif.dateTime && (
                    <div className="space-y-2">
                      <div className="border-b border-stone-300 pb-1 text-sm text-stone-600">
                        {new Date(photo.exif.dateTime).toLocaleDateString(
                          'en-US',
                          {
                            month: 'long',
                            day: 'numeric',
                          },
                        )}
                      </div>
                      <div className="border-b border-stone-300 pb-1 text-sm text-stone-600">
                        {new Date(photo.exif.dateTime).getFullYear()}
                      </div>
                      <div className="border-b border-stone-300 pb-1 text-xs text-stone-400">
                        &nbsp;
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
});

interface SceneProps {
  photos: PhotoData[];
  selected: SelectedPhoto | null;
  setSelected: (s: SelectedPhoto | null) => void;
  isFlipped: boolean;
  setIsFlipped: (f: boolean) => void;
}

const Scene = ({
  photos,
  selected,
  setSelected,
  isFlipped,
  setIsFlipped,
}: SceneProps) => {
  const { camera, scene } = useThree();
  const cameraRef = useRef<THREE.Camera>(camera);

  // Set up fog
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    scene.fog = new THREE.Fog('#1c1917', 8, 35);

    scene.background = new THREE.Color('#1c1917');
  }, [scene]);

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  const photoPositions = useMemo(() => {
    const radius = 20;
    const positions: {
      position: [number, number, number];
      rotation: [number, number, number];
      photo: PhotoData;
    }[] = [];

    const n = photos.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    photos.forEach((photo, i) => {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const yNorm = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
      const yLimited = yNorm * 0.7;
      const radiusAtY = Math.sqrt(1 - yLimited * yLimited);

      const x = radius * radiusAtY * Math.cos(theta);
      const y = radius * yLimited;
      const z = radius * radiusAtY * Math.sin(theta);

      const rotationY = Math.atan2(x, z);
      const rotationX = -Math.atan2(y, Math.sqrt(x * x + z * z));

      positions.push({
        position: [x, y, z],
        rotation: [rotationX, rotationY + Math.PI, 0],
        photo,
      });
    });

    return positions;
  }, [photos]);

  useEffect(() => {
    camera.position.set(0, 0, 0.1);
    camera.lookAt(0, 0, 1);
  }, [camera]);

  const handleBackgroundClick = useCallback(() => {
    if (selected) {
      setSelected(null);
      setIsFlipped(false);
    }
  }, [selected, setSelected, setIsFlipped]);

  return (
    <selectedPhotoContext.Provider
      value={{ selected, setSelected, cameraRef, isFlipped, setIsFlipped }}
    >
      <group onClick={handleBackgroundClick}>
        <ambientLight intensity={1} />

        {photoPositions.map(({ position, rotation, photo }, index) => (
          <PhotoPlane
            key={photo.uuid}
            photo={photo}
            position={position}
            rotation={rotation}
            index={index}
          />
        ))}

        <mesh>
          <sphereGeometry args={[50, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} side={THREE.BackSide} />
        </mesh>
      </group>
    </selectedPhotoContext.Provider>
  );
};

interface PhotoSphereProps {
  photos: PhotoData[];
}

export const PhotoSphere = ({ photos }: PhotoSphereProps) => {
  const [hasError, setHasError] = useState(false);
  const [selected, setSelected] = useState<SelectedPhoto | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cleanup WebGL context lost listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setHasError(true);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    return () =>
      canvas.removeEventListener('webglcontextlost', handleContextLost);
  }, []);

  if (hasError) {
    return <PhotoGrid photos={photos} />;
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-stone-900 md:aspect-[4/3]">
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 100,
          position: [0, 0, 0.1],
        }}
        onCreated={({ gl }) => {
          const canvas = gl.getContext().canvas;
          if (canvas instanceof HTMLCanvasElement) {
            canvasRef.current = canvas;
          }
        }}
        gl={{
          antialias: false,
          powerPreference: 'low-power',
        }}
      >
        <Scene
          photos={photos}
          selected={selected}
          setSelected={setSelected}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.8}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-center">
        <div className="whitespace-nowrap rounded-full bg-black/50 px-4 py-2 text-center text-xs text-white/70 backdrop-blur-sm">
          {selected
            ? 'Click photo to flip · Click elsewhere to close'
            : 'Drag to explore · Click photo to view'}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle, transparent 40%, rgba(28, 25, 23, 0.4) 100%)',
        }}
      />
    </div>
  );
};

// Masonry grid fallback
interface PhotoGridProps {
  photos: PhotoData[];
}

export const PhotoGrid = ({ photos }: PhotoGridProps) => {
  return (
    <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
      {photos.map((photo) => (
        <div key={photo.uuid} className="mb-3 break-inside-avoid">
          <Image
            src={`https://r2.photography.mislavjc.com/variants/grid/jpeg/640/${photo.uuid}.jpeg`}
            alt=""
            width={photo.w}
            height={photo.h}
            className="w-full"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
};

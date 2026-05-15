'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Environment, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { useRef, Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { crops } from '@/lib/crop-data'

interface PlantSceneProps {
  cropId?: string | null
}

// Stylized plant components based on crop type
function RicePlant({ position = [0, 0, 0] as [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle swaying motion
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Stems */}
      {[-0.2, 0, 0.2].map((x, i) => (
        <group key={i} position={[x, 0, i * 0.1 - 0.1]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.02, 0.03, 1, 8]} />
            <meshStandardMaterial color="#4a7c23" />
          </mesh>
          {/* Rice grain cluster */}
          <group position={[0, 1.1, 0]} rotation={[0.3, 0, x * 0.5]}>
            {[0, 1, 2, 3, 4].map((j) => (
              <mesh key={j} position={[0, j * 0.05, 0]} rotation={[0.2 * j, 0, 0]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="#d4a843" />
              </mesh>
            ))}
          </group>
        </group>
      ))}
    </group>
  )
}

function GenericPlant({ color = '#2D7A3A', position = [0, 0, 0] as [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + 0.5
    }
  })

  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.4, 0.3, 0.4, 16]} />
        <meshStandardMaterial color="#6B4226" />
      </mesh>
      {/* Soil */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      {/* Plant body */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={meshRef} position={[0, 0.5, 0]}>
          <Sphere args={[0.5, 32, 32]}>
            <MeshDistortMaterial
              color={color}
              speed={2}
              distort={0.3}
              radius={1}
            />
          </Sphere>
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 0.5, 8]} />
          <meshStandardMaterial color="#4a7c23" />
        </mesh>
      </Float>
    </group>
  )
}

function FloatingParticles({ count = 30 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 4,
        Math.random() * 3 - 0.5,
        (Math.random() - 0.5) * 4,
      ] as [number, number, number],
      scale: Math.random() * 0.05 + 0.02,
      speed: Math.random() * 0.5 + 0.5,
    }))
  }, [count])

  return (
    <>
      {particles.map((particle, i) => (
        <FloatingParticle key={i} {...particle} />
      ))}
    </>
  )
}

function FloatingParticle({
  position,
  scale,
  speed,
}: {
  position: [number, number, number]
  scale: number
  speed: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const initialY = position[1]

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        initialY + Math.sin(state.clock.elapsedTime * speed) * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[scale, 8, 8]} />
      <meshStandardMaterial
        color="#F5C842"
        transparent
        opacity={0.6}
        emissive="#F5C842"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

function Scene({ cropId }: { cropId?: string | null }) {
  const crop = cropId ? crops.find((c) => c.id === cropId) : null

  // Color based on crop category
  const getPlantColor = () => {
    if (!crop) return '#2D7A3A'
    switch (crop.category) {
      case 'grain':
        return '#4a7c23'
      case 'vegetable':
        return '#2D7A3A'
      case 'fruit':
        return '#ff6b35'
      case 'economic':
        return '#1a5f1a'
      case 'field':
        return '#7cb342'
      default:
        return '#2D7A3A'
    }
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <hemisphereLight
        color="#87CEEB"
        groundColor="#6B4226"
        intensity={0.4}
      />

      {crop?.id === 'rice' ? (
        <>
          <RicePlant position={[-0.5, 0, 0]} />
          <RicePlant position={[0, 0, 0.3]} />
          <RicePlant position={[0.5, 0, -0.1]} />
        </>
      ) : (
        <GenericPlant color={getPlantColor()} />
      )}

      <FloatingParticles count={20} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#4a3728" transparent opacity={0.3} />
      </mesh>

      <Environment preset="sunset" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-100 to-amber-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground mt-2">กำลังโหลด...</p>
      </div>
    </div>
  )
}

export function CropScene({ cropId }: PlantSceneProps) {
  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden bg-gradient-to-b from-sky-100 to-amber-50">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          shadows
          camera={{ position: [0, 1, 3], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <Scene cropId={cropId} />
        </Canvas>
      </Suspense>
    </div>
  )
}

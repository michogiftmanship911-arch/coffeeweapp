import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * Draw-call budget (this is why it stays smooth on phones):
 *   Cup   : 1 mesh (saucer + body + handle merged) + 1 liquid + 1 steam = 3
 *   Glass : 1 glass + 1 liquid + 1 instanced ice (all cubes) + 1 straw + 1 steam = 5
 *   + 1 soft shadow plane
 * Geometries are created once (useMemo); the liquid colour is lerped, never rebuilt.
 */

const V2 = (pts) => pts.map(([x, y]) => new THREE.Vector2(x, y))

// [radius, height] profiles revolved around the Y axis
const CUP_PROFILE = [
  [0, 0], [0.52, 0], [0.68, 0.06], [0.94, 0.52], [1.1, 1.1], [1.18, 1.52], [1.2, 1.58],
  [1.13, 1.58], [1.09, 1.5], [0.91, 1.06], [0.78, 0.52], [0.6, 0.2], [0, 0.2],
]
const SAUCER_PROFILE = [[0, -0.02], [1.5, -0.02], [1.86, 0.1], [1.92, 0.16], [1.84, 0.16], [1.45, 0.08], [0, 0.08]]
const GLASS_PROFILE = [[0, 0], [0.6, 0], [0.66, 0.05], [0.86, 2.2], [0.82, 2.2], [0.62, 0.24], [0, 0.24]]

const ICE = [
  [-0.2, 1.72, 0.12, 0.4],
  [0.24, 1.68, -0.14, 0.9],
  [0.02, 1.38, 0.28, 1.4],
  [-0.26, 1.28, -0.2, 0.2],
  [0.28, 1.14, 0.12, 0.7],
]

function useLerpColor(ref, hex, speed = 0.08) {
  const target = useMemo(() => new THREE.Color(hex), [hex])
  useFrame(() => {
    if (ref.current) ref.current.color.lerp(target, speed)
  })
}

/* ------------------------------- Cup ---------------------------------- */
function Cup({ product }) {
  const liquid = useRef()
  useLerpColor(liquid, product.colors.liquid)

  const ceramic = useMemo(() => {
    const body = new THREE.LatheGeometry(V2(CUP_PROFILE), 56)
    body.translate(0, 0.08, 0)
    const saucer = new THREE.LatheGeometry(V2(SAUCER_PROFILE), 72)
    const handle = new THREE.TorusGeometry(0.4, 0.075, 14, 28, Math.PI)
    handle.rotateZ(-Math.PI / 2)
    handle.translate(1.07, 1.03, 0)
    return mergeGeometries([saucer, body, handle])
  }, [])

  return (
    <group position={[0, -0.85, 0]}>
      <mesh geometry={ceramic}>
        <meshPhysicalMaterial
          color="#f6f0e2"
          roughness={0.3}
          clearcoat={0.9}
          clearcoatRoughness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 1.36, 0]}>
        <cylinderGeometry args={[0.985, 0.985, 0.04, 48]} />
        <meshStandardMaterial ref={liquid} color={product.colors.liquid} roughness={0.22} metalness={0.1} />
      </mesh>
    </group>
  )
}

/* ------------------------------- Glass -------------------------------- */
function Ice() {
  const ref = useRef()
  useLayoutEffect(() => {
    const d = new THREE.Object3D()
    ICE.forEach(([x, y, z, r], i) => {
      d.position.set(x, y, z)
      d.rotation.set(r, r * 1.7, r * 0.6)
      d.updateMatrix()
      ref.current.setMatrixAt(i, d.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, ICE.length]}>
      <boxGeometry args={[0.36, 0.36, 0.36]} />
      <meshPhysicalMaterial color="#eaf8ff" transparent opacity={0.55} roughness={0.08} />
    </instancedMesh>
  )
}

function Glass({ product }) {
  const liquid = useRef()
  useLerpColor(liquid, product.colors.liquid)
  const glass = useMemo(() => new THREE.LatheGeometry(V2(GLASS_PROFILE), 48), [])

  return (
    <group position={[0, -1.25, 0]}>
      <mesh geometry={glass} renderOrder={2}>
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.22}
          roughness={0.05}
          clearcoat={1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.77, 0.615, 1.58, 40]} />
        <meshStandardMaterial ref={liquid} color={product.colors.liquid} roughness={0.2} transparent opacity={0.94} />
      </mesh>
      <Ice />
      <mesh position={[0.28, 1.5, 0]} rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.045, 0.045, 2.7, 10]} />
        <meshStandardMaterial color={product.colors.accent} roughness={0.5} />
      </mesh>
    </group>
  )
}

/* ------------------------------- Steam -------------------------------- */
function Steam({ y, color }) {
  const COUNT = 26
  const ref = useRef()
  const texture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(255,255,255,0.95)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  }, [])
  const seeds = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        phase: Math.random(),
        x: (Math.random() - 0.5) * 0.7,
        z: (Math.random() - 0.5) * 0.7,
        drift: Math.random() * Math.PI * 2,
        speed: 0.16 + Math.random() * 0.12,
      })),
    [],
  )
  const positions = useMemo(() => new Float32Array(COUNT * 3), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const attr = ref.current.geometry.attributes.position
    seeds.forEach((s, i) => {
      const p = (t * s.speed + s.phase) % 1
      attr.array[i * 3] = s.x + Math.sin(t * 0.9 + s.drift + p * 5) * 0.2 * p
      attr.array[i * 3 + 1] = p * 2.1
      attr.array[i * 3 + 2] = s.z + Math.cos(t * 0.7 + s.drift) * 0.12 * p
    })
    attr.needsUpdate = true
  })

  return (
    <points ref={ref} position={[0, y, 0]} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial map={texture} color={color} size={0.75} transparent opacity={0.28} depthWrite={false} sizeAttenuation />
    </points>
  )
}

/* ------------------------------ Shadow -------------------------------- */
function Shadow({ y }) {
  const texture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    grad.addColorStop(0, 'rgba(0,0,0,0.55)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(c)
  }, [])
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <planeGeometry args={[4.4, 4.4]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  )
}

/* ------------------------------- Scene -------------------------------- */
/**
 * spin / drag are optional framer-motion MotionValues:
 *   rotation.y = spin + drag * 0.012
 * Without them the cup slowly auto-rotates (used on product pages).
 */
export default function TeaCup3D({ product, spin, drag }) {
  const { vessel, temp, colors } = product
  const floatRef = useRef()
  const spinRef = useRef()
  const rim = useRef()
  const lastVessel = useRef(vessel)
  const grow = useRef(0) // 0 → pops in on first mount, and again whenever the vessel type changes
  useLerpColor(rim, colors.accent)

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    if (lastVessel.current !== vessel) {
      lastVessel.current = vessel
      grow.current = 0
    }
    grow.current = Math.min(1, grow.current + dt * 2.4)
    const e = 1 - Math.pow(1 - grow.current, 3)

    const f = floatRef.current
    f.position.y = Math.sin(t * 1.25) * 0.1
    f.rotation.z = Math.sin(t * 0.8) * 0.03
    f.rotation.x = Math.sin(t * 0.65) * 0.025

    const s = spinRef.current
    s.rotation.y = (spin ? spin.get() : t * 0.4) + (drag ? drag.get() * 0.012 : 0)
    s.scale.setScalar(0.72 + 0.28 * e)
  })

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} />
      <directionalLight ref={rim} position={[-5, 3, -4]} intensity={2.2} color={colors.accent} />

      <Shadow y={vessel === 'glass' ? -1.27 : -0.88} />

      <group ref={floatRef}>
        <group ref={spinRef}>{vessel === 'glass' ? <Glass product={product} /> : <Cup product={product} />}</group>
        {temp === 'hot' && <Steam y={vessel === 'glass' ? 1.2 : 0.62} color="#ffffff" />}
      </group>
    </>
  )
}

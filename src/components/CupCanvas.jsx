import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import TeaCup3D from './TeaCup3D'
import useInView from '../hooks/useInView'

/**
 * The WebGL canvas. Loaded lazily through CupStage so Three.js never blocks
 * the first paint. The render loop is paused while off-screen.
 * The parent supplies sizing via `className` (e.g. "absolute inset-0").
 */
export default function CupCanvas({ product, spin, drag, className = '' }) {
  const wrap = useRef(null)
  const inView = useInView(wrap)

  return (
    <div ref={wrap} className={className}>
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.1, 7.2], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        {/* tiny procedural studio environment — no network requests */}
        <Environment frames={1} resolution={128} background={false}>
          <Lightformer form="rect" intensity={2} position={[0, 5, -5]} scale={[10, 4, 1]} />
          <Lightformer form="rect" intensity={1.2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
          <Lightformer form="rect" intensity={1} position={[5, 1, 2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
        </Environment>

        <TeaCup3D product={product} spin={spin} drag={drag} />
      </Canvas>
    </div>
  )
}

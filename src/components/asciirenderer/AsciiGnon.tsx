"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { Center, Float, Image, SpotLight, Text, Billboard, useVideoTexture, PerspectiveCamera, useTexture, shaderMaterial } from '@react-three/drei';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { DotScreen, EffectComposer, Glitch } from '@react-three/postprocessing';
import { Vector2, VideoTexture, SphereGeometry, Mesh, BackSide, MeshBasicMaterial, RingGeometry, TorusGeometry, PerspectiveCamera as ThreePerspectiveCamera } from 'three';
import { BlendFunction } from 'postprocessing';
import { AsciiEffect } from './AsciiGl';
import useCountdown from '../countdown3d/useCountdown';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      borderBlurMaterial: any;
    }
  }
}

interface IInternalSceneProps {
  y: number;
  x: number;
  width: number;
}

const KText = (props: any) => {
  return (
    <Text {...props} font='https://fonts.gstatic.com/s/orbitron/v7/2I3-8i9hT294TE_pyjy9SaCWcynf_cDxXwCLxiixG1c.ttf'/>
  )
}

interface IHPTextProps {
  width: number;
  color?: string;
  cover?: boolean;
}

const HPText = ({width, color= "white", cover=false}: IHPTextProps) => {
  const [pos, setPos] = useState(0);
  const countdown = useCountdown(new Date("2024-10-21T23:59:59"));

  useFrame(() => {
    // Update position
    if (pos < 1) {
      setPos(pos + 0.01);
    }
  })

  const commonProps = { color, maxWidth: width, textAlign: "center", letterSpacing: 0.2}
  return (
    <Text rotation={[0, 0, 0]} characters="abcdefgλhijklmnopqrstuvwxyz0123456789!" strokeOpacity={0.1}>
      <KText {...commonProps} fontSize={width/4} position={[0, (cover ? pos : 1) * 3, cover ? 0.2 : 0]}>GN0N</KText>
      <KText {...commonProps} fontSize={width/7} position={[0, (cover ? pos : 1) * -3, cover ? 0.2 : 0]}>{countdown}</KText>
    </Text>
  )
}

const BorderBlurMaterial = shaderMaterial(
  {
    map: null,
    borderWidth: 0.1,
    borderSoftness: 0.05,
  },
  // vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform sampler2D map;
    uniform float borderWidth;
    uniform float borderSoftness;
    varying vec2 vUv;

    void main() {
      vec4 texColor = texture2D(map, vUv);
      
      float distanceFromEdge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
      float alpha = smoothstep(borderWidth - borderSoftness, borderWidth, distanceFromEdge);
      
      gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
    }
  `
);

extend({ BorderBlurMaterial });

const InternalScene = ({y, x, width}: IInternalSceneProps) => {
  const texture = useTexture('/gnon.png');
  const pastCentre = 0.5 - y;

  const materialRef = useRef<any>();

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.opacity = pastCentre > 0 ? 1 - y : 0;
    }
  });

  // Calculate parallax offset
  const parallaxX = (x - 0.5) * 10; // Increased parallax effect
  const parallaxY = (y - 0.5) * 10; // Increased parallax effect

  return (
    <>
      <Float floatIntensity={1} floatingRange={[-1,1]} rotationIntensity={0.2}>
        <Float>
          <mesh 
            scale={[width * 2.5, width * 2.5, 1]} 
            position={[parallaxX, parallaxY, -20]}
          >
            <planeGeometry />
            <borderBlurMaterial 
              ref={materialRef} 
              map={texture} 
              transparent 
              borderWidth={0.05} 
              borderSoftness={0.02}
            />
          </mesh>
        </Float>

        <ambientLight intensity={4} />
        <SpotLight position={[0, 0, 10]} intensity={10} />
      </Float>
    </>
  );
}

const VideoBackground = () => {
  const texture = useVideoTexture("/lambda-video.mp4")
  const { scene } = useThree();

  useEffect(() => {
    const geometry = new TorusGeometry(100, 300, 40);
    const material = new MeshBasicMaterial({ 
      map: texture, 
      side: BackSide,
      color: 0x808080  // This will darken the video
    });
    const mesh = new Mesh(geometry, material);

    scene.add(mesh);

    return () => {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, texture]);

  return null;
};

const Container = () => {
  const [y, setY] = useState(0.5);
  const [x, setX] = useState(0.5);
  const { width, height } = useThree(state => state.viewport.getCurrentViewport())
  const cameraRef = useRef<ThreePerspectiveCamera>(null);

  useFrame(({ mouse, viewport }) => {
    // Normalize mouse coordinates to range from 0 to 1
    const normalizedX = (mouse.x + 1) / 2;
    const normalizedY = (mouse.y + 1) / 2;

    setX(normalizedX);
    setY(normalizedY);

    if (cameraRef.current) {
      // Adjust rotation range and sensitivity
      const rotationFactor = 0.1; // Reduced rotation for smoother effect
      cameraRef.current.rotation.y = (normalizedX - 0.5) * rotationFactor;
      cameraRef.current.rotation.x = (normalizedY - 0.5) * rotationFactor;
    }
  });

  const centerThreshold = 0.1; // Adjust this value to control the size of the center area
  const isNearCenter = Math.abs(x - 0.5) < centerThreshold && Math.abs(y - 0.5) < centerThreshold;

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 10]} />
      <VideoBackground />
      <group position={[0, 0, -5]}>
        <Billboard follow={false}>
          <HPText cover={true} color={"white"} width={width} />
          <HPText color={"green"} width={width} />
        </Billboard>
      </group>
      <InternalScene y={y} x={x} width={width} />
      <EffectComposer>
        {isNearCenter ? <Glitch strength={new Vector2(0.2, 0.2)} /> : <></>}
        <AsciiEffect characters=' .,⦁↬∞∂λ⍼☿⁜ℵ' cellSize={20}/>
      </EffectComposer>
    </>
  )
}

const AsciiBG = () => {
  return (
    <Canvas style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}>
      <Container />
    </Canvas>
  )
}

export { InternalScene, AsciiBG };

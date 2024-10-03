import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line, Stars } from '@react-three/drei';
import { BrainCircuit } from 'lucide-react';
import { Vector3, Raycaster, Group, Vector3Tuple, Mesh } from 'three';

type Point = [number, number, number];

const LucideIcon = ({ icon: Icon, ...props }: { icon: any, props: any }) => {
  const paths = Icon.toString().split('><path d="').slice(1).map(p => p.split('"')[0]);
  
  return (
    <group {...props}>
      {paths.map((d: string, i: number) => (
        <Line key={i} points={svgPathToPoints(d)} color="white" lineWidth={1} />
      ))}
    </group>
  );
};

const MathSymbol = ({ position, symbol }: { position: Point, symbol: string }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });
  
  return (
    <Text ref={ref} position={position} fontSize={0.2} color="white">
      {symbol}
    </Text>
  );
};

const Trail = ({ positions }: { positions: Point[] }) => {
  const symbols = ['+', '-', '×', '÷', '∑', '∫', 'π', '√'];
  return (
    <>
      {positions.map((pos: Point, index: number) => (
        <MathSymbol 
          key={index} 
          position={pos} 
          symbol={symbols[Math.floor(Math.random() * symbols.length)]}
        />
      ))}
    </>
  );
};

const CollisionParticle = ({ position }: { position: Point }) => {
  const ref = useRef<Mesh>(null);
  const [alive, setAlive] = useState(true);
  const velocity = useRef(new Vector3(
    (Math.random() - 0.5) * 0.05,
    (Math.random() - 0.5) * 0.05,
    (Math.random() - 0.5) * 0.05
  ));
  const symbols = ['+', '-', '×', '÷', '∑', '∫', 'π', '√'];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];

  useFrame(() => {
    if (ref.current && alive) {
      ref.current.position.add(velocity.current);
      ref.current.scale.multiplyScalar(0.98);
      if (ref.current.scale.x < 0.01) setAlive(false);
    }
  });

  if (!alive) return null;

  return (
    <Text ref={ref} position={position} fontSize={0.2} color="yellow">
      {symbol}
    </Text>
  );
};

const Critter = (
  { position, index, critters, setCritters, addCollision, controlledIndex }:
  {
    position: Point, 
    index: number, 
    critters: Point[], 
    setCritters: React.Dispatch<React.SetStateAction<Point[]>>, 
    addCollision: (position: Point) => void, 
    controlledIndex: number 
  }
) => {
  const ref = useRef<Group>(null);
  const [color, setColor] = useState('hotpink');
  const speed = useRef(Math.random() * 0.02 + 0.01);
  const direction = useRef<Vector3>(new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize());
  const trailPositions = useRef<Vector3Tuple[]>([]);

  useFrame((state) => {
    if (ref.current) {
      if (controlledIndex !== index) {
        if (!ref.current['position']) return;
        const position = ref.current['position'] as Vector3;
        position.add(direction.current.clone().multiplyScalar(speed.current));

        (['x', 'y', 'z'] as Array<"x" | "y" | "z">).forEach((axis) => {
          if (Math.abs(position[axis]) > 5) {
            direction.current[axis] *= -1;
          }
        });
      }

      ref.current.lookAt(ref.current.position.clone().add(direction.current));

      // Update trail
      trailPositions.current.unshift(ref.current.position.toArray());
      if (trailPositions.current.length > 5) trailPositions.current.pop();

      setCritters(prev => {
        const newCritters = [...prev];
        if (!ref.current) return prev;
        newCritters[index] = ref.current.position.toArray();
        return newCritters;
      });
    }
  });

  useEffect(() => {
    const nearbyDistance = 1;
    critters.forEach((otherPosition, i) => {
      if (i !== index) {
        const distance = new Vector3(...position).distanceTo(new Vector3(...otherPosition));
        if (distance < nearbyDistance) {
          const awayVector = new Vector3(...position).sub(new Vector3(...otherPosition)).normalize();
          direction.current.add(awayVector.multiplyScalar(0.1)).normalize();
          
          // Trigger collision effect
          addCollision(new Vector3(...position).lerp(new Vector3(...otherPosition), 0.5).toArray());
        }
      }
    });
  }, [critters, index, position, addCollision]);

  const handleClick = () => {
    setColor(color === 'hotpink' ? 'cyan' : 'hotpink');
    speed.current = Math.random() * 0.04 + 0.02;
  };

  return (
    <>
      <Trail positions={trailPositions.current} />
      <group ref={ref} position={position} onClick={handleClick}>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={color} />

        </mesh>
        
      </group>
    </>
  );
};

const MathsPetsScene = () => {
  const [critters, setCritters] = useState<Point[]>([]);
  const [collisions, setCollisions] = useState<{ id: number, position: Point }[]>([]);
  const [controlledIndex, setControlledIndex] = useState(-1);
  const controlSpeed = 0.1;

  useEffect(() => {
    const initialCritters = [...Array(10)].map(() => [
      Math.random() * 8 - 4,
      Math.random() * 8 - 4,
      Math.random() * 8 - 4
    ]) as Point[];
    setCritters(initialCritters);
  }, []);

  const addCollision = (position: Point) => {
    setCollisions(prev => [...prev, { id: Date.now(), position }]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCollisions(prev => prev.filter(c => Date.now() - c.id < 2000));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (controlledIndex === -1) {
        if (event.key === ' ') {
          setControlledIndex(0);
        }
        return;
      }

      setCritters(prev => {
        const newCritters = [...prev];
        const [x, y, z] = newCritters[controlledIndex];
        switch(event.key) {
          case 'ArrowUp':
            newCritters[controlledIndex] = [x, y + controlSpeed, z];
            break;
          case 'ArrowDown':
            newCritters[controlledIndex] = [x, y - controlSpeed, z];
            break;
          case 'ArrowLeft':
            newCritters[controlledIndex] = [x - controlSpeed, y, z];
            break;
          case 'ArrowRight':
            newCritters[controlledIndex] = [x + controlSpeed, y, z];
            break;
          case 'w':
            newCritters[controlledIndex] = [x, y, z - controlSpeed];
            break;
          case 's':
            newCritters[controlledIndex] = [x, y, z + controlSpeed];
            break;
          case ' ':
            setControlledIndex((controlledIndex + 1) % critters.length);
            break;
          default:
            break;
        }
        return newCritters;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [controlledIndex, critters.length]);

  return (
    <div style={{ width: '100%', height: '100vh', background: 'linear-gradient(to bottom, #000033, #000066)' }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {critters.map((position, index) => (
          <Critter 
            key={`critter-${index}`} 
            position={position}
            index={index}
            critters={critters}
            setCritters={setCritters}
            addCollision={addCollision}
            controlledIndex={controlledIndex}
          />
        ))}

        {collisions.map(({ id, position }) => (
          <CollisionParticle key={id} position={position} />
        ))}
      </Canvas>
      <div style={{ position: 'absolute', bottom: 10, left: 10, color: 'white' }}>
        Press SPACE to control critters. Use arrow keys for X/Y movement, W/S for Z movement.
      </div>
    </div>
  );
};

export default MathsPetsScene;

// Helper function to convert SVG path to points
function svgPathToPoints(d: string): Vector3[] {
  const commands = d.match(/[A-Z][^A-Z]*/g) || [];
  const points: Vector3[] = [];
  let currentPoint = new Vector3();

  commands.forEach((cmd: string) => {
    const type = cmd[0];
    const args = cmd.slice(1).trim().split(/[\s,]+/).map(Number);

    switch (type) {
      case 'M':
      case 'L':
        currentPoint.set(args[0], -args[1], 0);
        points.push(currentPoint.clone());
        break;
      case 'C':
        currentPoint.set(args[4], -args[5], 0);
        points.push(currentPoint.clone());
        break;
    }
  });

  return points;
}

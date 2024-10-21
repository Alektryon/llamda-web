import React from 'react';
import { Text } from '@react-three/drei';
import useCountdown from './useCountdown';
function Countdown() {
  const timeLeft = useCountdown(new Date('2024-10-21T23:59:59-08:00'));

  return (
    <Text fontSize={2} position={[0, 0, 0]}>
      {timeLeft}
    </Text>
  );
}

export default Countdown;

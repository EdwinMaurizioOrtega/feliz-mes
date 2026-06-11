'use client';

import { useState } from 'react';
import LockScreen from '@/components/LockScreen';
import Roulette from '@/components/Roulette';
import TimePicker from '@/components/TimePicker';
import FinalReveal from '@/components/FinalReveal';

export default function Home() {
  const [step, setStep] = useState('lock'); // lock | roulette | time | final
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <main>
      {step === 'lock' && <LockScreen onUnlock={() => setStep('roulette')} />}
      {step === 'roulette' && <Roulette onConfirm={() => setStep('time')} />}
      {step === 'time' && (
        <TimePicker
          onConfirm={(time) => {
            setSelectedTime(time);
            setStep('final');
          }}
        />
      )}
      {step === 'final' && <FinalReveal time={selectedTime} />}
    </main>
  );
}

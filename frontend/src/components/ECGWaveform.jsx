import React, { useEffect, useRef } from 'react';

const ECGWaveform = ({ bpm = 72, color = '#ff3366' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let x = 0;
    const points = [];
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      }
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }

      // ECG Logic
      const speed = (bpm / 60) * 2;
      x += speed;
      if (x > width) x = 0;

      // Generate ECG shape (P-QRS-T)
      let y = height / 2;
      const cyclePos = x % 100;
      
      if (cyclePos > 10 && cyclePos < 20) y -= 5; // P wave
      if (cyclePos > 25 && cyclePos < 28) y += 10; // Q wave
      if (cyclePos > 28 && cyclePos < 32) y -= 40; // R wave (spike)
      if (cyclePos > 32 && cyclePos < 35) y += 15; // S wave
      if (cyclePos > 45 && cyclePos < 60) y -= 8; // T wave

      points.push({ x, y });
      if (points.length > 200) points.shift();

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';

      for (let i = 0; i < points.length; i++) {
        if (i === 0) ctx.moveTo(points[i].x, points[i].y);
        else ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [bpm, color]);

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={100} 
      className="w-full h-full opacity-60"
    />
  );
};

export default ECGWaveform;

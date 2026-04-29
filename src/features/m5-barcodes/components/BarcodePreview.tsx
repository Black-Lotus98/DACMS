'use client';

import { useEffect, useRef } from 'react';
import bwipjs from 'bwip-js';
import { BarcodeType } from '../types';

interface BarcodePreviewProps {
  code: string;
  type: BarcodeType;
}

export function BarcodePreview({ code, type }: BarcodePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      bwipjs.toCanvas(canvasRef.current, {
        bcid: type === BarcodeType.QR ? 'qrcode' : 'code128',
        text: code,
        scale: 2,
        height: type === BarcodeType.QR ? 24 : 12,
        includetext: type !== BarcodeType.QR,
      });
    } catch {
      // keep preview resilient even if rendering fails
    }
  }, [code, type]);

  return <canvas ref={canvasRef} className="max-w-full" />;
}

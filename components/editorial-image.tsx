'use client';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
type Props = Omit<ImageProps, 'onError'>;
export function EditorialImage({ alt, className = '', ...props }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div role="img" aria-label={`${alt || 'Editorial'} image unavailable`} className="absolute inset-0 grid place-items-center bg-[linear-gradient(145deg,#e4eee9,#f6f5f1)] p-6 text-center text-sm font-semibold tracking-[.08em] text-accent"><span>AURELIA<br/><span className="font-normal tracking-normal text-muted">Image unavailable</span></span></div>;
  return <Image {...props} alt={alt} className={className} onError={() => setFailed(true)} />;
}

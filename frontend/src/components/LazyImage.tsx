import React, { useState } from 'react';
import { useLazyImage } from '../hooks/useLazy';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  width?: number;
  height?: number;
}

/**
 * Componente LazyImage otimizado
 * Carrega imagens apenas quando entram no viewport
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22400%22 height=%22300%22/%3E%3C/svg%3E',
  width,
  height,
  className,
  ...props
}: LazyImageProps) => {
  const { ref, isVisible } = useLazyImage();
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      ref={ref}
      src={isVisible ? src : placeholder}
      alt={alt}
      width={width}
      height={height}
      className={`lazy-image ${loaded ? 'loaded' : ''} ${className || ''}`}
      onLoad={() => setLoaded(true)}
      {...props}
    />
  );
};

export default LazyImage;

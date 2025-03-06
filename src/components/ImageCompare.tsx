import React, { useState, useRef, useEffect } from "react";

interface ImageComparisonProps {
  before: string;
  after: string;
  altBefore?: string;
  altAfter?: string;
}

const ImageCompare: React.FC<ImageComparisonProps> = ({ before, after, altBefore = "Before", altAfter = "After" }) => {
  const [position, setPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Maneja el arrastre del slider
  const handleDrag = (event: MouseEvent | TouchEvent) => {
    console.log('entroo')
    if (!isDragging.current || !sliderRef.current) return;

    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
    const rect = sliderRef.current.getBoundingClientRect();
    let newPos = ((clientX - rect.left) / rect.width) * 100;
    newPos = Math.max(0, Math.min(100, newPos)); // Limitar entre 0 y 100

    setPosition(newPos);
  };

  // Activa el drag al hacer clic en el control
  const startDrag = () => {
    isDragging.current = true;
  };

  // Detiene el drag cuando se suelta el mouse o el touch
  const stopDrag = () => {
    isDragging.current = false;
  };

  // Añade y elimina eventos globales de movimiento y soltar
  useEffect(() => {
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", handleDrag, { passive: false });
    document.addEventListener("touchend", stopDrag);

    return () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", stopDrag);
      document.removeEventListener("touchmove", handleDrag);
      document.removeEventListener("touchend", stopDrag);
    };
  }, []);

  return (
    <div ref={sliderRef} className="relative w-full h-[400px] overflow-hidden select-none touch-none">
      {/* Imagen de antes */}
      <img src={before} alt={altBefore} className="absolute inset-0 w-full h-full object-cover" />

      {/* Imagen de después con clip-path dinámico */}
      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img src={after} alt={altAfter} className="w-full h-full object-cover" />
      </div>

      {/* Barra de control */}
      <div className="absolute inset-y-0" style={{ left: `${position}%` }}>
        <div className="w-[4px] h-full bg-white shadow-lg rounded-full"></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center cursor-ew-resize"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          ⬌
        </div>
      </div>
    </div>
  );
};

export default ImageCompare;
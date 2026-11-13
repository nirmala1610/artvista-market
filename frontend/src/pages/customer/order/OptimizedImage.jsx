import { useState } from "react";

const OptimizedImage = ({
  src,
  alt,
  className,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-[30px]">

      {!loaded && (
        <div className="absolute inset-0 bg-[#d9e4ec] animate-pulse" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`
          ${className}
          transition-all duration-700
          ${loaded
            ? "opacity-100 scale-100"
            : "opacity-0 scale-110"}
        `}
      />

    </div>
  );
};

export default OptimizedImage;
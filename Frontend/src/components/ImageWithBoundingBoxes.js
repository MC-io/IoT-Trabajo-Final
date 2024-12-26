import React, { useRef, useEffect, useState } from "react";

function ImageWithBoundingBoxes({ imageUrl, metadata }) {
  const imageRef = useRef(null);
  const [imageDimensions, setImageDimensions] = useState({
    naturalWidth: 1,
    naturalHeight: 1,
    displayedWidth: 1,
    displayedHeight: 1,
  });

  useEffect(() => {
    const updateImageDimensions = () => {
      if (imageRef.current) {
        const { naturalWidth, naturalHeight, clientWidth } = imageRef.current;

        // Calcular el alto mostrado basándonos en la proporción del ancho
        const displayedHeight = (naturalHeight / naturalWidth) * clientWidth;

        setImageDimensions({
          naturalWidth,
          naturalHeight,
          displayedWidth: clientWidth,
          displayedHeight,
        });
      }
    };

    // Actualizar dimensiones al cargar la imagen o redimensionar la ventana
    updateImageDimensions();

    // Escuchar cambios en el tamaño de la ventana
    window.addEventListener("resize", updateImageDimensions);

    return () => {
      window.removeEventListener("resize", updateImageDimensions);
    };
  }, [imageUrl]);

  const { displayedWidth, displayedHeight, naturalWidth, naturalHeight } = imageDimensions;

  // Relación de escalado entre las dimensiones originales y las mostradas
  const scaleX = displayedWidth / naturalWidth;
  const scaleY = displayedHeight / naturalHeight;

  return (
    <div className="image-container" style={{ position: "relative", display: "inline-block" }}>
      {/* Imagen base */}
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Frame"
        style={{ width: "100%", display: "block" }}
        onLoad={() => {
          if (imageRef.current) {
            const { naturalWidth, naturalHeight, clientWidth } = imageRef.current;

            // Calcular el alto mostrado basándonos en la proporción del ancho
            const displayedHeight = (naturalHeight / naturalWidth) * clientWidth;

            setImageDimensions({
              naturalWidth,
              naturalHeight,
              displayedWidth: clientWidth,
              displayedHeight,
            });
          }
        }}
      />

      {/* Dibujar bounding boxes */}
      {metadata.map((detection, index) => {
        const { bbox, label, confidence } = detection;

        // Calcular posiciones y dimensiones escaladas
        const left = bbox.x_min * scaleX;
        const top = bbox.y_min * scaleY;
        const boxWidth = (bbox.x_max - bbox.x_min) * scaleX;
        const boxHeight = (bbox.y_max - bbox.y_min) * scaleY;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              border: "2px solid red",
              left: `${left}px`,
              top: `${top}px`,
              width: `${boxWidth}px`,
              height: `${boxHeight}px`,
              boxSizing: "border-box",
            }}
          >
            {/* Etiqueta */}
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "-15px",
                transform: "translateX(-50%)",
                color: "white",
                fontSize: "12px",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                padding: "2px 5px",
                borderRadius: "4px",
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
            >
              {label} - {Math.round(confidence * 100)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default ImageWithBoundingBoxes;

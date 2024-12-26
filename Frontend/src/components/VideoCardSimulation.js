import React, { useEffect, useState } from "react";
import ImageWithBoundingBoxes from "./ImageWithBoundingBoxes";

function VideoCard({ video }) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % video.urls.length);
    }, 1000); // Simula el cambio de frames (300ms)
    return () => clearInterval(interval);
  }, [video.urls.length]);

  const handleTimestampClick = (index) => {
    setCurrentFrame(index); 
  };

  return (
    <div className="video-card">
      <ImageWithBoundingBoxes
        imageUrl={video.urls[currentFrame]} 
        metadata={video.metadata[currentFrame]} 
      />
      <h3>{video.timestamps[currentFrame]}</h3>

      {/* Lista de timestamps */}
      <div className="timestamp-list">
        {video.timestamps.map((timestamp, index) => (
          <button
            key={index}
            className={`timestamp-btn ${
              index === currentFrame ? "active" : ""
            }`} // Marca el timestamp actual como activo
            onClick={() => handleTimestampClick(index)}
          >
            {timestamp}
          </button>
        ))}
      </div>
    </div>
  );
}

export default VideoCard;

import React, { useEffect, useState } from "react";
import ImageWithBoundingBoxes from './ImageWithBoundingBoxes';

function VideoCard({ imageUrl, metadata }) {
  

  return (
    <div className="video-card">
      <ImageWithBoundingBoxes
        imageUrl={imageUrl} 
        metadata={metadata || []} 
      />
    </div>
  );
}

export default VideoCard;

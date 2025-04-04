
import React from 'react';

type VideoBackgroundProps = {
  children: React.ReactNode;
};

const VideoBackground = ({ children }: VideoBackgroundProps) => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/lovable-uploads/philippines-beach.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Enhanced overlay with gradient using new colors */}
        <div className="absolute inset-0 bg-gradient-to-b from-filipino-forest/70 via-filipino-forest/40 to-filipino-forest/70 z-10"></div>
        
        {/* Color accent borders */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-filipino-maroon via-filipino-goldenrod to-filipino-beige z-20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-filipino-beige via-filipino-goldenrod to-filipino-maroon z-20"></div>
      </div>
      
      {/* Content with higher z-index */}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
};

export default VideoBackground;

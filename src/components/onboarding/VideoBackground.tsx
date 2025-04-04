
import React from 'react';

type VideoBackgroundProps = {
  children: React.ReactNode;
};

const VideoBackground = ({ children }: VideoBackgroundProps) => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 w-full h-full z-0">
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
        <div className="absolute inset-0 bg-gradient-to-b from-filipino-navy/70 via-filipino-navy/40 to-filipino-navy/70 z-10"></div>
        
        {/* Color accent borders */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-filipino-teal via-filipino-yellow to-filipino-red z-20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-filipino-red via-filipino-yellow to-filipino-teal z-20"></div>
      </div>
      
      {/* Content with higher z-index */}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
};

export default VideoBackground;

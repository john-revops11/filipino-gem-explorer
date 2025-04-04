
import React from 'react';

type VideoBackgroundProps = {
  children: React.ReactNode;
};

export default function VideoBackground({ children }: VideoBackgroundProps) {
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
        
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-filipino-navy/70 via-filipino-navy/40 to-filipino-navy/80 z-10"></div>
      </div>
      
      {/* Content with higher z-index */}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
}

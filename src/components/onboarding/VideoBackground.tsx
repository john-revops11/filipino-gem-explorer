
import React, { useEffect, useState } from 'react';

type VideoBackgroundProps = {
  children: React.ReactNode;
};

const VideoBackground = ({ children }: VideoBackgroundProps) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Create YouTube iframe API script
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Add event listener for when the YouTube API is ready
    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player('youtubeBackground', {
        videoId: 'R7YMIeqIxHI', // YouTube video ID
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: 'R7YMIeqIxHI', // needed for loop to work
          controls: 0,
          showinfo: 0,
          rel: 0,
          disablekb: 1,
          modestbranding: 1,
          mute: 1, // muted for autoplay to work
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            event.target.mute();
            setVideoLoaded(true);
          },
        }
      });
    };

    return () => {
      // Cleanup
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* YouTube background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div id="youtubeBackground" className="w-full h-full">
          {/* YouTube iframe will be inserted here by the API */}
        </div>
        
        {/* Fallback video background - will only show before YouTube loads */}
        {!videoLoaded && (
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
        )}
        
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

// Add TypeScript declaration for the YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | null;
  }
}

export default VideoBackground;

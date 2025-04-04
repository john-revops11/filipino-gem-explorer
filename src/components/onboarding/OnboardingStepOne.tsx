
import { motion } from "framer-motion";

export default function OnboardingStepOne() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-white"
      >
        <div className="w-40 h-40 mb-8 mx-auto">
          <img 
            src="/lovable-uploads/4c2638cd-0e7f-4814-adf8-5f0215c6afbd.png" 
            alt="Local Stopover Logo"
            className="w-full h-full object-contain"
          />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-white">Welcome to Local Stopover</h1>
        
        <p className="text-lg text-white/90 mb-8 max-w-md mx-auto">
          Discover the beauty of the Philippines through its hidden gems and authentic local experiences.
        </p>
        
        <div className="flex justify-center space-x-4 mb-8">
          <div className="w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <span className="text-3xl">🏝️</span>
          </div>
          <div className="w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <span className="text-3xl">🍲</span>
          </div>
          <div className="w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <span className="text-3xl">🏺</span>
          </div>
        </div>
        
        <p className="text-white/80 max-w-md mx-auto">
          Let's personalize your experience to help you discover places that match your interests.
        </p>
      </motion.div>
    </div>
  );
}

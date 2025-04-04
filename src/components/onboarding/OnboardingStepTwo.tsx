
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const interests = [
  { id: "culture", label: "Culture & Heritage", emoji: "🏛️" },
  { id: "food", label: "Food & Cuisine", emoji: "🍲" },
  { id: "nature", label: "Nature & Outdoors", emoji: "🌴" },
  { id: "adventure", label: "Adventure", emoji: "🧗‍♀️" },
  { id: "beach", label: "Beaches", emoji: "🏖️" },
  { id: "wildlife", label: "Wildlife", emoji: "🦎" },
  { id: "festivals", label: "Festivals", emoji: "🎭" },
  { id: "shopping", label: "Markets & Crafts", emoji: "🛍️" },
];

type OnboardingStepTwoProps = {
  preferences: {
    interests: string[];
    travelStyle: string;
    budget: string;
  };
  updatePreferences: (key: string, value: any) => void;
};

export default function OnboardingStepTwo({ preferences, updatePreferences }: OnboardingStepTwoProps) {
  const toggleInterest = (interestId: string) => {
    if (preferences.interests.includes(interestId)) {
      updatePreferences(
        "interests",
        preferences.interests.filter((id) => id !== interestId)
      );
    } else {
      updatePreferences("interests", [...preferences.interests, interestId]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-black/30 p-6 rounded-xl backdrop-blur-sm text-white max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold mb-2">What interests you most?</h2>
      <p className="text-white/80 mb-6">
        Select all that apply to get personalized recommendations.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {interests.map((interest) => {
          const isSelected = preferences.interests.includes(interest.id);
          return (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`relative flex flex-col items-center justify-center p-4 rounded-lg border ${
                isSelected
                  ? "bg-filipino-terracotta/70 border-filipino-terracotta"
                  : "border-white/20 bg-white/10"
              } transition-all duration-200`}
            >
              {isSelected && (
                <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-white" />
              )}
              <span className="text-2xl mb-2">{interest.emoji}</span>
              <span className={isSelected ? "font-medium" : ""}>{interest.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

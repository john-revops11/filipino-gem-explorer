
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type OnboardingStepThreeProps = {
  preferences: {
    interests: string[];
    travelStyle: string;
    budget: string;
  };
  updatePreferences: (key: string, value: any) => void;
};

export default function OnboardingStepThree({ preferences, updatePreferences }: OnboardingStepThreeProps) {
  const travelStyles = [
    { id: "solo", label: "Solo Traveler", emoji: "👤" },
    { id: "couple", label: "Couple", emoji: "👫" },
    { id: "family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
    { id: "friends", label: "Group of Friends", emoji: "👥" },
  ];

  const budgetRanges = [
    { id: "budget", label: "Budget Conscious" },
    { id: "moderate", label: "Moderate Spender" },
    { id: "luxury", label: "Luxury Explorer" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6">A bit more about your travel</h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">How do you travel?</h3>
          <RadioGroup
            value={preferences.travelStyle}
            onValueChange={(value) => updatePreferences("travelStyle", value)}
            className="grid grid-cols-2 gap-3"
          >
            {travelStyles.map((style) => (
              <div key={style.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={style.id}
                  id={`travel-style-${style.id}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`travel-style-${style.id}`}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-border bg-card peer-data-[state=checked]:bg-filipino-terracotta/10 peer-data-[state=checked]:border-filipino-terracotta"
                >
                  <span className="text-2xl mb-2">{style.emoji}</span>
                  <span className="text-center">{style.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">What's your budget range?</h3>
          <RadioGroup
            value={preferences.budget}
            onValueChange={(value) => updatePreferences("budget", value)}
            className="space-y-3"
          >
            {budgetRanges.map((budget) => (
              <div key={budget.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={budget.id}
                  id={`budget-${budget.id}`}
                />
                <Label htmlFor={`budget-${budget.id}`}>{budget.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </motion.div>
  );
}

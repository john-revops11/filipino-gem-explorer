
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Note: In a production app, you would store this in environment variables
// The API key below will be accessible to frontend users - use with caution
const API_KEY = "AIzaSyCJIDNvI7w8jpjyWLI9yaPp3PWAeD95AnA";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(API_KEY);

// Safety settings to avoid harmful content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Function to format itinerary text into structured HTML
export function formatItineraryContent(content: string): string {
  // First, let's identify days in the itinerary
  const dayRegex = /\*\*Day\s+(\d+)[^\*]*\*\*/g;
  const dayMatches = [...content.matchAll(dayRegex)];
  
  if (dayMatches.length === 0) {
    // If no day structure found, return basic formatted content
    return `<div class="prose prose-sm max-w-none">${content
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n\*/g, '<br/>•')
      .replace(/\n/g, '<br/>')}</div>`;
  }

  // Split by days
  const dayTexts = [];
  for (let i = 0; i < dayMatches.length; i++) {
    const startPos = dayMatches[i].index;
    const endPos = i < dayMatches.length - 1 ? dayMatches[i + 1].index : content.length;
    
    if (startPos !== undefined) { // TypeScript check
      const dayText = content.substring(startPos, endPos).trim();
      dayTexts.push(dayText);
    }
  }

  // Format the title and introduction (text before the first day)
  let intro = '';
  if (dayMatches[0] && dayMatches[0].index !== undefined && dayMatches[0].index > 0) {
    intro = content.substring(0, dayMatches[0].index).trim();
  }

  // Build the formatted HTML
  let htmlContent = '';
  
  // Add title and introduction if they exist
  if (intro) {
    const titleMatch = intro.match(/##\s+([^\n]+)/);
    if (titleMatch) {
      htmlContent += `<h2 class="text-2xl font-bold text-filipino-deepTeal mb-4">${titleMatch[1]}</h2>`;
      intro = intro.replace(/##\s+([^\n]+)/, '');
    }
    
    htmlContent += `<div class="mb-6 text-filipino-darkGray">${intro
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>')}</div>`;
  }

  // Create an accordion-like structure for each day
  htmlContent += `<div class="space-y-4">`;
  
  dayTexts.forEach((dayText) => {
    // Extract day number and title
    const dayTitleMatch = dayText.match(/\*\*Day\s+(\d+):([^\*]+)\*\*/);
    if (!dayTitleMatch) return;
    
    const dayNumber = dayTitleMatch[1];
    const dayTitle = dayTitleMatch[2].trim();
    
    // Format the day's content
    let dayContent = dayText.replace(/\*\*Day\s+\d+:[^\*]+\*\*/, '').trim();
    
    // Create sections for morning, afternoon, evening
    const timeSlots = ['Morning', 'Afternoon', 'Evening'];
    let formattedContent = '';
    
    timeSlots.forEach(timeSlot => {
      const slotRegex = new RegExp(`\\*\\*${timeSlot}[^\\*]*\\*\\*([\\s\\S]*?)(?=\\*\\*(?:Afternoon|Evening|Travel Tip|$))`, 'i');
      const slotMatch = dayContent.match(slotRegex);
      
      if (slotMatch) {
        const slotContent = slotMatch[1].trim();
        
        // Format activities and food
        let activities = '';
        let food = '';
        let costs = '';
        
        const activityMatch = slotContent.match(/\*\*Activity:\*\*([^*]+?)(?=\*\*Food|\*\*Estimated|\*\*Travel|$)/s);
        if (activityMatch) activities = activityMatch[1].trim();
        
        const foodMatch = slotContent.match(/\*\*Food:\*\*([^*]+?)(?=\*\*Estimated|\*\*Travel|$)/s);
        if (foodMatch) food = foodMatch[1].trim();
        
        const costMatch = slotContent.match(/\*\*Estimated Cost:\*\*([^*]+?)(?=\*\*Travel|$)/s);
        if (costMatch) costs = costMatch[1].trim();
        
        // Add the time slot section
        formattedContent += `
          <div class="mb-4">
            <h4 class="font-semibold text-filipino-terracotta">${timeSlot}</h4>
            ${activities ? `
              <div class="ml-4 mt-2">
                <div class="flex items-start">
                  <div class="bg-filipino-teal/10 p-1 rounded mr-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-filipino-teal" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                  </div>
                  <div>
                    <p class="font-medium text-sm">Activities</p>
                    <p class="text-sm text-filipino-darkGray">${activities.replace(/\n/g, '<br/>')}</p>
                  </div>
                </div>
              </div>
            ` : ''}
            ${food ? `
              <div class="ml-4 mt-2">
                <div class="flex items-start">
                  <div class="bg-filipino-warmOchre/10 p-1 rounded mr-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-filipino-warmOchre" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>
                  </div>
                  <div>
                    <p class="font-medium text-sm">Food</p>
                    <p class="text-sm text-filipino-darkGray">${food.replace(/\n/g, '<br/>')}</p>
                  </div>
                </div>
              </div>
            ` : ''}
            ${costs ? `
              <div class="ml-4 mt-2">
                <div class="flex items-start">
                  <div class="bg-filipino-deepTeal/10 p-1 rounded mr-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-filipino-deepTeal" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/></svg>
                  </div>
                  <div>
                    <p class="font-medium text-sm">Estimated Cost</p>
                    <p class="text-sm text-filipino-darkGray">${costs.replace(/\n/g, '<br/>')}</p>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }
    });
    
    // Check for travel tips
    const tipMatch = dayContent.match(/\*\*Travel Tip:\*\*([^*]+)(?=\*\*|$)/s);
    let travelTip = '';
    if (tipMatch) travelTip = tipMatch[1].trim();
    
    // Add the day card
    htmlContent += `
      <div class="border rounded-lg overflow-hidden shadow-sm">
        <div class="bg-filipino-teal/10 p-4">
          <h3 class="font-bold text-filipino-deepTeal">Day ${dayNumber}: ${dayTitle}</h3>
        </div>
        <div class="p-4">
          ${formattedContent}
          ${travelTip ? `
            <div class="bg-filipino-warmOchre/10 p-3 rounded-md mt-2">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-filipino-warmOchre mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <div>
                  <p class="font-medium text-sm">Travel Tip</p>
                  <p class="text-sm text-filipino-darkGray">${travelTip.replace(/\n/g, '<br/>')}</p>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  });
  
  // Add final section (if any)
  const finalContent = content.substring(
    dayMatches[dayMatches.length - 1].index !== undefined ? 
      dayMatches[dayMatches.length - 1].index + dayTexts[dayMatches.length - 1].length : 
      content.length
  ).trim();
  
  if (finalContent) {
    htmlContent += `
      <div class="border rounded-lg overflow-hidden shadow-sm mt-4">
        <div class="bg-filipino-teal/10 p-4">
          <h3 class="font-bold text-filipino-deepTeal">Additional Information</h3>
        </div>
        <div class="p-4">
          <div class="prose prose-sm">${finalContent
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br/>')}</div>
        </div>
      </div>
    `;
  }
  
  htmlContent += '</div>';
  
  return htmlContent;
}

// Create a function to generate travel recommendations based on user preferences
export async function generateTravelRecommendations(preferences: {
  location?: string;
  interests?: string[];
  budget?: string;
  duration?: string;
  travelStyle?: string;
}): Promise<any> {
  try {
    // Format the prompt based on user preferences
    const prompt = `Act as a Filipino travel expert and recommend destinations in the Philippines based on these preferences:
    ${preferences.location ? `Location preference: ${preferences.location}` : ''}
    ${preferences.interests ? `Interests: ${preferences.interests.join(', ')}` : ''}
    ${preferences.budget ? `Budget: ${preferences.budget}` : ''}
    ${preferences.duration ? `Trip duration: ${preferences.duration}` : ''}
    ${preferences.travelStyle ? `Travel style: ${preferences.travelStyle}` : ''}
    
    Provide three specific destinations with a brief description, key attractions, best time to visit, and estimated costs.`;

    // Get the model and start the generation process
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      },
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating travel recommendations:", error);
    throw error;
  }
}

// Create a function to generate detailed itineraries
export async function generateItinerary(destination: string, days: number, preferences: string): Promise<any> {
  try {
    const prompt = `Create a detailed ${days}-day itinerary for ${destination} in the Philippines. 
    Consider these preferences: ${preferences}.
    Format the response as follows:
    
    ## ${days}-Day ${destination} Itinerary
    
    Start with a brief introduction about this itinerary.
    
    **Day 1: [Title for Day 1]**
    
    **Morning (approximate time range):**
    **Activity:** Describe morning activities in detail.
    **Food:** Recommend breakfast options.
    **Estimated Cost:** Provide cost range for morning activities and food.
    
    **Afternoon (approximate time range):**
    **Activity:** Describe afternoon activities in detail.
    **Food:** Recommend lunch options.
    **Estimated Cost:** Provide cost range for afternoon activities and food.
    
    **Evening (approximate time range):**
    **Activity:** Describe evening activities in detail.
    **Food:** Recommend dinner options.
    **Estimated Cost:** Provide cost range for evening activities and food.
    
    **Travel Tip:** Provide one useful tip specific to this day.
    
    (Repeat this format for each day)
    
    After the daily breakdown, include a "Total Estimated Cost" section and any additional notes about accommodation or transportation.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1500,
      },
    });

    const response = result.response;
    const rawText = response.text();
    
    // Format the raw text into structured HTML
    return formatItineraryContent(rawText);
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
}

// Create a function to analyze and answer travel questions
export async function answerTravelQuestion(question: string): Promise<any> {
  try {
    const prompt = `As a Filipino travel expert, please answer this travel question about the Philippines:
    
    ${question}
    
    Provide a helpful, informative answer based on local knowledge and travel expertise.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 600,
      },
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error answering travel question:", error);
    throw error;
  }
}

export { genAI };

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Pexels API configuration
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_BASE_URL = "https://api.pexels.com/v1";

async function searchPexelsImage(query, orientation = "landscape") {
  if (!PEXELS_API_KEY) {
    return "https://via.placeholder.com/400x300?text=Image+Placeholder";
  }

  try {
    const response = await fetch(
      `${PEXELS_BASE_URL}/search?query=${encodeURIComponent(
        query
      )}&orientation=${orientation}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Pexels API request failed");
    }

    const data = await response.json();

    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.medium; // Use medium size for better performance
    }

    return "https://via.placeholder.com/400x300?text=Image+Placeholder";
  } catch (error) {
    console.error("Error fetching Pexels image:", error);
    return "https://via.placeholder.com/400x300?text=Image+Placeholder";
  }
}

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Create the model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite-preview-06-17",
    });

    // Create the system prompt
    const systemPrompt = `You are an expert email designer and developer. Create a professional email structure based on the user's description.

AVAILABLE COMPONENTS:
1. heading - For titles and section headers
2. text-block - For body text content  
3. image - For images (will be fetched from Pexels API)
4. button - For call-to-action buttons
5. divider - For horizontal separators
6. spacer - For vertical spacing
7. social-media - For social media links
8. navigation - For menu navigation

COMPONENT DATA STRUCTURES:
- heading: { content: string, level: "h1"|"h2"|"h3"|"h4"|"h5"|"h6", fontSize: string, color: string, alignment: "left"|"center"|"right" }
- text-block: { content: string, fontSize: string, color: string, alignment: "left"|"center"|"right"|"justify" }
- image: { src: string, alt: string, width: string, height: string, pexelsQuery: string }
- button: { text: string, url: string, backgroundColor: string, color: string, padding: string, borderRadius: string }
- divider: { style: "solid"|"dashed"|"dotted", color: string, height: string }
- spacer: { height: string }
- social-media: { platforms: [{ name: string, url: string }], iconSize: string, color: string, alignment: "left"|"center"|"right" }
- navigation: { items: [{ text: string, url: string }], alignment: "left"|"center"|"right", fontSize: string, color: string }

INSTRUCTIONS:
1. Analyze the user's request carefully
2. Create a logical email structure with appropriate components
3. Use professional colors (blues, grays, whites for business; brighter colors for promotions)
4. Include engaging content that matches the email purpose
5. Add appropriate spacing and dividers for visual hierarchy
6. For images, include a pexelsQuery field with relevant search terms
7. Include call-to-action buttons for promotional emails
8. Add social media links for brand awareness
9. DO NOT generate HTML content - only use the component structure
10. Write natural, engaging text content

RESPONSE FORMAT:
Return ONLY a valid JSON object with this exact structure:
{
  "components": [
    {
      "type": "component-type",
      "data": { /* component data */ }
    }
  ]
}

Make the email professional, engaging, and well-structured. Use appropriate colors, fonts, and spacing.`;

    // Generate content
    const result = await model.generateContent([
      systemPrompt,
      `User request: ${prompt}`,
    ]);
    const response = await result.response;
    const text = response.text();

    // Try to extract JSON from the response
    let emailStructure;
    try {
      // Look for JSON in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        emailStructure = JSON.parse(jsonMatch[0]);

        // Validate the structure
        if (
          !emailStructure.components ||
          !Array.isArray(emailStructure.components)
        ) {
          throw new Error("Invalid component structure");
        }

        // Process images and fetch from Pexels
        for (const component of emailStructure.components) {
          if (component.type === "image" && component.data.pexelsQuery) {
            const imageUrl = await searchPexelsImage(
              component.data.pexelsQuery
            );
            component.data.src = imageUrl;
            // Remove pexelsQuery as it's not needed in the final data
            delete component.data.pexelsQuery;
          }
        }
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (error) {
      console.error("Error parsing AI response:", error);
      console.log("Raw AI response:", text);

      // Fallback: create a simple structure based on the prompt
      const fallbackContent = `Generated email based on: "${prompt}"\n\nThis is a placeholder email. Please edit the content to match your needs.`;

      emailStructure = {
        components: [
          {
            type: "heading",
            data: {
              content: "Generated Email",
              level: "h1",
              fontSize: "28px",
              color: "#1f2937",
              alignment: "center",
            },
          },
          {
            type: "spacer",
            data: {
              height: "20px",
            },
          },
          {
            type: "text-block",
            data: {
              content: fallbackContent,
              fontSize: "16px",
              color: "#374151",
              alignment: "left",
            },
          },
          {
            type: "spacer",
            data: {
              height: "20px",
            },
          },
          {
            type: "divider",
            data: {
              style: "solid",
              color: "#e5e7eb",
              height: "1px",
            },
          },
          {
            type: "spacer",
            data: {
              height: "20px",
            },
          },
          {
            type: "text-block",
            data: {
              content:
                "You can edit this email using the editor tools on the left panel.",
              fontSize: "14px",
              color: "#6b7280",
              alignment: "center",
            },
          },
        ],
      };
    }

    return Response.json({
      emailStructure: JSON.stringify(emailStructure),
      rawResponse: text,
    });
  } catch (error) {
    console.error("Error generating email:", error);
    return Response.json(
      { error: "Failed to generate email. Please try again." },
      { status: 500 }
    );
  }
}

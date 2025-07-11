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
    const systemPrompt = `You are an expert email designer and developer. Create a professional and visually appealing email structure based on the user's description.

AVAILABLE COMPONENTS:
1. heading - For titles and section headers
2. text-block - For body text content
3. image - For images (will be fetched from Pexels API)
4. button - For call-to-action buttons
5. divider - For horizontal separators
6. spacer - For vertical spacing
7. social-media - For social media links
8. navigation - For menu navigation
9. single-column - A single column layout that can contain other components
10. two-columns-50 - Two equal-width columns that can contain other components
11. two-columns-33-67 - Two columns (33% and 67%) that can contain other components
12. two-columns-67-33 - Two columns (67% and 33%) that can contain other components
13. three-columns - Three equal-width columns that can contain other components
14. four-columns - Four equal-width columns that can contain other components

COMPONENT DATA STRUCTURES:
- heading: { content: string, level: "h1"|"h2"|"h3", fontSize: string, color: string, alignment: "left"|"center"|"right" }
- text-block: { content: string, fontSize: string, color: string, alignment: "left"|"center"|"right"|"justify" }
- image: { src: string, alt: string, width: string, height: string, pexelsQuery: string }
- button: { text: string, url: string, backgroundColor: string, color: string, padding: string, borderRadius: string }
- divider: { style: "solid"|"dashed"|"dotted", color: string, height: string }
- spacer: { height: string }
- social-media: { platforms: [{ name: string, url: string }], iconSize: string, color: string, alignment: "left"|"center"|"right" }
- navigation: { items: [{ text: string, url: string }], alignment: "left"|"center"|"right", fontSize: string, color: string }
- single-column: { width: string, backgroundColor: string, padding: string, components: [] }
- two-columns-50: { leftWidth: "50%", rightWidth: "50%", backgroundColor: string, padding: string, gap: string, leftComponents: [], rightComponents: [] }
- two-columns-33-67: { leftWidth: "33%", rightWidth: "67%", backgroundColor: string, padding: string, gap: string, leftComponents: [], rightComponents: [] }
- two-columns-67-33: { leftWidth: "67%", rightWidth: "33%", backgroundColor: string, padding: string, gap: string, leftComponents: [], rightComponents: [] }
- three-columns: { columnWidth: "33.33%", backgroundColor: string, padding: string, gap: string, column1Components: [], column2Components: [], column3Components: [] }
- four-columns: { columnWidth: "25%", backgroundColor: string, padding: string, gap: string, column1Components: [], column2Components: [], column3Components: [], column4Components: [] }

INSTRUCTIONS:
1.  Analyze the user's request carefully to understand the email's purpose and tone.
2.  Create a logical and visually appealing email structure by nesting components within layout components (e.g., single-column, two-columns).
3.  Use professional and harmonious color palettes. For corporate emails, prefer blues, grays, and whites. For promotional emails, use brighter, more vibrant colors that match the brand's identity.
4.  Choose appropriate font sizes and styles for headings and body text to ensure readability and visual hierarchy.
5.  Incorporate engaging and well-written copy that matches the email's purpose.
6.  Use spacers and dividers effectively to create a clean and well-organized layout.
7.  For images, provide a relevant 'pexelsQuery' to fetch appropriate visuals.
8.  Include clear and compelling call-to-action buttons for promotional content.
9.  Add social media links to enhance brand presence.
10. Do NOT generate any HTML. Only use the provided component data structures.

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

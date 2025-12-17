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
    const { prompt, image } = await request.json();

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
      model: "gemini-2.5-flash",
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
8. link - for block level link text
9. two-column - 2 columns side-by-side layout
10. three-column - 3 columns side-by-side layout
11. list - can list ordered or unordered items
12. container - wrapper for grouping components with specific background/padding (like cards, badges, sections)

COMPONENT DATA STRUCTURES:
- heading: { content: string, level: "h1"|"h2"|"h3"|"h4"|"h5"|"h6", color: string, alignment: "left"|"center"|"right",font:"Arial"|"Georgia"|"Times New Roman" |"Verdana",bold:boolean,italic:boolean,underline:boolean ,backgroundColor:string}
- text-block: { content: string, fontSize: "12px" |"14px"|"16px" |"18px"|"24px" ,font:"Arial"|"Georgia"|"Times New Roman" |"Verdana", alignment: "left"|"center"|"right",backgoundColor:string}
- image: { src: string, alt: string, width: "100%"|"75%"|"50%"|"25%"|"200px"|"300px"|"400px", height: "auto"|"100px"| "200px"|"300px"|"400px", pexelsQuery: string, alignment: "left"|"center"|"right" }
- button: { text: string, url: string, backgroundColor: string, textColor: string, padding: "10px 20px" | "18px 40px", borderRadius: "4px"|"8px"|"999px", alignment: "center"|"left"|"right", font: "Helvetica Neue" }
- divider: { style: "solid"|"dashed"|"dotted", color: string, height: "1px"|"2px"|"3px"|"4px"|}
- spacer: { height: "10px"|"20px"|"30px"|"40px"|"50px"|"60px"| }
- social-media: { platforms: [{ name: "facebbok"|"twitter"|"instagram"|"linkedin"|"youtube"|"tiktok", url: string }], iconSize:"20px"|"24px"|"32px"|"40px", color: string, alignment: "left"|"center"|"right" }
- link: {text:string,url:string, color:string,underline:boolean ,alignment: "left" || "right" || "center"}
- two-column: { width: "100%", backgroundColor: string, padding: "0px"|"10px"|"20px"|"30px", gap:"0px"|"10px"|"20px"|"30px", columnsData: [] } // Array of 2 arrays: components per column
- three-column: { width: "100%", backgroundColor: string, padding: "0px"|"10px"|"20px"|"30px", gap:"0px"|"10px"|"20px"|"30px", columnsData: [] } // Array of 3 arrays: components per column
- list :{content:html,font:"Arial"|"Georgia"|"Times New Roman" |"Verdana", fontSize:"12px" |"14px"|"16px" |"18px"|"24px"  } //cpntent can have bullet or numbered list
- container: { padding: "10px"|"20px"|"30px", backgroundColor: string, borderRadius: "0px"|"8px"|"16px", components: [] }

INSTRUCTIONS:
1.  Analyze the user's request carefully to understand the email's purpose and tone.
2.  Use 'container' component generously to create distinct sections, cards, or badges (e.g., 'New Arrival' badge, 'Featured' section card).
3.  Nest headings, text-blocks, buttons, etc., inside containers to group them visually.
4.  Use professional and harmonious color palettes. For corporate emails, prefer blues, grays, and whites. For promotional emails, use brighter, more vibrant colors.
5.  Choose appropriate font sizes and styles for headings and body text to ensure readability and visual hierarchy.
6.  Incorporate engaging and well-written copy.
7.  Use spacers and dividers effectively to create a clean and well-organized layout.
8.  For every image component, provide a direct src URL of a relevant image from Pexels and include a meaningful pexelsQuery.
9.  Include clear and compelling call-to-action buttons.
10. Add social media links to enhance brand presence.
11. Do NOT generate any HTML (except for list content). Only use the provided component data structures.
12. Keep the alignment for components to center where appropriate.
13. Consider the whole canvas to be 600px max width.

RESPONSE FORMAT:
Return ONLY a valid JSON object with this exact structure:
{
  "components": [
    {"id":"unique id",
      "type": "component-type",
      "data": { /* component data */ }
    }
  ]
}

Make the email professional, engaging, and well-structured with nested containers where applicable.`;

    // Build Gemini input
    const parts = [
      { text: systemPrompt },
      {
        text: `User request: ${
          prompt || "Generate based on the uploaded image"
        }`,
      },
    ];

    if (image) {
      parts.push({
        inlineData: {
          mimeType: "image/png", // adjust if jpeg
          data: image, // base64 string
        },
      });
    }

    // Generate content
    const result = await model.generateContent(parts);
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

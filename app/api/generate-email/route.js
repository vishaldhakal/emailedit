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
8. link - for general  links
9. column - can be split upto 3 columns and can contain other components
10.list - can list ordered or unordered items 

COMPONENT DATA STRUCTURES:
- heading: { content: string, level: "h1"|"h2"|"h3"|"h4"|"h5"|"h6", color: string, alignment: "left"|"center"|"right",font:"Arial"|"Georgia"|"Times New Roman" |"Verdana",bold:boolean,italic:boolean,underline:boolean }
- text-block: { content: string, fontSize: "12px" |"14px"|"16px" |"18px"|"24px" ,font:"Arial"|"Georgia"|"Times New Roman" |"Verdana", color: string, alignment: "left"|"center"|"right",bold:boolean,italic:boolean,underline:boolean}
- image: { src: string, alt: string, width: "100%"|"75%"|"50%"|"25%"|"200px"|"300px"|"400px" height: "auto"|"100px"| "200px"|"300px"|"400px", pexelsQuery: string }
- button: { text: string, url: string, backgroundColor: string, color: string, padding: "8px 16px"|"12px 24px"| |"16px 32px"|"20px 40px", borderRadius: "0px"|"4px"|"8px"|"16px"|"24px" }
- divider: { style: "solid"|"dashed"|"dotted", color: string, height: "1px"|"2px"|"3px"|"4px"|}
- spacer: { height: "10px"|"20px"|"30px"|"40px"|"50px"|"60px"| }
- social-media: { platforms: [{ name: "facebbok"|"twitter"|"instagram"|"linkedin"|"youtube"|"tiktok", url: string }], iconSize:"20px"|"24px"|"32px"|"40px", color: string, alignment: "left"|"center"|"right" }
-link:{text:string,url:string, color:string,underline:boolean ,alignment: "left" || "right" || "center"}
- column: { width: "100%"|"90%"|"80%"|"70%" , backgroundColor: string, padding: "0px"|"10px"|"20px"|"30px",gap:"0px"|"10px"|"20px"|"30px",columns:number //number of columns ,columnsData = [], // Array of arrays: components per column}
-list :{listType:"unordered" | "ordered", listStyle:   //for unordered "disc"|"circle"|"square"  //for ordered "decimal" | "upper-roman" |"lower-alpha",items:[],color:string, fontSize:"12px" |"14px"|"16px" |"18px"|"24px" , }

INSTRUCTIONS:
1.  Analyze the user's request carefully to understand the email's purpose and tone.
2.  Create a logical and visually appealing email structure by nesting components within layout components (e.g., single-column, two-columns).
3.  Use professional and harmonious color palettes. For corporate emails, prefer blues, grays, and whites. For promotional emails, use brighter, more vibrant colors that match the brand's identity.
4.  Choose appropriate font sizes and styles for headings and body text to ensure readability and visual hierarchy.
5.  Incorporate engaging and well-written copy that matches the email's purpose.
6.  Use spacers and dividers effectively to create a clean and well-organized layout.
7.  For every image component, whether nested inside columns or standalone, provide a direct src URL of a relevant image from Pexels and include a meaningful pexelsQuery. Do not leave src empty or omit it inside columns.
8.  Include clear and compelling call-to-action buttons for promotional content.
9.  Add social media links to enhance brand presence.
10. Do NOT generate any HTML. Only use the provided component data structures.

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

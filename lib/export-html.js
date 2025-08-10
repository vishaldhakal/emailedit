import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
export function generateHtml(components) {
  const body = components.map(componentToHtml).join("\n");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Email</title>
    </head>
    <body>
      ${body}
    </body>
    </html>
  `;
}

function componentToHtml(component) {
  switch (component.type) {
    case "text-block":
      return `<div style="font-size: ${component.data.fontSize}; color: ${
        component.data.color
      };font-family:${component.data.font};font-weight:${
        component.data.bold ? "bold" : "normal"
      };font-style: ${
        component.data.italic ? "italic" : "normal"
      };text-decoration: ${
        component.data.underline ? "underline" : "none"
      }; text-align: ${component.data.alignment};">${
        component.data.content
      }</div>`;
    case "heading":
      return `<${component.data.level} style="font-family:${
        component.data.font
      }; font-weight:${component.data.bold ? "bold" : "normal"};font-style: ${
        component.data.italic ? "italic" : "normal"
      };text-decoration: ${
        component.data.underline ? "underline" : "none"
      };  color: ${component.data.color}; text-align: ${
        component.data.alignment
      }; margin: 0;">${component.data.content}</${component.data.level}>`;
    case "image":
      return `<div style="width: ${
        component.data.width || "100%"
      }; display: flex; justify-content: center; align-items: center;">
  <img 
    src="${component.data.src}" 
    alt="${component.data.alt}" 
    style="height: ${component.data.height}; max-width: 100%; display: block;" 
    class="rounded"
  />
</div>`;
    case "button":
      return `<div style="text-align: center;">
  <a 
    href="${(component.data.url || "").trim() || "#"}" 
    target="_blank" 
    style="
      background-color: ${component.data.backgroundColor};
      color: ${component.data.color};
      padding: ${component.data.padding};
      border-radius: ${component.data.borderRadius || "4px"};
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: opacity 0.3s ease;
    "
    onmouseover="this.style.opacity=0.9"
    onmouseout="this.style.opacity=1"
  >
    ${component.data.text}
  </a>
</div>`;

    case "divider":
      return `<hr style="
  border: none;
  border-top: ${component.data.height} ${component.data.style} ${component.data.color};
  margin: 0;
" />`;
    case "spacer":
      return `<div style="height: ${component.data.height};"></div>`;
    case "social-media":
      return `<div style="text-align: ${
        component.data.alignment
      };"><div style="display: flex; gap: 16px; justify-content: center;">${component.data.platforms
        .map(
          (platform) =>
            `<a href="${
              platform.url
            }" target="_blank" rel="noopener noreferrer" style="font-size: ${
              component.data.iconSize
            }; color: ${component.data.color}; text-decoration: none;">${
              socialIcons[platform.name] || "🔗"
            }</a>`
        )
        .join("")}</div></div>`;

    case "single-column":
      return `<div style="width: ${component.data.width}; background-color: ${
        component.data.backgroundColor
      }; padding: ${component.data.padding};">${component.data.components
        .map(componentToHtml)
        .join("\n")}</div>`;
    case "two-columns-50":
    case "two-columns-33-67":
    case "two-columns-67-33":
      return `<div style="background-color: ${
        component.data.backgroundColor
      }; padding: ${component.data.padding};"><div style="display: flex; gap: ${
        component.data.gap || "20px"
      };"><div style="width: ${
        component.data.leftWidth
      };">${component.data.leftComponents
        .map(componentToHtml)
        .join("\n")}</div><div style="width: ${
        component.data.rightWidth
      };">${component.data.rightComponents
        .map(componentToHtml)
        .join("\n")}</div></div></div>`;
    case "three-columns":
      return `<div style="background-color: ${
        component.data.backgroundColor
      }; padding: ${component.data.padding};"><div style="display: flex; gap: ${
        component.data.gap || "20px"
      };"> <div style="width: ${
        component.data.columnWidth
      };">${component.data.column1Components
        .map(componentToHtml)
        .join("\n")}</div><div style="width: ${
        component.data.columnWidth
      };">${component.data.column2Components
        .map(componentToHtml)
        .join("\n")}</div><div style="width: ${
        component.data.columnWidth
      };">${component.data.column3Components
        .map(componentToHtml)
        .join("\n")}</div></div></div>`;
    case "four-columns":
      return `<div style="background-color: ${
        component.data.backgroundColor
      }; padding: ${component.data.padding};"><div style="display: flex; gap: ${
        component.data.gap || "20px"
      };"> <div style="width: ${
        component.data.columnWidth
      };">${component.data.column1Components
        .map(componentToHtml)
        .join("\n")}</div><div style="width: ${
        component.data.columnWidth
      };">${component.data.column2Components
        .map(componentToHtml)
        .join("\n")}</div><div style="width: ${
        component.data.columnWidth
      };">${component.data.column3Components
        .map(componentToHtml)
        .join("\n")}</div><div style="width: ${
        component.data.columnWidth
      };">${component.data.column4Components
        .map(componentToHtml)
        .join("\n")}</div></div></div>`;
    default:
      return "";
  }
}

const socialIcons = {
  facebook: "📘",
  twitter: "🐦",
  instagram: "📷",
  linkedin: "💼",
  youtube: "📺",
  tiktok: "🎵",
};

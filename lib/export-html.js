import ReactDOMServer from "react-dom/server";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
const socialIcons = {
  facebook: ReactDOMServer.renderToStaticMarkup(<FaFacebookF />),
  twitter: ReactDOMServer.renderToStaticMarkup(<FaTwitter />),
  instagram: ReactDOMServer.renderToStaticMarkup(<FaInstagram />),
  linkedin: ReactDOMServer.renderToStaticMarkup(<FaLinkedinIn />),
  youtube: ReactDOMServer.renderToStaticMarkup(<FaYoutube />),
  tiktok: ReactDOMServer.renderToStaticMarkup(<SiTiktok />),
};
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
     <div style="
  max-width: 800px; 
  margin: 0 auto; 
  padding: 24px; 
  background-color: #ffffff;
"> ${body}</div
    </body>
    </html>
  `;
}

function componentToHtml(component) {
  switch (component.type) {
    case "text-block":
      return `<div style=" margin-bottom: 16px; padding-left: 0.5rem; padding-bottom: 0.25rem; width: 100%; border: none; outline: none; font-size: ${
        component.data.fontSize
      }; color: ${component.data.color};font-family:${
        component.data.font
      };font-weight:${component.data.bold ? "bold" : "normal"};font-style: ${
        component.data.italic ? "italic" : "normal"
      };text-decoration: ${
        component.data.underline ? "underline" : "none"
      }; text-align: ${component.data.alignment};">${
        component.data.content
      }</div>`;
    case "heading":
      return `<${
        component.data.level
      } style=" margin: 0; margin-bottom: 16px; padding-left:0.25rem; border:none; outline:none;  font-family:${
        component.data.font
      }; font-weight:${component.data.bold ? "bold" : "normal"};font-style: ${
        component.data.italic ? "italic" : "normal"
      };text-decoration: ${
        component.data.underline ? "underline" : "none"
      };  color: ${component.data.color}; text-align: ${
        component.data.alignment
      }; ">${component.data.content}</${component.data.level}>`;
    case "image":
      return `<div style="width:auto; display: flex; justify-content: center; align-items: center;">
  <img 
    src="${component.data.src}" 
    alt="${component.data.alt}" 
    style="margin-bottom:16px; width:${component.data.width}; height: ${component.data.height}; max-width: 100%; display: block;" 
    class="rounded"
  />
</div>`;
    case "button":
      return `<div style="  margin-bottom: 16px;  text-align: center;">
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
      return `<hr  style="margin-bottom: 16px;
  border: none;
  border-top: ${component.data.height} ${component.data.style} ${component.data.color};
  
" />`;
    case "spacer":
      return `<div style="height: ${component.data.height};"></div>`;

    case "link":
      return `<div style=" margin-bottom: 16px;  text-align: ${
        component.data.alignment
      };">
  <a
    href="${component.data.url}"
    target="_blank"
    rel="noopener noreferrer"
    style="
      text-align: ${component.data.alignment};
      color: ${component.data.color || "#007bff"};
      text-decoration: ${component.data.underline ? "underline" : "none"};
      cursor: pointer;
      font-weight: 500;
      display: inline-block;
    "
  >
    ${component.data.text}
  </a>
</div>`;

    case "social-media":
      const justifyContentMap = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };
      return `<div style=" margin-bottom: 16px;  text-align: ${
        component.data.alignment
      };"><div style="display: flex; gap: 16px; justify-content:${
        justifyContentMap[component.data.alignment] || "center"
      };">${component.data.platforms
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

    case "column":
      return `<div   style=" margin-bottom: 16px;  background-color: ${
        component.data.backgroundColor
      }; padding: ${component.data.padding}; width:${
        component.data.width
      };  display: flex; gap: ${
        component.data.gap || "20px"
      };">${component.data.columnsData
        .map(
          (col, index) =>
            `  <div style="width: ${
              component.data.columnWidths?.[index] || "auto"
            };">
                ${col.map(componentToHtml).join("\n")}
              </div>`
        )
        .join("\n")}</div>`;

    default:
      return "";
  }
}

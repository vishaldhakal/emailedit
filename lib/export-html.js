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

/**
 * Generate HTML for email from components and optionally append footer
 * @param {Array} components - Email components array
 * @param {Object} footerSettings - Optional footer settings to append
 */
export function generateHtml(components) {
  if (!components || components.length === 0) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Email</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 0; 
          background-color: #f5f5f5; 
        }
        .email-container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background-color: #ffffff; 
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <p>This email campaign is ready to be sent.</p>
      </div>
    </body>
    </html>
    `;
  }

  // Generate body components - for footer prefer shared settings for consistent preview
  const body = components
    .map((component) => {
      return componentToHtml(component);
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Email</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 0; 
      padding: 0; 
      background-color: #f5f5f5; 
    }
    .email-container { 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px; 
      background-color: #ffffff; 
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    /* Reset UA margins inside email */
    .email-container p, .email-container h1, .email-container h2, .email-container h3,
    .email-container h4, .email-container h5, .email-container h6,
    .email-container ul, .email-container ol { margin: 0; }
  </style>
</head>
<body>
  <div class="email-container">
    ${body}
    
  </div>
</body>
</html>`;
}

function containerPaddingStyle(data = {}) {
  const pad = data.containerPadding || {};
  const toPx = (n, d) =>
    typeof n === "number" ? `${n}px` : typeof n === "string" ? n : `${d}px`;
  const top = toPx(pad.top, 0);
  const right = toPx(pad.right, 0);
  const bottom = toPx(pad.bottom, 0);
  const left = toPx(pad.left, 0);
  return `padding: ${top} ${right} ${bottom} ${left};`;
}

function wrapWithPadding(component, innerHtml) {
  const style = containerPaddingStyle(component.data);
  return `<div style="${style}">${innerHtml}</div>`;
}

function componentToHtml(component) {
  switch (component.type) {
    case "text-block":
      return wrapWithPadding(
        component,
        `<div style="padding-bottom: 0.25rem; width: 100%; border: none; outline: none; font-size: ${component.data.fontSize};font-family:${component.data.font}; text-align: ${component.data.alignment}; background-color:${component.data.backgroundColor};letter-spacing:${component.data.letterSpacing}px; line-height:${component.data.lineHeight}; ">${component.data.content}</div>`
      );
    case "heading":
      return wrapWithPadding(
        component,
        `<${
          component.data.level
        } style=" margin: 0; padding-left:0.25rem; border:none; outline:none;  font-family:${
          component.data.font
        }; font-weight:${component.data.bold ? "bold" : "normal"};font-style: ${
          component.data.italic ? "italic" : "normal"
        };text-decoration: ${
          component.data.underline ? "underline" : "none"
        };  background-color:${component.data.backgroundColor};letter-spacing:${
          component.data.letterSpacing
        }px; line-height:${component.data.lineHeight}; color: ${
          component.data.color
        }; text-align: ${component.data.alignment}; ">${
          component.data.content
        }</${component.data.level}>`
      );
    case "image":
      return wrapWithPadding(
        component,
        `<div style="width:auto; display: flex; justify-content: center; align-items: center;">
  <img 
    src="${component.data.src}" 
    alt="${component.data.alt}" 
    style="width:${component.data.width}; height: ${component.data.height}; max-width: 100%; display: block;" 
    class="rounded"
  />
</div>`
      );
    case "button":
      // Build border style string
      const borderWidth = component.data.borderWidth || "0px";
      const borderStyle = component.data.borderStyle || "solid";
      const borderColor = component.data.borderColor || "#000000";
      const borderStyleString =
        borderWidth && borderWidth !== "0px" && borderWidth !== "0"
          ? `${borderWidth} ${borderStyle} ${borderColor}`
          : "none";
      const align = component.data.align || "center";
      return wrapWithPadding(
        component,
        `<div style="text-align: ${align};">
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
      border: ${borderStyleString};
      cursor: pointer;
      transition: opacity 0.3s ease;
    "
    onmouseover="this.style.opacity=0.9"
    onmouseout="this.style.opacity=1"
  >
    ${component.data.text}
  </a>
</div>`
      );

    case "divider":
      return wrapWithPadding(
        component,
        `<hr  style="
  border: none;
  border-top: ${component.data.height} ${component.data.style} ${component.data.color};
  
" />`
      );
    case "spacer":
      return wrapWithPadding(
        component,
        `<div style="height: ${component.data.height};"></div>`
      );

    case "link":
      return wrapWithPadding(
        component,
        `<div style=" text-align: ${component.data.alignment};
  ">
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
</div>`
      );

    case "social-media":
      const justifyContentMap = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };
      return `<div style=" text-align: ${
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

    case "two-column":
    case "three-column":
      return `<div   style=" background-color: ${
        component.data.backgroundColor
      }; padding: ${component.data.padding}; width:${
        component.data.width
      };  display: flex; gap: ${
        component.data.gap || "20px"
      }">${component.data.columnsData
        .map(
          (col, index) =>
            `  <div style="width: ${
              component.data.columnWidths?.[index] || "auto"
            }">
                ${col.map(componentToHtml).join("\n")}
              </div>`
        )
        .join("\n")}</div>`;

    case "list":
      return `<div style=" font-size: ${component.data.fontSize};font-family:${component.data.font}; ">${component.data.content}</div>`;

    case "footer":
      // Prefer shared footer settings when passed via generateHtml footerSettings param
      if (component.footerSettings && component.footerSettings.has_content) {
        return generateFooterHtml(component.footerSettings);
      }
      // Fallback to component-specific custom HTML
      if (component?.data?.html || component?.data?.content) {
        return component.data.html || component.data.content;
      }
      return `<div style="margin-top: 40px; padding: 20px; background-color: #ffffff; border-top: 1px solid #e0e0e0; text-align: center; color: #666666; font-size: 12px;">
        <a href="{{unsubscribe_url}}" style="color:#666; text-decoration: none;">Unsubscribe</a>
      </div>`;

    default:
      return "";
  }
}

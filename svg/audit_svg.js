import { AUDITE } from "../query.js";
import { graphQLRequest } from "../utils.js";
const VIEWBOX_HEIGHT = 47;
const VIEWBOX_WIDHT = 400;

function calculateRectWidths(result) {
  console.log("rere", result.success.count);

  const totalAudits = result.success.count + result.failed.count;
  const widthPerAudit = VIEWBOX_WIDHT / totalAudits;
  return {
    successRectWidth: widthPerAudit * result.success.count,
    failedRectWidth: widthPerAudit * result.failed.count,
  };
}
function rectangule(object, result) {
  let rect = "";
  for (const key in object) {
    let color = "#12F543";
    let x = 0;
    let label = "Success";
    let count = result.success.count;
    let textAnchor = "start";

    if (key === "failedRectWidth") {
      color = "#F52512";
      x = object.successRectWidth;
      label = "Failed";
      count = result.failed.count;
      textAnchor = "end";
    }

    rect += `
      <rect x="${x}" width="${object[key]}" height="${VIEWBOX_HEIGHT}" rx="23.5" fill="${color}"/>
      <text x="${key === "failedRectWidth" ? x - 5 : x + object[key] + 5}" y="${VIEWBOX_HEIGHT / 2}" text-anchor="${textAnchor}" fill="#ffffff" font-family="IBM Plex Mono" font-size="12">
        ${count}
      </text>
      <text x="${x + object[key] / 2}" y="${VIEWBOX_HEIGHT + 12}" text-anchor="middle" fill="#ffffff" font-family="IBM Plex Mono" font-size="12">
        ${label}
      </text>
    `;
  }
  return rect;
}

export async function audit() {
  try {
    const res = await graphQLRequest(AUDITE);

    if (!res.user) return `<div>No audit data available</div>`;

    const user = res.user[0];
    const result = {
      success: user.success.count,
      failed: user.failed.count,
    };
    const totalAudits = result.success.count + result.failed.count;
    const RectWidths = calculateRectWidths(result);
    const svg = `
     <div class="audit-bar">
        <svg width="100%" height="100%" viewBox="0 0 ${VIEWBOX_WIDHT} ${VIEWBOX_HEIGHT + 20}" overflow="visible" aria-label="User audit bar">
          <text x="50%" y="-5" text-anchor="middle" fill="#ffffff" font-family="IBM Plex Mono" font-size="14" font-weight="bold">
            Total Audits: ${totalAudits}
          </text>
          ${rectangule(RectWidths, result)}
        </svg>
      </div>

    `;
    return svg;
  } catch (error) {
    console.log(error);
  }
}

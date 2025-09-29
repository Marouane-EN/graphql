import { AUDITE } from "../utils/query.js";
import { graphQLRequest } from "../utils/utils.js";
const VIEWBOX_HEIGHT = 25;
const VIEWBOX_WIDHT = 400;
const PADDING = 20

function calculateRectWidths(result) {

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
    let color = "#05e235ff";
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
      <rect x="${x + PADDING}" width="${object[key]}" height="${VIEWBOX_HEIGHT}" rx="12" fill="${color}"/>
      <text x="${key === "failedRectWidth" ? VIEWBOX_WIDHT + PADDING * 2 : x}" y="${VIEWBOX_HEIGHT / 2 + 3}" text-anchor="${textAnchor}" fill="#475569" font-family="Inter, sans-serif" font-size="12" font-weight="200">
        ${count}
      </text>
      <text x="${x + PADDING + 30}" y="${VIEWBOX_HEIGHT + PADDING - 8}" text-anchor="middle" fill="${color}" font-family="Inter, sans-serif" font-size="12" font-weight="200">
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
     <div class="audit-progress">
        <svg width="100%" height="100%" viewBox="0 0 ${VIEWBOX_WIDHT + PADDING * 2} ${VIEWBOX_HEIGHT}" overflow="visible" aria-label="User audit bar">
          <text x="50%" y="-5" text-anchor="middle" fill="#475569" font-family="Inter, sans-serif" font-size="12" font-weight="600">
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

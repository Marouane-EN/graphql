import { AUDIT_AGGREGATE_QUERY } from "../utils/query.js";
import { graphqlRequest } from "../utils/utils.js";

const VIEWBOX_HEIGHT = 25;
const VIEWBOX_WIDHT = 400;
const PADDING = 20;

/**
 * Calculate the proportional widths of success and failed audit rectangles
 * based on the total number of audits.
 */
function calculateRectWidths(result) {
  const totalAudits = result.success.count + result.failed.count;
  const widthPerAudit = VIEWBOX_WIDHT / totalAudits;

  return {
    successRectWidth: widthPerAudit * result.success.count,
    failedRectWidth: widthPerAudit * result.failed.count,
  };
}

/**
 * Generate the <rect> and <text> SVG elements for success and failed audits.
 * Each key in the widths object corresponds to one bar (success or failed).
 */
function rectangule(object, result) {
  let rect = "";

  for (const key in object) {
    // Default values for the "success" bar
    let color = "#05e235ff";
    let x = 0;
    let label = "Success";
    let count = result.success.count;
    let textAnchor = "start"; // align text to the left

    // Override values if we’re drawing the "failed" bar
    if (key === "failedRectWidth") {
      color = "#F52512";
      x = object.successRectWidth;
      label = "Failed";
      count = result.failed.count;
      textAnchor = "end"; // align text to the right
    }

    rect += `
      <rect x="${x + PADDING}" width="${
      object[key]
    }" height="${VIEWBOX_HEIGHT}" rx="12" fill="${color}"/>
      <text x="${
        key === "failedRectWidth" ? VIEWBOX_WIDHT + PADDING * 2 : x
      }" y="${
      VIEWBOX_HEIGHT / 2 + 3
    }" text-anchor="${textAnchor}" fill="#475569" font-family="Inter, sans-serif" font-size="12" font-weight="200">
        ${count}
      </text>
      <text x="${x + PADDING + 30}" y="${
      VIEWBOX_HEIGHT + PADDING - 8
    }" text-anchor="middle" fill="${color}" font-family="Inter, sans-serif" font-size="12" font-weight="200">
        ${label}
      </text>
    `;
  }

  return rect;
}

/**
 * Main function: fetches audit aggregate data via GraphQL
 * and builds an SVG progress bar (success vs failed).
 */
export async function audit() {
  try {
    const res = await graphqlRequest(AUDIT_AGGREGATE_QUERY);

    if (!res.user) return `<div>No audit data available</div>`;

    const user = res.user[0];

    // Normalize into success/failed object with counts
    const result = {
      success: user.success.count,
      failed: user.failed.count,
    };

    const totalAudits = result.success.count + result.failed.count;

    // Compute proportional bar widths
    const RectWidths = calculateRectWidths(result);

    // Build SVG markup
    const svg = `
     <div class="audit-progress">
        <svg width="100%" height="100%" viewBox="0 0 ${
          VIEWBOX_WIDHT + PADDING * 2
        } ${VIEWBOX_HEIGHT}" overflow="visible" aria-label="User audit bar">
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

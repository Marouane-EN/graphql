import { SKILLS_QUERY } from "../utils/query.js";
import { graphQLRequest } from "../utils/utils.js"; 

/* ---------- visual constants ---------- */
const VIEWBOX_SIZE = 500;
const CENTER = VIEWBOX_SIZE / 2;
const MAX_RAD = 200; // outer ring radius in your example
const RINGS = 10; // number of concentric rings
const LABEL_OFFSET = 28; // offset for labels outside the outer radius

/* utility: extract skill name from type "skill_prog" -> "prog" */
function skillNameFromType(type) {
  return type.replace(/^skill_/, "");
}

/* utility: normalize amounts to [0..1] using max found
   fallback if all zeros -> keep 0 to avoid NaN */
function normalizeSkills(skills) {
  return skills.map((s) => ({
    name: s.name,
    raw: s.amount,
    val: Math.max(0, s.amount) / 100, // always map 100 -> 1 (outer circle)
  }));
}

/* compute the polygon points for radar area
   skillsNormalized: [{name, val (0..1)}] */
function radarPoints(skillsNormalized) {
  const n = skillsNormalized.length;
  // guard: at least 3 axes to create a polygon, otherwise render a circle-like dot
  const points = [];

  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2; // start at top (-90deg)
    const r = skillsNormalized[i].val * MAX_RAD; // leave small margin
    const x = CENTER + Math.cos(angle) * r;
    const y = CENTER + Math.sin(angle) * r;
    points.push([x, y]);
  }
  return points;
}

/* convert points to SVG polygon string "x1,y1 x2,y2 ..." */
function pointsToString(points) {
  return points.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
}

/* build label positions for each axis */
function labelPositions(skills, radius = MAX_RAD + LABEL_OFFSET) {
  const n = skills.length;
  return skills.map((s, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const x = CENTER + Math.cos(angle) * radius;
    const y = CENTER + Math.sin(angle) * radius;
    // decide text anchor depending on quadrant
    let anchor = "middle";
    const deg = ((angle + 2 * Math.PI) % (2 * Math.PI)) * (180 / Math.PI);
    if (deg > 315 || deg < 45) anchor = "middle"; // top
    else if (deg >= 45 && deg < 135) anchor = "start"; // right
    else if (deg >= 135 && deg < 225) anchor = "middle"; // bottom
    else anchor = "end"; // left
    return { name: s.name, x, y, anchor };
  });
}

/* draw concentric rings markup */
function ringsMarkup() {
  let html = "";
  for (let i = 1; i <= RINGS; i++) {
    const r = (i / RINGS) * MAX_RAD;
    html += `<circle fill="none" stroke="#e2e8f0" stroke-width="1" cx="${CENTER}" cy="${CENTER}" r="${r}" />\n`;
  }
  return html;
}

/* draw cardinal axis dots (small dots placed along axes similar to your example)
   We'll produce dots along each axis r=20..MAX_RAD with step = MAX_RAD / RINGS */
function axisDotsMarkup(axesCount) {
  const step = MAX_RAD / RINGS;
  let markup = "";

  // for each axis compute angle and create small dots along the axis
  for (let i = 0; i < axesCount; i++) {
    const angle = (Math.PI * 2 * i) / axesCount - Math.PI / 2;
    for (let s = 1; s <= RINGS; s++) {
      const r = step * s;
      const x = CENTER + Math.cos(angle) * r;
      const y = CENTER + Math.sin(angle) * r;
      markup += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(
        2
      )}" fill="#2563eb" r="0.9" />\n`;
    }
  }
  return markup;
}

/* main exported function: fetches user's skills and returns markup string */
export async function userSkills() {
  try {
    // fetch data from GraphQL using your project helper
    const res = await graphQLRequest(SKILLS_QUERY);
    // `user` is an array (because user_public_view) — find the current user entry in that list
    // If multiple users returned, we pick the first one (your existing USERBOARD uses user_public_view too)
    const userEntry = (res?.user && res.user) || null;

    if (!userEntry) return `<div class="skills-card">No user data</div>`;

    // transactions: array of { type: 'skill_XXX', amount: number }
    const txs = userEntry || [];

    // map to {name, amount}
    const skillsRaw = txs.map((t) => ({
      name: skillNameFromType(t.type),
      amount: Number(t.amount || 0),
    }));

    // if no skills -> show placeholder
    if (skillsRaw.length === 0) {
      return `<div class="skills-card">No skills data</div>`;
    }

    // normalize and compute visuals
    const normalized = normalizeSkills(skillsRaw);
    const points = radarPoints(normalized);
    const poly = pointsToString(points);
    const labels = labelPositions(normalized);
    const axesCount = normalized.length;

    // area fill path — using polygon is fine and animatable by changing "points"
    const svg = `
      <div class="skills-card">
        <svg width="100%" height="100%" viewBox="0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}" overflow="visible" aria-label="User skills">
          
          <!-- rings -->
          ${ringsMarkup()}

          <!-- radial axis lines -->
          ${normalized
            .map((_, i) => {
              const angle = (Math.PI * 2 * i) / axesCount - Math.PI / 2;
              const x = (CENTER + Math.cos(angle) * MAX_RAD).toFixed(2);
              const y = (CENTER + Math.sin(angle) * MAX_RAD).toFixed(2);
              return `<path stroke-width="1" stroke="#e2e8f0" d="M${CENTER} ${CENTER} L ${x} ${y}" />`;
            })
            .join("\n")}
          
          <!-- Skills area -->
          <defs>
              <linearGradient id="skillsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#2563eb;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#0ea5e9;stop-opacity:0.1" />
              </linearGradient>
          </defs>

          <!-- filled polygon (skills area) -->
          <polygon points="${poly}" fill="url(#skillsGradient)" 
                                stroke="#2563eb"
                                stroke-width="2" 
                                style="transition: all .3s ease;" />

          <!-- axis dots -->
          ${axisDotsMarkup(axesCount)}

          <!-- labels -->
          ${labels
            .map(
              (l) => `
            <text text-anchor="${l.anchor}" alignment-baseline="central"
              x="${l.x.toFixed(2)}" y="${l.y.toFixed(2)}"
              fill="#475569" font-family="Inter, sans-serif" font-size="12" font-weight="600"
              style="pointer-events:none">${l.name}</text>
          `
            )
            .join("\n")}

        </svg>
      </div>
    `;

    return svg;
  } catch (err) {
    return `<div class="skills-card">Failed to load skills</div>`;
  }
}

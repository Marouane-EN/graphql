import { USER_QUERY, XP_QUERY } from "./query.js";
import { userSkills } from "./svg/skill_svg.js";
import { audit } from "./svg/audit_svg.js";
import { graphQLRequest } from "./utils.js";
let username;
let password;
const Container = document.querySelector(".container");
const headers = document.querySelector("header");

async function home() {
  Container.className = "flex";
  await DisplayUser();
}

async function DisplayUser() {
  const userData = await graphQLRequest(USER_QUERY);
  const totalXp = await graphQLRequest(XP_QUERY);
  const skillSvg = await userSkills();
  const auditSvg = await audit();

  // Header Section
  headers.innerHTML = `
    <div class="header">
      <h1>GraphQl</h1>
      <button id="logout">Logout</button>
    </div>
  `;

  // User Info Section
  const userInfo = document.createElement("div");
  userInfo.className = "aside1";
  const userInitials = `${userData.user[0].userName[0]}${
    userData.user[0].userName.split(" ").pop()[0]
  }`;
  userInfo.innerHTML = `
    <div class="user-profile">
      <div class="circle">${userInitials}</div>
      <p>Full Name: ${userData.user[0].userName}</p>
      <p>Level: ${userData.user[0].level}</p>
      <p>Total xp: ${formatXpToBytes(totalXp.xp.aggregate.sum.amount)}</p>
      <p>Audit ratio: ${userData.user[0].userAuditRatio}</p>
    </div>
  `;

  // SVG Section
  const svgSection = document.createElement("div");
  svgSection.className = "aside2";
  svgSection.innerHTML = skillSvg + auditSvg;

  // Append to Container
  Container.appendChild(userInfo);
  Container.appendChild(svgSection);

  // Logout functionality
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("jwt");
    Display();
  });
}

async function ping() {
  try {
    const respons = await fetch(
      "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
              query {
                user {
                  id
                }
              }
    `,
        }),
      }
    );
    const res = await respons.json();
    console.log("res", res);
    if (res.errors) {
      throw new Error("error");
    }
    return true;
  } catch (error) {
    return false;
  }
}
async function main() {
  if (!(await ping())) {
    Display();
    return;
  }
  home();
}
main();
function Display() {
  Container.innerHTML = `
  <h1>Login</h1>
        <div class="input">
            <input type="text" placeholder="username/email" name="username or email" id="username"
                autocomplete="username" required>
            <i class="bx bx-user"></i>
        </div>
        <div class="input">
            <input type="password" placeholder="password" name="password" id="password" autocomplete="current-password"
                required>
            <i class='bxr  bx-lock'></i>
        </div>
        <button type="submit" id="btn">submit</button>`;
  const btn = document.getElementById("btn");
  console.log(btn);

  btn.addEventListener("click", login);
}

function login() {
  username = document.getElementById("username").value;
  password = document.getElementById("password").value;
  const credentials = btoa(`${username}:${password}`);

  fetch("https://learn.zone01oujda.ma/api/auth/signin", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("jwt", data);
    });
  home();
}

function formatXpToBytes(totalXp) {
  if (totalXp < 1000) return `${totalXp}b`;
  const units = ["b", "kb", "mb", "gb", "tb"];
  let unitIndex = 0;
  let formattedXp = totalXp;

  while (formattedXp >= 1000 && unitIndex < units.length - 1) {
    formattedXp /= 1000;
    unitIndex++;
  }

  return `${formattedXp.toFixed(1)}${units[unitIndex]}`;
}

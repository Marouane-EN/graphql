import { USER_QUERY, XP_QUERY } from "./query.js";
import { userSkills } from "./svg/skill_svg.js";
import { audit } from "./svg/audit_svg.js";
import { graphQLRequest } from "./utils.js";
let username;
let password;
const Container = document.querySelector(".container");
const headers = document.querySelector("header");

async function home() {
  Container.className = "flex hover-effect";
  Container.innerHTML = "";
  await DisplayUser();
}

async function DisplayUser() {
  const userData = await graphQLRequest(USER_QUERY);
  console.log("userData", userData);
  const totalXp = await graphQLRequest(XP_QUERY);
  console.log("totalXp", totalXp);
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
  userInfo.innerHTML = `
    <div class="user-profile">
      <div class="circle">
        <img 
          src="https://discord.zone01oujda.ma/assets/pictures/${userData.user[0].userLogin}.jpg"
          alt="Profile"
        />
      </div>
      <div class="details">
        <div class="content">
              <p>Full Name</p>
              <p>${userData.user[0].userName}</p>
        </div>
        <div class="content">
              <p>Level</p>
              <p>${userData.user[0].level}</p>
        </div>
        <div class="content">
              <p>Total xp</p>
              <p>${formatXpToBytes(totalXp.xp.aggregate.sum.amount)}</p>
        </div>
        <div class="content">
              <p>Audit ratio</p>
              <p>${userData.user[0].userAuditRatio.toFixed(2)}</p>
        </div>
      </div>
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
  await home();
}
main();
function Display() {
  headers.innerHTML = "";
  Container.className = "container hover-effect";
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
  const passwordInput = document.getElementById("password");
  passwordInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      btn.click();
    }
  });

  
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
    },
  })
    .then((res) => res.text())
    .then((data) => {
      const token = data.replaceAll('"', '');
      console.log("data", token);

      localStorage.setItem("jwt", token);
    }).then(home);
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

import { USER_QUERY, XP_QUERY } from "./query.js";
import { userSkills } from "./svg/skill_svg.js";
import { audit } from "./svg/audit_svg.js";
import { graphQLRequest } from "./utils.js";
const Container = document.querySelector(".container");
const header = document.querySelector("header");

async function home() {
  document.body.style = "";
  Container.className = "main-container";
  Container.innerHTML = "";
  await DisplayUser();
}

async function DisplayUser() {
  const userData = await graphQLRequest(USER_QUERY);
  console.log("userData", userData);
  console.log("sdsdsd", userData.user[0].userName);

  const totalXp = await graphQLRequest(XP_QUERY);
  console.log("totalXp", totalXp);
  const skillSvg = await userSkills();
  const auditSvg = await audit();

  // Header Section
  header.innerHTML = `
    <div class="header">
            <h1>GraphQL Dashboard</h1>
            <div class="header-actions">
                <div class="user-menu" tabindex="0">
                    <img src="https://discord.zone01oujda.ma/assets/pictures/${
                      userData.user[0].userLogin
                    }.jpg" alt="User Avatar" class="user-avatar">
                    <div class="user-info">
                        <span class="user-name">${
                          userData.user[0].userName
                        }</span>
                        <span class="user-role">${ranks(
                          userData.user[0].level
                        )} developer</span>
                    </div>
                </div>
                <button id="logout">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16,17 21,12 16,7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Sign Out
                </button>
            </div>
        </div>
  `;

  // User Info Section
  const userInfo = document.createElement("aside");
  userInfo.className = "profile-section";
  userInfo.innerHTML = `
  <div class="profile-card fade-in">
                <div class="profile-header">
                    <img 
                    src="https://discord.zone01oujda.ma/assets/pictures/${
                      userData.user[0].userLogin
                    }.jpg"
                    alt="Profile" class="profile-image">
                    <h2 class="profile-name">${userData.user[0].userName}</h2>
                    <span class="profile-level">Level ${
                      userData.user[0].level
                    }</span>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${formatXpToBytes(
                          totalXp.xp.aggregate.sum.amount
                        )}</span>
                        <span class="stat-label">Total XP</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${userData.user[0].userAuditRatio.toFixed(
                          2
                        )}</span>
                        <span class="stat-label">Audit Ratio</span>
                    </div>
                </div>
            </div>
  `;

  // SVG Section
  const svgSection = document.createElement("main");
  svgSection.className = "dashboard-section";
  svgSection.innerHTML += `
              <div class="card fade-in">
                <div class="card-header">
                    <h3 class="card-title">Skills Overview</h3>
                    <p class="card-description">Your technical competencies across different domains</p>
                </div>
                ${skillSvg}
              </div>
              <div class="card fade-in">
                <div class="card-header">
                    <h3 class="card-title">Audit Performance</h3>
                    <p class="card-description">Overview of your code review and audit activities</p>
                </div>
                ${auditSvg}
              </div>
  
  `;

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
  document.body.style = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
  `;
  header.innerHTML = "";
  Container.className = "login-container fade-in";
  Container.innerHTML = `
          <div class="login-header">
            <div class="brand">
                <div class="brand-icon">G</div>
                <span class="brand-text">GraphQL</span>
            </div>
            <h1 class="login-title">Sign In</h1>
            <p class="login-subtitle">Access your dashboard</p>
        </div>

        <div class="login-form" id="loginForm">
            <div class="form-group">
                <label for="username" class="form-label">Username or Email</label>
                <div class="input-wrapper">
                    <input type="text" id="username" name="username" class="form-input"
                        placeholder="Enter your username or email" autocomplete="username" required>
                    <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            </div>

            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <div class="input-wrapper">
                    <input type="password" id="password" name="password" class="form-input"
                        placeholder="Enter your password" autocomplete="current-password" required>
                    <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
            </div>

            <button type="submit" class="submit-button" id="submitButton">
                <span id="buttonText">Sign In</span>
            </button>
        </div>`;
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const btn = document.getElementById("submitButton");
  passwordInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      btn.click();
    }
  });
  // Real-time validation
  usernameInput.addEventListener("blur", function () {
    if (!this.value.trim()) {
      showError(this, "Username or email is required");
    } else {
      clearError(this);
    }
  });

  passwordInput.addEventListener("blur", function () {
    if (!this.value.trim()) {
      showError(this, "Password is required");
    } else {
      clearError(this);
    }
  });
  usernameInput.addEventListener("input", () => clearError(usernameInput));
  passwordInput.addEventListener("input", () => clearError(passwordInput));
  btn.addEventListener("click", login);
}

function login() {
  clearErrors();
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const username = usernameInput.value;
  const password = passwordInput.value;
  console.log(username, password);

  const credentials = btoa(`${username}:${password}`);

  fetch("https://learn.zone01oujda.ma/api/auth/signin", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {

      if (data.error) {
        console.log(data.error);
        
        throw new Error(data.error);
      }
      localStorage.setItem("jwt", data);
      return home();
    })
    .catch((error) =>
      showError(
        passwordInput,
        error
      )
    );
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

function ranks(level) {
  const units = [
    "Aspiring",
    "Beginner",
    "Apprentice",
    "Assistant",
    "Basic",
    "Junior",
    "Confirmed",
    "Full-stack",
  ];
  if (level < 10) return `${units[0]}`;
  let unitIndex = 0;

  while (level >= 10 && unitIndex < units.length - 1) {
    level /= 10;
    unitIndex++;
  }

  return `${units[unitIndex]}`;
}

// Helper functions
function showError(input, message) {
  input.classList.add("error");

  // Remove existing error message
  const existingError =
    input.parentNode.parentNode.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  // Add new error message
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    ${message}
                `;
  input.parentNode.parentNode.appendChild(errorDiv);
}

function clearError(input) {
  input.classList.remove("error");
  const errorMessage =
    input.parentNode.parentNode.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

function clearErrors() {
  document.querySelectorAll(".form-input").forEach((input) => {
    clearError(input);
  });
}

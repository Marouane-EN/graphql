import { USER_DETAILS_QUERY, USER_QUERY, XP_QUERY } from "./utils/query.js";
import { userSkills } from "./svg/skill_svg.js";
import { audit } from "./svg/audit_svg.js";
import { graphQLRequest, clearError, clearErrors, showError, formatXpToBytes, ranks, ping } from "./utils/utils.js";
const Container = document.querySelector(".container");
const header = document.querySelector("header");
async function main() {
  if (!(await ping())) {
    Display();
    return;
  }
  await home();
}
main();

async function home() {
  document.body.style = "";
  Container.className = "main-container";
  Container.innerHTML = "";
  await DisplayUser();
}
function displayHeader(user) {
  // Header Section
  header.innerHTML = `
    <div class="header">
            <h1>GraphQL Dashboard</h1>
            <div class="header-actions">
                <div class="user-menu" id="userMenu" tabindex="0">
                    <img src="https://discord.zone01oujda.ma/assets/pictures/${user.userLogin
                    }.jpg" alt="User Avatar" class="user-avatar">
                    <div class="user-info">
                        <span class="user-name">${user.userName}</span>
                        <span class="user-role">${ranks(user.level)} developer</span>
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
}

function displayUserInfo(user, totalXp) {
  // User Info Section  
  const userInfo = document.createElement("aside");
  userInfo.className = "profile-section";
  userInfo.innerHTML = `
  <div class="profile-card fade-in">
                <div class="profile-header">
                    <img 
                    src="https://discord.zone01oujda.ma/assets/pictures/${user.userLogin}.jpg"
                    alt="Profile" class="profile-image">
                    <h2 class="profile-name">${user.userName}</h2>
                    <span class="profile-level">Level ${user.level}</span>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${formatXpToBytes(totalXp)}</span>
                        <span class="stat-label">Total XP</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${user.userAuditRatio.toFixed(2)}</span>
                        <span class="stat-label">Audit Ratio</span>
                    </div>
                </div>
  </div>
  <!-- Profile Modal -->
    <div class="modal-overlay" id="profileModal">
        <div class="profile-modal">
            <div class="modal-header">
                <h2 class="modal-title">Personal Information</h2>
                <button class="modal-close" id="closeModal" aria-label="Close modal">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div><br>

            <div class="profile-header">
                    <img 
                    src="https://discord.zone01oujda.ma/assets/pictures/${user.userLogin}.jpg"
                    alt="Profile" class="profile-image">
                    <div class="user-info">
                        <span class="info-value">${ranks(user.level)} developer</span>
                    </div>
            </div>

            <div class="modal-body">
                <div class="profile-info-grid">
                    <div class="info-item">
                        <span class="info-label">First Name</span>
                        <div class="info-value">${user.attrs.firstName}</div>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Last Name</span>
                        <div class="info-value">${user.attrs.lastName}</div>
                    </div>
                    
                    <div class="info-item highlight">
                        <span class="info-label">Email Address</span>
                        <div class="info-value">${user.attrs.email}</div>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Phone Number</span>
                        <div class="info-value">${user.attrs.tel}</div>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Gender</span>
                        <div class="info-value">${user.attrs.gender}</div>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">National ID (CIN)</span>
                        <div class="info-value">${user.attrs.cin}</div>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">City</span>
                        <div class="info-value">${user.attrs.addressCity}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `;
  Container.appendChild(userInfo);
}
function displaySVG(skillSvg, auditSvg) {
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
  Container.appendChild(svgSection);
}
async function DisplayUser() {
  const userData = await graphQLRequest(USER_QUERY);
  const totalXp = await graphQLRequest(XP_QUERY);
  const userDetails = await graphQLRequest(USER_DETAILS_QUERY)
  const skillSvg = await userSkills();
  const auditSvg = await audit();
  userData.user[0].attrs = userDetails.user[0].attrs
  displayHeader(userData.user[0])
  displayUserInfo(userData.user[0], totalXp.xp.aggregate.sum.amount)
  displaySVG(skillSvg, auditSvg)

  const profileModal = document.getElementById("profileModal")

  document.getElementById("userMenu").addEventListener("click", () => {
    profileModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  })
  document.getElementById("closeModal").addEventListener("click", () => {
    profileModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  })
  // Logout functionality
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("jwt");
    Display();
  });
}


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
      <form id="submit">
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
        </div>
      </form>
        `;
  eventListeners()
}
function eventListeners() {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const form = document.getElementById("submit");
  passwordInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      form.click();
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
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    login()
  });
}


function login() {
  clearErrors();
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const username = usernameInput.value;
  const password = passwordInput.value;

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

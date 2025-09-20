import { USER_QUERY, XP_QUERY } from "./query.js";
import { userSkills } from "./svg.js";
import { graphQLRequest } from "./utils.js";
let username;
let password;
const Container = document.querySelector(".container");
const headers = document.querySelector("header");

async function home() {
  Container.remove();
  await DisplayUser();
}

async function DisplayUser() {
  const userData = await graphQLRequest(USER_QUERY);
  const skillSvg = await userSkills();
  headers.textContent = `Welcome ${userData.user[0].userName} | Level: ${userData.user[0].level} | Audit Ratio: ${Number(userData.user[0].userAuditRatio).toFixed(2)}`;
  const div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = skillSvg;
  document.body.appendChild(div);
  const xpData = await graphQLRequest(XP_QUERY);
  const xp = xpData.xp.aggregate.sum.amount;
  const xpDiv = document.createElement("div");
  xpDiv.classList.add("xp");
  xpDiv.textContent = `Total XP: ${xp}`;
  document.body.appendChild(xpDiv);
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

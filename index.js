
let username;
let password;
const Container = document.querySelector(".container");
async function fetchData() {
  try {
    const json = await fetch(
      "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          {
           User : event_user(
              where: {user: {id: {_is_null: false}}, event: {path: {_eq: "/oujda/module"}}}
              order_by: {level: asc}
            ) {
              level
              userName
              userAuditRatio
            }
            xp :  transaction_aggregate(
                where: {type: {_eq: "xp"}, event: {object: {name: {_eq: "Module"}}}}
                order_by: {createdAt: asc}
              ) {
                aggregate {
                  sum {
                    amount
                  }
                }
              }
          }`,
        }),
      }
    );
    const res = await json.json();
    if (res.errors) {
      console.log(111);

      throw new Error(d.errors.message);
    }
    console.log("sdsqdq", res);
    return res.data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
async function home() {
  Container.innerHTML = "";
  const data = await fetchData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      for (const k in data[key][0]) {
        const h1 = document.createElement("h1");
        h1.textContent = data[key][0][k];
        Container.appendChild(h1);
      }
    }
  }
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

window.fetchData = function fetchData() {
  fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearerwindow.userDetails = ;
 ${localStorage.getItem("jwt")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
            {
              
            }
`,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.errors) {
        // Convert GraphQL errors into real JS error
        throw new Error(JSON.stringify(data.errors));
      }
      return data.data;
    })
    .then((result) => {
      console.log("==== XP Sum ====", result);
    })
    .catch((error) => {
      console.error("Caught error:", error.message);
    });
};

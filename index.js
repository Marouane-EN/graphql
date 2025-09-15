let username;
let password;
const btn = document.getElementById("btn");
btn.addEventListener("click", login);
function varification(error = "") {
  if (
    localStorage.getItem("jwt") === null ||
    localStorage.getItem("jwt") === "" ||
    localStorage.getItem("jwt") === "[object Object]" ||
    error != ""
  ) {
    return true;
  }
  return false;
}
function login() {
  username = document.getElementById("username").value;
  password = document.getElementById("password").value;
  const credentials = btoa(`${username}:${password}`);
  if (varification()) {
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
  }
}

login();

window.fetchData = function fetchData() {
  fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query {
        transaction_aggregate(
          where: {
            type: { _eq: "xp" },
            event: { object: { name: { _eq: "Module" } } }
          },
          order_by: { createdAt: asc }
        ) {
          aggregate {
            sum {
              amount
            }
          }
        }
      }
    `,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(
        "==== XP Sum ====",
        data.data.transaction_aggregate.aggregate.sum.amount
      );
    })
    .catch((error) => console.error("Fetch error:", error));
};

window.userDetails = function fetchData() {
  fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query {
          event_user(
             where: {
                user: { id: { _is_null: false } }
                event: { path: { _eq: "/oujda/module" } }
              }
              order_by: { level: asc }
              ) {
                level
                userName
                userAuditRatio
              }
      }
    `,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(
        "==== XP Sum ====",
        data.data.event_user
      );
    })
    .catch((error) => console.error("Fetch error:", error));
};

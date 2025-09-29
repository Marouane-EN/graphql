export async function graphQLRequest(query) {
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
            ${query}
          }`,
        }),
      }
    );
    if (!json.ok) {

      throw new Error(res.errors.message);
    }
    const res = await json.json();
    return res.data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Helper functions
export function showError(input, message) {
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

export function clearError(input) {
  input.classList.remove("error");
  const errorMessage =
    input.parentNode.parentNode.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

export function clearErrors() {
  document.querySelectorAll(".form-input").forEach((input) => {
    clearError(input);
  });
}


export function formatXpToBytes(totalXp) {
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

export function ranks(level) {
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

export async function ping() {
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
    if (res.errors) {
      throw new Error("error");
    }
    return true;
  } catch (error) {
    return false;
  }
}
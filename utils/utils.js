// Function to send a GraphQL request to the API
export async function graphqlRequest(query) {
  try {
    const response = await fetch(
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

    const res = await response.json();

    if (!response.ok || res.errors) {
      const message =
        res && res.errors ? JSON.stringify(res.errors) : response.statusText;
      throw new Error(message);
    }

    return res.data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Function to show an error message next to a form input
export function showError(input, message) {
  input.classList.add("error");

  // Remove any existing error message near this input
  const existingError =
    input.parentNode.parentNode.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
                 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
    ${message}
  `;

  // Attach the error div under the input’s parent
  input.parentNode.parentNode.appendChild(errorDiv);
}

// Function to clear error message from a specific input
export function clearError(input) {
  input.classList.remove("error");
  const errorMessage =
    input.parentNode.parentNode.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Function to clear ALL error messages in a form
export function clearErrors() {
  document.querySelectorAll(".form-input").forEach((input) => {
    clearError(input);
  });
}

// Function to format XP into readable units (b, kb, mb, gb, tb)
export function formatXpToBytes(totalXp) {
  if (totalXp < 1000) return `${totalXp}b`;

  const units = ["b", "kb", "mb", "gb", "tb"];
  let unitIndex = 0;
  let formattedXp = totalXp;

  // Keep dividing until value is < 1000 or we reach largest unit
  while (formattedXp >= 1000 && unitIndex < units.length - 1) {
    formattedXp /= 1000;
    unitIndex++;
  }

  return `${formattedXp.toFixed(1)}${units[unitIndex]}`;
}

// Function to get user rank title based on level
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

  // Divide by 10 for every rank until reaching max
  while (level >= 10 && unitIndex < units.length - 1) {
    level /= 10;
    unitIndex++;
  }

  return `${units[unitIndex]}`;
}

// Function to check if the user is authenticated (ping the server)
export async function ping() {
  try {
    const response = await fetch(
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

    const res = await response.json();

    if (!response.ok || res.errors) {
      throw new Error(
        res && res.errors ? JSON.stringify(res.errors) : response.statusText
      );
    }

    return true;
  } catch (error) {
    console.error("Ping error:", error);
    return false;
  }
}

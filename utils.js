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
    
    const res = await json.json();
    console.log("res", res, query);
    
    if (res.errors) {
      console.log("GraphQL errors:", res.errors);
      
      throw new Error(res.errors.message);
    }
    
    return res.data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
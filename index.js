let username
let password
let sum = 0
const btn = document.getElementById('btn')
btn.addEventListener('click', login)

function login() {
    username = document.getElementById('username').value
    password = document.getElementById('password').value
    const credentials = btoa(`${username}:${password}`)

    fetch("https://learn.zone01oujda.ma/api/auth/signin",
        {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/json"
            },
        }

    ).then(res => res.json()).then(data => {
        localStorage.setItem("jwt", data)

        console.log(data)
    })
    console.log('== = =', localStorage.getItem("jwt"));

    fetch("https://learn.zone01oujda.ma//api/graphql-engine/v1/graphql",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                query: `
                query {
                    transaction(where:{type: {_eq:"xp"}, event: { object: { name: { _eq: "Module" } } }}, order_by: {createdAt:asc}) {
    
    type
    amount
  }
                }
                `
            })

        }

    ).then(res => res.json()).then(data => {
        data.data.transaction.forEach(element => {
            console.log(element.amount);
            
            sum += element.amount
        });
        console.log("====  ", data)
        console.log("sum",sum);
    })

}



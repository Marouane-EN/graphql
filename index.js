let username
let password
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

    // fetch("https://learn.zone01oujda.ma//api/graphql-engine/v1/graphql",
    //     {
    //         method: "POST",
    //         headers: {
    //             "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
    //             "Content-Type": "application/json"
    //         },

    //         body: {
    //             query: `
    //                 user {
    //                     id
    //                     login
    //                 }
                
    //             `
    //         }

    //     }

    // ).then(res => res.json()).then(data => {
    //     console.log(data)
    // })

}



export const USER_QUERY = `
user : event_user(
              where: {user: {id: {_is_null: false}}, 
              event: {path: {_eq: "/oujda/module"}}}
              order_by: {level: asc}
            ) {
              level
              userLogin
              userName
              userAuditRatio
            }`;

export const SKILLS_QUERY = `
  user:   transaction(
    where: { type:{ _like: "skill_%" } }
    distinct_on: type
    order_by: { type: asc, amount: desc }
  ) {
    type
    amount
  }
  
`;

export const XP_QUERY = `
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
          `;

export const AUDITE = `
  user {
    success: audits_aggregate(where: { closureType: { _eq: succeeded } }) {
      count: aggregate { count }
    }
    failed: audits_aggregate(where: { closureType: { _eq: failed } }) {
      count: aggregate { count }
    }
  }
`
export const USER_DETAILS_QUERY = `
  user {
    attrs
  }
`
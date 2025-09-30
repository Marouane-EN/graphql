# GraphQL Profile Dashboard — Project Presentation

Subject
This project is a client-side GraphQL Profile Dashboard. It demonstrates how to query a GraphQL endpoint to build a personalized profile page that displays user information, aggregated XP, skills, audits and SVG-based statistics.

Objectives

Project structure
Top-level files and their purpose:


Folders
	- `skill_svg.js` — Builds SVG markup for skill-related visualizations.
	- `audit_svg.js` — Builds SVG markup for audit/performance visualizations.

	- `query.js` — Centralized GraphQL query constants used by the app.
	- `utils.js` — Helper utilities: GraphQL request wrapper, formatters, validation helpers, and a ping/health check.

How the app is organized
	1. Validate authentication (ping).
	2. Show the login UI if there is no valid JWT.
	3. On successful login, obtain data via GraphQL queries (user, XP aggregates, user attributes).
	4. Render the header/profile, sidebar stats, and SVG visualizations.
	5. Provide a profile modal and logout mechanism.


Additional notes

If you want the README expanded later with examples of the GraphQL queries used or a short API contract, I can add that on request. 

GraphQL query examples & short API contract
------------------------------------------
This project queries a GraphQL endpoint at:

`https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql`

Authentication
- Obtain a JWT by POSTing credentials to `https://learn.zone01oujda.ma/api/auth/signin` using Basic auth (Base64 encoded `username:password` or `email:password`).
- Supply the JWT to GraphQL requests using the HTTP header:

```
Authorization: Bearer <your-jwt-here>
Content-Type: application/json
```

Common query examples (these correspond to the queries in `utils/query.js`):

1) Event users list (basic user identification)

```graphql
{
	user: event_user(
		where: { user: { id: { _is_null: false } }, event: { path: { _eq: "/oujda/module" } } }
		order_by: { level: asc }
	) {
		level
		userLogin
		userName
		userAuditRatio
	}
}
```

Sample shape of response.data

```json
{
	"data": {
		"user": [
			{ "level": 12, "userLogin": "jdoe", "userName": "John Doe", "userAuditRatio": 0.85 }
		]
	}
}
```

2) XP aggregate (sum of XP transactions)

```graphql
{
	xp: transaction_aggregate(
		where: { type: { _eq: "xp" }, event: { object: { name: { _eq: "Module" } } } }
	) {
		aggregate { sum { amount } }
	}
}
```

Sample shape of response.data

```json
{
	"data": {
		"xp": { "aggregate": { "sum": { "amount": 12345 } } }
	}
}
```

3) Distinct skills (transactions where type starts with "skill_")

```graphql
{
	user: transaction(
		where: { type: { _like: "skill_%" } }
		distinct_on: type
		order_by: { type: asc, amount: desc }
	) {
		type
		amount
	}
}
```

Sample shape of response.data

```json
{
	"data": {
		"user": [
			{ "type": "skill_js", "amount": 1200 },
			{ "type": "skill_html", "amount": 800 }
		]
	}
}
```

4) User attributes (attrs stored on the user)

```graphql
{
	user { attrs }
}
```

Sample shape of response.data

```json
{
	"data": {
		"user": [ { "attrs": { "firstName": "John", "lastName": "Doe", "email": "john@example.com" } } ]
	}
}
```

Notes on query usage
- Use nested queries when you need related data (for example `result { user { login } }`).
- When targeting a single object you may use arguments/filters like `where: { id: { _eq: 3323 } }` to reduce the returned set.
- The GraphQL schema can be explored via GraphiQL when logged into the platform; it helps to discover available fields and arguments.
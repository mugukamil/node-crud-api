# Node.js CRUD API

A simple REST API implementation using pure Node.js and TypeScript.

## Prerequisites

- Node.js (v18 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd crud-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```bash
PORT=3000
```

## Running the Application

Development mode with auto-reload:

```bash
npm run start:dev
```

## API Endpoints

### Users

#### GET /api/users

- Returns all users
- Response: 200 OK

```json
[
    {
        "id": "uuid",
        "username": "string",
        "age": "number",
        "hobbies": ["string"]
    }
]
```

#### GET /api/users/{userId}

- Returns user by id
- Response: 200 OK

```json
{
    "id": "uuid",
    "username": "string",
    "age": "number",
    "hobbies": ["string"]
}
```

#### POST /api/users

- Creates a new user
- Request body:

```json
{
    "username": "string",
    "age": "number",
    "hobbies": ["string"]
}
```

- Response: 201 Created

#### PUT /api/users/{userId}

- Updates existing user
- Request body (at least one field required):

```json
{
    "username": "string",
    "age": "number",
    "hobbies": ["string"]
}
```

- Response: 200 OK

#### DELETE /api/users/{userId}

- Removes user
- Response: 204 No Content

## Error Responses

- 400 Bad Request: Invalid user data or UUID
- 404 Not Found: Route not found
- 500 Internal Server Error: Server error

## Response Headers

All responses have content type: `application/json`

## Project Structure

```
crud-api/
├── src/
│   ├── data/
│   │   └── users.ts
│   ├── utils.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── .env
```

## Technologies Used

- Node.js
- TypeScript
- UUID for generating unique identifiers
- dotenv for environment variables

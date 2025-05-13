# Node.js CRUD API

A simple REST API implementation using pure Node.js and TypeScript with horizontal scaling capabilities.

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
PORT=4000
```

## Running the Application

There are three modes to run the application:

### Development Mode (with auto-reload)

```bash
npm run start:dev
```

### Production Mode (optimized build)

```bash
npm run start:prod
```

### Multi-Instance Mode (with load balancer)

```bash
npm run start:multi
```

This mode starts multiple instances:

- Load balancer on PORT (default: 4000)
- Worker instances on PORT+1, PORT+2, etc.
- Automatically scales based on CPU cores

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
│   ├── cluster.ts
│   ├── loadBalancer.ts
│   ├── store.ts
│   ├── server.ts
│   ├── utils.ts
│   ├── crud.ts
│   └── index.ts
├── __tests__/
│   └── crud.test.ts
├── package.json
├── tsconfig.json
├── webpack.config.js
└── .env
```

## Technologies Used

- Node.js
- TypeScript
- UUID for generating unique identifiers
- dotenv for environment variables
- Jest for testing
- webpack for production builds

## Testing

Run the test suite:

```bash
npm test
```

The tests cover:

- Basic CRUD operations
- Error handling
- Invalid input scenarios
- Data consistency

## Load Balancing

In multi-instance mode, the application uses a Round-robin algorithm to distribute requests across worker instances. State is synchronized across all instances using Node.js IPC mechanisms.

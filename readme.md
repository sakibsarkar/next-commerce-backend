# Next Commerce Backend

## Introduction

Welcome to the Project Name repository! This README file will guide you through the steps required to set up and run the project on your local computer.

## Getting Started

To get started with the project, follow the instructions below:

### Prerequisites

Make sure you have the following software installed on your machine:

- Git
- Node.js (v20.9.0 recommended)
- Yarn

### Cloning the Repository

First, clone the repository using the following command:

```
git clone https://github.com/sakibsarkar/next-commerce-backend.git
```

### Installing Dependencies

Open the project file in terminal and run `yarn install`

```
yarn install

```

### Setting Up Environment Variables

Create a .env file in the root directory of the project and add your MongoDB credentials:

```
SALT_ROUND=10
NODE_ENV="development"
ADMIN_DEFAUL_PASS=ADMIN DEFAULT PASSWORD
ACCESS_TOKEN_SECRET=SECRET FOR ACCESS TOKEN
REFRESH_TOKEN_SECRET=SECRET FOR REFRESH TOKEN
CN_CLOUD_NAME=COUDINARY CN CLOUD NAME
CN_API_KEY=COUDINARY API KEY
CN_API_SECRET=COUDINARY SECRET KEY
FRONTEND_URL=FRONEND URL
MAILPASS=GMAIL APP PASSWORD
MAIL=lMAIL
STRIPE_SK=STRIPE SECRET KEY
DATABASE_URL=DB URL

```

### Running the Project

Once you have set up the environment variables, you can run the project locally.

```
yarn dev

```

### Accessing the Project

```
http://localhost:5000

```

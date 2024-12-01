# Book Library 📚

## Project Description

Book Library is a straightforward library management system designed to streamline the borrowing and returning of books. Members can borrow books for a set period and are notified of overdue books if they fail to return them within 14 days. This system ensures efficient tracking of borrowed books and due dates, providing users with a smooth experience in managing their borrowed items.

## Live URL

[Book Library Backend](https://booklibrary20.vercel.app/)

## Technology Stack & Packages

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose for MongoDB ORM)
- **Other Packages**:
  - `dotenv`: For environment variable management
  - `cors`: To handle cross-origin requests

## Setup Instructions

```
git clone https://github.com/sakibsarkar/book_library.git
```

### Installing Dependencies

Open the project file in terminal and run `yarn install`

```
yarn install

```

### Setting Up Environment Variables

Create a .env file in the root directory of the project and add your MongoDB credentials:

```
DATABASE_URL="YOUR POSTGRES DB URL"
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

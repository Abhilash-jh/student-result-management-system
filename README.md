# Student Result Management System

A web-based Student Result Management System built with **React.js**, **Node.js**, **Express.js**, and **MongoDB Atlas**.

## Features
- Student search by name or roll number
- Student result viewing
- Admin login
- Add, edit, and delete student records
- Student photo upload
- Semester 1–4 marks
- Automatic percentage calculation
- MongoDB database integration

## Technologies Used
- React.js
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Bootstrap
- Multer

## Project Structure
```text
student-results/
├── frontend/
│   ├── public/
│   └── src/
└── backend/
    ├── models/
    │   └── Student.js
    ├── routes/
    │   └── students.js
    ├── uploads/
    │   ├── .gitkeep
    │   ├── db.js
    │   ├── server.js
    │   ├── .env.example
    │   └── package.json
├── .gitignore
└── README.md
```

## Requirements
- Node.js and npm
- A free MongoDB Atlas account and cluster

## 1. Clone the Repository
```bash
git clone <your-github-repository-url>
cd student-results
```

## 2. Configure MongoDB Atlas

1. Create a free MongoDB Atlas cluster.
2. Create a database user with a username and password.
3. Add your current IP address under the Atlas network access settings.
4. Open **Connect → Drivers** and select **Node.js**.
5. Copy the MongoDB connection string.

## 3. Configure Backend Environment

Open the `backend` folder and create a file named `.env` by copying `.env.example`.

Example:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/student_result_db?retryWrites=true&w=majority
ADMIN_TOKEN=your-admin-token
UPLOAD_DIR=uploads
```

Replace the placeholders with your own Atlas credentials.

**Never commit `.env` to GitHub.** The repository includes `.env.example` as a safe template.

## 4. Run the Backend

```bash
cd backend
npm install
npm start
```

The backend runs on:
```text
http://localhost:5000
```

## 5. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm start
```

The React application runs on:
```text
http://localhost:3000
```

The frontend uses the CRA proxy to communicate with the backend on port 5000.

## Admin Login

The admin authentication token is the value configured as `ADMIN_TOKEN` in the backend `.env` file.

## MongoDB Data

The application uses a `students` collection. Student records include:
- Roll number
- Name
- Class
- Date of birth
- Email
- Phone
- Semester 1–4 marks
- Percentage
- Image path

The database and collection are created automatically when data is first inserted.

## GitHub Safety

Do not upload:
- `.env`
- MongoDB usernames/passwords
- MongoDB Atlas connection strings containing credentials
- `node_modules`
- Runtime uploaded student images

These are excluded through `.gitignore`. Only `.env.example` should be committed for environment configuration.

## License

This project was developed as an academic project for educational purposes.

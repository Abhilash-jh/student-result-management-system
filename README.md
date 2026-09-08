# 🎓 Student Result Management System

A web-based Student Result Management System developed using **React.js, Node.js, Express.js, and MongoDB Atlas**.

The system allows students to search and view their academic results, while administrators can securely manage student records and results.

---

## 🚀 Features

### 👨‍🎓 Student
- Search student results by name or roll number
- View complete student result
- View semester-wise marks
- View percentage
- View student profile image

### 👨‍💼 Admin
- Secure admin login
- Add new student records
- Edit student information
- Delete student records
- Upload student profile images
- Manage semester-wise marks
- Automatic percentage calculation

---

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Bootstrap

### Backend
- Node.js
- Express.js
- Multer

### Database
- MongoDB
- MongoDB Atlas
- Mongoose

---

## 📂 Project Structure

```text
student-result-management-system/
│
├── backend/
│   ├── models/
│   │   └── Student.js
│   ├── routes/
│   │   └── students.js
│   ├── uploads/
│   ├── db.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md

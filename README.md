<div align="center">
  <img src="frontend/src/assets/logo.png" width="100" alt="Mello Logo" />
  <h1>Mello</h1>
</div>

Mello is a Trello inspired application, built with **Spring Boot** and **ReactJS**. It allows users to create, manage, and organize boards, lists, and cards.

---

## 🚀 Features

- **Board, List, Card Management**  
  Create, update, delete, and view boards to organize tasks.

---

## 🛠 Technologies Used

- **React** 
- **Spring Boot**
- **PostgreSQL** 

---

## 📋 Prerequisites

Before running Mello locally, ensure you have:

- [Node.js](https://nodejs.org/)
- [Java 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [PostgreSQL](https://www.postgresql.org/) 

---

## 🧰 Setup & Installation

To run the project locally:

1. **Clone the repository**

   ```bash
   git clone https://github.com/alpearik/Mello.git
   cd mello
   
2. **Backend Setup**

   ```bash
   cd backend


- Update backend/src/main/resources/application.properties with your PostgreSQL credentials:

   ```bash
   spring.datasource.url=jdbc:postgresql://localhost:5432/mello
   spring.datasource.username=*****
   spring.datasource.password=*****
   ```

- Install dependencies and build the backend:

  ```bash
  ./mvnw clean install

- Start the Backend

  ```bash
  ./mvnw spring-boot:run
  ```


3. **Frontend Setup** 

- Navigate to the frontend directory:
  
    ```bash
    cd frontend

- Install dependencies:

   ```bash
  npm install
   ```

- Start the Frontend
  
   ```bash
  npm run dev
   ```

---

## 👨‍💻 Author 
<a href="https://github.com/alpearik">@alpearik</a>


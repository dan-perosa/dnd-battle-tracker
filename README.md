### **Dungeons & Dragons Battle Tracker**

**A comprehensive battle tracker for Dungeons & Dragons, built with a robust tech stack.**

#### **Overview**
This web application streamlines Dungeons & Dragons combat, providing a user-friendly interface for creating and managing battles. Key features include:
* Character and monster creation and management.
* Intuitive battle creation and editing.
* Dynamic initiative tracking and turn-based combat.
* Detailed combat logging and saving.
* Integration with the official DnD API for monster data.

#### **Technology Stack**
* **Frontend:** Next.js (React Framework), TypeScript, Tailwind CSS
* **Backend:** FastAPI, SQLAlchemy, Alembic
* **Database:** PostgreSQL
* **Authentication:** User registration and login with password hashing

#### **Installation and Setup**
**Prerequisites:**
* Node.js and npm (or yarn)
* Python 3.6+
* A PostgreSQL database

**1. Clone the repository:**
   ```bash
   git clone https://github.com/dan-perosa/dnd-battle-tracker.git
   ```
**2. Install frontend dependencies:**
   ```bash
   cd dnd-battle-tracker/front/battle_tracker
   npm install
   ```
**3. Install backend dependencies:**
   ```bash
   cd ../../back
   pip install -r requirements.txt
   ```
**4. Configure the database:**
   * Create a PostgreSQL local database and a user with necessary privileges.
**5. Run database migrations:**
   ```bash
   alembic upgrade head
   ```
**6. Start development servers:**
   * **Frontend:**
     ```bash
     npm run dev
     ```
   * **Backend:**
     ```bash
     fastapi dev main.py
     ```

#### **Key Features and Functionality**
* **Character and Monster Management:** Create custom characters and utilize the DnD API to add official monsters to battles.
* **Initiative Tracking:** Automatically determine turn order based on initiative rolls.
* **Combat Simulation:** Simulate attacks, damage, and status effects, providing a rich combat experience.
* **Battle Saving:** Save battle progress to resume later or review past encounters.
* **User Authentication:** Secure user registration and login with password hashing.

#### **Contributing**
Contributions are welcome! Please feel free to open an issue or submit a pull request.

**Tags:** #dnd #battletracker #nextjs #typescript #tailwindcss #fastapi #sqlalchemy #alembic #postgresql #rpg #gamedev

**Note:**

* **Customization:** The application is designed to be highly customizable, allowing users to tailor it to their specific needs.
* **Scalability:** The backend is built with scalability in mind, allowing for future expansion and handling of larger datasets.
* **Best Practices:** The project adheres to industry best practices for web development, including code quality, security, and maintainability.

**Note:**

This project has been developed primarily for local development. **To deploy this application to a server, some adaptations may be necessary, especially on the backend.** This includes adjusting database connection settings, defining API endpoints, and configuring a web server.

**Recommendations for deployment:**
* **Platform as a Service (PaaS):** Heroku, Render, Vercel offer easy integration with databases and allow you to scale your application as needed.
* **Virtual servers:** AWS, GCP, Azure provide more granular control over the hosting environment but require more configuration.

**Remember to configure environment variables correctly for your specific deployment.**

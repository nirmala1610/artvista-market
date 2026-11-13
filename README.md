# ArtVista Market 🎨

### A Full-Stack Art Gallery & E-Commerce Platform

ArtVista Market is a full-stack web application designed to connect artists, galleries, and art enthusiasts through a unified digital marketplace. Users can explore artworks, discover artists, manage collections, purchase art, and engage with exhibitions through a modern web interface.

Built with **React, Vite, Spring Boot, Java, MySQL, and MongoDB**, the project combines a responsive frontend with a backend designed to support authentication, artwork management, orders, and role-based functionality.

---

## ✨ Features

### 🛍️ Customer Experience
- Browse and discover artworks.
- Explore artwork details and artist portfolios.
- Save favorite artworks and manage wishlists.
- Manage shopping carts, addresses, and orders.
- Access order and purchase-related features.
- Contact support and manage disputes.

### 🎨 Artist Dashboard
- Upload and manage artwork listings.
- Update artwork information and inventory.
- Manage an artist portfolio.
- Track sales and view dashboard analytics.

### 🏛️ Gallery & Exhibition Management
- Organize art collections and exhibitions.
- Manage exhibition details and participating artists.
- Support exhibition ticketing and visitor-related information.
- Provide gallery management functionality.

### 🛡️ Administration
- Role-based access control.
- Manage users and artist verification workflows.
- Review artist and curator applications.
- Handle disputes and administrative operations.
- Access analytics and reporting features.

### 🔐 Authentication & Security
- JWT-based authentication and authorization.
- Role-based access for customers, artists, and administrators.
- Google OAuth2 integration.
- Protected frontend routes and backend endpoints.

### 💳 Additional Integrations
- Razorpay payment integration.
- Cloudinary image delivery and optimization.
- Email functionality using SMTP.
- MySQL and MongoDB for application data.

*Feature availability depends on the configured services and credentials.*

---

## 🧰 Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling & UI | Tailwind CSS, shadcn/ui |
| Backend | Java, Spring Boot |
| Security | Spring Security, JWT, OAuth2 |
| Relational Database | MySQL |
| Document Database | MongoDB |
| Payments | Razorpay |
| Image Management | Cloudinary |
| Email | Spring Mail, SMTP |
| Build Tools | npm, Maven |
| Version Control | Git, GitHub |

---

## 🏗️ Project Structure

```text
ArtVista/
├── artvista-backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   │           ├── application.properties
│   │           └── application.example.properties
│   ├── .env
│   └── pom.xml
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── util/
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

*The tree illustrates the intended organization. Some files or directories may differ in your local setup.*

---

## ⚙️ Getting Started

### Prerequisites

Install or configure the following before running the project:

- [Node.js and npm](https://nodejs.org/)
- [Java JDK](https://adoptium.net/)
- MySQL
- MongoDB
- Git

You will also need credentials for any external integrations you want to use, such as Google OAuth, Razorpay, Cloudinary, Supabase, or SMTP email.

### 1. Clone the Repository

```bash
git clone https://github.com/nirmala1610/artvista-market.git
cd artvista-market
```

### 2. Configure the Frontend

Navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file based on `.env.example` and supply the appropriate values.

Example:

```dotenv
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_or_publishable_key
```

Add any other frontend environment variables required by your application.

Start the development server:

```bash
npm run dev
```

Vite will print the local URL in the terminal.

### 3. Configure the Backend

Open another terminal and navigate to the backend:

```bash
cd artvista-backend
```

Create a private `.env` file using the environment variables required by the backend configuration.

Configure the following values as applicable:

| Variable | Purpose |
|---|---|
| `SPRING_APPLICATION_NAME` | Spring Boot application name |
| `DB_URL` | MySQL JDBC connection URL |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `MONGODB_URI` | MongoDB connection URI |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `RAZORPAY_KEY` | Razorpay key |
| `RAZORPAY_SECRET` | Razorpay secret |
| `MAIL_USERNAME` | SMTP email account |
| `MAIL_PASSWORD` | SMTP credential or app password |

Make sure the database services are running and the credentials match your local configuration.

**Important:** Spring Boot does not automatically load an arbitrary `.env` file in every setup. Export the variables into the process environment or use your existing environment-loading script before starting the application.

From the backend directory, start the application using the Maven wrapper on Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

On systems where the Maven wrapper is unavailable, configure Maven and use:

```bash
mvn spring-boot:run
```

The backend will start on its configured port.

### 4. Run Both Applications

Keep the frontend and backend running in separate terminals. Ensure the frontend's API configuration points to the correct backend address and that the required database and external services are configured.

---

## 🔒 Environment Variables & Security

- Never commit `.env` files or real credentials.
- Keep backend secrets exclusively on the backend.
- Never expose database passwords, payment secrets, OAuth client secrets, or Supabase service-role keys in frontend code.
- Frontend environment variables prefixed with `VITE_` are bundled into client-side code and must not contain private secrets.
- Configure appropriate database permissions and Supabase Row Level Security policies.
- Use HTTPS and secure deployment settings in production.

---

## 🚀 Deployment

The project can be deployed using separate frontend and backend hosting services.

A typical deployment setup includes:

- **Frontend:** a static hosting platform compatible with Vite.
- **Backend:** a Java/Spring Boot hosting service or container platform.
- **Databases:** managed MySQL and MongoDB services.
- **Images:** Cloudinary.
- **Secrets:** environment variables configured in the hosting provider.

Before deployment, configure production API URLs, OAuth callback URLs, CORS rules, payment settings, database access, and environment variables.

---

## 🎯 Project Goals

ArtVista Market explores the development of a complete full-stack marketplace with multiple user roles and integrated services.

The project focuses on:

- Building a responsive React application.
- Designing RESTful backend functionality with Spring Boot.
- Working with relational and document databases.
- Implementing authentication and role-based authorization.
- Integrating third-party services.
- Organizing a full-stack application for version control and deployment.

---

## 👨‍💻 Author

**Nirmaladevi S**

Computer Science Engineering Student | Full-Stack Development | Java & Spring Boot

GitHub: [@nirmala1610](https://github.com/nirmala1610)

---

*ArtVista Market — Bringing the art world closer through technology.* 🎨

# 📊 Payroll & Reports BI Management System

A comprehensive Full-Stack Enterprise Solution for managing payroll reports, employee documentation, and organizational workflows. Built with a focus on **Security**, **Scalability**, and **User Experience**.

## 🌟 Project Highlights
This system serves as a central hub for employers and employees, streamlining the reporting process with an automated approval workflow.

* **Role-Based Access Control (RBAC):** Distinct interfaces for Employees, Managers, and Administrators.
* **Secure Authentication:** Identity management using **JWT (JSON Web Tokens)**.
* **Dynamic Data Handling:** Complex filtering, sorting, and real-time status updates for reports.
* **Automated Workflow:** Multi-stage approval process (Pending, Approved, Rejected) with automated logic.

## 🛠️ Technical Deep Dive

### Frontend (Angular 16+)
* **Architecture:** Modular design with **Lazy Loading** for optimized performance.
* **State Management:** Reactive programming using **RxJS**.
* **UI/UX:** Rich interface built with **Angular Material** and custom SCSS components.
* **Security:** Route Guards for protected pages and Interceptors for JWT injection.

### Backend (ASP.NET Core Web API)
* **Design Pattern:** Implemented **Repository Pattern** and **Unit of Work** for clean, maintainable code.
* **Business Logic:** Decoupled Services layer to handle complex payroll calculations.
* **Middleware:** Custom error handling and logging middleware.
* **ORM:** Entity Framework Core with a Code-First approach.

### Database (SQL Server)
* Relational schema designed for high data integrity.
* Optimized queries for large-scale report generation.

## 📂 Project Structure
```text
├── Reports_Client/       # Angular Frontend Application
├── Reports_Server/       # ASP.NET Core Web API
├── Documentation/        # Full System Characterization & Design PDF
└── Database_Scripts/     # SQL Initial Schema & Seed Data

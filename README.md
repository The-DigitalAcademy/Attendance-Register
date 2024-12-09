# Attendance-Register

A Node.js backend application built with Express and Prisma to manage admins, learners, and their attendance data. This system supports authentication, role-based access control, and CRUD operations for managing learners, programs, and attendance records.

# Features
# Admin Management
Admin Registration: Add new admins with hashed passwords. \
Admin Login: Authenticate admins and issue JWT tokens.\
Role-Based Access Control: Support for roles such as admin and super_admin.\
Admin CRUD: View, update roles, and delete admin accounts (restricted to super_admin).

# Learner Management 
Learner Records: CRUD operations for learners, including geolocation and cohort data. \
Attendance Management: Track learners' attendance records with geolocation and timestamps. 

# Program Management
Programs: Define and manage programs, cohorts, and learner counts. \
Technologies Used \
Node.js: Backend runtime.\ 
Express: Web framework for route handling. \
Prisma: ORM for database management. \
PostgreSQL: Database for persisting data. \
JWT: Token-based authentication. \
bcryptjs: Secure password hashing. 

# Prerequisites
Before starting, ensure you have the following installed: 

Node.js (v14 or later) \
PostgreSQL or another Prisma-supported database \
Prisma CLI (npx can also work) \
Setup  
1. Clone the Repository \

# ADMIN User Stories
  Get all learners \
 Get a single learner:
 (CHECKEDIT_AT(DATE_TIME PARAMS=PARSE MONTH)) \
 how many times NOT  Checked In and Checked \
Get all learner by cohort \
Get all Checked in by cohort \
Get all NOT CheckedIn by cohort 


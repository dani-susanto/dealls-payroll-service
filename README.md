# Dealls Payroll Service

A robust payroll management system built with NestJS, featuring automated payroll processing, attendance tracking, and employee management.

## Features

- **Authentication System**
  - Separate auth for employees and admin
  - JWT-based authentication
  - Role-based access control

- **Payroll Management**
  - Automated payroll calculation
  - Working days computation
  - Overtime processing
  - Reimbursement handling
  - Asynchronous processing using BullMQ

- **Employee Activities**
  - Attendance tracking
  - Overtime submissions
  - Reimbursement requests

## Tech Stack

- Node.js
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Redis & BullMQ
- Jest for testing

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL
- Redis

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/dani-susanto/dealls-payroll-service
cd dealls-payroll-service
```

2. Run the installation script:
```bash
chmod +x install.sh
./install.sh
```

The script will:
- Set up environment variables
- Start Docker containers
- Install dependencies
- Run database migrations
- Start the application

Access the application at:
- API: http://localhost:3000/api
- Documentation: http://localhost:3000/api/docs
- Adminer: http://localhost:3001
- Redis Commander: http://localhost:3002

## Testing

Run unit tests:
```bash
npm run test
```

Run e2e tests:
```bash
npm run test:e2e
```

## API Documentation

After starting the application, access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

## Project Structure

```
src/
├── admin-auth/       # Admin authentication
├── admin-payroll/    # Payroll management
├── common/           # Shared resources
├── database/        # Database configurations
├── employee-auth/    # Employee authentication
├── employee-activity/# Employee activities
├── entities/        # TypeORM entities
└── employee-payroll/ # Employee payroll views
```

## Key Features Documentation

### Payroll Processing

- Automated calculation of:
  - Basic salary based on attendance
  - Overtime compensation
  - Reimbursements
  - Take-home pay

### Queue System

- Asynchronous payroll processing
- Job queues for large datasets
- Automatic retry mechanism
- Progress tracking


## License

[MIT License](LICENSE)

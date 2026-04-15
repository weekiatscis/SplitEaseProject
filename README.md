# SplitEase

A expense-splitting app built with Next.js and a Python Flask microservices backend.

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Backend:** Python Flask (microservices)

## Project Structure

splitease/
├── app/                    # Next.js app router pages
│   ├── dashboard/
│   ├── groups/
│   └── signup/
├── components/             # React components
│   ├── cards/
│   ├── charts/
│   ├── dashboard/
│   ├── forms/
│   ├── groups/
│   ├── sidebar/
│   ├── table/
│   └── ui/
└── flask-backend/          # Python microservices
    ├── auth_service/       # Port 5001 — authentication
    ├── group_service/      # Port 5002 — groups
    ├── expense_service/    # Port 5003 — expenses
    └── payment_service/    # Port 5004 — payments

## Getting Started

### Installation

1. npm install

3. Install Python dependencies:

   pip install -r flask-backend/requirements.txt

4. Run in development (frontend + all Flask services):

   npm run dev

5. Build for production:

   npm run build

6. Run production stack (frontend + all Flask services):

   npm start

For frontend-only production server, use:

   npm run start:web

| Service          | Port |
|------------------|------|
| Next.js          | 3000 |
| Auth service     | 5001 |
| Group service    | 5002 |
| Expense service  | 5003 |
| Payment service  | 5004 |

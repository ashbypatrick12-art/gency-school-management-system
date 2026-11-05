# Gency School Management System

A responsive React + Vite school operations demo built with Tailwind CSS and Lucide icons.

## Current build

- Dashboard with school overview and quick actions
- Student, teacher, class and subject records
- Attendance register
- Assessment marks and configurable grading boundaries
- Term-filtered printable student report cards
- Fee payment records and CSV exports
- Add and edit forms with basic validation
- Demo role entry for administrator, teacher and student views

## Storage and demo access

This version uses **browser localStorage only**. Records stay in the browser and device where they were entered. Clearing browser data or changing devices can remove or separate the records.

The demo role selector is only a user-interface preview. It is **not authentication, authorization or secure data isolation**. Do not enter real student, guardian, staff or financial information. Use fictional test records only.

No Supabase or other remote database is connected in this phase.

## Run locally

```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

## Stack

- React 18 + Vite
- Tailwind CSS
- Lucide React
- Browser localStorage for demo persistence

## Build verification

GitHub Actions runs `npm install` and `npm run build` on pushes and pull requests.

# CV Reviewer Application

A web application for analyzing and providing feedback on CVs/resumes using AI.

## Features

- Upload and analyze CVs in PDF format
- Get detailed feedback on content, formatting, and ATS compatibility
- View analysis results with scores and improvement suggestions
- User authentication with Firebase
- Store analysis history in Firestore
- Upload CVs to Firebase Storage
- AI-powered CV analysis using DeepSeek AI
- PDF text extraction using PDF.js

## Tech Stack

- React with TypeScript
- Vite for build tooling
- Tailwind CSS with shadcn/ui components
- Firebase (Authentication, Firestore, Storage)
- DeepSeek AI API for CV analysis
- PDF.js for PDF text extraction
- React Router for navigation
- React Hook Form for form handling

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your Firebase and DeepSeek configuration:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# DeepSeek API Key
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```
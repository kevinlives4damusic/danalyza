# Analyza Backend

Backend service for the Analyza CV analysis platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up Firebase:
   - Create a Firebase project
   - Generate a service account key
   - Save it as `src/config/serviceAccountKey.json`

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update with your configuration

## Development

Start the development server:
```bash
npm run dev
```

## Build

Build for production:
```bash
npm run build
```

## API Endpoints

### Payments
- `POST /api/payments/verify` - Verify a payment and create subscription
- `GET /api/payments/:paymentId` - Get payment details

### Subscriptions
- `GET /api/subscriptions/:userId` - Get user's active subscription

## Testing

Run tests:
```bash
npm test
``` 
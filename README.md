# Portfolio Backend - Express + MongoDB + Nodemailer

Production-ready Node.js API for your portfolio contact form.

## 📋 Quick Start

### 1. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` - MongoDB connection string
- `EMAIL_USER` / `EMAIL_PASS` - Gmail account with App Password
- `CORS_ORIGIN` - Your frontend URL (e.g., `http://localhost:5173`)
- `PORT` - Server port (default 5000)

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Server

Development (with auto-reload):
```bash
npm run dev
```

Production:
```bash
npm start
```

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   └── contact.controller.js    # Business logic
├── middleware/
│   ├── asyncHandler.js          # Async error wrapper
│   ├── errorHandler.js          # Global error handler
│   ├── requestLogger.js         # Request logging
│   ├── rateLimit.js             # Rate limiting (5 req/15 min)
│   └── validateContact.js       # Input validation
├── models/
│   └── contact.model.js         # MongoDB schema
├── routes/
│   └── contact.routes.js        # API endpoints
├── utils/
│   └── sendEmail.js             # Nodemailer config
├── server.js                    # Entry point
├── package.json
├── .env                         # Environment variables (keep secret!)
├── .env.example                 # Example template
└── .gitignore
```

## 🔗 API Endpoints

### POST /api/contact

Submit a contact form message.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about project",
  "message": "Hello, I have a question..."
}
```

**Response (Success 201):**
```json
{
  "success": true,
  "message": "Contact message received and saved",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-02-26T10:30:00.000Z"
  }
}
```

**Response (Error 400):**
```json
{
  "success": false,
  "message": "message must be at least 10 characters"
}
```

**Response (Rate Limited 429):**
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

### GET /api/health

Check server status.

**Response:**
```json
{
  "status": "ok",
  "environment": "development",
  "timestamp": "2024-02-26T10:30:00.000Z"
}
```

## 🛡️ Features

✅ **Input Validation**
- Required fields: name, email, message
- Email format validation
- String type checking
- Min length validation
- Automatic trimming & lowercase

✅ **Rate Limiting**
- 5 requests per 15 minutes per IP
- Returns 429 status when exceeded
- Auto-cleanup of expired records

✅ **Error Handling**
- Global error middleware
- Async error catching
- Mongoose validation errors
- Development vs production modes

✅ **Security**
- CORS enabled for frontend
- Payload size limit (10KB)
- HTML escaping in emails
- Environment variable protection

✅ **Email Integration**
- Gmail + Nodemailer
- Formatted HTML emails
- Reply-To field
- Async non-blocking

✅ **Logging**
- Request logging with timestamps
- Error logging with stack traces
- Duration tracking
- Status indicators (✅ ⚠️ ❌)

✅ **Database**
- MongoDB with Mongoose
- Auto timestamps
- Field validation
- Lowercase email storage

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development / production |
| MONGO_URI | Database URL | mongodb://localhost:27017/portfolio |
| EMAIL_USER | Gmail address | your-email@gmail.com |
| EMAIL_PASS | Gmail app password | xyzw abcd efgh ijkl |
| CORS_ORIGIN | Allowed frontend URL | http://localhost:5173 |

## 📧 Gmail Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate [App Password](https://myaccount.google.com/apppasswords)
3. Copy the 16-character password to `EMAIL_PASS` in `.env`

## 🗄️ MongoDB Setup

### Local (Community)
```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Or Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Cloud (Atlas - Recommended)
1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

## 🎯 Frontend Integration

Your React contact form already uses fetch:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const res = await fetch(`${API_URL}/api/contact`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
const data = await res.json();

if (data.success) {
  // Show success message
} else {
  // Show error
}
```

Add to React `.env`:
```
VITE_API_URL=http://localhost:5000
```

## 🚀 Deployment

### Heroku
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
git push heroku main
```

### Vercel Serverless
Not recommended for this (it needs persistent DB connection).

### Railway / Render
1. Push code to GitHub
2. Connect repository
3. Set environment variables
4. Deploy

### VPS (Ubuntu)
```bash
# Install Node
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Clone and run
git clone <your-repo>
cd backend
npm install
npm start
```

## 🔍 Viewing Data

### MongoDB Compass (GUI)
Download: https://www.mongodb.com/products/compass
- Connect to `mongodb://localhost:27017`
- Browse collections visually

### mongosh (CLI)
```bash
mongosh
use portfolio
db.contacts.find()
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `MONGO_URI is not defined` | Copy `.env.example` to `.env` and fill values |
| `Cannot find module 'mongoose'` | Run `npm install` |
| `Email not sending` | Check EMAIL_USER & EMAIL_PASS in `.env` |
| `CORS error from frontend` | Update CORS_ORIGIN in `.env` to match your frontend URL |
| `Rate limit exceeded` | Wait 15 minutes or change `RATE_LIMIT` in `rateLimit.js` |

## 📝 License

MIT


# AdFlow Pro - MERN Stack Project

AdFlow Pro is a full-stack sponsored ads marketplace. Clients create ads, moderators review content, admins verify payments, and only approved published ads are visible publicly.

## 1. Project Features

### Public Features

- Home page
- Explore active ads
- Packages page
- Public ads only show when status is `published`
- Expired, rejected, scheduled, unpaid, and under-review ads are hidden

### Authentication Features

- Register account
- Login account
- Role-based access
- Forgot password
- Reset password using reset token

### Roles

| Role | Purpose |
| --- | --- |
| `client` | Creates ads and submits payment proof |
| `moderator` | Reviews ad content and approves/rejects ads |
| `admin` | Verifies payments and publishes ads |
| `super_admin` | Creates packages, categories, cities, and learning questions |

### Workflow Features

1. Super admin creates setup data.
2. Client submits an ad.
3. Moderator approves or rejects the ad.
4. Client submits payment proof.
5. Admin verifies payment.
6. Admin publishes the ad.
7. Published ad appears on Explore page.
8. Cron jobs can publish scheduled ads and expire old ads.

## 2. Folder Structure

```text
AdFlow-Pro/
  package.json
  README.md

  backend/
    app.js
    server.js
    package.json
    .env.example
    API_COLLECTION.md
    src/
      app.js
      config.js
      db.js
      seed.js
      config/
        db.config.js
      controllers/
        auth.user.js
        auth.admin.js
        auth.moderator.js
      middlewares/
        auth.middlewares.js
      middleware/
        auth.js
      models/
        index.js
      routes/
        auth.routes.js
        public.routes.js
        client.routes.js
        moderator.routes.js
        admin.routes.js
        super.routes.js
        health.routes.js
        cron.routes.js
      cron/
        jobs.js
      services/
        workflow.js
      utils/
        media.js
        ranking.js

  frontend/
    package.json
    .env.example
    index.html
    src/
      main.jsx
      App.jsx
      styles.css
      utils/
        api.js
      pages/
        Navbar.jsx
        Home.jsx
        Login.jsx
        Register.jsx
        ForgotPassword.jsx
        SetupDashboard.jsx
        ClientDashboard.jsx
        ModeratorDashboard.jsx
        AdminDashboard.jsx
        ExploreAds.jsx
        Packages.jsx
        Health.jsx
```

## 5. How To Use Project From Scratch

### Step 1: Register Super Admin

Go to:

```text
http://localhost:5173/register
```

Fill the form:

```text
Name: Super Admin
Email: super@example.com
Password: 123456
Role: Super Admin
```

After register, you will go to setup dashboard.

### Step 2: Create Setup Data

Open:

```text
/setup
```

Create at least:

- 1 package
- 1 category
- 1 city
- 1 learning question

Example package:

```text
Name: Premium
Duration: 30
Weight: 3
Price: 6500
Benefits: Homepage featured, Auto refresh
Featured: checked
```

Example category:

```text
Vehicles
```

Example city:

```text
Lahore
```

### Step 3: Register Client

Go to:

```text
/register
```

Create account:

```text
Role: Client
```

### Step 4: Client Creates Ad

Open:

```text
/client
```

Click:

```text
+ New Ad
```

Fill:

- title
- category
- city
- package
- price
- phone
- external image URL or YouTube URL
- description

Submit the ad.

Ad status becomes:

```text
under_review
```

### Step 5: Register Moderator

Create another account:

```text
Role: Moderator
```

Open:

```text
/moderator
```

Moderator can:

- approve ad
- reject ad

If approved, ad status becomes:

```text
payment_pending
```

### Step 6: Client Submits Payment

Login as client again.

Open:

```text
/client
```

Click:

```text
Submit Payment
```

Fill:

- payment pending ad
- package
- payment method
- transaction reference
- sender name
- optional screenshot URL

Ad status becomes:

```text
payment_submitted
```

### Step 7: Register Admin

Create another account:

```text
Role: Admin
```

Open:

```text
/admin
```

Admin can:

- verify payment
- reject payment
- publish verified ads
- view analytics

After payment verification, ad status becomes:

```text
payment_verified
```

Then click:

```text
Publish Now
```

Ad status becomes:

```text
published
```

### Step 8: View Public Ad

Open:

```text
/explore
```

Published ads appear here.

## 6. Forgot Password Facility

This project includes a simple password reset feature.

### How It Works

1. User opens forgot password page.
2. User enters registered email.
3. System generates a reset token.
4. Token is shown on screen for demo/testing.
5. User enters token and new password.
6. Password is updated.

## 7. Deploy On Render

You can deploy this repository as two Render services: one backend web service and one frontend static site.

### Step 1: Push To GitHub

```bash
git init
git add .
git commit -m "Initial AdFlow Pro deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Do not commit real `.env` files. Keep secrets only in Render environment variables.

### Step 2: Create MongoDB Atlas Database

1. Create a MongoDB Atlas cluster.
2. Create a database user and password.
3. Allow network access from Render. For a quick student/demo deploy, you can allow `0.0.0.0/0`.
4. Copy your MongoDB connection string.

### Step 3: Deploy Backend On Render

1. Open Render Dashboard.
2. Click **New** > **Web Service**.
3. Connect your GitHub repository.
4. Use these settings:

```text
Name: adflow-pro-api
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

5. Add these backend environment variables:

```text
NODE_VERSION=22
PORT=10000
MONGODB_URI=your MongoDB Atlas connection string
JWT_SECRET=your long random secret
CLIENT_URL=https://your-frontend-name.onrender.com
CRON_ENABLED=true
```

6. Deploy the backend.
7. Open the backend URL. It should show:

```json
{ "name": "AdFlow Pro API", "status": "online" }
```

### Step 4: Deploy Frontend On Render

1. Click **New** > **Static Site**.
2. Connect the same GitHub repository.
3. Use these settings:

```text
Name: adflow-pro-frontend
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

4. Add this frontend environment variable:

```text
VITE_API_URL=https://your-backend-name.onrender.com/api
```

5. Add a rewrite rule for React Router:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

6. Deploy the frontend.

### Step 5: Connect Frontend And Backend

After the frontend deploy finishes, copy the frontend URL and update the backend `CLIENT_URL` environment variable:

```text
CLIENT_URL=https://your-frontend-name.onrender.com
```

Redeploy the backend once after changing `CLIENT_URL`.

### Optional: Render Blueprint

This repo includes `render.yaml`, so you can also use Render Blueprints. Render will ask you for the secret values marked as manual inputs, including `MONGODB_URI`, `CLIENT_URL`, and `VITE_API_URL`.



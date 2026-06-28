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

## 2. Forgot Password Facility

This project includes a simple password reset feature.

### How It Works

1. User opens forgot password page.
2. User enters registered email.
3. System generates a reset token.
4. Token is shown on screen for demo/testing.
5. User enters token and new password.
6. Password is updated.

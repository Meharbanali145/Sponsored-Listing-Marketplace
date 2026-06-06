# AdFlow Pro — API Reference

Base URL (local): `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>`

---

## 🔓 Auth — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/register` | ❌ | `name, email, password, role?` | Register a new user. Returns token. |
| POST | `/login` | ❌ | `email, password` | Login. Returns token + user. |
| GET | `/me` | ✅ | — | Get current user from token. |
| POST | `/forgot-password` | ❌ | `email` | Generate reset token (returned in response for demo). |
| POST | `/reset-password` | ❌ | `email, resetToken, newPassword` | Reset password with token. |

---

## 🌐 Public — `/api`

| Method | Endpoint | Auth | Query Params | Description |
|---|---|---|---|---|
| GET | `/meta` | ❌ | — | Get packages, categories, cities in one call. |
| GET | `/packages` | ❌ | — | List all active packages. |
| GET | `/ads` | ❌ | `q, category, city, sort, page, limit` | Paginated published ads. sort: `rank\|newest\|expiring` |
| GET | `/ads/:slug` | ❌ | — | Single ad detail + media + seller profile. Increments viewCount. |
| POST | `/ads/:slug/report` | ❌ | — | Report a listing. Increments reportCount. |
| GET | `/questions/random` | ❌ | — | Random learning question from DB. |

---

## 👤 Client — `/api/client` (role: client)

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/dashboard` | — | All my ads + payments + notifications. |
| POST | `/ads` | `title, category, city, description, price, sellerPhone, package, mediaUrls[], submit?` | Create a new ad. `submit: true` moves it to `submitted`. |
| PATCH | `/ads/:id` | Any ad fields + `submit?` | Update ad (only draft/rejected). |
| POST | `/payments` | `ad, package, method, transactionRef, senderName, screenshotUrl?` | Submit payment proof for an ad. |
| PATCH | `/profile` | `displayName, businessName, phone, city` | Update seller profile. |

---

## 🔍 Moderator — `/api/moderator` (roles: moderator, admin, super_admin)

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/review-queue` | — | All ads with status `submitted` or `under_review`. Duplicate flags shown first. |
| PATCH | `/ads/:id/review` | `decision: "approve"\|"reject"\|"flag", note?` | Review decision. Approve → `payment_pending`. Reject → `rejected`. Flag → sets `duplicateFlag`. |

---

## 🛡️ Admin — `/api/admin` (roles: admin, super_admin)

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/payment-queue` | — | All payments with status `submitted`. |
| GET | `/publish-queue` | — | Ads with status `payment_verified` or `scheduled`. |
| PATCH | `/payments/:id/verify` | `decision: "verify"\|"reject", note?` | Verify or reject a payment proof. |
| PATCH | `/ads/:id/publish` | `publishAt?, adminBoost?, isFeatured?` | Set publish date (future = scheduled), boost, feature flag. Calculates rank score. |
| GET | `/analytics/summary` | — | Ads by status, revenue by package, category breakdown, city breakdown, user count, health logs. |
| GET | `/management` | — | Packages, categories, cities, users, recent ads. |

---

## ⚙️ Super Admin — `/api/super-admin` (role: super_admin only)

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/packages` | `name, durationDays, weight, price, isFeatured?, homepagePlacement?, benefits[]` | Create a package. |
| PATCH | `/packages/:id` | Any package fields | Update a package. |
| POST | `/categories` | `name, slug?` | Create a category. |
| POST | `/cities` | `name, slug?` | Create a city. |
| POST | `/questions` | `question, answer, topic, difficulty` | Add a learning question. |

---

## ❤️ Health — `/api/health`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/db` | Returns DB connection status and recent heartbeat logs. |

---

## ⏱️ Cron (manual triggers) — `/api/cron`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/publish` | Manually trigger the publish-scheduled-ads job. |
| POST | `/expire` | Manually trigger the expire-old-ads job. |
| POST | `/heartbeat` | Manually trigger a DB heartbeat log. |

---

## 📊 Rank Score Formula

```
rankScore = isFeatured(50) + packageWeight×10 + freshnessPoints + adminBoost + verifiedSeller(10)

freshnessPoints = max(0, 25 - floor(ageHours / 8))
```

- Premium package (weight 3) = 30 points
- Standard package (weight 2) = 20 points
- Basic package (weight 1) = 10 points
- Featured listing = +50 points
- Verified seller = +10 points
- Admin boost = custom integer set per ad

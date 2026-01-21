# 🎓 Unimate (Student–Consultant Counseling Platform)

A web-based platform that connects **high school students** with **verified college consultants** (focused on private colleges) through **short, structured 1:1 video sessions**, helping students make informed decisions about their higher education journey.

---

## 🚀 Problem Statement

High school students often face:
- Confusion about private colleges
- Misinformation from unofficial sources
- Lack of access to genuine, experienced counselors

At the same time, consultants lack a **dedicated, structured platform** to connect with students efficiently.

---

## 💡 Solution

This platform enables:
- Students to **discover, book, and meet** verified consultants
- Consultants to **manage availability and sessions**
- Admins to **verify consultants and maintain trust**

The core experience is simple:

> **Book → Meet → Get clarity**

---

## 🧠 Core User Roles

### 🧑‍🎓 Student
- Sign up and log in
- Browse consultant profiles
- Book available slots
- Join video sessions
- Leave feedback after meetings

### 🧑‍🏫 Consultant
- Apply and create a profile
- Get verified by admin
- Set availability slots
- Conduct counseling sessions
- View feedback

### 🧑‍💼 Admin
- Review and verify consultants
- Monitor bookings and activity
- Handle reports and moderation

---

## 🔁 Application Flow (High-Level)

```text
Landing Page
   ↓
Authentication
   ↓
Role-based Dashboard
   ↓
Consultant Discovery
   ↓
Slot Booking
   ↓
Video Meeting
   ↓
Feedback
```
## 🎯 MVP Scope (v1)

### ✅ Included

- Authentication (Student / Consultant / Admin)  
- Consultant profiles  
- Availability & booking system  
- 1:1 video meetings  
- Post-meeting feedback  
- Basic admin verification  
- **Transactional Emails (Booking confirmations)**

### ❌ Explicitly NOT Included

- Payments  
- Chat before meetings  
- AI recommendations  
- Mobile app  
- Analytics dashboards  

---

## 🧱 Tech Stack (Planned)

### Frontend
- Next.js (App Router)  
- TypeScript  
- Tailwind CSS  
- **date-fns-tz** (Timezone management)

### Backend
- Next.js Route Handlers  
- Prisma ORM  
- **Resend** (Transactional Emails)

### Database & Storage
- Supabase (Postgres DB + Storage for images/docs)

### Authentication
- Clerk (role-based auth)  

### Video Meetings
- **Daily.co** (1:1 Video Calls)

### Hosting
- Vercel (App)  

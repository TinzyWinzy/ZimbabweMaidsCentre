# Product Requirements Document (PRD)
## Zimbabwe Maids Centre — Digital Placement Platform

**Version:** 1.0  
**Date:** 18 July 2026  
**Prepared for:** Zimbabwe Maids Centre  
**Prepared by:** [Your Name / Team]  
**Status:** Draft — Ready for Review  

---

## 1. Executive Summary

Zimbabwe Maids Centre is a Harare-based domestic placement agency currently processing ~6 manual placements per day. This PRD defines the requirements for a digital platform that automates job matching, worker verification, billing, and communication to scale operations to **1,000 placements per month** while reducing operational overhead and call volume.

---

## 2. Business Objectives

| # | Objective | Target Metric |
|---|-----------|---------------|
| 1 | Scale placement volume | 1,000 placements/month (from ~180/month) |
| 2 | Reduce inbound call volume | 70% reduction via self-service & chatbots |
| 3 | Automate verification & trust | 100% KYC + background check digitization |
| 4 | Streamline revenue collection | Automated placement fees, connection fees, retainers |
| 5 | Improve user experience | Information readily available; minimal user effort |
| 6 | Ensure data privacy | Encrypted contact details until match is confirmed |

---

## 3. Target Users & Personas

### 3.1 Primary Users

| Persona | Role | Goals | Pain Points |
|---------|------|-------|-------------|
| **Household Employer** | Homeowner/tenant seeking domestic help | Find verified, reliable workers quickly | Endless searching, trust issues, time-consuming interviews |
| **Domestic Worker** | Maid, nanny, chef, cleaner, gardener | Find legitimate, well-paying jobs | Scams, lack of visibility, no verification credentials |
| **Agency Admin** | Zimbabwe Maids Centre staff | Manage placements, verify workers, handle billing | Overwhelming calls, manual paperwork, refund disputes |

### 3.2 Secondary Users

| Persona | Role | Goals |
|---------|------|-------|
| **Verifier / Background Checker** | Third-party or internal staff | Submit and review background check reports |
| **Finance Manager** | Admin handling revenue | Track fees, retainers, refunds, payouts |

---

## 4. Functional Requirements

### 4.1 User Authentication & Profiles

#### 4.1.1 Registration & Login
- **FR-AUTH-01:** Support registration via email, phone number (with OTP), and social login (Google, Facebook optional).
- **FR-AUTH-02:** Role-based registration: Employer or Worker.
- **FR-AUTH-03:** Password reset via email/SMS.
- **FR-AUTH-04:** Session management with JWT tokens and automatic timeout.
- **FR-AUTH-05:** Two-factor authentication (2FA) for admin accounts.

#### 4.1.2 Employer Profile
- **FR-EMP-01:** Profile fields: Name, contact info, location (city/suburb), household size, specific needs, preferred worker type, budget range.
- **FR-EMP-02:** Upload profile photo (optional).
- **FR-EMP-03:** Job posting capability: create, edit, delete job listings.
- **FR-EMP-04:** View match history, active placements, and payment history.
- **FR-EMP-05:** Rating and review system for placed workers.

#### 4.1.3 Worker Profile
- **FR-WKR-01:** Profile fields: Name, age, gender, location, skills, experience, availability, expected salary, languages, certifications.
- **FR-WKR-02:** Upload profile photo, ID document, certificates, and reference letters.
- **FR-WKR-03:** Work history timeline with previous employers and roles.
- **FR-WKR-04:** Verification status badges (KYC, Background Check, Reference Check, Training Certified).
- **FR-WKR-05:** Privacy settings: contact details encrypted/hidden until match is confirmed.

---

### 4.2 Job Market & Matching Engine

#### 4.2.1 Job Listings (Employer Side)
- **FR-JOB-01:** Create job posts with: title, description, location, worker type, salary range, start date, live-in/live-out, requirements.
- **FR-JOB-02:** Job post visibility: public or invite-only.
- **FR-JOB-03:** Auto-expire listings after 30 days (renewable).
- **FR-JOB-04:** Receive applications from matched workers.

#### 4.2.2 Worker Discovery (Employer Side)
- **FR-MATCH-01:** Advanced search with filters: location, worker type, experience, salary, availability, verification status, skills.
- **FR-MATCH-02:** Smart matching algorithm suggesting top 5–10 workers based on job requirements.
- **FR-MATCH-03:** Save favorites and shortlist workers.
- **FR-MATCH-04:** View worker profiles with anonymized contact details (show only first name, suburb, and verification badges until payment).

#### 4.2.3 Job Discovery (Worker Side)
- **FR-JDIS-01:** Browse and search job listings with filters.
- **FR-JDIS-02:** One-click "Apply" to matched jobs.
- **FR-JDIS-03:** Job alerts via SMS, WhatsApp, or push notification.

#### 4.2.4 Matching Algorithm Logic
- **FR-ALG-01:** Match score based on: location proximity, skill match, salary alignment, availability overlap, verification level.
- **FR-ALG-02:** Admin override capability for manual matches.
- **FR-ALG-03:** Feedback loop: learn from successful placements to improve future matches.

---

### 4.3 Chatbot & Communication

#### 4.3.1 AI Chatbot
- **FR-CHAT-01:** 24/7 chatbot for FAQs, registration guidance, and basic troubleshooting.
- **FR-CHAT-02:** Natural language understanding for common queries: "How do I hire a maid?", "What is the placement fee?", "How do I verify my account?"
- **FR-CHAT-03:** Handoff to human agent when confidence score < 70%.
- **FR-CHAT-04:** WhatsApp Business API integration for chatbot conversations.

#### 4.3.2 In-App Messaging
- **FR-MSG-01:** Secure messaging between employer and worker after match confirmation.
- **FR-MSG-02:** Message encryption at rest and in transit.
- **FR-MSG-03:** Admin visibility into all conversations for dispute resolution.
- **FR-MSG-04:** Automated system messages: match confirmations, payment reminders, verification updates.

---

### 4.4 Verification & Trust (KYC)

#### 4.4.1 Worker Verification Pipeline
- **FR-KYC-01:** Identity verification: upload National ID or Passport + selfie liveness check.
- **FR-KYC-02:** Address verification: upload utility bill or official letter.
- **FR-KYC-03:** Background check: integration with third-party service or internal checker assignment.
- **FR-KYC-04:** Reference checks: minimum 2 references with phone/email validation.
- **FR-KYC-05:** Training certification upload and validation.
- **FR-KYC-06:** Verification status dashboard for workers showing progress.
- **FR-KYC-07:** Admin review and approval workflow with notes and rejection reasons.

#### 4.4.2 Employer Verification
- **FR-KYC-08:** Basic identity verification for employers (ID upload + phone verification).
- **FR-KYC-09:** Optional: address verification for high-value placements.

---

### 4.5 Billing & Revenue Model

#### 4.5.1 Fee Structure
| Fee Type | Charged To | Trigger | Amount (TBD by Client) |
|----------|-----------|---------|------------------------|
| Placement Fee | Employer | Successful match / worker starts | TBD |
| Connection Fee | Worker | Successful job placement | TBD |
| Retainer Fee | Employer | Subscription / priority access | TBD (monthly/quarterly) |
| Refund | Either | Failed placement within guarantee period | Per policy |

#### 4.5.2 Payment Integration
- **FR-PAY-01:** Integration with **Paynow** (Zimbabwe online payments).
- **FR-PAY-02:** Integration with **EcoCash** (mobile money).
- **FR-PAY-03:** Support for credit/debit cards (future).
- **FR-PAY-04:** Secure payment processing with PCI-DSS compliance.
- **FR-PAY-05:** Payment confirmation receipts via SMS/email.

#### 4.5.3 Billing Features
- **FR-BILL-01:** Auto-invoice generation for all fee types.
- **FR-BILL-02:** Payment status tracking: pending, paid, failed, refunded.
- **FR-BILL-03:** Wallet/balance system for retainers and credits.
- **FR-BILL-04:** Refund workflow: request, approval, processing, and notification.
- **FR-BILL-05:** Financial reporting: daily, weekly, monthly revenue dashboards.
- **FR-BILL-06:** Payout management for connection fees (worker side).

---

### 4.6 Privacy & Security

- **FR-SEC-01:** **Encrypted contact details**: phone numbers and addresses hidden until match is confirmed and placement fee paid.
- **FR-SEC-02:** AES-256 encryption for sensitive data at rest.
- **FR-SEC-03:** TLS 1.3 for data in transit.
- **FR-SEC-04:** Role-based access control (RBAC): Admin, Verifier, Finance, Employer, Worker.
- **FR-SEC-05:** Data retention policy: auto-delete inactive accounts after 2 years (configurable).
- **FR-SEC-06:** Audit logs for all admin actions, payment events, and data access.
- **FR-SEC-07:** GDPR/Zimbabwe Data Protection Act compliance framework.

---

### 4.7 Admin Dashboard

- **FR-ADM-01:** Real-time placement metrics: daily, weekly, monthly counts.
- **FR-ADM-02:** Revenue dashboard with fee breakdown.
- **FR-ADM-03:** Verification queue management.
- **FR-ADM-04:** User management: search, suspend, verify, delete accounts.
- **FR-ADM-05:** Dispute resolution interface.
- **FR-ADM-06:** Content management: edit FAQs, terms, pricing, announcements.
- **FR-ADM-07:** Bulk SMS/Email notification tool.
- **FR-ADM-08:** Chatbot conversation logs and analytics.

---

## 5. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | **Performance** | Page load < 2s; search results < 1s; support 5,000 concurrent users |
| NFR-02 | **Availability** | 99.9% uptime; scheduled maintenance windows |
| NFR-03 | **Scalability** | Handle 1,000+ placements/month; 10,000+ active users |
| NFR-04 | **Security** | OWASP Top 10 compliance; annual penetration testing |
| NFR-05 | **Accessibility** | WCAG 2.1 Level AA compliance |
| NFR-06 | **Mobile-First** | Responsive design; PWA support; native apps (Phase 2) |
| NFR-07 | **Localization** | English primary; Shona/Ndebele support (Phase 2) |
| NFR-08 | **Backup & Recovery** | Daily automated backups; RTO < 4 hours; RPO < 1 hour |

---

## 6. User Stories

### 6.1 Employer Stories

| ID | As an... | I want to... | So that... | Acceptance Criteria |
|----|----------|--------------|------------|---------------------|
| US-EMP-01 | Employer | Register with my phone number | I can quickly create an account | OTP verification; account created in < 2 min |
| US-EMP-02 | Employer | Post a job with specific requirements | I attract the right workers | Job form with all required fields; live preview |
| US-EMP-03 | Employer | Search verified workers near me | I find trustworthy help fast | Filter by location, skills, verification; results in < 1s |
| US-EMP-04 | Employer | See worker verification badges | I know who is trustworthy | Badges visible: KYC, Background, Reference, Training |
| US-EMP-05 | Employer | Pay the placement fee online | I can unlock worker contact details | Paynow/EcoCash integration; instant unlock |
| US-EMP-06 | Employer | Chat with a matched worker | I can interview before hiring | Secure messaging opens after match confirmation |
| US-EMP-07 | Employer | Rate and review my worker | I help other employers decide | 5-star rating + text review; editable for 30 days |
| US-EMP-08 | Employer | Request a refund | I get my money back if placement fails | Refund form; admin approval; 7-day processing |

### 6.2 Worker Stories

| ID | As a... | I want to... | So that... | Acceptance Criteria |
|----|---------|--------------|------------|---------------------|
| US-WKR-01 | Worker | Create a detailed profile | Employers can find me | All fields editable; photo upload; skills checklist |
| US-WKR-02 | Worker | Upload my ID and certificates | I get verified and trusted | Document upload; status tracking; admin approval |
| US-WKR-03 | Worker | Browse available jobs | I can find work opportunities | Searchable listings; filter by location, salary, type |
| US-WKR-04 | Worker | Apply to a job with one click | I don't waste time | One-click apply; confirmation message |
| US-WKR-05 | Worker | Receive job alerts via WhatsApp | I never miss an opportunity | WhatsApp Business API; opt-in/opt-out |
| US-WKR-06 | Worker | Pay my connection fee | I can start working | EcoCash/Paynow; receipt generated; status updated |
| US-WKR-07 | Worker | Hide my contact details | Only serious employers reach me | Details hidden until match + fee paid |
| US-WKR-08 | Worker | See my verification status | I know what else I need to do | Progress bar; checklist; next steps |

### 6.3 Admin Stories

| ID | As an... | I want to... | So that... | Acceptance Criteria |
|----|----------|--------------|------------|---------------------|
| US-ADM-01 | Admin | View daily placement numbers | I can track growth toward 1,000/month | Dashboard with real-time counter; trend graphs |
| US-ADM-02 | Admin | Review and approve KYC documents | Only verified workers are listed | Document viewer; approve/reject with notes |
| US-ADM-03 | Admin | Process refund requests | I maintain customer trust | Refund queue; one-click approve/reject; auto-notification |
| US-ADM-04 | Admin | See all chatbot conversations | I can improve responses | Searchable logs; filter by date, topic, sentiment |
| US-ADM-05 | Admin | Generate monthly revenue reports | I understand business health | Export to PDF/Excel; breakdown by fee type |
| US-ADM-06 | Admin | Override automatic matches | I can handle special cases | Manual match interface; reason logging |

---

## 7. System Architecture (High-Level)

### 7.1 Architecture Diagram (Text)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Web App      │  │  Mobile PWA │  │  WhatsApp Chatbot       │ │
│  │  (React/Vue)  │  │  (Responsive)│  │  (WhatsApp Business API)│ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS / TLS 1.3
┌──────────────────────────▼──────────────────────────────────────┐
│                      API GATEWAY (Kong/AWS)                      │
│         • Rate Limiting • Authentication • Load Balancing        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                   APPLICATION SERVICES (K8s)                     │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐ │
│  │ Auth Service │ │ Matching     │ │ Billing Service        │ │
│  │ (JWT/OAuth2) │ │ Engine       │ │ (Paynow + EcoCash)     │ │
│  └──────────────┘ └──────────────┘ └────────────────────────┘ │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐ │
│  │ Chatbot      │ │ Verification │ │ Notification Service   │ │
│  │ (NLP/LLM)    │ │ Pipeline     │ │ (SMS, Email, WhatsApp) │ │
│  └──────────────┘ └──────────────┘ └────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐   │
│  │ PostgreSQL   │ │ Redis Cache  │ │ AWS S3 / MinIO         │   │
│  │ (Primary DB) │ │ (Sessions)   │ │ (Documents/Photos)     │   │
│  └──────────────┘ └──────────────┘ └────────────────────────┘   │
│  ┌──────────────┐ ┌──────────────┐                             │
│  │ Elasticsearch│ │ RabbitMQ     │                             │
│  │ (Search)     │ │ (Job Queue)  │                             │
│  └──────────────┘ └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Key Technology Stack Recommendations

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React + Tailwind CSS | Component-based, fast, mobile-first |
| **Mobile** | React Native (Phase 2) or PWA | Cost-effective, single codebase |
| **Backend** | Node.js (Express/NestJS) or Python (FastAPI) | Fast development, rich ecosystem |
| **Database** | PostgreSQL | ACID compliance, JSON support, scalable |
| **Cache** | Redis | Session management, fast lookups |
| **Search** | Elasticsearch | Full-text search, fuzzy matching, geo-search |
| **Queue** | RabbitMQ / AWS SQS | Async processing: payments, notifications, matching |
| **Chatbot** | OpenAI API / Rasa + WhatsApp Business API | NLP understanding, local deployment option |
| **Payments** | Paynow API + EcoCash API | Zimbabwe-native, trusted |
| **Hosting** | AWS / Azure / Local Cloud (Zim) | Scalable, reliable, local compliance |
| **CI/CD** | GitHub Actions + Docker + Kubernetes | Automated deployment, scaling |

---

## 8. Data Model (Simplified)

### 8.1 Core Entities

```
User
├── id (UUID)
├── role (enum: EMPLOYER, WORKER, ADMIN, VERIFIER)
├── phone (encrypted)
├── email (encrypted)
├── password_hash
├── status (ACTIVE, SUSPENDED, PENDING)
├── created_at, updated_at

EmployerProfile
├── user_id (FK)
├── full_name
├── location (city, suburb, coordinates)
├── household_size
├── preferences (JSON)
├── verification_status

WorkerProfile
├── user_id (FK)
├── full_name
├── date_of_birth
├── gender
├── location
├── skills[]
├── experience_years
├── expected_salary
├── availability (JSON)
├── bio
├── verification_status (PENDING, KYC, FULLY_VERIFIED)
├── contact_encrypted (boolean)

JobListing
├── id (UUID)
├── employer_id (FK)
├── title, description
├── worker_type (enum)
├── location
├── salary_range
├── requirements[]
├── status (DRAFT, ACTIVE, FILLED, EXPIRED)
├── created_at, expires_at

Match
├── id (UUID)
├── job_id (FK)
├── worker_id (FK)
├── status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
├── placement_fee_status
├── connection_fee_status
├── created_at, confirmed_at

VerificationRecord
├── id (UUID)
├── worker_id (FK)
├── type (KYC, BACKGROUND, REFERENCE, TRAINING)
├── status (PENDING, APPROVED, REJECTED)
├── documents[] (S3 URLs)
├── reviewer_notes
├── reviewed_by (FK to User)
├── created_at, reviewed_at

Payment
├── id (UUID)
├── match_id (FK, nullable)
├── user_id (FK)
├── type (PLACEMENT_FEE, CONNECTION_FEE, RETAINER, REFUND)
├── amount
├── currency (USD, ZWL)
├── gateway (PAYNOW, ECOCASH)
├── status (PENDING, SUCCESS, FAILED, REFUNDED)
├── transaction_reference
├── created_at, completed_at
```

---

## 9. Phased Implementation Plan

### Phase 1: MVP (Months 1–3) — "Go Digital"
- User registration & profiles (Employer + Worker)
- Basic job posting and worker discovery
- KYC upload and manual admin verification
- Paynow + EcoCash payment integration
- Placement fee & connection fee collection
- Encrypted contact details (unlock on payment)
- Basic admin dashboard
- **Target:** 200 placements/month

### Phase 2: Automation (Months 4–6) — "Scale"
- AI matching algorithm
- WhatsApp chatbot for FAQs and job alerts
- In-app messaging
- Retainer fee subscriptions
- Refund workflow automation
- Advanced analytics dashboard
- **Target:** 500 placements/month

### Phase 3: Optimization (Months 7–9) — "Dominate"
- Mobile native apps (iOS/Android)
- Background check API integrations
- Reference check automation
- Multi-language support (Shona, Ndebele)
- Advanced reporting & BI
- **Target:** 1,000+ placements/month

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Low digital literacy among workers | High | USSD fallback, WhatsApp-first interface, agent-assisted onboarding |
| Payment gateway downtime | High | Dual gateway (Paynow + EcoCash); offline payment reconciliation |
| Fake profiles / fraud | High | Multi-layer verification, photo liveness, admin review |
| Data privacy breaches | Critical | Encryption, RBAC, regular audits, compliance with Data Protection Act |
| Platform adoption slow | Medium | Onboarding incentives, referral bonuses, free first placement promo |
| Internet connectivity issues | Medium | Offline-capable PWA, SMS notifications, low-bandwidth mode |

---

## 11. Success Metrics (KPIs)

| Metric | Baseline | Phase 1 | Phase 2 | Phase 3 |
|--------|----------|---------|---------|---------|
| Placements/Month | 180 | 200 | 500 | 1,000+ |
| Avg. Time-to-Hire | 7 days | 5 days | 3 days | 1–2 days |
| Call Volume Reduction | 0% | 30% | 60% | 70%+ |
| User Registration (Monthly) | N/A | 500 | 1,500 | 3,000+ |
| Payment Success Rate | N/A | 85% | 92% | 95%+ |
| Worker Verification Rate | Manual | 60% | 80% | 90%+ |
| Customer Satisfaction (NPS) | N/A | 50 | 60 | 70+ |

---

## 12. Appendices

### Appendix A: Glossary
- **KYC:** Know Your Customer — identity verification process
- **Placement Fee:** Fee charged to employer upon successful worker placement
- **Connection Fee:** Fee charged to worker upon successful job placement
- **Retainer Fee:** Recurring subscription fee for priority employer access
- **PWA:** Progressive Web App — mobile-optimized web application

### Appendix B: References
- Zimbabwe Maids Centre marketing materials (uploaded images)
- ILO Domestic Workers Training Centre, Harare
- Zimbabwe Data Protection Act compliance requirements
- Paynow API Documentation
- EcoCash Merchant API Documentation

---

**End of Document**

*Prepared for Zimbabwe Maids Centre. This document is confidential and proprietary.*

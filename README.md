# LeadFlow AI — AI-Powered B2B Sales & Customer Engagement Platform

LeadFlow AI is an enterprise-grade B2B sales intelligence and customer engagement platform built specifically for Account Executives, Sales Managers, and Business Development teams at SaaS and CPaaS (Communication Platform as a Service) companies.

The platform bridges the gap between technical communication infrastructure and consultative B2B deal execution—guiding sales professionals through requirement extraction, qualification scoring, catalog solution matching, multi-channel pitch generation, and predictive pipeline forecasting.

---

## 1. Problem Statement

In enterprise B2B sales (specifically within telecom and cloud communication services):
- **Unstructured Inbound Requirements:** Prospective clients submit vague briefs like *"Need 50k OTPs with WhatsApp order alerts"*, making it slow for reps to map the right carrier routes and compliance requirements.
- **Inaccurate Lead Qualification:** Sales representatives frequently waste time on low-margin or high-churn leads rather than prioritizing high-volume, high-intent accounts.
- **Fragmented Outreach:** Crafting customized messages across Email, WhatsApp, and LinkedIn that address specific delivery SLAs, latency bottlenecks, and regulatory DLT compliance is time-consuming.
- **Pipeline Blindspots:** Sales managers struggle to accurately forecast monthly target attainment due to subjective deal probability assessments.

---

## 2. Solution Overview

LeadFlow AI structures the complete enterprise sales lifecycle:
```
Potential Client Inquiry
        ↓
Lead Ingestion
        ↓
AI Requirement Extraction (NLP)
        ↓
AI Lead Qualification & Scoring (0–100)
        ↓
Hybrid Solution Matching (CPaaS Catalog)
        ↓
Personalized Multi-Tone Outreach (Email/LinkedIn/WhatsApp)
        ↓
Meeting Scheduling & Follow-up Cadence
        ↓
Kanban Pipeline Progression
        ↓
AI Sales Forecasting & ML Conversion Predictions
```

---

## 3. Key Modules & Features

### Core Workspace
- **Executive Sales Dashboard:** Real-time KPI cards (Total Leads, Qualified Leads, Active Pipeline, Won Revenue, Win Rate, Quota Achievement) with interactive Recharts visualizations (Funnel, Revenue Trend, Pipeline by Stage, Industry breakdown, Channel performance).
- **Smart AI Daily Sales Assistant:** Automatically summarizes the rep's morning agenda: follow-ups due today, scheduled discovery calls, top priority hot deals to contact before noon.
- **Lead Management (105+ Synthetic Leads):** Complete search, multi-filter (industry, stage, priority, source), pagination, sorting, and CSV import/export.
- **Lead 360° Profile:** Deep-dive modal with company background, primary contacts, business requirement, AI scoring breakdown, communication audit trail, and scheduled discovery demos.
- **Kanban Sales Pipeline:** Drag-and-drop opportunity board across 8 standardized stages: `NEW` → `CONTACTED` → `QUALIFIED` → `MEETING` → `PROPOSAL` → `NEGOTIATION` → `WON` → `LOST` with automatic weighted pipeline calculation.
- **Customer Accounts (360°):** Multi-contact account management connecting contacts, leads, deals, and engagement history.
- **Scheduled Meetings:** Triage Discovery Calls, Technical Architecture Reviews, and Pricing Discussions with attendee tracking.
- **Follow-up Engine:** Zero-dropped-lead accountability engine tracking Overdue, Due Today, and Upcoming touches.

### AI & CPaaS Sales Tools
- **AI Requirement Analyzer Studio:** Natural language NLP engine powered by Gemini 3.8 Flash with structured JSON schemas extracting:
  - Industry Sector & Business Model
  - Customer Pain Points
  - Required Telecom Channels (SMS, WhatsApp, Voice, Email)
  - Estimated Traffic Volume (Low, Medium, High, Enterprise)
  - Buying Intent & Urgency
  - Recommended Account Executive Action
- **AI Multi-Tone Pitch Generator:** Produces customized outreach copy for Cold Email, Follow-up Email, LinkedIn InMail, WhatsApp Business, Meeting Invites, and Proposal Follow-ups across 5 selectable tones (*Consultative*, *Professional*, *Persuasive*, *Friendly*, *Concise*) with inline editing and simulated dispatch tracking.
- **CPaaS Solutions Catalog (9 Products):**
  1. **SMS API:** Tier-1 carrier routes with real-time DLR.
  2. **OTP Messaging:** Sub-5s delivery SLA with automatic voice fallback.
  3. **WhatsApp Business Communication:** Meta-verified rich media and interactive button notifications.
  4. **Transactional Messaging:** Event-driven billing and status webhook engine.
  5. **Promotional Messaging:** DND-compliant seasonal campaign blaster.
  6. **Cloud Communication:** Virtual phone number privacy masking and PBX.
  7. **AI Voice Agent:** Autonomous 24/7 conversational calling bot.
  8. **Communication Automation:** Visual customer lifecycle workflow orchestrator.
  9. **Omnichannel Messaging:** Unified single-API communication platform.

### Analytics & Intelligence
- **Sales Targets & Quota Management:** Track individual rep quotas and team targets with visual progress bars.
- **AI Sales Forecasting:** Predicts expected month-end revenue, quota attainment probabilities, and pipeline gaps.
- **Machine Learning Conversion Prediction:** Calibrated multivariate logistic regression classifier evaluating deals with synthetic test metrics:
  - Accuracy: `86.4%`
  - Precision: `84.1%`
  - Recall: `88.2%`
  - F1-Score: `86.1%`
  - ROC-AUC: `0.912`
- **Root Cause Loss Analytics:** Postmortem breakdown of lost deals (pricing sensitivity, in-house legacy gateways, DLT delays).

### Evaluation & Demonstration
- **Guided Interview Demo Journey (NovaCart):** An interactive 10-step guided sales scenario walking an interviewer through the full customer lifecycle.
- **Automated QA Test Suite:** Built-in runner testing entity integrity, AI endpoints, scoring formulas, and pipeline state machines.
- **Global Search (Cmd+K / Ctrl+K):** Instant modal search across leads, companies, contacts, and opportunities.

---

## 4. Architecture

```
User (Browser)
      ↓
Next.js / Vite React SPA (Tailwind CSS, Lucide Icons, Recharts)
      ↓
Full-Stack Express REST API Layer (`server.ts`)
      ↓
   ┌────────────────────────────────────────┐
   │ Service Layer                          │
   │ ├─ aiService.ts (GoogleGenAI + Rules)  │
   │ ├─ mlService.ts (Scikit-Learn Weights) │
   │ └─ db.ts (Relational In-Memory Store)  │
   └────────────────────────────────────────┘
      ↓
External Integrations (Simulated Channels: SMS, WhatsApp, Email, Calendar)
```

---

## 5. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Backend:** Express, Node.js (`tsx`), REST APIs.
- **AI Engine:** Google Gemini SDK (`@google/genai` via model `gemini-3.8-flash`) with structured JSON schema extraction and intelligent domain fallback.
- **Machine Learning:** Scikit-learn style calibrated logistic scoring with normalized feature contributions.
- **Testing:** Automated integration test suite (`/api/tests/run`).

---

## 6. Demo User Roles & Credentials

Switch roles instantly via the top-right profile menu:

| Role | User Name | Demo Email | Target Quota | Title |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Aditi Sharma | `admin@leadflow.demo` | ₹50.0L | VP of Global Sales & Operations |
| **Sales Manager** | Rajesh Kulkarni | `manager@leadflow.demo` | ₹35.0L | B2B Sales Director - Enterprise CPaaS |
| **Sales Executive** | Ammar Khan | `sales@leadflow.demo` | ₹15.0L | Enterprise Account Executive |
| **Sales Executive** | Priya Iyer | `priya@leadflow.demo` | ₹12.0L | Senior Business Development Representative |

---

## 7. Environment Variables (`.env.example`)

```env
# GEMINI_API_KEY: Required for Gemini AI API calls.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The hosting URL of the application.
APP_URL="MY_APP_URL"

PORT="3000"
NODE_ENV="development"
```

---

## 8. Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the full-stack development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 9. Ethical Disclosure & Synthetic Data Disclaimer

- **Simulated Communications:** All SMS, WhatsApp, email, and phone calls within the outreach timeline are demo simulations. No actual carrier messages are dispatched unless configured with production telecom gateways.
- **Synthetic Data:** The 105+ leads, 30+ companies, and 50+ contacts represent realistic yet completely fictional entities created for demonstration purposes.
- **ML Evaluation:** The model performance metrics (86.4% Accuracy, 0.912 ROC-AUC) were calibrated on synthetic B2B communication dataset distributions.

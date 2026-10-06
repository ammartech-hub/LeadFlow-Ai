# 🚀 LeadFlow AI — AI-Powered B2B Sales & Customer Engagement Platform

**LeadFlow AI** is an enterprise-grade **B2B sales intelligence and customer engagement platform** designed for Account Executives, Sales Managers, and Business Development teams in **SaaS and CPaaS (Communication Platform as a Service)** companies.

It bridges the gap between technical communication infrastructure and consultative B2B sales by helping teams with **AI-powered requirement extraction, lead qualification, solution matching, personalized outreach, pipeline management, and sales forecasting**.

---

## 📌 Problem Statement

Enterprise B2B sales teams often face challenges such as:

- 📝 **Unstructured Requirements** — Customers provide vague requirements such as *"Need 50k OTPs with WhatsApp order alerts."*
- 🎯 **Inaccurate Lead Qualification** — Sales representatives may spend time on low-value or low-intent leads.
- 📧 **Fragmented Outreach** — Creating personalized Email, WhatsApp, and LinkedIn messages for every prospect is time-consuming.
- 📊 **Pipeline Blindspots** — Managers often rely on subjective deal probabilities when forecasting revenue.
- 🔄 **Disconnected Sales Processes** — Lead information, communication history, meetings, and opportunities are often scattered across different systems.

---

# 💡 Solution

LeadFlow AI provides a unified AI-powered workspace covering the complete B2B sales lifecycle:

```text
Potential Client Inquiry
        ↓
Lead Ingestion
        ↓
AI Requirement Extraction
        ↓
AI Lead Qualification & Scoring
        ↓
CPaaS Solution Matching
        ↓
Personalized Multi-Channel Outreach
        ↓
Meeting Scheduling & Follow-ups
        ↓
Kanban Sales Pipeline
        ↓
AI Sales Forecasting
        ↓
ML Conversion Prediction
```

---

# ✨ Key Features

## 📊 1. Executive Sales Dashboard

Provides real-time visibility into:

- Total Leads
- Qualified Leads
- Active Pipeline
- Won Revenue
- Win Rate
- Quota Achievement
- Revenue Trends
- Pipeline by Stage
- Industry Breakdown
- Channel Performance

Interactive visualizations are built using **Recharts**.

---

## 🤖 2. AI Sales Assistant

The AI Sales Assistant helps sales representatives start their day with a prioritized agenda.

It highlights:

- Follow-ups due today
- Scheduled discovery calls
- High-priority opportunities
- Hot deals requiring immediate attention
- Recommended actions

---

## 👥 3. Lead Management

LeadFlow AI includes **105+ synthetic leads** with:

- Search
- Multi-filtering
- Industry filtering
- Stage filtering
- Priority filtering
- Source filtering
- Pagination
- Sorting
- CSV Import/Export

---

## 🔎 4. Lead 360° Profile

Each lead includes a detailed profile containing:

- Company information
- Primary contacts
- Business requirements
- AI qualification score
- Score breakdown
- Communication history
- Scheduled meetings
- Discovery demo information

---

## 📌 5. Kanban Sales Pipeline

Opportunities can be managed using a drag-and-drop Kanban board.

### Sales Stages

```text
NEW
 ↓
CONTACTED
 ↓
QUALIFIED
 ↓
MEETING
 ↓
PROPOSAL
 ↓
NEGOTIATION
 ↓
WON / LOST
```

The system also calculates **weighted pipeline value automatically**.

---

# 🤖 AI & CPaaS Sales Tools

## 🧠 AI Requirement Analyzer

The AI Requirement Analyzer converts natural-language customer requirements into structured sales intelligence.

It extracts:

- Industry Sector
- Business Model
- Customer Pain Points
- Required Communication Channels
- Traffic Volume
- Buying Intent
- Urgency
- Recommended Sales Action

### Supported Channels

```text
SMS
WhatsApp
Voice
Email
```

The analyzer uses **structured JSON schema extraction** for consistent results.

---

# ✉️ AI Multi-Tone Pitch Generator

Generate personalized outreach messages for:

- Cold Emails
- Follow-up Emails
- LinkedIn InMail
- WhatsApp Business
- Meeting Invitations
- Proposal Follow-ups

### Available Tones

| Tone | Purpose |
|---|---|
| Consultative | Solution-focused communication |
| Professional | Formal enterprise communication |
| Persuasive | Conversion-oriented messaging |
| Friendly | Relationship-focused outreach |
| Concise | Short and direct communication |

Generated content can be edited before simulated dispatch.

---

# 📡 CPaaS Solutions Catalog

LeadFlow AI includes a catalog of **9 CPaaS solutions**:

| # | Product | Description |
|---|---|---|
| 1 | SMS API | Tier-1 carrier routes with real-time DLR |
| 2 | OTP Messaging | Sub-5-second delivery with voice fallback |
| 3 | WhatsApp Business | Rich media and interactive notifications |
| 4 | Transactional Messaging | Event-driven messaging and webhook engine |
| 5 | Promotional Messaging | DND-compliant campaign messaging |
| 6 | Cloud Communication | Virtual numbers, privacy masking and PBX |
| 7 | AI Voice Agent | 24/7 conversational calling assistant |
| 8 | Communication Automation | Visual customer lifecycle workflows |
| 9 | Omnichannel Messaging | Unified communication API |

---

# 📈 Analytics & Sales Intelligence

## 🎯 Sales Targets & Quota Management

Track:

- Individual sales targets
- Team quotas
- Revenue achievement
- Progress toward targets
- Pipeline gaps

---

## 🔮 AI Sales Forecasting

The platform predicts:

- Expected month-end revenue
- Quota attainment probability
- Pipeline gaps
- Expected conversion outcomes

---

# 🧪 Machine Learning Conversion Prediction

LeadFlow AI uses a **calibrated logistic regression-style scoring model** to estimate deal conversion probability.

### Evaluation Metrics

| Metric | Score |
|---|---:|
| Accuracy | **86.4%** |
| Precision | **84.1%** |
| Recall | **88.2%** |
| F1 Score | **86.1%** |
| ROC-AUC | **0.912** |

> ⚠️ These metrics are based on synthetic B2B communication dataset distributions and are intended for demonstration purposes.

---

# 📉 Root Cause Loss Analytics

The platform analyzes lost opportunities and identifies potential causes such as:

- Pricing Sensitivity
- Existing In-House Gateways
- DLT/Compliance Delays
- Product Mismatch
- Low Customer Intent

This helps sales managers identify recurring problems in the sales process.

---

# 🧪 Evaluation & Demonstration

## 🎬 Guided Interview Demo — NovaCart

LeadFlow AI includes an interactive **10-step guided sales journey** demonstrating the complete customer lifecycle.

The demo covers:

```text
Lead Creation
      ↓
Requirement Analysis
      ↓
Qualification
      ↓
Solution Matching
      ↓
Outreach
      ↓
Meeting
      ↓
Proposal
      ↓
Negotiation
      ↓
Conversion
      ↓
Forecasting
```

---

## 🧪 Automated QA Test Suite

The application includes a built-in test runner for validating:

- Entity integrity
- AI endpoints
- Lead scoring formulas
- Pipeline state transitions
- API functionality

---

# 🔍 Global Search

Use:

```text
Ctrl + K
```

or

```text
Cmd + K
```

to quickly search across:

- Leads
- Companies
- Contacts
- Opportunities

---

# 🏗️ System Architecture

```text
                     ┌─────────────────────┐
                     │       User          │
                     │      Browser        │
                     └──────────┬──────────┘
                                │
                                ▼
                 ┌──────────────────────────┐
                 │ React / Next.js Frontend │
                 │ TypeScript + Tailwind   │
                 │ Recharts + Lucide       │
                 └────────────┬─────────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │   Express REST API       │
                 │       server.ts          │
                 └────────────┬─────────────┘
                              │
              ┌───────────────┼────────────────┐
              ▼               ▼                ▼
       ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
       │ AI Service  │ │ ML Service  │ │ Database    │
       │ Gemini API  │ │ ML Scoring  │ │ Data Store  │
       └─────────────┘ └─────────────┘ └─────────────┘
              │               │                │
              └───────────────┼────────────────┘
                              ▼
                 ┌──────────────────────────┐
                 │ External Integrations    │
                 │ SMS / WhatsApp / Email   │
                 │ Calendar / Communication │
                 └──────────────────────────┘
```

---

# 🛠️ Technology Stack

### Frontend

- React 19
- TypeScript
- Tailwind CSS
- Lucide Icons
- Recharts

### Backend

- Node.js
- Express.js
- TypeScript
- `tsx`
- REST APIs

### Artificial Intelligence

- Google Gemini API
- `@google/genai`
- Structured JSON Schema
- NLP-based requirement extraction
- AI sales recommendations

### Machine Learning

- Logistic Regression-style scoring
- Feature normalization
- Calibrated conversion prediction
- Synthetic B2B sales dataset

### Testing

- Automated integration testing
- API endpoint testing
- Entity validation
- Pipeline state validation

---

# 👤 Demo User Roles

You can switch between demo roles using the profile menu.

| Role | User | Email | Target Quota | Position |
|---|---|---|---:|---|
| Admin | Aditi Sharma | `admin@leadflow.demo` | ₹50.0L | VP of Global Sales & Operations |
| Sales Manager | Rajesh Kulkarni | `manager@leadflow.demo` | ₹35.0L | B2B Sales Director – Enterprise CPaaS |
| Sales Executive | Ammar Khan | `sales@leadflow.demo` | ₹15.0L | Enterprise Account Executive |
| Sales Executive | Priya Iyer | `priya@leadflow.demo` | ₹12.0L | Senior Business Development Representative |

---

# ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

APP_URL="YOUR_APP_URL"

PORT="3000"

NODE_ENV="development"
```

> 🔐 Never commit your actual API key or `.env` file to GitHub.

Add this to `.gitignore`:

```gitignore
.env
.env.local
.env.*.local
node_modules/
dist/
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

```bash
cd leadflow-ai
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create `.env`:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
PORT="3000"
NODE_ENV="development"
```

## 4. Start Development Server

```bash
npm run dev
```

## 5. Open the Application

```text
http://localhost:3000
```

---

# 📁 Project Structure

```text
leadflow-ai/
│
├── client/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── server/
│   ├── server.ts
│   ├── aiService.ts
│   ├── mlService.ts
│   └── db.ts
│
├── public/
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

> The exact directory structure may vary depending on the current implementation.

---

# 🔐 Ethical Disclosure & Synthetic Data

### Simulated Communications

All SMS, WhatsApp, email, and phone communication shown inside the platform is **simulated for demonstration purposes**.

No real carrier messages are dispatched unless production telecom integrations are configured.

### Synthetic Data

The application contains:

- 105+ synthetic leads
- 30+ fictional companies
- 50+ fictional contacts

All entities are created for demonstration and testing purposes.

### ML Metrics

The reported ML metrics were evaluated on **synthetic B2B communication dataset distributions** and should not be interpreted as production-world performance.

---

# 🎯 Target Users

LeadFlow AI is designed for:

- 👨‍💼 Account Executives
- 📊 Sales Managers
- 🤝 Business Development Representatives
- 🏢 Enterprise Sales Teams
- 📡 CPaaS Companies
- ☁️ SaaS Companies
- 📈 Revenue Operations Teams

---

# 🌟 Why LeadFlow AI?

LeadFlow AI combines **CRM + AI + CPaaS Solution Intelligence + Sales Automation + Predictive Analytics** into one platform.

Instead of simply storing leads, the platform helps sales teams answer:

> **Who should I contact?**

> **What does the customer actually need?**

> **Which CPaaS solution should I recommend?**

> **What should I say to the customer?**

> **Which deals are most likely to close?**

> **Will we achieve our sales target?**

---

# 📌 Future Enhancements

- 🔗 Real CRM integrations
- 📱 Production WhatsApp Business API
- 📧 Real email delivery
- 📲 SMS gateway integration
- 🗓️ Google Calendar integration
- 🗄️ PostgreSQL / Supabase persistence
- 🔐 Enterprise authentication & RBAC
- 📊 Advanced BI dashboards
- 🧠 More advanced ML models
- ☁️ Production cloud deployment
- 🔔 Automated notifications
- 💬 AI-powered conversational sales assistant

---

# 👨‍💻 Project

**LeadFlow AI — AI-Powered B2B Sales & Customer Engagement Platform**

Built with **React, TypeScript, Node.js, Express, Google Gemini, Machine Learning, Tailwind CSS, and Recharts**.

---

## 📄 License

This project is intended primarily for **educational, portfolio, demonstration, and interview purposes**.

---

⭐ **If you find this project interesting, consider giving the repository a star!**

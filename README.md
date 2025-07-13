# OK Federal & State Tax Calculator

A simple FastAPI + React application to calculate estimated **federal**, **Oklahoma state**, and **FICA** taxes based on a user's income, filing status, pay schedule, and optional overage percentage for extra withholding.

---

## 📌 Features

- Calculates:
  - Federal tax
  - Oklahoma state tax
  - FICA (Social Security & Medicare)
- Supports:
  - Single / Married filing statuses
  - Common paycheck frequencies: monthly, semi-monthly, biweekly, weekly
  - Overage withholding percentage (e.g., for saving or offsetting future tax surprises)
- Built with:
  - [FastAPI](https://fastapi.tiangolo.com/) backend (Python)
  - [React](https://reactjs.org/) frontend (JavaScript)

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js (v18+ recommended)
- `pip`, `npm`, or `yarn` installed

---

## ⚙️ Backend Setup (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
By default, backend runs on: http://localhost:8000

You can visit http://localhost:8000/docs to test the /calculate endpoint.

💻 Frontend Setup (React)
bash
Copy
Edit
cd frontend
npm install
npm start
By default, frontend runs on: http://localhost:3000

🧪 Example Request
POST http://localhost:8000/calculate

json
Copy
Edit
{
  "income": 120000,
  "filing_status": "single",
  "state": "OK",
  "paychecks_per_year": 26,
  "overage_percent": 0.05
}
📦 JSON Response
json
Copy
Edit
{
  "Federal Tax": 18000,
  "State Tax": 3200,
  "FICA Tax": 9180,
  "Total Tax": 30380,
  "Per Paycheck Withholding (Break-even)": 1168.46,
  "Per Paycheck Withholding (+Overage)": 1226.88
}
🛠 Project Structure
bash
Copy
Edit
OK_Fed_&_State_Tax_Calculator/
├── backend/
│   └── main.py           # FastAPI app
│   └── tax_utils.py      # Tax logic
├── frontend/
│   └── App.js            # React UI
├── README.md
📜 License
MIT © 2025 – Thomas Couch

yaml
Copy
Edit

---

Let me know if you'd like a split version with instructions per subdirectory (`frontend` and `backend`), or if you plan to deploy it so I can help with production info (like Docker, Heroku, etc).

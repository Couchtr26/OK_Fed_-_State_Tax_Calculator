import React, { useState } from "react";

export default function App() {
  const [income, setIncome] = useState("");
  const [filingStatus, setFilingStatus] = useState("single");
  const [state, setState] = useState("OK");
  const [paychecks, setPaychecks] = useState(26);
  const [overagePercent, setOveragePercent] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function calculate() {
    if (!income || income <= 0) {
      alert("Please enter a valid income");
      return;
    }
    setLoading(true);

    try {
      const payload = {
        income: parseFloat(income),
        filing_status: filingStatus,
        state: state,
        paychecks_per_year: paychecks,
        overage_percent: overagePercent / 100,
      };

      console.log("Sending payload:", payload);

      const res = await fetch("http://localhost:8000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Server returned error: ${res.status} - ${err}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      alert("Failed to calculate. Is the backend running?");
      console.error(e);
    }

  return (
    <div style={{ maxWidth: 480, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>W-2 Tax Withholding Calculator</h1>
      <label>
        Gross Annual Income:
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          style={{ width: "100%", margin: "8px 0" }}
          placeholder="e.g. 120000"
        />
      </label>
      <label>
        Filing Status:
        <select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)} style={{ width: "100%", margin: "8px 0" }}>
          <option value="single">Single</option>
          <option value="married">Married Filing Jointly</option>
        </select>
      </label>
      <label>
        State:
        <select value={state} onChange={(e) => setState(e.target.value)} style={{ width: "100%", margin: "8px 0" }}>
          <option value="OK">Oklahoma</option>
          {/* Add other states here if you want */}
        </select>
      </label>
      <label>
        Paychecks per Year:
        <select value={paychecks} onChange={(e) => setPaychecks(parseInt(e.target.value))} style={{ width: "100%", margin: "8px 0" }}>
          <option value={12}>Monthly (12)</option>
          <option value={24}>Semi-Monthly (24)</option>
          <option value={26}>Biweekly (26)</option>
          <option value={52}>Weekly (52)</option>
        </select>
      </label>
      <label>
        Overage Percentage (%):
        <input
          type="number"
          value={overagePercent}
          onChange={(e) => setOveragePercent(parseFloat(e.target.value))}
          style={{ width: "100%", margin: "8px 0" }}
          min="0"
          step="0.1"
          placeholder="e.g. 5"
        />
      </label>
      <button onClick={calculate} disabled={loading} style={{ width: "100%", padding: "12px", marginTop: 12 }}>
        {loading ? "Calculating..." : "Calculate"}
      </button>

      {result && (
        <div style={{ marginTop: 20, padding: 12, border: "1px solid #ccc", borderRadius: 6 }}>
          <h2>Results</h2>
          <p>Federal Tax: ${result["Federal Tax"].toLocaleString()}</p>
          <p>State Tax: ${result["State Tax"].toLocaleString()}</p>
          <p>FICA Tax: ${result["FICA Tax"].toLocaleString()}</p>
          <p><b>Total Tax:</b> ${result["Total Tax"].toLocaleString()}</p>
          <p>Per Paycheck Withholding (Break-even): ${result["Per Paycheck Withholding (Break-even)"].toLocaleString()}</p>
          <p>Per Paycheck Withholding (+Overage): ${result["Per Paycheck Withholding (+Overage)"].toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
           
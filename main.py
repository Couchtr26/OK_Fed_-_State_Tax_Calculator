from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

app = FastAPI()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )

@app.get("/")
def root():
    return {"status": "API is alive"}

#Allow CORS for local dev or deploayable frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaxRequest(BaseModel):
    income: float
    filing_status: str
    state: str
    paychecks_per_year: int
    overage_percent: float

#Federal tax for filing brackets
FEDERAL_BRACKETs = {
    "single": [
        (0, 0.10),
        (11000, 0.12),
        (44725, 0.22),
        (95375, 0.24),
        (182100, 0.32),
        (231250, 0.35),
        (578125, 0.37)
    ],
    "married": [
        (0, 0.10),
        (22000, 0.12),
        (89450, 0.22),
        (190750, 0.24),
        (364200, 0.32),
        (462500, 0.35),
        (693750, 0.37)
    ]
}

STANDARD_DEDUCTION = {
    "single": 13950,
    "married":27900
}

#State Brackets
OK_BRACKETS = [
    (0, 0.0),
    (1000, 0.01),
    (2500, 0.02),
    (3750, 0.03),
    (4900, 0.04),
    (7200, 0.05),
    (float('inf'), 0.05)
]

SS_RATE = 0.062
SS_WAGE_LIMIT = 160200
MEDICARE_RATE = 0.0145

def calc_tax_brackets(taxable_income, brackets):
    tax = 0.0
    for i in range(len(backets)):
        limit, rate = brackets[i]
        next_limit = brackets[i+1][0] if i+1 < len(brackets) else None
        if taxable_income > limit:
            taxable_at_this_rate = (min(taxable_income, next_limit) - limit) if next_limit else (taxable_income - limit)
            if taxable_at_this_rate > 0:
                tax += taxable_at_this_rate * rate
        else:
            break
    return tax

#@app.post("/calculate")
#def calculate_tax(req: TaxRequest):
    #income = req.income
    #filing_status = req.filing_status.lower()
    #paychecks_per_year = req.paychecks_per_year
    #overage_percent = req.overage_percent

    #standard_deduction = STANDARD_DEDUCTION.get(filing_status, 13950)
    #fed_brackets = FEDERAL_BRACKETS.get(filing_status, FEDERAL_BRACKETS["single"])

    #taxable_fed = max(0, income - standard_deduction)
    #federal_tax = calc_tax_brackets(taxable_fed, fed_brackets)

    #taxable_state = max(0, income - standard_deduction)
    #state_tax = calc_tax_brackets(taxable_state, OK_BRACKETS)

    #ss_taxable = min(income, SS_WAGE_LIMIT)
    #ss_tax = ss_taxable * SS_RATE
    #medicare_tax = income * MEDICARE_RATE
    #fica_tax = ss_tax + medicare_tax

    #total_tax = federal_tax + state_tax + fica_tax

    #base_withholding = total_tax / paychecks_per_year
    #overage_withholding = base_withholding * (1 + overage_percent)

    #return {
        #"Federal Tax": round(federal_tax, 2),
        #"State Tax": round(state_tax, 2), 
        #"FICA Tax": round(fica_tax, 2),
        #"Total Tax": round(total_tax, 2),
        #"Per Paycheck Withholding (Break-even)": round(base_withholding, 2),
        #"Per Paycheck Withholding (+Overage)": round(overage_withholding, 2)
#}
 
      
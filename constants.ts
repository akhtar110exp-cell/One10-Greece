
export const EXTERNAL_PORTAL_URL = "https://schedule.cf-grcon-isl-pakistan.com/schedule/grcon-isl-pakistan/National_visa_for_WORK";
export const CREATE_ACCOUNT_URL = "https://schedule.cf-grcon-isl-pakistan.com/users/new/grcon-isl-pakistan?after=%2Fschedule%2Fgrcon-isl-pakistan%2FWORK_National_VISA&return=%2Fschedule%2Flogin%2Fgrcon-isl-pakistan%2FWORK_National_VISA";
export const LOGIN_URL = "https://schedule.cf-grcon-isl-pakistan.com/schedule/login/grcon-isl-pakistan/WORK_National_VISA";
export const GMAIL_GENERATOR_URL = "https://mailmeteor.com/tools/gmail-generator";
export const ATOMIC_MAIL_URL = "https://atomicmail.io/app/auth/sign-up";

export const PORTAL_USER = "ONE10_GLOBAL";
export const PORTAL_PASSWORD = "Life@1122";

export const REGION_LIST = [
  "ΑΓΙΟΣ ΝΙΚΟΛΑΟΣ", "ΑΓΡΙΝΙΟ", "ΑΘΗΝΑ", "ΑΛΕΞΑΝΔΡΟΥΠΟΛΗ", "ΑΜΦΙΣΣΑ", "ΑΡΓΟΣΤΟΛΙ", 
  "ΑΡΤΑ", "ΒΑΘΥ ΣΑΜΟΥ", "ΒΕΡΟΙΑ", "ΒΟΛΟΣ", "ΓΡΕΒΕΝΑ", "ΔΡΑΜΑ", "ΕΔΕΣΣΑ", 
  "ΕΡΜΟΥΠΟΛΗ ΣΥΡΟΥ", "ΖΑΚΥΝΘΟΣ", "ΗΓΟΥΜΕΝΙΤΣΑ", "ΗΡΑΚΛΕΙΟ", "ΘΕΣΣΑΛΟΝΙΚΗ", 
  "Ι.Π. ΜΕΣΟΛΟΓΓΙΟΥ", "ΙΩΑΝΝΙΝΑ", "ΚΑΒΑΛΑ", "ΚΑΛΑΜΑΤΑ", "ΚΑΡΔΙΤΣΑ", "ΚΑΡΠΕΝΗΣΙ", 
  "ΚΑΣΤΟΡΙΑ", "ΚΑΤΕΡΙΝΗ", "ΚΕΡΚΥΡΑ", "ΚΙΛΚΙΣ", "ΚΟΖΑΝΗ", "ΚΟΜΟΤΗΝΗ", "ΚΟΡΙΝΘΟΣ", 
  "ΛΑΜΙΑ", "ΛΑΡΙΣΑ", "ΛΕΥΚΑΔΑ", "ΛΙΒΑΔΕΙΑ", "ΜΥΤΙΛΗΝΗ", "ΝΑΥΠΑΚΤΟΣ", "ΝΑΥΠΛΙΟ", 
  "ΞΑΝΘΗ", "ΠΑΛΛΗΝΗ", "ΠΑΤΡΑ", "ΠΕΙΡΑΙΑΣ", "ΠΟΛΥΓΥΡΟΣ", "ΠΡΕΒΕΖΑ", "ΠΥΡΓΟΣ", 
  "ΡΕΘΥΜΝΟ", "ΡΟΔΟΣ", "ΣΕΡΡΕΣ", "ΣΠΑΡΤΗ", "ΤΡΙΚΑΛΑ", "ΤΡΙΠΟΛΗ", "ΦΛΩΡΙΝΑ", 
  "ΧΑΛΚΙΔΑ", "ΧΑΝΙΑ", "ΧΙΟΣ"
];

export const SYSTEM_INSTRUCTION = `
You are a high-precision OCR engine for Greek Visa documents.
Extract details for Tampermonkey scripts.

Return ONLY valid JSON.

CRITICAL NAME FORMATTING:
From the Passport, find "Given Name(s)" and "Surname". 
Combine them as: [GIVEN NAME] [SURNAME]
Example: If Surname is "YASIR" and Given Name is "AMMAR", you MUST return "AMMAR YASIR".
All names must be strictly UPPERCASE.

Required JSON Structure:
{
    "phone": "",
    "mobile": "",
    "fullName": "GIVEN NAME SURNAME (UPPERCASE)",
    "greekDecisionNumber": "Exactly (AM{number}){year}/{number}. Example: (AM354245)2025/25290",
    "employerName": "Employer Name in English/Latin characters",
    "regionOfEmployment": "Pick the closest match from the VALID_REGIONS list below",
    "am": "Numeric AM part only (e.g., 354245)",
    "apofasiYear": "4-digit Year",
    "apofasiNumber": "Final numeric ID after the slash",
    "greekEmployerName": "Employer name in English/Latin",
    "passportNumber": "Passport ID",
    "expirationDate": "DDMMYYYY (e.g., 15092027)",
    "rawText": "Full OCR text for system logs."
}

VALID_REGIONS (You MUST choose exactly one of these for regionOfEmployment):
${REGION_LIST.join(", ")}

STRICT RULES:
1. FULL NAME format must be exactly [GIVEN NAMES] [SURNAME] in ALL CAPS.
2. GREEK DECISION NUMBER format must include parentheses: (AM354245)2025/25290.
3. REGION must be EXACTLY one of the values from the VALID_REGIONS list. If not sure, pick the most likely match from the list.
4. Do not include titles like "MR" or "MS" in the full name.
`;


export interface ClientData {
  phone: string;
  mobile: string;
  fullName: string;
  greekDecisionNumber: string;
  employerName: string;
  regionOfEmployment: string;
  am: string;
  apofasiYear: string;
  apofasiNumber: string;
  greekEmployerName: string;
  passportNumber: string;
  expirationDate: string; // Format DDMMYYYY
  rawText?: string; // New field for OCR raw text
}

export interface FileState {
  file: File | null;
  preview: string | null;
  name: string;
}

export enum DocType {
  PASSPORT = 'Passport',
  APOFASI = 'Work Permit (Apofasi)'
}

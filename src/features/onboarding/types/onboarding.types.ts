

export interface PrimaryDetailsPayload {
  first_name: string;
  middle_name?: string;
  last_name: string;
  display_name?: string;
  gender: string;
  dob: string;
  marital_status?: string;
  blood_group: string;
  nationality?: string;
}


export interface ContactPayload {
  personal_email?: string;
  mobile_no?: string;
  work_no?: string;
  residence_no?: string;
}


export interface IdentityPayload {
  doc_type: "AADHAAR" | "PAN" | "PASSPORT";
  doc_number: string;
  name_on_doc?: string;
  issue_date?: string;
  expiry_date?: string;
  extra_info?: Record<string, unknown>;
}

export interface ProfileIdentityItem {
  id?: number;
  employee_id?: number;
  doc_type: "AADHAAR" | "PAN" | "PASSPORT";
  doc_number: string;
  name_on_doc?: string;
  issue_date?: string;
  expiry_date?: string;
}


export interface ProfileAddressItem {
  address_type?: "CURRENT" | "PERMANENT";
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pin_code: string;
  country: string;
  ownership_type: string;
}


export interface CompletionResponse {
  percentage: number;
  sections: {
    profile?: boolean;
    contact?: boolean;
    education?: boolean;
    experience?: boolean;
    addresses?: boolean;
    identity?: boolean;
    documents?: boolean;
    assets?: boolean;
    relations?: boolean;
  };
}


export interface DocumentItem {
  id: number;
  employee_id: number;
  doc_category: string;
  file_name: string;
  s3_url: string;
  presigned_url?: string;
  file_size_kb: number;
  mime_type: string;
  verification_status: string;
  uploaded_at: string;
}

export interface VerifyDocumentPayload {
  status: "VERIFIED" | "REJECTED";
  note?: string;
}


export interface EmployeeAssetItem {
  id: number;
  employee_id: number;
  asset_code?: string;
  asset_type: string;
  asset_name: string;
  serial_no?: string;
  assigned_on: string;
  acknowledgement_status: "PENDING" | "ACKNOWLEDGED";
}

export interface AdminDashboardRow {
  employee_id: number;
  name: string;
  department?: string;
  date_of_joining?: string | null;
  days_since_joining: number;
  completion_pct: number;
  incomplete_sections: string[];
}


export interface ProfileResponse {
  employee: {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  display_name?: string;
  dob?: string;
  gender?: string;
  marital_status?: string;
  blood_group?: string;
  nationality?: string;
  personal_email?: string;
  mobile_no?: string;
  work_no?: string;
};
  education: EducationItem[];
  experience: ExperienceItem[];
  addresses: ProfileAddressItem[];
  documents: DocumentItem[];
  assets: EmployeeAssetItem[];
  identity: ProfileIdentityItem[];
  relations: RelationsPayload;
}


export interface ParentRelation {
  name: string;
  dob: string;
  occupation: string;
  contact: string;
}

export interface SpouseRelation {
  name: string;
  dob: string;
  contact: string;
}

export interface ChildRelation {
  name: string;
  dob: string;
}

export interface RelationsPayload {
  mother: ParentRelation;
  father: ParentRelation;
  spouse: SpouseRelation;
  children: ChildRelation[];
}


export interface EducationItem {
  id: number;
  employee_id: number;
  degree: string;
  branch: string;
  university: string;
  cgpa_or_pct: number;
  year_of_joining: number;
  year_of_completion: number;
  certificate_url?: string;
}

export interface EducationPayload {
  employee_id: number;
  degree: string;
  branch: string;
  university: string;
  cgpa_or_pct: number;
  year_of_joining: number;
  year_of_completion: number;
}


export interface ExperienceItem {
  id: number;
  employee_id: number;
  company_name: string;
  designation: string;
  employment_type: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  industry: string;
  description: string;
}

export interface ExperiencePayload {
  employee_id: number;
  company_name: string;
  designation: string;
  employment_type: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  industry: string;
  description: string;
}
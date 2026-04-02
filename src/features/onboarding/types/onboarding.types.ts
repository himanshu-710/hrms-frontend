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
  personal_email: string;
  mobile_no: string;
  work_no: string;
  residence_no?: string;
}

export interface IdentityPayload {
  employee_id?: number;
  doc_type: "AADHAAR" | "PAN" | "PASSPORT";
  doc_number: string;
  name_on_doc?: string;
  issue_date?: string;
  expiry_date?: string;
  extra_info?: Record<string, unknown>;
}

export interface AddressItem {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pin_code: string;
  country: string;
  ownership_type: string;
}

export interface AddressPayload {
  employee_id?: number;
  current: AddressItem;
  permanent: AddressItem;
  copy_from_current: boolean;
}

export interface CompletionResponse {
  sections: Record<string, boolean>;
  percentage: number;
}

export interface DocumentItem {
  id: number;
  employee_id: number;
  doc_category: string;
  file_name: string;
  s3_url: string;
  file_size_kb: number;
  mime_type: string;
  verification_status: string;
  uploaded_at: string;
}

export interface ProfileResponse {
  employee: {
    id: number;
    first_name: string;
    last_name: string;
    dob?: string;
    gender?: string;
    blood_group?: string;
    personal_email?: string;
    mobile_no?: string;
    work_no?: string;
  };
  education: unknown[];
  experience: unknown[];
  addresses: unknown[];
  documents: DocumentItem[];
  assets: unknown[];
  identity: unknown[];
  relations: Record<string, unknown>;
}
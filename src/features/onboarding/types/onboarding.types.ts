export interface CreateEmployeePayload {
  first_name: string;
  last_name: string;
  personal_email: string;
  department: string;
}

export interface PrimaryDetailsPayload {
  first_name: string;
  middle_name: string;
  last_name: string;
  display_name: string;
  gender: string;
  dob: string;
  marital_status: string;
  blood_group: string;
  nationality: string;
}

export interface ContactDetailsPayload {
  personal_email: string;
  mobile_no: string;
  work_no: string;
  residence_no: string;
}
import api from "@/lib/api";
import type {
  AdminDashboardRow,
  AddressPayload,
  CompletionResponse,
  ContactPayload,
  DocumentItem,
  EducationPayload,
  EmployeeAssetItem,
  ExperiencePayload,
  IdentityPayload,
  PrimaryDetailsPayload,
  EducationItem,
  ExperienceItem,
  ProfileResponse,
  RelationsPayload,
  VerifyDocumentPayload,
} from "@/features/onboarding/types/onboarding.types";

export const onboardingApi = {
  getProfile: async (employeeId: number) => {
    const { data } = await api.get<ProfileResponse>(`/onboarding/profile/${employeeId}`);
    return data;
  },

  updatePrimaryDetails: async (
    employeeId: number,
    payload: PrimaryDetailsPayload
  ) => {
    const { data } = await api.put(
      `/onboarding/profile/${employeeId}/primary`,
      payload
    );
    return data;
  },

  updateContact: async (employeeId: number, payload: ContactPayload) => {
    const { data } = await api.put(
      `/onboarding/profile/${employeeId}/contact`,
      payload
    );
    return data;
  },

  saveIdentity: async (employeeId: number, payload: IdentityPayload) => {
    const { data } = await api.put(
      `/onboarding/profile/${employeeId}/identity`,
      payload
    );
    return data;
  },

  getIdentity: async (employeeId: number) => {
    const { data } = await api.get(`/onboarding/profile/${employeeId}/identity`);
    return data;
  },

  saveAddresses: async (employeeId: number, payload: AddressPayload) => {
    const { data } = await api.put(
      `/onboarding/profile/${employeeId}/addresses`,
      payload
    );
    return data;
  },

  saveRelations: async (employeeId: number, payload: RelationsPayload) => {
    const { data } = await api.put(
      `/onboarding/profile/${employeeId}/relations`,
      payload
    );
    return data;
  },

  getEducation: async (employeeId: number) => {
  const { data } = await api.get<EducationItem[]>(`/onboarding/education/${employeeId}`);
  return data;
},


  addEducation: async (payload: EducationPayload) => {
    const { data } = await api.post(`/onboarding/education`, payload);
    return data;
  },

  updateEducation: async (id: number, payload: EducationPayload) => {
    const { data } = await api.put(`/onboarding/education/${id}`, payload);
    return data;
  },

  deleteEducation: async (id: number) => {
    const { data } = await api.delete(`/onboarding/education/${id}`);
    return data;
  },

 getExperience: async (employeeId: number) => {
  const { data } = await api.get<ExperienceItem[]>(`/onboarding/experience/${employeeId}`);
  return data;
},


  addExperience: async (payload: ExperiencePayload) => {
    const { data } = await api.post(`/onboarding/experience`, payload);
    return data;
  },

  updateExperience: async (id: number, payload: ExperiencePayload) => {
    const { data } = await api.put(`/onboarding/experience/${id}`, payload);
    return data;
  },

  deleteExperience: async (id: number) => {
    const { data } = await api.delete(`/onboarding/experience/${id}`);
    return data;
  },

  getCompletion: async (employeeId: number) => {
    const { data } = await api.get<CompletionResponse>(
      `/onboarding/profile/${employeeId}/completion`
    );
    return data;
  },

  uploadDocument: async (
    employeeId: number,
    formData: FormData,
    onUploadProgress?: (progress: number) => void
  ) => {
    const { data } = await api.post(
      `/onboarding/profile/${employeeId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          if (!event.total || !onUploadProgress) return;
          const progress = Math.round((event.loaded * 100) / event.total);
          onUploadProgress(progress);
        },
      }
    );
    return data;
  },

  getDocuments: async (employeeId: number) => {
    const { data } = await api.get<DocumentItem[]>(
      `/onboarding/profile/${employeeId}/documents`
    );
    return data;
  },

  deleteDocument: async (documentId: number) => {
    const { data } = await api.delete(`/onboarding/documents/${documentId}`);
    return data;
  },

  verifyDocument: async (documentId: number, payload: VerifyDocumentPayload) => {
    const { data } = await api.patch(`/onboarding/documents/${documentId}/verify`, payload);
    return data;
  },

  getAssets: async (employeeId: number) => {
    const { data } = await api.get<EmployeeAssetItem[]>(
      `/onboarding/profile/${employeeId}/assets`
    );
    return data;
  },

  acknowledgeAsset: async (assignmentId: number) => {
    const { data } = await api.patch(`/onboarding/assets/${assignmentId}/acknowledge`);
    return data;
  },

  getAdminDashboard: async () => {
    const { data } = await api.get<AdminDashboardRow[]>(`/onboarding/admin/dashboard`);
    return data;
  },

  sendReminder: async (employeeId: number) => {
    const { data } = await api.post(`/onboarding/admin/remind/${employeeId}`);
    return data;
  },
};

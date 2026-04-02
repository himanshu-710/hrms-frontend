import api from "@/lib/api";
import type {
  CompletionResponse,
  ContactPayload,
  DocumentItem,
  PrimaryDetailsPayload,
  ProfileResponse,
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
};
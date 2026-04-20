import api from "@/lib/api";

export const onboardingApi = {

  getProfile: async (employeeId: number) => {
    const res = await api.get(`/onboarding/profile/${employeeId}`);
    return res.data; 
  },

  updatePrimary: (employeeId: number, data: any) =>
  api.put(`/onboarding/profile/${employeeId}/primary`, data),

  updateContact: (employeeId: number, data: any) =>
    api.put(`/onboarding/profile/${employeeId}/contact`, data),

  updateRelations: (employeeId: number, data: any) =>
    api.put(`/onboarding/profile/${employeeId}/relations`, data),

  updateAddress: (employeeId: number, data: any) =>
    api.put(`/onboarding/profile/${employeeId}/addresses`, data),

  updateIdentity: (employeeId: number, data: any) =>
    api.put(`/onboarding/profile/${employeeId}/identity`, data),

  getEducation: async (employeeId: number) => {
  const res = await api.get(`/onboarding/education/${employeeId}`);
  return res.data ?? [];
},

  createEducation: (data: any) =>
    api.post(`/onboarding/education`, data),

  updateEducation: (id: number, data: any) =>
    api.put(`/onboarding/education/${id}`, data),

  deleteEducation: (id: number) =>
    api.delete(`/onboarding/education/${id}`),



  getExperience: async (employeeId: number) => {
    const res = await api.get(`/onboarding/experience/${employeeId}`);
    return res.data;
  },

  createExperience: (data: any) =>
    api.post(`/onboarding/experience`, data),

  updateExperience: (id: number, data: any) =>
    api.put(`/onboarding/experience/${id}`, data),

  deleteExperience: (id: number) =>
    api.delete(`/onboarding/experience/${id}`),

 

  uploadDocument: (employeeId: number, formData: FormData, onProgress?: any) =>
    api.post(`/onboarding/profile/${employeeId}/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress,
    }),

  getDocuments: async (employeeId: number) => {
    const res = await api.get(`/onboarding/profile/${employeeId}/documents`);
    return res.data;
  },
  deleteDocument: (documentId: number) =>
    api.delete(`/onboarding/documents/${documentId}`),
  getPendingDocuments: async () => {
    const res = await api.get("/onboarding/admin/documents");
    return res.data;
  },

  verifyDocument: (id: number, data: any) =>
    api.patch(`/onboarding/documents/${id}/verify`, data),

  getAssets: async (employeeId: number) => {
    const res = await api.get(`/onboarding/profile/${employeeId}/assets`);
    return res.data;
  },

  acknowledgeAsset: (id: number) =>
    api.patch(`/onboarding/assets/${id}/acknowledge`),

  

  getAdminDashboard: async () => {
    const res = await api.get(`/onboarding/admin/dashboard`);
    return res.data;
  },

  sendReminder: (employeeId: number) =>
    api.post(`/onboarding/admin/${employeeId}/reminder`),

  

  getCompletion: async (employeeId: number) => {
  const res = await api.get(`/onboarding/profile/${employeeId}/completion`);
  return res.data;
},
};
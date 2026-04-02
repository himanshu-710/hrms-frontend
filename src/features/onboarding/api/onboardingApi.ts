import { api } from "@/lib/axios";
import type {
  ContactDetailsPayload,
  CreateEmployeePayload,
  PrimaryDetailsPayload,
} from "@/features/onboarding/types/onboarding.types";

export const onboardingApi = {
  createEmployee: async (payload: CreateEmployeePayload) => {
    const { data } = await api.post("/onboarding/employee", payload);
    return data;
  },

  getProfile: async (id: number) => {
    const { data } = await api.get(`/onboarding/profile/${id}`);
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

  updateContactDetails: async (
    employeeId: number,
    payload: ContactDetailsPayload
  ) => {
    const { data } = await api.put(
      `/onboarding/profile/${employeeId}/contact`,
      payload
    );
    return data;
  },
};
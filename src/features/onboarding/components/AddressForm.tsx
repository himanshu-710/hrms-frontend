import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Select, toast } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/useAuth";

type Address = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pin_code: string;
  country: string;
  ownership_type: string;
};

type AddressValues = {
  current: Address;
  permanent: Address;
  sameAsCurrent: boolean;
};

const emptyAddress: Address = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  pin_code: "",
  country: "",
  ownership_type: "",
};

export default function AddressForm() {
  const { employee } = useAuth();
  const employeeId = employee?.id;
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["onboarding-profile", employeeId],
    queryFn: () => onboardingApi.getProfile(employeeId as number),
    enabled: !!employeeId,
  });

  const { register, handleSubmit, control, setValue, reset } =
    useForm<AddressValues>({
      defaultValues: {
        current: emptyAddress,
        permanent: emptyAddress,
        sameAsCurrent: false,
      },
    });

  useEffect(() => {
    const addresses = profile?.addresses ?? [];

    const currentAddress =
      addresses.find((a: any) => a.address_type === "CURRENT") ??
      emptyAddress;

    const permanentAddress =
      addresses.find((a: any) => a.address_type === "PERMANENT") ??
      emptyAddress;

    reset({
      current: {
        line1: currentAddress.line1 ?? "",
        line2: currentAddress.line2 ?? "",
        city: currentAddress.city ?? "",
        state: currentAddress.state ?? "",
        pin_code: currentAddress.pin_code ?? "",
        country: currentAddress.country ?? "",
        ownership_type: currentAddress.ownership_type ?? "",
      },
      permanent: {
        line1: permanentAddress.line1 ?? "",
        line2: permanentAddress.line2 ?? "",
        city: permanentAddress.city ?? "",
        state: permanentAddress.state ?? "",
        pin_code: permanentAddress.pin_code ?? "",
        country: permanentAddress.country ?? "",
        ownership_type: permanentAddress.ownership_type ?? "",
      },
      sameAsCurrent: false,
    });
  }, [profile, reset]);

  const sameAsCurrent = useWatch({
    control,
    name: "sameAsCurrent",
  });

  const current = useWatch({
    control,
    name: "current",
  });

  useEffect(() => {
    if (!sameAsCurrent) return;
    setValue("permanent", current);
  }, [sameAsCurrent, current, setValue]);

  const mutation = useMutation({
  mutationFn: (values: AddressValues) => {
    if (!employeeId) throw new Error("Employee id missing");

    const payload = {
      current: {
        address_type: "CURRENT",
        line1: values.current.line1,
        line2: values.current.line2,
        city: values.current.city,
        state: values.current.state,
        pin_code: values.current.pin_code,
        country: values.current.country,
        ownership_type: values.current.ownership_type,
      },
      permanent: {
        address_type: "PERMANENT",
        line1: values.permanent.line1,
        line2: values.permanent.line2,
        city: values.permanent.city,
        state: values.permanent.state,
        pin_code: values.permanent.pin_code,
        country: values.permanent.country,
        ownership_type: values.permanent.ownership_type,
      },
    };

    return onboardingApi.updateAddress(employeeId, payload);
  },

  onSuccess: () => {
    toast.success("Address updated");
    queryClient.invalidateQueries({
      queryKey: ["onboarding-profile", employeeId],
    });
  },

  onError: () => {
    toast.error("Failed to update address");
  },
});

  const onSubmit = (values: AddressValues) => {
    if (!employeeId) {
      toast.error("Employee id not found");
      return;
    }

    mutation.mutate(values);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h3 className="mb-3 text-lg font-semibold">
          Current Address
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Line 1" {...register("current.line1")} />
          <Input label="Line 2" {...register("current.line2")} />
          <Input label="City" {...register("current.city")} />
          <Input label="State" {...register("current.state")} />
          <Input label="Pin Code" {...register("current.pin_code", { required: true })} />
          <Input label="Country" {...register("current.country", { required: true })} />

          <Select
            label="Ownership Type"
            options={[
              { label: "Select ownership type", value: "" },
              { label: "Owned", value: "OWNED" },
              { label: "Rented", value: "RENTED" },
            ]}
            {...register("current.ownership_type")}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" {...register("sameAsCurrent")} />
        Same as current
      </label>

      <div>
        <h3 className="mb-3 text-lg font-semibold">
          Permanent Address
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Line 1" {...register("permanent.line1")} />
          <Input label="Line 2" {...register("permanent.line2")} />
          <Input label="City" {...register("permanent.city")} />
          <Input label="State" {...register("permanent.state")} />
          <Input label="Pin Code" {...register("permanent.pin_code")} />
          <Input label="Country" {...register("permanent.country")} />

          <Select
            label="Ownership Type"
            options={[
              { label: "Select ownership type", value: "" },
              { label: "Owned", value: "OWNED" },
              { label: "Rented", value: "RENTED" },
            ]}
            {...register("permanent.ownership_type")}
          />
        </div>
      </div>

      <Button type="submit" isLoading={mutation.isPending}>
        Save Addresses
      </Button>
    </form>
  );
}
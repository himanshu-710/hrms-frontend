import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Select, toast } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/AuthContext";

type AddressValues = {
  current: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pin_code: string;
    country: string;
    ownership_type: string;
  };
  permanent: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pin_code: string;
    country: string;
    ownership_type: string;
  };
  sameAsCurrent: boolean;
};

const emptyAddress = {
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

  const { register, handleSubmit, watch, setValue, reset } = useForm<AddressValues>({
    defaultValues: {
      current: emptyAddress,
      permanent: emptyAddress,
      sameAsCurrent: false,
    },
  });

    useEffect(() => {
    const addresses = profile?.addresses ?? [];

    const currentAddress =
      addresses.find((item) => item.address_type === "CURRENT") ?? emptyAddress;

    const permanentAddress =
      addresses.find((item) => item.address_type === "PERMANENT") ?? emptyAddress;

    reset({
      current: {
        line1: currentAddress.line1 || "",
        line2: currentAddress.line2 || "",
        city: currentAddress.city || "",
        state: currentAddress.state || "",
        pin_code: currentAddress.pin_code || "",
        country: currentAddress.country || "",
        ownership_type: currentAddress.ownership_type || "",
      },
      permanent: {
        line1: permanentAddress.line1 || "",
        line2: permanentAddress.line2 || "",
        city: permanentAddress.city || "",
        state: permanentAddress.state || "",
        pin_code: permanentAddress.pin_code || "",
        country: permanentAddress.country || "",
        ownership_type: permanentAddress.ownership_type || "",
      },
      sameAsCurrent: false,
    });
  }, [profile, reset]);


  const sameAsCurrent = watch("sameAsCurrent");
  const current = watch("current");

  useEffect(() => {
    if (!sameAsCurrent) return;

    setValue("permanent.line1", current.line1);
    setValue("permanent.line2", current.line2);
    setValue("permanent.city", current.city);
    setValue("permanent.state", current.state);
    setValue("permanent.pin_code", current.pin_code);
    setValue("permanent.country", current.country);
    setValue("permanent.ownership_type", current.ownership_type);
  }, [sameAsCurrent, current, setValue]);

  const mutation = useMutation({
    mutationFn: (values: AddressValues) =>
      onboardingApi.saveAddresses(employeeId as number, {
        current: values.current,
        permanent: values.permanent,
        copy_from_current: values.sameAsCurrent,
      }),
    onSuccess: () => {
      toast.success("Address details updated");
      queryClient.invalidateQueries({ queryKey: ["onboarding-profile", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-completion", employeeId] });
    },
    onError: () => {
      toast.error("Failed to update address details");
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
        <h3 className="mb-3 text-lg font-semibold">Current Address</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Line 1" {...register("current.line1")} />
          <Input label="Line 2" {...register("current.line2")} />
          <Input label="City" {...register("current.city")} />
          <Input label="State" {...register("current.state")} />
          <Input label="Pin Code" {...register("current.pin_code")} />
          <Input label="Country" {...register("current.country")} />
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
        <h3 className="mb-3 text-lg font-semibold">Permanent Address</h3>
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

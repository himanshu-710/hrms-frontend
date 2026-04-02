import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "@/components/ui";

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

export default function AddressForm() {
  const { register, handleSubmit, watch, setValue, getValues } =
    useForm<AddressValues>({
      defaultValues: {
        current: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          pin_code: "",
          country: "",
          ownership_type: "",
        },
        permanent: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          pin_code: "",
          country: "",
          ownership_type: "",
        },
        sameAsCurrent: false,
      },
    });

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

  const onSubmit = async () => {
    console.log(getValues());
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
          <Input label="Ownership Type" {...register("current.ownership_type")} />
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
          <Input label="Ownership Type" {...register("permanent.ownership_type")} />
        </div>
      </div>

      <Button type="submit">Save Addresses</Button>
    </form>
  );
}
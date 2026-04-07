import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, toast } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/AuthContext";

type ParentRelation = {
  name: string;
  dob: string;
  occupation: string;
  contact: string;
};

type SpouseRelation = {
  name: string;
  dob: string;
  contact: string;
};

type ChildRelation = {
  name: string;
  dob: string;
};

type RelationsFormValues = {
  mother: ParentRelation;
  father: ParentRelation;
  spouse: SpouseRelation;
  children: ChildRelation[];
};

const emptyParent: ParentRelation = {
  name: "",
  dob: "",
  occupation: "",
  contact: "",
};

const emptySpouse: SpouseRelation = {
  name: "",
  dob: "",
  contact: "",
};

export default function RelationsForm() {
  const { employee } = useAuth();
  const employeeId = employee?.id;
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["onboarding-profile", employeeId],
    queryFn: () => onboardingApi.getProfile(employeeId as number),
    enabled: !!employeeId,
  });

  const { register, control, handleSubmit, reset } = useForm<RelationsFormValues>({
    defaultValues: {
      mother: emptyParent,
      father: emptyParent,
      spouse: emptySpouse,
      children: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "children",
  });

  useEffect(() => {
    const relations = profile?.relations as Partial<RelationsFormValues> | undefined;

    reset({
      mother: relations?.mother ?? emptyParent,
      father: relations?.father ?? emptyParent,
      spouse: relations?.spouse ?? emptySpouse,
      children: Array.isArray(relations?.children) ? relations.children : [],
    });
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: (values: RelationsFormValues) =>
      onboardingApi.saveRelations(employeeId as number, values),
    onSuccess: () => {
      toast.success("Relations updated");
      queryClient.invalidateQueries({ queryKey: ["onboarding-profile", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-completion", employeeId] });
    },
    onError: () => {
      toast.error("Failed to update relations");
    },
  });

  const onSubmit = (values: RelationsFormValues) => {
    if (!employeeId) {
      toast.error("Employee id not found");
      return;
    }

    mutation.mutate(values);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Family Relations</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Mother Name" {...register("mother.name")} />
        <Input label="Mother DOB" type="date" {...register("mother.dob")} />
        <Input label="Mother Occupation" {...register("mother.occupation")} />
        <Input label="Mother Contact" {...register("mother.contact")} />

        <Input label="Father Name" {...register("father.name")} />
        <Input label="Father DOB" type="date" {...register("father.dob")} />
        <Input label="Father Occupation" {...register("father.occupation")} />
        <Input label="Father Contact" {...register("father.contact")} />

        <Input label="Spouse Name" {...register("spouse.name")} />
        <Input label="Spouse DOB" type="date" {...register("spouse.dob")} />
        <Input label="Spouse Contact" {...register("spouse.contact")} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-900">Children</h4>
          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ name: "", dob: "" })}
          >
            Add Child
          </Button>
        </div>

        {fields.length === 0 ? (
          <p className="text-sm text-slate-500">No children added</p>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-4 rounded-xl border border-slate-200 p-4 md:grid-cols-2"
              >
                <Input label="Child Name" {...register(`children.${index}.name`)} />
                <Input label="Child DOB" type="date" {...register(`children.${index}.dob`)} />

                <div className="md:col-span-2">
                  <Button type="button" variant="secondary" onClick={() => remove(index)}>
                    Remove Child
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" isLoading={mutation.isPending}>
        Save Relations
      </Button>
    </form>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Spinner, toast } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/useAuth";

export default function OnboardingAssetsPage() {
  const { employee } = useAuth();
  const employeeId = employee?.id;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["onboarding-assets", employeeId],
    queryFn: () => onboardingApi.getAssets(employeeId as number),
    enabled: !!employeeId,
  });

  
  const assets = Array.isArray(data) ? data : [];

  const acknowledgeMutation = useMutation({
    mutationFn: (assignmentId: number) =>
      onboardingApi.acknowledgeAsset(assignmentId),

    onSuccess: () => {
      toast.success("Asset acknowledged");

      queryClient.invalidateQueries({
        queryKey: ["onboarding-assets", employeeId],
      });

      queryClient.invalidateQueries({
        queryKey: ["onboarding-completion", employeeId],
      });
    },

    onError: () => {
      toast.error("Failed to acknowledge asset");
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Spinner />
          <span>Loading assets...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-red-600">
          Unable to load assigned assets right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Assigned Assets
        </h3>

        <p className="text-sm text-slate-600">
          Review and acknowledge the assets assigned to you.
        </p>
      </div>

      {assets.length === 0 ? (
        <p className="text-sm text-slate-500">
          No assets assigned yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="px-3 py-2">Asset Code</th>
                <th className="px-3 py-2">Asset Type</th>
                <th className="px-3 py-2">Asset Name</th>
                <th className="px-3 py-2">Assigned On</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {assets.map((asset) => {
                const isAcknowledged =
                  asset.acknowledgement_status ===
                  "ACKNOWLEDGED";

                return (
                  <tr
                    key={asset.id}
                    className="border-b border-slate-100"
                  >
                    <td className="px-3 py-3">
                      {asset.asset_code ||
                        asset.serial_no ||
                        `ASSET-${asset.id}`}
                    </td>

                    <td className="px-3 py-3">
                      {asset.asset_type}
                    </td>

                    <td className="px-3 py-3">
                      {asset.asset_name}
                    </td>

                    <td className="px-3 py-3">
                      {asset.assigned_on}
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          isAcknowledged
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {asset.acknowledgement_status}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={isAcknowledged}
                        isLoading={
                          acknowledgeMutation.isPending
                        }
                        onClick={() =>
                          acknowledgeMutation.mutate(
                            asset.id
                          )
                        }
                      >
                        {isAcknowledged
                          ? "Acknowledged"
                          : "Acknowledge"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
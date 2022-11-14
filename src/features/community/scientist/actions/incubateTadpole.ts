import { communityContracts } from "features/community/lib/communityContracts";

type Request = {
  frogId: string;
  tadpoleId: string;
};

export async function incubateTadpole(request: Request) {
  const incubated = await communityContracts
    .getIncubator()
    .incubate(request.frogId, request.tadpoleId);

  return { incubated };
}

export async function removeIncubator(incubatorId: string) {
  const getFrogIdIncubator = await communityContracts
    .getIncubator()
    .getFrogIdIncubator(incubatorId);
  const remove = await communityContracts
    .getIncubator()
    .remove(getFrogIdIncubator, incubatorId);

  return { remove };
}

export async function claimIncubator(incubatorId: string) {
  const getFrogIdIncubator = await communityContracts
    .getIncubator()
    .getFrogIdIncubator(incubatorId);
  const claim = await communityContracts
    .getIncubator()
    .claim(getFrogIdIncubator, incubatorId);

  return { claim };
}

export async function approveFrogs(address: string) {
  const approveToken = await communityContracts
    .getFrog()
    .setApprovalAllFrogs(address, true);
  return approveToken;
}

export async function revokeFrogs(address: string) {
  const revokeToken = await communityContracts
    .getFrog()
    .setApprovalAllFrogs(address, false);
  return revokeToken;
}

export async function approveTadpoles(address: string) {
  const approveToken = await communityContracts
    .getTadpole()
    .setApprovalAllTadpoles(address, true);
  return approveToken;
}

export async function revokeTadpoles(address: string) {
  const revokeToken = await communityContracts
    .getTadpole()
    .setApprovalAllTadpoles(address, false);
  return revokeToken;
}

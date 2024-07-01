export const handleCommand = async (command: string, args: string[]) => {
  switch (command) {
    case "/mute":
      CommandeMute(args);
      break;
    case "/unmute":
      CommandeUnmute(args);
      break;
    default:
      break;
  }
};

const isFarmIdValid = (farmId: number) => {
  return !isNaN(farmId) && farmId >= 0 && farmId % 1 === 0;
};

const CommandeMute = (args: string[]) => {
  const farmId = Number(args[0]);
  const localMutedFarmIds = JSON.parse(
    localStorage.getItem("plaza-settings.mutedFarmIds") || "[]",
  );

  if (isFarmIdValid(farmId) && !localMutedFarmIds.includes(farmId)) {
    localMutedFarmIds.push(farmId);
    localStorage.setItem(
      "plaza-settings.mutedFarmIds",
      JSON.stringify(localMutedFarmIds),
    );
  }
};

const CommandeUnmute = (args: string[]) => {
  const farmId = Number(args[0]);
  const localMutedFarmIds = JSON.parse(
    localStorage.getItem("plaza-settings.mutedFarmIds") || "[]",
  );

  if (isFarmIdValid(farmId)) {
    const index = localMutedFarmIds.indexOf(farmId);
    if (index !== -1) {
      localMutedFarmIds.splice(index, 1);
      localStorage.setItem(
        "plaza-settings.mutedFarmIds",
        JSON.stringify(localMutedFarmIds),
      );
    }
  }
};

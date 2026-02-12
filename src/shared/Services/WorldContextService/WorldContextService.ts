import { Players, RunService } from "@rbxts/services";
import CrossPlaceServiceClient from "../CrossPlaceService/CrossPlaceServiceClient";
import CrossPlaceServiceServer from "../CrossPlaceService/CrossPlaceServiceServer";
import { TELEPORT_DATA_OVERRIDE } from "shared/devtools";
import { COINS_STAT_NAME } from "shared/helper";

const side = RunService.IsClient() ? "CLIENT" : "SERVER";
print(`Initializing ${script.Parent?.Name} (${side})`);

export default class WorldContextService {
    public static IsLobby(): boolean {
        if (RunService.IsStudio() && TELEPORT_DATA_OVERRIDE !== undefined) {
            return TELEPORT_DATA_OVERRIDE.Location === undefined;
        }
        if (RunService.IsClient()) {
            return CrossPlaceServiceClient.GetCurrentLocation() === undefined;
        } else {
            return CrossPlaceServiceServer.GetCurrentMap() === undefined;
        }
    }

    public static CreateLeaderstatsWithBaseMoney = () => {
        if (RunService.IsClient() || this.IsLobby()) {
            return;
        }
        Players.GetPlayers().forEach((player) => {
            const lsFolder = new Instance("Folder");
            lsFolder.Name = "leaderstats";
            lsFolder.Parent = player;

            const moneyIntValue = new Instance("IntValue");
            moneyIntValue.Name = COINS_STAT_NAME;
            moneyIntValue.Value =
                CrossPlaceServiceServer.GetCurrentMap()?.StartMoney ?? 800;
            moneyIntValue.Parent = lsFolder;
        });
    };
}

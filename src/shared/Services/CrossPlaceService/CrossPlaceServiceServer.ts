import { Players, RunService } from "@rbxts/services";
import { TELEPORT_DATA_OVERRIDE } from "shared/devtools";
import { TeleportData } from "shared/Services/CrossPlaceService/CrossPlaceService";
import { NetworkDefinitions } from "shared/Services/NetworkingService/NetworkingService";
import { Map } from "../RegistryService/MapRegistry";

export default class CrossPlaceServiceServer {
    private static TeleportData?: TeleportData;

    public static GetCurrentMap(): Map | undefined {
        return this.TeleportData?.Location;
    }

    public static Init() {
        print("Initializing CrossPlaceService (SERVER)");

        NetworkDefinitions.CrossPlaceService.GetCurrentLocation.OnServerInvoke =
            () => {
                return this.TeleportData;
            };

        while (Players.GetPlayers().size() < 1) {
            task.wait();
        }
        const firstPlayer = Players.GetPlayers()[0];

        if (RunService.IsStudio() && TELEPORT_DATA_OVERRIDE !== undefined) {
            this.TeleportData = TELEPORT_DATA_OVERRIDE; // Forge the teleport data
            return;
        }

        print("First player joined piggy backing off of their Teleport Data!");
        const joinData = firstPlayer.GetJoinData();
        const teleportData = joinData?.TeleportData;

        if (teleportData !== undefined && typeIs(teleportData, "table")) {
            this.TeleportData = teleportData as TeleportData;
        }
    }
}

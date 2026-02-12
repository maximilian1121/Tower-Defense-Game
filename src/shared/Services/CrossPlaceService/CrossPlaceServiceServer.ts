import { Players } from "@rbxts/services";
import { TeleportData } from "shared/Services/CrossPlaceService/CrossPlaceService";
import { NetworkDefinitions } from "shared/Services/NetworkingService/NetworkingService";
import { Map } from "shared/Services/RegistryService/MapRegistry";

export default class CrossPlaceServiceServer {
    private static TeleportData?: TeleportData;

    public static GetCurrentMap(): Map | undefined {
        return this.TeleportData?.Location;
    }

    public static Init() {
        print("Initializing CrossPlaceService (SERVER)!");

        NetworkDefinitions.CrossPlaceService.GetCurrentLocation.OnServerInvoke =
            () => {
                return this.TeleportData;
            };

        while (Players.GetPlayers().size() < 1) {
            task.wait();
        }
        print("First player joined piggy backing off of their Teleport Data!");
        const joinData = Players.GetPlayers()[0].GetJoinData();
        const teleportData = joinData?.TeleportData;

        if (teleportData !== undefined && typeIs(teleportData, "table")) {
            this.TeleportData = teleportData as TeleportData;
        }
    }
}

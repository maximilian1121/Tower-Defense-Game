import { RunService } from "@rbxts/services";
import CrossPlaceServiceClient from "../CrossPlaceService/CrossPlaceServiceClient";
import CrossPlaceServiceServer from "../CrossPlaceService/CrossPlaceServiceServer";

const side = RunService.IsClient() ? "CLIENT" : "SERVER";
print(`Initializing ${script.Parent?.Name} (${side})`);

export default class WorldContextService {
    public static IsLobby(): boolean {
        if (RunService.IsClient()) {
            return CrossPlaceServiceClient.GetCurrentLocation() === undefined;
        } else {
            return CrossPlaceServiceServer.GetCurrentMap() === undefined;
        }
    }
}

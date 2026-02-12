import { RunService } from "@rbxts/services";
import CrossPlaceServiceClient from "../CrossPlaceService/CrossPlaceServiceClient";
import CrossPlaceServiceServer from "../CrossPlaceService/CrossPlaceServiceServer";

export default class WorldContextService {
    public static IsLobby(): boolean {
        if (RunService.IsClient()) {
            return CrossPlaceServiceClient.GetCurrentLocation() === undefined;
        } else {
            return CrossPlaceServiceServer.GetCurrentMap() === undefined;
        }
    }
}

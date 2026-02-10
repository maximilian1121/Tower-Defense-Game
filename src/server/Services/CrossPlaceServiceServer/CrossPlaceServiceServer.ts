import { Players } from "@rbxts/services";
import { TeleportData } from "shared/Services/CrossPlaceService/CrossPlaceService";

export default class CrossPlaceServiceServer {
    private static CurrentLocation = "";

    public static GetCurrentLocation(): string {
        return this.CurrentLocation;
    }

    public static Init() {
        Players.PlayerAdded.Once((player) => {
            const joinData = player.GetJoinData();
            const teleportData = joinData?.TeleportData as
                | TeleportData
                | undefined;

            if (teleportData?.Location !== undefined) {
                this.CurrentLocation = teleportData.Location;
            }
        });
    }
}

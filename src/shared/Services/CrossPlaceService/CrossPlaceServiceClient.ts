import { RunService, TeleportService } from "@rbxts/services";
import { Map } from "../RegistryService/MapRegistry";
import { devMap } from "../RegistryService/Maps";
import { TeleportData } from "./CrossPlaceService";
import { NetworkDefinitions } from "../NetworkingService/NetworkingService";

export default class CrossPlaceServiceClient {
    private static TeleportData?: TeleportData;
    private static Initialized = false;

    public static GetCurrentLocation(): Map | undefined {
        if (!RunService.IsRunning()) {
            return devMap;
        }

        if (!this.Initialized) {
            this.Initialized = true;

            const rawData = TeleportService.GetLocalPlayerTeleportData();
            if (rawData !== undefined && typeIs(rawData, "table")) {
                this.TeleportData = rawData as TeleportData;
            }

            task.spawn(() => {
                const serverData: TeleportData | undefined =
                    NetworkDefinitions.CrossPlaceService.GetCurrentLocation.InvokeServer();

                if (serverData !== undefined) {
                    this.TeleportData = serverData;
                }
            });
        }

        return this.TeleportData?.Location;
    }
}

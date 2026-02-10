import { NetworkDefinitions } from "../NetworkingService/NetworkingService";

export default class CrossPlaceServiceClient {
    private static CurrentLocation = undefined as string | undefined;

    public static GetCurrentLocation(): string {
        if (this.CurrentLocation === undefined) {
            this.CurrentLocation =
                NetworkDefinitions.CrossPlaceService.GetCurrentLocation.InvokeServer() as string;
        }
        return this.CurrentLocation;
    }
}

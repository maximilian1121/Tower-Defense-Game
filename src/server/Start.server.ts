import { Networking } from "shared/Services/NetworkingService/NetworkingService";
import { DataServiceServer } from "./Services/DataService/DataServiceServer";
import RegistryService from "shared/Services/RegistryService/RegistryService";
import CrossPlaceServiceServer from "../shared/Services/CrossPlaceService/CrossPlaceServiceServer";
import { ReplicatedStorage } from "@rbxts/services";

Networking.Init();
DataServiceServer.Init();
RegistryService.RegisterAll();
CrossPlaceServiceServer.Init();

ReplicatedStorage.GetDescendants().forEach((i) => {
    if (i.IsA("Sound")) {
        i.Playing = false;
    }
});

if (CrossPlaceServiceServer.GetCurrentMap() === undefined) {
    print("Lobby");
}

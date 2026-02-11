import ProfileStore from "@rbxts/profile-store";
import { Players, ReplicatedStorage, RunService } from "@rbxts/services";
import { PROFILE_TEMPLATE } from "shared/helper";
import { Networking } from "shared/Services/NetworkingService/NetworkingService";
import { DataServiceServer } from "./Services/DataService/DataServiceServer";
import RegistryService from "shared/Services/RegistryService/RegistryService";
import CrossPlaceServiceServer from "./Services/CrossPlaceServiceServer/CrossPlaceServiceServer";

function getStoreName(): string {
    return RunService.IsStudio() ? "PlayerStoreDev" : "PlayerStore";
}

Networking.Init();
RegistryService.RegisterAll();
DataServiceServer.Init();
CrossPlaceServiceServer.Init();

const PlayerStore = ProfileStore.New(getStoreName(), PROFILE_TEMPLATE);

const PlayerAdded = (player: Player) => {
    const profile = PlayerStore.StartSessionAsync(`${player.UserId}`, {
        Cancel: () => {
            return player.Parent !== Players;
        },
    });

    if (profile !== undefined) {
        profile.AddUserId(player.UserId);
        profile.Reconcile();

        profile.OnSessionEnd.Connect(() => {
            DataServiceServer.Profiles[player.UserId] = undefined;
            player.Kick("Data error occurred. Please rejoin.");
        });

        if (player.Parent === Players) {
            DataServiceServer.Profiles[player.UserId] = profile;
        } else {
            profile.EndSession();
        }
    } else {
        player.Kick("Data error occurred. Please rejoin.");
    }
};

Players.PlayerAdded.Connect(PlayerAdded);

ReplicatedStorage.GetDescendants().forEach((i) => {
    if (i.IsA("Sound")) {
        i.Playing = false;
    }
});

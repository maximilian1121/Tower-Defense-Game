import ProfileStore from "@rbxts/profile-store";
import { Players, RunService } from "@rbxts/services";
import { registerItems } from "shared/Core/Registry/ItemRegistry";
import { PROFILE_TEMPLATE } from "shared/Core/TYPES";
import { Profiles } from "./DataManger";
import { Networking } from "shared/Core/Networking";

function getStoreName(): string {
    return RunService.IsStudio() ? "PlayerStoreDev" : "PlayerStore";
}

Networking.Init();

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
            Profiles[player.UserId] = undefined;
            player.Kick("Data error occurred. Please rejoin.");
        });

        if (player.Parent === Players) {
            Profiles[player.UserId] = profile;
        } else {
            profile.EndSession();
        }
    } else {
        player.Kick("Data error occurred. Please rejoin.");
    }
};

registerItems();

Players.PlayerAdded.Connect(PlayerAdded);

Networking.Get("Inventory", "GetHotbar", "RemoteFunction").OnServerInvoke = (
    player: Player,
) => {
    while (Profiles[player.UserId] === undefined) {
        task.wait();
    }
    const profile = Profiles[player.UserId];

    if (profile) {
        return profile.Data.Hotbar;
    } else {
        return PROFILE_TEMPLATE.Hotbar;
    }
};

Networking.Get("Stats", "GetLevel", "RemoteFunction").OnServerInvoke = (
    player: Player,
) => {
    while (Profiles[player.UserId] === undefined) {
        task.wait();
    }
    const profile = Profiles[player.UserId];

    if (profile) {
        return profile.Data.LevelData;
    } else {
        return PROFILE_TEMPLATE.LevelData;
    }
};

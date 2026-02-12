import ProfileStore, { Profile } from "@rbxts/profile-store";
import { Players, RunService } from "@rbxts/services";
import { NetworkDefinitions } from "shared/Services/NetworkingService/NetworkingService";
import { PROFILE_TEMPLATE, ProfileData } from "shared/helper";

function getStoreName(): string {
    return RunService.IsStudio() ? "PlayerStoreDev" : "PlayerStore";
}

export class DataServiceServer {
    public static Profiles: Record<number, Profile<ProfileData> | undefined> =
        {};

    public static Init = () => {
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
                    this.Profiles[player.UserId] = undefined;
                    player.Kick("Data error occurred. Please rejoin.");
                });

                if (player.Parent === Players) {
                    this.Profiles[player.UserId] = profile;
                } else {
                    profile.EndSession();
                }
            } else {
                player.Kick("Data error occurred. Please rejoin.");
            }
        };

        Players.PlayerAdded.Connect(PlayerAdded);

        Players.PlayerRemoving.Connect((player: Player) => {
            const profile = this.Profiles[player.UserId];
            if (profile) {
                profile.EndSession();
            }
        });

        NetworkDefinitions.Inventory.GetHotbar.OnServerInvoke = (
            player: Player,
        ) => {
            while (this.Profiles[player.UserId] === undefined) {
                task.wait();
            }
            const profile = this.Profiles[player.UserId];

            if (profile) {
                return profile.Data.Hotbar;
            } else {
                return PROFILE_TEMPLATE.Hotbar;
            }
        };

        NetworkDefinitions.Stats.GetLevelData.OnServerInvoke = (
            player: Player,
        ) => {
            while (this.Profiles[player.UserId] === undefined) {
                task.wait();
            }
            const profile = this.Profiles[player.UserId];

            if (profile) {
                return profile.Data.LevelData;
            } else {
                return PROFILE_TEMPLATE.LevelData;
            }
        };
    };

    public static AddLevelProgression(userId: number, amount: number) {
        const profile = this.Profiles[userId];
        if (profile) {
            const levelData = profile.Data.LevelData;
            levelData.Progression += amount;

            while (levelData.Progression >= levelData.Level * 25) {
                levelData.Level += 1;
                levelData.Progression -= levelData.Level * 25;
            }

            NetworkDefinitions.Stats.LevelDataChange.FireClient(
                Players.GetPlayerByUserId(userId)!,
                levelData,
            );
        }
    }
}

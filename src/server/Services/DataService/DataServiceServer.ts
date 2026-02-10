import { Profile } from "@rbxts/profile-store";
import { Players } from "@rbxts/services";
import { NetworkDefinitions } from "shared/Services/NetworkingService/NetworkingService";
import { PROFILE_TEMPLATE, ProfileData } from "shared/helper";

export class DataServiceServer {
    public static Profiles: Record<number, Profile<ProfileData> | undefined> =
        {};

    public static Init = () => {
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

            while (levelData.Progression >= levelData.NextMilestone) {
                levelData.Level += 1;
                levelData.Progression -= levelData.NextMilestone;
                levelData.NextMilestone = levelData.Level * 25;
            }

            NetworkDefinitions.Stats.LevelDataChange.FireClient(
                Players.GetPlayerByUserId(userId)!,
                levelData,
            );
        }
    }
}

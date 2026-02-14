import { COINS_STAT_NAME } from "shared/helper";
import { TowerItem } from "../RegistryService/ItemRegistry";
import { CollectionService, Workspace } from "@rbxts/services";

const overlapParams = new OverlapParams();
overlapParams.FilterType = Enum.RaycastFilterType.Include;
CollectionService.GetInstanceAddedSignal("InvalidPlacement").Connect(
    (addedPart) => {
        overlapParams.AddToFilter(addedPart);
    },
);
CollectionService.GetTagged("InvalidPlacement").forEach((addedPart) => {
    overlapParams.AddToFilter(addedPart);
});

export default class PlacementService {
    // Used by both server and clients!

    public static IsValid(
        tower: TowerItem,
        player: Player,
        cf: CFrame,
        detectPart: Part,
    ): { success: boolean; errorMessage: string } {
        const leaderStats = player.FindFirstChild("leaderstats");
        const moneyStat = leaderStats?.FindFirstChild(
            COINS_STAT_NAME,
        ) as IntValue;
        if (moneyStat) {
            const playerMoney = moneyStat.Value;
            if (playerMoney < tower.Price)
                return {
                    success: false,
                    errorMessage: `Not enough ${COINS_STAT_NAME}. Need ${tower.Price - playerMoney} more ${COINS_STAT_NAME}!`,
                };
        } else
            return {
                success: false,
                errorMessage: `Not enough ${COINS_STAT_NAME}`,
            };

        const partsInBounds = Workspace.GetPartsInPart(
            detectPart,
            overlapParams,
        );
        if (partsInBounds.size() <= 0) {
            return { success: true, errorMessage: "" };
        }

        return { success: false, errorMessage: "You cannot place that there!" };
    }
}

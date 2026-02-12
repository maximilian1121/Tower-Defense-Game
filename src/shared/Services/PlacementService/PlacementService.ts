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
    ): boolean {
        const leaderStats = player.FindFirstChild("leaderstats");
        const moneyStat = leaderStats?.FindFirstChild(
            COINS_STAT_NAME,
        ) as IntValue;
        if (moneyStat) {
            const playerMoney = moneyStat.Value;
            if (playerMoney < tower.Price) return false;
        } else return false;

        const partsInBounds = Workspace.GetPartsInPart(
            detectPart,
            overlapParams,
        );
        if (partsInBounds.size() <= 0) {
            return true;
        }

        return false;
    }
}

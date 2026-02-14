import { CollectionService, HttpService, Workspace } from "@rbxts/services";
import { COINS_STAT_NAME } from "shared/helper";
import { getTowerAsset } from "shared/Services/AssetService/AssetService";
import { NetworkDefinitions } from "shared/Services/NetworkingService/NetworkingService";
import PlacementService from "shared/Services/PlacementService/PlacementService";
import { TowerItem } from "shared/Services/RegistryService/ItemRegistry";

const detectSphere = new Instance("Part");
detectSphere.Shape = Enum.PartType.Ball;
detectSphere.Parent = Workspace;
detectSphere.Anchored = true;
detectSphere.CanCollide = false;
detectSphere.CanQuery = false;
detectSphere.Transparency = 1;

export default class PlacementServiceServer {
    private static PlaceTower(
        player: Player,
        tower: TowerItem,
        targetPosition: Vector3,
    ) {
        const asset = getTowerAsset(tower.Id);
        const size = asset.GetExtentsSize();

        const diameter = math.max(size.X + 1, size.Z + 1);
        detectSphere.Size = new Vector3(diameter, diameter, diameter);
        detectSphere.Position = targetPosition;
        const { success, errorMessage } = PlacementService.IsValid(
            tower,
            player,
            new CFrame(targetPosition),
            detectSphere,
        );

        if (!success) {
            return { success, errorMessage };
        }

        const towerAsset = getTowerAsset(tower.Id).Clone();
        towerAsset.Parent = Workspace;
        towerAsset.Name = `Tower-${player.Name}-${HttpService.GenerateGUID(true)}`;
        towerAsset.PivotTo(new CFrame(targetPosition));

        towerAsset.GetDescendants().forEach((dec) => {
            if (dec.IsA("BasePart")) {
                dec.CollisionGroup = "Tower";
                CollectionService.AddTag(dec, "InvalidPlacement");
            }
        });

        const value = player
            .FindFirstChild("leaderstats")
            ?.FindFirstChild(COINS_STAT_NAME) as IntValue;

        value.Value -= tower.Price;

        return { success: true, errorMessage: "" };
    }

    public static Init() {
        NetworkDefinitions.InGame.PlaceTower.OnServerInvoke = (
            player,
            tower,
            targetPos,
        ) => {
            return this.PlaceTower(
                player,
                tower as TowerItem,
                targetPos as Vector3,
            );
        };
    }
}

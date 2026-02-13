import { Workspace } from "@rbxts/services";
import { getTowerAsset } from "shared/Services/AssetService/AssetService";
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
        tower: TowerItem,
        player: Player,
        targetPosition: Vector3,
    ) {
        const asset = getTowerAsset(tower.Id);
        const size = asset.GetExtentsSize();

        const diameter = math.max(size.X + 1, size.Z + 1);
        detectSphere.Size = new Vector3(diameter, diameter, diameter);
        detectSphere.Position = targetPosition;
        const canPlace = PlacementService.IsValid(
            tower,
            player,
            new CFrame(targetPosition),
            detectSphere,
        );

        print(canPlace);
    }
}

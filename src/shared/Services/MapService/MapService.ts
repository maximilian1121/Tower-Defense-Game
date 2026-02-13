import { RunService, Workspace } from "@rbxts/services";
import { Map } from "../RegistryService/MapRegistry";
import WorldContextService from "../WorldContextService/WorldContextService";
import { getMapAsset } from "../AssetService/AssetService";
import PathGenerator from "../PathGeneratorService/PathGeneratorService";
import { subdividePath } from "shared/helper";

export default class MapService {
    private static selectedMap: Map | undefined;
    private static mapAsset: Folder | Model | undefined;
    private static LoggedCanRunMessage: boolean;
    private static PathGenerator: PathGenerator = new PathGenerator();

    private static CanRun() {
        if (WorldContextService.IsLobby()) {
            if (!this.LoggedCanRunMessage) {
                warn(`Cannot run ${script.Parent?.Name} on the lobby!`);
                this.LoggedCanRunMessage = true;
            }
            return false;
        } else return true;
    }

    public static SetMap(map: Map) {
        // Server only
        if (!this.CanRun()) return;
        if (RunService.IsClient()) return;
        this.selectedMap = map;
    }

    public static LoadMap() {
        // Server only
        if (!this.CanRun()) return;
        if (RunService.IsClient()) return;
        if (this.selectedMap === undefined) return;
        const asset = getMapAsset(this.selectedMap.Id);
        if (asset !== undefined) {
            this.mapAsset = asset.Clone();
            this.mapAsset.Parent = Workspace;

            const pathFolder = this.mapAsset.FindFirstChild("Path");
            if (!pathFolder) return;

            const points = pathFolder
                .GetChildren()
                .filter((a) => a.IsA("Attachment"));

            points.sort((a, b) => {
                const numA = tonumber(a.Name) ?? 0;
                const numB = tonumber(b.Name) ?? 0;
                return numA > numB;
            });

            let path = points.map((p) => p.WorldPosition);
            path = subdividePath(path, 4); // Important to make the path actually smooth

            this.PathGenerator.setPath(path);
            this.PathGenerator.generatePath();
        }
    }
}

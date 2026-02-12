import { HttpService, Workspace } from "@rbxts/services";

const foundationHeight = 0.25;
const pathHeight = 0.15;

export default class PathGenerator {
    private pathParts: BasePart[];
    private container: Folder;
    private path: Vector3[];

    constructor() {
        this.pathParts = [];
        this.container = new Instance("Folder");
        this.container.Name = `GeneratedPath ${HttpService.GenerateGUID(true)}`;
        this.container.Parent = Workspace;
        this.path = [];
    }

    public setPath(path: Vector3[]): void {
        this.path = path;
    }

    public getPath(): Vector3[] {
        return this.path;
    }

    public destroy(): void {
        this.container.Destroy();
        this.pathParts = [];
    }

    private createNode(cf: CFrame): void {
        const foundation = new Instance("Part");
        foundation.Size = new Vector3(foundationHeight, 2.5, 2.5);
        foundation.CFrame = cf
            .add(new Vector3(0, foundationHeight / 2, 0))
            .mul(CFrame.Angles(0, math.rad(90), math.rad(90)));
        foundation.Shape = Enum.PartType.Cylinder;
        this.pathParts.push(foundation);

        const foundationPath = new Instance("Part");
        foundationPath.Size = new Vector3(pathHeight, 2.2, 2.2);
        foundationPath.CFrame = cf
            .add(new Vector3(0, foundationHeight + pathHeight / 2, 0))
            .mul(CFrame.Angles(0, math.rad(90), math.rad(90)));
        foundationPath.Shape = Enum.PartType.Cylinder;
        this.pathParts.push(foundationPath);
    }

    private createIntermediate(cf: CFrame, cf2: CFrame): void {
        const pos1 = cf.Position;
        const pos2 = cf2.Position;
        const direction = pos2.sub(pos1);
        const distance = direction.Magnitude;
        const centre = pos1.add(pos2).div(2);
        const lookCf = CFrame.lookAt(centre, pos2);

        const foundation = new Instance("Part");
        foundation.Size = new Vector3(2.5, foundationHeight, distance);
        foundation.CFrame = lookCf.add(new Vector3(0, foundationHeight / 2, 0));
        this.pathParts.push(foundation);

        const foundationPath = new Instance("Part");
        foundationPath.Size = new Vector3(2.2, pathHeight, distance);
        foundationPath.CFrame = lookCf.add(
            new Vector3(0, foundationHeight + pathHeight / 2, 0),
        );
        this.pathParts.push(foundationPath);
    }

    public generatePath(): void {
        this.container.ClearAllChildren();
        this.pathParts = [];

        if (this.path.size() < 1) return;

        for (let i = 0; i < this.path.size(); i++) {
            const currentPos = this.path[i];
            const currentCf = new CFrame(currentPos);
            this.createNode(currentCf);

            if (i < this.path.size() - 1) {
                const nextPos = this.path[i + 1];
                const nextCf = new CFrame(nextPos);
                this.createIntermediate(currentCf, nextCf);
            }
        }

        if (
            this.path.size() < 2
        ) // Check if the path exists if not just whatever
        {
            this.pathParts.forEach((p) => {
                p.Anchored = true;
                p.Parent = this.container;
            });
            return;
        } else {
            const toUnion = this.pathParts[0];
            toUnion.Parent = script;
            toUnion.Anchored = true;
            const rest: BasePart[] = [];

            for (let i = 1; i < this.pathParts.size(); i++) {
                const p = this.pathParts[i];
                if (p) rest.push(p);
            }

            const result = toUnion.UnionAsync(
                rest,
                Enum.CollisionFidelity.PreciseConvexDecomposition,
            );
            this.pathParts = [result];
            result.Parent = this.container;
        }
    }
}

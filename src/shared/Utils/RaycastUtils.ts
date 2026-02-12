import { Players, Workspace, RunService } from "@rbxts/services";

export class RaycastUtils {
    private static mouse?: Mouse;
    private static camera?: Camera;

    private static init() {
        if (!RunService.IsClient()) return;

        if (!this.mouse) {
            const player = Players.LocalPlayer;
            if (player) {
                this.mouse = player.GetMouse();
            }
        }

        if (!this.camera) {
            this.camera = Workspace.CurrentCamera;
        }
    }

    public static MouseRaycast(
        raycastParams?: RaycastParams,
        maxDistance = 1000,
    ): RaycastResult | undefined {
        if (!RunService.IsClient()) return;

        this.init();

        if (!this.mouse || !this.camera) return;

        const unitRay = this.camera.ScreenPointToRay(
            this.mouse.X,
            this.mouse.Y,
        );

        return Workspace.Raycast(
            unitRay.Origin,
            unitRay.Direction.mul(maxDistance),
            raycastParams,
        );
    }
}

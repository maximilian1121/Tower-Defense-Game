import ReactRoblox from "@rbxts/react-roblox";
import React, { useState, useEffect, useBinding } from "@rbxts/react";
import {
    CollectionService,
    HttpService,
    Players,
    ReplicatedStorage,
    RunService,
    Workspace,
} from "@rbxts/services";
import App from "../shared/UI/App";
import RegistryService from "shared/Services/RegistryService/RegistryService";
import {
    GameStateServiceClient,
    LocalGameState,
} from "shared/Services/GameStateService/GameStateService";
import { getTowerAsset } from "shared/Services/AssetService/AssetService";
import { RaycastUtils } from "shared/Utils/RaycastUtils";
import RangeCircle from "shared/UI/components/tower/rangeCircle";
import PlacementService from "shared/Services/PlacementService/PlacementService";
import { FULL_SIZE, WHITE } from "shared/UI/Constants";
import { generateGradientForRarity } from "shared/helper";
import WorldContextService from "shared/Services/WorldContextService/WorldContextService";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

RegistryService.RegisterAll();

if (!WorldContextService.IsLobby()) {
    const context = ReplicatedStorage.FindFirstChild("InGame") as InputContext;
    if (context) {
        context.Enabled = true;
    }
}

const GUI = new Instance("ScreenGui");
GUI.Parent = playerGui;
GUI.IgnoreGuiInset = true;
GUI.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

const root = ReactRoblox.createRoot(GUI);
root.render(React.createElement(App));

const placeholderCirclePart = new Instance("Part", script);
placeholderCirclePart.Size = new Vector3(5, 0.01, 5);
placeholderCirclePart.Name = "placeHolderRangeCircle";
placeholderCirclePart.Anchored = true;
placeholderCirclePart.CanCollide = false;
placeholderCirclePart.CanQuery = false;
placeholderCirclePart.CanTouch = false;
placeholderCirclePart.AudioCanCollide = false;
placeholderCirclePart.Transparency = 1;

const placeholderCircleSurfaceGui = new Instance(
    "SurfaceGui",
    placeholderCirclePart,
);
placeholderCircleSurfaceGui.Face = Enum.NormalId.Top;
placeholderCircleSurfaceGui.SizingMode =
    Enum.SurfaceGuiSizingMode.PixelsPerStud;

const placeholderCircleReactROOT = ReactRoblox.createRoot(
    placeholderCircleSurfaceGui,
);

let placeholderTower: Model | undefined = undefined;
const detectSphere = new Instance("Part");
detectSphere.Shape = Enum.PartType.Ball;
detectSphere.Parent = Workspace;
detectSphere.Anchored = true;
detectSphere.CanCollide = false;
detectSphere.CanQuery = false;
detectSphere.Transparency = 1;

const RangeCircleWrapper = () => {
    const [valid, setValid] = useState<boolean>(false);
    const [rotation, setRotation] = useBinding(0);
    const [detectRadScale, setDetectRadScale] = useBinding(
        UDim2.fromScale(0, 0),
    );

    useEffect(() => {
        const raycastParams = new RaycastParams();
        raycastParams.FilterType = Enum.RaycastFilterType.Exclude;
        raycastParams.IgnoreWater = true;

        CollectionService.GetInstanceAddedSignal("InvalidPlacement").Connect(
            (addedPart) => {
                raycastParams.AddToFilter(addedPart);
            },
        );
        CollectionService.GetTagged("InvalidPlacement").forEach((addedPart) => {
            raycastParams.AddToFilter(addedPart);
        });

        const conn = RunService.RenderStepped.Connect(() => {
            setRotation((os.clock() * 25) % 360);
            const state = GameStateServiceClient.GetLocalGameState();
            if (state?.name !== "placingTower") {
                if (placeholderTower) {
                    placeholderTower.Destroy();
                    placeholderTower = undefined;
                }
                return;
            }

            const towerData = state.tower;
            if (!towerData) {
                return;
            }

            const result = RaycastUtils.MouseRaycast(raycastParams, 128);

            if (!placeholderTower) {
                placeholderTower = getTowerAsset(towerData.Id).Clone();
                placeholderTower.Parent = Workspace;
                placeholderTower.Name = HttpService.GenerateGUID(false);

                placeholderCirclePart.Size = new Vector3(
                    towerData.Range * 2,
                    0.01,
                    towerData.Range * 2,
                );
                placeholderCirclePart.Parent = Workspace;
                const asset = getTowerAsset(towerData.Id);
                const size = asset.GetExtentsSize();

                const diameter = math.max(size.X + 1, size.Z + 1);

                setDetectRadScale(
                    UDim2.fromScale(
                        diameter / (towerData.Range * 2),
                        diameter / (towerData.Range * 2),
                    ),
                );

                detectSphere.Size = new Vector3(diameter, diameter, diameter);

                raycastParams.AddToFilter(placeholderTower);
                Players.GetPlayers().forEach((p) => {
                    if (p.Character) raycastParams.AddToFilter(p.Character);
                });
            }

            if (result && placeholderTower) {
                const goal = new CFrame(result.Position);
                placeholderTower.PivotTo(goal);
                detectSphere.Position = result.Position;
                placeholderCirclePart.Position = result.Position;

                setValid(
                    PlacementService.IsValid(
                        towerData,
                        player,
                        goal,
                        detectSphere,
                    ),
                );
            } else {
                setValid(false);
            }
        });

        return () => conn.Disconnect();
    }, []);

    return (
        <frame Size={FULL_SIZE} BackgroundTransparency={1}>
            <RangeCircle valid={valid} />
            <frame
                Position={UDim2.fromScale(0.5, 0.5)}
                AnchorPoint={new Vector2(0.5, 0.5)}
                Size={detectRadScale}
                BackgroundTransparency={0.75}
            >
                <uicorner CornerRadius={new UDim(1, 0)} />
                <uiaspectratioconstraint />
                <uigradient
                    Color={generateGradientForRarity("Common")}
                    Rotation={rotation}
                />

                <uistroke
                    Color={WHITE}
                    Thickness={8}
                    BorderStrokePosition={"Outer"}
                    Transparency={0.5}
                >
                    <uigradient
                        Color={generateGradientForRarity("Common")}
                        Rotation={rotation}
                    />
                </uistroke>
            </frame>
        </frame>
    );
};

placeholderCircleReactROOT.render(React.createElement(RangeCircleWrapper));

GameStateServiceClient.OnLocalGameStateChanged((gameState: LocalGameState) => {
    if (gameState === undefined) {
        placeholderCirclePart.Parent = script;
    }
});

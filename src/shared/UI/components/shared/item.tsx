import React, {
    useBinding,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "@rbxts/react";
import { FULL_SIZE, STUDS, WHITE } from "shared/UI/Constants";
import { useSnackbar } from "../toasting/snackbar";
import { RunService } from "@rbxts/services";
import { useSpring } from "@rbxts/react-spring";
import ItemRegistry, {
    Item,
} from "shared/Services/RegistryService/RegistryService";
import {
    getSoundAsset,
    getTextureAsset,
} from "shared/Services/AssetService/AssetService";

type Props = {
    itemId?: string | undefined;
    onPress?: () => void;
    doGrowAnimation?: boolean;
};

const rarityColors: Record<Item["Rarity"], Color3> = {
    Common: new Color3(0.41, 0.41, 0.41),
    Uncommon: new Color3(0.12, 1, 0.12),
    Rare: new Color3(0.12, 0.75, 1),
    Epic: new Color3(0.75, 0.12, 1),
    Legendary: new Color3(1, 0.59, 0.12),
    Mythic: new Color3(1, 0.97, 0.12),
    Exotic: new Color3(1, 0.75, 0.75),
};

export const generateGradientForRarity = (
    rarity: Item["Rarity"],
    sections: number = 4,
): ColorSequence => {
    const baseColor = rarityColors[rarity] || rarityColors.Common;

    if (rarity === "Exotic") {
        const NUM_KEYPOINTS = sections;
        const keypoints: ColorSequenceKeypoint[] = [];

        for (let i = 0; i < NUM_KEYPOINTS; i++) {
            const progress = i / (NUM_KEYPOINTS - 1);

            const color = Color3.fromHSV(progress, 0.5, 1);

            keypoints.push(new ColorSequenceKeypoint(progress, color));
        }

        return new ColorSequence(keypoints);
    }

    const percent = 0.5;

    const darkerColor = new Color3(
        baseColor.R * percent,
        baseColor.G * percent,
        baseColor.B * percent,
    );

    return new ColorSequence([
        new ColorSequenceKeypoint(0, baseColor),
        new ColorSequenceKeypoint(1, darkerColor),
    ]);
};

export default function Item({ itemId, onPress, doGrowAnimation }: Props) {
    const enqueueSnackbar = useSnackbar();
    const itemInformation = ItemRegistry.getItem(itemId ?? "");

    doGrowAnimation = doGrowAnimation ?? false;

    const viewportRef = useRef<ViewportFrame>(undefined);
    const cameraRef = useRef<Camera>(undefined);
    const buttonRef = useRef<ImageButton>(undefined);

    const [rarityGradient, setRarityGradient] = useState<ColorSequence>(
        generateGradientForRarity("Common"),
    );
    const [rotation, setRotation] = useBinding(0);
    const [guiState, setGuiState] = useState<Enum.GuiState>(Enum.GuiState.Idle);

    useEffect(() => {
        if (itemInformation) {
            setRarityGradient(
                generateGradientForRarity(itemInformation.Rarity),
            );
        }
    }, [itemInformation?.Rarity]);

    useEffect(() => {
        const connection = RunService.RenderStepped.Connect(() => {
            setRotation(os.clock() * 50);
        });

        return () => connection.Disconnect();
    }, []);

    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        const camera = cameraRef.current;

        if (
            viewport &&
            camera &&
            itemInformation &&
            !typeIs(itemInformation.Icon, "string")
        ) {
            viewport.CurrentCamera = camera;

            const worldModel = new Instance("WorldModel");
            worldModel.Parent = viewport;

            const model = itemInformation.Icon.Clone() as Model;
            model.Parent = worldModel;

            const camPos = model.FindFirstChild("CamPos") as
                | Attachment
                | undefined;
            const lookAt = model.FindFirstChild("LookAt") as
                | Attachment
                | undefined;

            camera.CFrame = new CFrame(
                camPos?.WorldPosition || new Vector3(0, 0, 0),
                lookAt?.WorldPosition || new Vector3(0, 0, 0),
            );

            return () => model.Destroy();
        }
    }, [itemInformation]);

    useEffect(() => {
        let connection: RBXScriptConnection;
        if (buttonRef.current) {
            connection = buttonRef.current
                .GetPropertyChangedSignal("GuiState")
                .Connect(() => {
                    setGuiState(
                        buttonRef.current?.GuiState || Enum.GuiState.Idle,
                    );
                });
        }

        return () => {
            if (connection !== undefined) {
                connection.Disconnect();
            }
        };
    }, [buttonRef]);

    if (!itemInformation) {
        if (itemId !== undefined) {
            warn(`Item with ID ${itemId} not found in registry.`);
            enqueueSnackbar(`Item with ID ${itemId} not found in registry.`, {
                variant: "warning",
            });
        } else {
            // Do nothing because it just means that this slot is empty and that's fine
        }
    }

    let buffRenderer = undefined;

    if (itemInformation && itemInformation.Type === "tower") {
        const buffs = itemInformation.Buffs || [];

        buffRenderer = (
            <frame
                Size={FULL_SIZE.add(UDim2.fromScale(0, 0))}
                BackgroundTransparency={1}
                AnchorPoint={new Vector2(0, 0.5)}
                Position={new UDim2(0, -16, 0, -8)}
            >
                <uilistlayout
                    FillDirection={"Horizontal"}
                    VerticalAlignment={"Center"}
                    HorizontalAlignment={"Left"}
                    Padding={new UDim(0, 2)}
                />
                {buffs.includes("Turbo") && (
                    <imagelabel
                        Size={UDim2.fromScale(0.4, 0.4)}
                        Position={UDim2.fromScale(0, 0)}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        Image={getTextureAsset("Buff_Turbo")}
                        BackgroundTransparency={1}
                    />
                )}
                {buffs.includes("Burn") && (
                    <imagelabel
                        Size={UDim2.fromScale(0.4, 0.4)}
                        Position={UDim2.fromScale(0, 0)}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        Image={getTextureAsset("Buff_Burn")}
                        BackgroundTransparency={1}
                    />
                )}
            </frame>
        );
    }

    function getSizeForState() {
        if (guiState === Enum.GuiState.Hover) {
            return UDim2.fromScale(1.15, 1.15);
        } else if (guiState === Enum.GuiState.Press) {
            return UDim2.fromScale(0.95, 0.95);
        }
        return UDim2.fromScale(1, 1);
    }

    function getConfigForState() {
        if (guiState === Enum.GuiState.Press) {
            return { tension: 1500, friction: 40 };
        }
        return { tension: 250, friction: 30 };
    }

    const styles = useSpring({
        size: doGrowAnimation ? getSizeForState() : UDim2.fromScale(1, 1),
        config: getConfigForState(),
    });

    return (
        <imagebutton
            Size={styles.size}
            Image={STUDS}
            ref={buttonRef}
            BackgroundColor3={new Color3(0.24, 0.24, 0.24)}
            Event={{
                Activated: () => {
                    if (onPress) {
                        onPress();
                    }
                    getSoundAsset("GUI_SELECT")?.PlayGlobal();
                },
                MouseEnter: () => {
                    getSoundAsset("GUI_HOVER")?.PlayGlobal();
                },
            }}
            AutoButtonColor={false}
        >
            <uicorner CornerRadius={new UDim(0, 8)} />
            <uiaspectratioconstraint />
            <uistroke
                Color={WHITE}
                Thickness={0.05}
                StrokeSizingMode={"ScaledSize"}
                BorderStrokePosition={"Center"}
            >
                <uigradient Color={rarityGradient} Rotation={rotation} />
            </uistroke>
            <uigradient Color={rarityGradient} Rotation={rotation} />

            {typeIs(itemInformation?.Icon, "string") ? (
                <imagelabel
                    key="IconImage"
                    Size={UDim2.fromScale(0.95, 0.95)}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    Image={itemInformation?.Icon ?? ""}
                    BackgroundTransparency={1}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                    {buffRenderer}
                </imagelabel>
            ) : (
                <viewportframe
                    key="IconViewport"
                    ref={viewportRef}
                    Size={UDim2.fromScale(0.95, 0.95)}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundTransparency={1}
                >
                    <uicorner CornerRadius={new UDim(0, 8)} />
                    <camera ref={cameraRef} FieldOfView={70} />
                    {buffRenderer}
                </viewportframe>
            )}
        </imagebutton>
    );
}

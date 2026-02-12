import React, {
    useBinding,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "@rbxts/react";
import { FULL_SIZE, GetFont, STUDS, WHITE } from "shared/UI/Constants";
import { useSnackbar } from "../snackbar";
import { RunService } from "@rbxts/services";
import { useSpring } from "@rbxts/react-spring";
import ItemRegistry, {
    Item,
} from "shared/Services/RegistryService/ItemRegistry";
import {
    getSoundAsset,
    getTextureAsset,
} from "shared/Services/AssetService/AssetService";
import HotbarTowerTooltip from "../tooltips/HotbarTowerTooltip";
import {
    darkenColor3,
    generateGradientForRarity,
    rarityColors,
} from "shared/helper";

type Props = {
    itemId?: string | undefined;
    onPress?: () => void;
    inHotbar?: boolean;
};

export default function Item({ itemId, onPress, inHotbar }: Props) {
    const enqueueSnackbar = useSnackbar();
    const itemInformation = ItemRegistry.getItem(itemId ?? "");

    inHotbar = inHotbar ?? false;

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
    let costRender = undefined;

    if (itemInformation && itemInformation.Type === "tower") {
        const buffs = itemInformation.Buffs || [];

        costRender = (
            <frame
                Size={UDim2.fromScale(0, 0.4)}
                BackgroundTransparency={1}
                AnchorPoint={new Vector2(0.5, 1)}
                Position={UDim2.fromScale(0.5, 1)}
                AutomaticSize={"X"}
            >
                <uilistlayout
                    FillDirection={"Horizontal"}
                    VerticalAlignment={"Center"}
                    HorizontalAlignment={"Left"}
                    Padding={new UDim(0, 4)}
                />
                <imagelabel
                    Image={getTextureAsset("COINS")}
                    Size={UDim2.fromScale(1, 1)}
                    BackgroundTransparency={1}
                >
                    <uiaspectratioconstraint />
                </imagelabel>
                <textlabel
                    FontFace={GetFont()}
                    TextScaled={true}
                    Size={UDim2.fromScale(0, 1)}
                    AutomaticSize={"X"}
                    BackgroundTransparency={1}
                    TextColor3={rarityColors.Legendary}
                    Text={`${itemInformation.Price}`}
                    TextXAlignment={"Left"}
                >
                    {/* <uiflexitem FlexMode={"Fill"} /> */}
                    <uistroke
                        Thickness={3}
                        Color={darkenColor3(rarityColors.Legendary, 0.5)}
                        BorderStrokePosition={"Center"}
                    />
                    <uitextsizeconstraint MinTextSize={12} MaxTextSize={64} />
                </textlabel>
            </frame>
        );

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
            return { tension: 2000, friction: 40 };
        }
        return { tension: 500, friction: 15 };
    }

    const styles = useSpring({
        size: inHotbar ? getSizeForState() : UDim2.fromScale(1, 1),
        rotation:
            guiState === Enum.GuiState.Hover || guiState === Enum.GuiState.Press
                ? 2
                : 0,
        config: getConfigForState(),
    });

    return (
        <imagebutton
            Size={styles.size}
            ref={buttonRef}
            BackgroundTransparency={1}
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
            <uiaspectratioconstraint />
            <imagelabel
                Rotation={styles.rotation}
                Size={FULL_SIZE}
                BackgroundColor3={new Color3(0.24, 0.24, 0.24)}
                Image={STUDS}
            >
                {itemInformation?.Type === "tower" && (
                    <screengui>
                        <HotbarTowerTooltip
                            towerId={itemInformation.Id}
                            visible={
                                guiState === Enum.GuiState.Hover ||
                                guiState === Enum.GuiState.Press
                            }
                            slot={buttonRef}
                        />
                    </screengui>
                )}
                <uicorner CornerRadius={new UDim(0, 8)} />
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
                        {costRender}
                    </viewportframe>
                )}
            </imagelabel>
            {inHotbar && (
                <imagelabel
                    Image={getTextureAsset("GLOW_BLUR")}
                    Size={UDim2.fromScale(1.3, 1.3)}
                    BackgroundTransparency={1}
                    ZIndex={-1}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Rotation={styles.rotation}
                >
                    <uigradient
                        Color={generateGradientForRarity(
                            itemInformation?.Rarity,
                        )}
                        Rotation={rotation}
                    />
                </imagelabel>
            )}
        </imagebutton>
    );
}

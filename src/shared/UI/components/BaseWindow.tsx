import React, { useBinding, useEffect, useRef, useState } from "@rbxts/react";
import { useSpring } from "@rbxts/react-spring";
import { RunService } from "@rbxts/services";
import { darkenColor3, generateGradientForRarity } from "shared/helper";
import { getSoundAsset } from "shared/Services/AssetService/AssetService";
import { Rarity } from "shared/Services/RegistryService/ItemRegistry";
import { FULL_SIZE, GetFont, STUDS, WHITE } from "shared/UI/Constants";

type WindowProps = {
    name: string;
    children?: React.ReactNode | undefined;
    onClose?: (() => void) | undefined;
    gradient?: Rarity;
    open: boolean;
};

export default function Window({
    name,
    children,
    onClose,
    gradient,
    open,
}: WindowProps) {
    const [rotation, setRotation] = useBinding(0);
    const closeButtonRef = useRef<ImageButton>();
    const [closeGuiState, setCloseGuiState] = useState<Enum.GuiState>(
        Enum.GuiState.Idle,
    );

    useEffect(() => {
        const connection = RunService.RenderStepped.Connect(() => {
            setRotation(os.clock() * 15);
        });

        return () => connection.Disconnect();
    }, []);

    useEffect(() => {
        const connection =
            closeButtonRef.current &&
            closeButtonRef.current
                .GetPropertyChangedSignal("GuiState")
                .Connect(() => {
                    setCloseGuiState(
                        closeButtonRef.current?.GuiState ?? Enum.GuiState.Idle,
                    );
                });

        return () => {
            if (connection) {
                connection.Disconnect();
            }
        };
    }, [closeButtonRef]);

    const styles = useSpring(
        {
            closeRot:
                closeGuiState === Enum.GuiState.Hover ||
                closeGuiState === Enum.GuiState.Press
                    ? 15
                    : 0,
            closeSiz:
                closeGuiState === Enum.GuiState.Hover
                    ? UDim2.fromScale(0.16, 0.16)
                    : UDim2.fromScale(0.15, 0.15),
            position: open
                ? UDim2.fromScale(0.5, 0.5)
                : UDim2.fromScale(0.5, 1.1),
            size: open ? UDim2.fromScale(0.68, 0.68) : UDim2.fromScale(0, 0),
            config: {
                tension: 600,
            },
        },
        [closeGuiState, open],
    );

    return (
        <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            Position={styles.position}
            Size={styles.size}
            BackgroundColor3={darkenColor3(WHITE, 0.2)}
        >
            <textlabel
                Text={name}
                TextScaled={true}
                Size={UDim2.fromScale(0, 0.1)}
                AutomaticSize={"X"}
                TextXAlignment={"Left"}
                FontFace={GetFont()}
                TextColor3={WHITE}
                BackgroundTransparency={1}
                AnchorPoint={new Vector2(0, 1)}
                Position={UDim2.fromOffset(0, -4)}
            >
                <uistroke
                    Color={WHITE}
                    Thickness={4}
                    BorderStrokePosition={"Center"}
                >
                    <uigradient
                        Color={generateGradientForRarity(gradient ?? "Rare")}
                        Rotation={rotation}
                    />
                </uistroke>
            </textlabel>
            <uistroke
                Color={WHITE}
                Thickness={8}
                BorderStrokePosition={"Center"}
            >
                <uigradient
                    Color={generateGradientForRarity(gradient ?? "Rare")}
                    Rotation={rotation}
                />
            </uistroke>
            <uigradient
                Color={generateGradientForRarity(gradient ?? "Rare")}
                Rotation={45}
            />
            <uicorner CornerRadius={new UDim(0, 12)} />
            <imagebutton
                AnchorPoint={new Vector2(0.5, 0.5)}
                Position={UDim2.fromScale(1, 0)}
                Size={styles.closeSiz}
                BackgroundColor3={new Color3(1, 0.29, 0.29)}
                AutoButtonColor={false}
                Rotation={styles.closeRot}
                ref={closeButtonRef}
                Image={STUDS}
                Event={{
                    Activated: () => {
                        getSoundAsset("GUI_SELECT")?.PlayGlobal();
                        if (onClose) onClose();
                    },
                }}
            >
                <uiaspectratioconstraint />
                <uicorner CornerRadius={new UDim(0, 12)} />
                <textlabel
                    TextScaled={true}
                    Text="X"
                    FontFace={GetFont()}
                    RichText={true}
                    TextColor3={WHITE}
                    Size={FULL_SIZE}
                    BackgroundTransparency={1}
                >
                    <uistroke
                        Color={new Color3()}
                        Thickness={4}
                        BorderStrokePosition={"Center"}
                    />
                </textlabel>
            </imagebutton>
            <frame
                key={"WINDOW_CONTENT"}
                Size={FULL_SIZE}
                ZIndex={-5}
                BackgroundTransparency={1}
            >
                <uipadding
                    PaddingBottom={new UDim(0, 8)}
                    PaddingTop={new UDim(0, 8)}
                    PaddingLeft={new UDim(0, 8)}
                    PaddingRight={new UDim(0, 8)}
                />
                {children}
            </frame>
        </frame>
    );
}

import { useEffect, useState } from "@rbxts/react";
import ItemRegistry, {
    TowerItem,
} from "shared/Services/RegistryService/ItemRegistry";
import ToolTipBase from "./BaseToolTip";
import React from "@rbxts/react";
import { GetFont, WHITE } from "shared/UI/Constants";
import Divider from "../shared/Divider";
import { getTextureAsset } from "shared/Services/AssetService/AssetService";
import { generateGradientForRarity } from "shared/helper";
import { RunService } from "@rbxts/services";
import { Stat } from "../inventory/stat";

type HotbarTowerTooltipProps = {
    towerId?: string;
    visible: boolean;
    slot?: React.RefObject<GuiObject>;
};

export default function HotbarTowerTooltip({
    towerId = "builderman",
    visible = false,
    slot,
}: HotbarTowerTooltipProps) {
    const [towerInformation, setTowerInformation] = useState<
        TowerItem | undefined
    >(undefined);
    const [pos, setPos] = useState(Vector2.zero);

    useEffect(() => {
        setTowerInformation(
            ItemRegistry.getItem(towerId) as TowerItem | undefined,
        );
    }, [towerInformation]);

    useEffect(() => {
        let conn: RBXScriptConnection | undefined;

        if (slot && slot.current) {
            conn = RunService.RenderStepped.Connect(() => {
                const element = slot.current;
                if (!element) return;

                const absPos = element.AbsolutePosition;
                const absSize = element.AbsoluteSize;

                const centerX = absPos.X + absSize.X / 2;
                const topY = absPos.Y;

                setPos(new Vector2(centerX, topY - 12));
            });
        }

        return () => conn?.Disconnect();
    }, [slot, visible]);

    return (
        <ToolTipBase
            aspectRatio={2.5 / 2}
            size={UDim2.fromScale(0.25, 0.3)}
            visible={visible}
            position={pos}
            anchorPoint={new Vector2(0.5, 1)}
        >
            <uipadding
                PaddingLeft={new UDim(0, 16)}
                PaddingRight={new UDim(0, 16)}
                PaddingTop={new UDim(0, 16)}
                PaddingBottom={new UDim(0, 16)}
            />
            <uilistlayout
                VerticalAlignment={"Top"}
                HorizontalAlignment={"Left"}
                Padding={new UDim(0, 4)}
            />
            <textlabel
                Text={towerInformation?.Name}
                Size={UDim2.fromScale(0, 0.2)}
                AutomaticSize={"X"}
                TextScaled={true}
                BackgroundTransparency={1}
                FontFace={GetFont()}
                TextColor3={WHITE}
            >
                <uistroke
                    Thickness={5}
                    Color={new Color3(0.14, 0.14, 0.14)}
                    BorderStrokePosition={"Center"}
                />
                <uigradient
                    Color={generateGradientForRarity(
                        towerInformation?.Rarity,
                        undefined,
                        0.75,
                    )}
                />
            </textlabel>
            <Divider thickness={4} />
            <Stat
                icon={getTextureAsset("SWORD") ?? ""}
                name="DMG"
                value={towerInformation?.DMG ?? 0}
            />
            <Stat
                icon={getTextureAsset("SPEED") ?? ""}
                name="SPD"
                value={towerInformation?.FireRate ?? 0}
            />
            <Stat
                icon={getTextureAsset("LOCATION") ?? ""}
                name="RNG"
                value={towerInformation?.Range ?? 0}
            />

            <Divider thickness={4} />

            <Stat
                icon={getTextureAsset("COINS") ?? ""}
                value={towerInformation?.Price ?? 0}
                colorRarity="Legendary"
            />
        </ToolTipBase>
    );
}

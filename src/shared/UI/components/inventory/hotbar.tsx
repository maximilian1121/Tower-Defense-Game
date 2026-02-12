import React, { useEffect } from "@rbxts/react";
import LevelBar from "./levelbar";
import Item from "./item";
import { RunService } from "@rbxts/services";
import { AppStoryControls } from "shared/UI/App";
import { EMPTY_HOTBAR, Hotbar, HotbarSlot, STUDIO_HOTBAR } from "shared/helper";
import { DataServiceClient } from "shared/Services/DataService/DataServiceClient";
import ItemRegistry, {
    TowerItem,
} from "shared/Services/RegistryService/ItemRegistry";
import WorldContextService from "shared/Services/WorldContextService/WorldContextService";
import { GameStateServiceClient } from "shared/Services/GameStateService/GameStateService";

const paddingUDim8 = new UDim(0, 8);

type props = {
    storyBookControls?: AppStoryControls;
    openUnitsToTower?: (tower?: TowerItem) => void;
};

export default function Hotbar({ storyBookControls, openUnitsToTower }: props) {
    const [hotbarData, setHotbarData] = React.useState<Hotbar | undefined>(
        EMPTY_HOTBAR,
    );

    useEffect(() => {
        if (!RunService.IsRunning()) {
            setHotbarData(STUDIO_HOTBAR);
            return; // Make it so that storybooks don't break
        }
        const fetchHotbar = async () => {
            const data = await DataServiceClient.GetHotbar();
            setHotbarData(data);
        };

        fetchHotbar();

        return () => {};
    }, []);

    const handleItemPress = (slot: HotbarSlot) => {
        if (hotbarData === undefined) {
            return;
        }
        if (WorldContextService.IsLobby()) {
            const tower = ItemRegistry.getItem(hotbarData[slot]);
            if (openUnitsToTower !== undefined) {
                openUnitsToTower(tower as TowerItem);
            }
            return;
        } else {
            GameStateServiceClient.SetCurrentlyPlacingTower(hotbarData[slot]);
        }
    };

    const slots = [1, 2, 3, 4, 5, 6] as const;

    return (
        <React.Fragment>
            <uipadding
                PaddingBottom={paddingUDim8}
                PaddingRight={paddingUDim8}
                PaddingLeft={paddingUDim8}
                PaddingTop={paddingUDim8}
            />
            <uilistlayout
                VerticalAlignment={Enum.VerticalAlignment.Bottom}
                HorizontalAlignment={Enum.HorizontalAlignment.Center}
                Padding={new UDim(0, 12)}
            />
            <frame
                Size={UDim2.fromScale(0.5, 0.15)}
                BackgroundTransparency={1}
                AnchorPoint={new Vector2(0.5, 1)}
                Position={UDim2.fromScale(0.5, 1)}
            >
                <uilistlayout
                    VerticalAlignment={Enum.VerticalAlignment.Center}
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    FillDirection={Enum.FillDirection.Horizontal}
                    Padding={new UDim(0, 16)}
                />
                <uipadding
                    PaddingBottom={paddingUDim8}
                    PaddingRight={paddingUDim8}
                    PaddingLeft={paddingUDim8}
                    PaddingTop={paddingUDim8}
                />
                {slots.map((e: number) => (
                    <Item
                        key={e}
                        itemId={hotbarData?.[`slot${e}` as HotbarSlot]}
                        onPress={() => {
                            handleItemPress(`slot${e}` as HotbarSlot);
                        }}
                        inHotbar={true}
                    />
                ))}
            </frame>
            <LevelBar storyBookControls={storyBookControls} />
        </React.Fragment>
    );
}

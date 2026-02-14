import React, { useEffect, useRef, useState } from "@rbxts/react";
import LevelBar from "./levelbar";
import Item from "./item";
import { ReplicatedStorage, RunService } from "@rbxts/services";
import { AppStoryControls } from "shared/UI/App";
import { EMPTY_HOTBAR, Hotbar, HotbarSlot, STUDIO_HOTBAR } from "shared/helper";
import { DataServiceClient } from "shared/Services/DataService/DataServiceClient";
import ItemRegistry, {
    TowerItem,
} from "shared/Services/RegistryService/ItemRegistry";
import WorldContextService from "shared/Services/WorldContextService/WorldContextService";
import {
    GameStateServiceClient,
    LocalGameState,
} from "shared/Services/GameStateService/GameStateService";
import Control from "../control";

const paddingUDim8 = new UDim(0, 8);

type props = {
    storyBookControls?: AppStoryControls;
    openUnitsToTower?: (tower?: TowerItem) => void;
};

export default function Hotbar({ storyBookControls, openUnitsToTower }: props) {
    const [hotbarData, setHotbarData] = React.useState<Hotbar | undefined>(
        EMPTY_HOTBAR,
    );
    const hotbarRef = useRef<Hotbar | undefined>(hotbarData);
    const [localGameState, setLocalGameState] = useState<
        LocalGameState | undefined
    >(undefined);

    const handleItemPress = (slot: HotbarSlot) => {
        const currentHotbar = hotbarRef.current;
        if (currentHotbar === undefined) {
            if (WorldContextService.IsLobby()) {
                return;
            } else {
                GameStateServiceClient.SetCurrentlyPlacingTower(undefined);
            }
            return;
        }
        if (WorldContextService.IsLobby()) {
            const tower = ItemRegistry.getItem(currentHotbar[slot]);
            if (openUnitsToTower !== undefined) {
                openUnitsToTower(tower as TowerItem);
            }
            return;
        } else {
            GameStateServiceClient.SetCurrentlyPlacingTower(
                currentHotbar[slot],
            );
        }
    };

    useEffect(() => {
        if (!RunService.IsRunning()) {
            setHotbarData(STUDIO_HOTBAR);
            return; // Make it so that storybooks don't break
        }

        const actions = (
            ReplicatedStorage.FindFirstChild("InGame") as InputContext
        ).GetChildren() as InputAction[];

        actions.forEach((action) => {
            const [index] = action.Name.find("Hotbar");

            if (index !== undefined) {
                const [slotName] = action.Name.gsub("Hotbar", "slot");
                action.Pressed.Connect(() => {
                    handleItemPress(slotName as HotbarSlot);
                });
            }
        });

        const fetchHotbar = async () => {
            const data = await DataServiceClient.GetHotbar();
            setHotbarData(data);
        };

        fetchHotbar();

        const conn = GameStateServiceClient.OnLocalGameStateChanged((state) => {
            setLocalGameState(state);
        });

        return () => {
            conn.Disconnect();
        };
    }, []);

    useEffect(() => {
        hotbarRef.current = hotbarData;
    }, [hotbarData]);

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
                BackgroundTransparency={1}
                Size={UDim2.fromScale(0.5, 0.075)}
            >
                {(localGameState?.name === "placingTower" ||
                    (storyBookControls && storyBookControls.PlacingTower)) && (
                    <>
                        <uilistlayout
                            FillDirection={"Horizontal"}
                            Padding={new UDim(0, 32)}
                            HorizontalAlignment={"Center"}
                        />
                        <Control
                            input={Enum.UserInputType.MouseButton1}
                            text="Place tower"
                        />
                        <Control input={Enum.KeyCode.E} text="Exit placing" />

                        <Control
                            input={Enum.KeyCode.LeftControl}
                            text="Continue placing"
                        />
                    </>
                )}
            </frame>
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

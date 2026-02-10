import React, { useEffect } from "@rbxts/react";
import LevelBar from "./levelbar";
import Item from "./item";
import { RunService } from "@rbxts/services";
import { AppStoryControls } from "shared/UI/App";
import { EMPTY_HOTBAR, Hotbar, HotbarSlot, STUDIO_HOTBAR } from "shared/helper";
import { NetworkDefinitions } from "shared/Services/NetworkingService/NetworkingService";

const paddingUDim8 = new UDim(0, 8);

type props = {
    storyBookControls?: AppStoryControls;
};

export default function Hotbar({ storyBookControls }: props) {
    const [hotbarData, setHotbarData] = React.useState<Hotbar | undefined>(
        EMPTY_HOTBAR,
    );

    useEffect(() => {
        if (!RunService.IsRunning()) {
            print(STUDIO_HOTBAR);
            setHotbarData(STUDIO_HOTBAR);
            return; // Make it so that storybooks don't break
        }
        const fetchHotbar = async () => {
            const hotbarRemote = NetworkDefinitions.Inventory.GetHotbar;
            const data = await hotbarRemote.InvokeServer();
            setHotbarData(data);
        };

        fetchHotbar();

        return () => {};
    }, []);

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
                Padding={new UDim(0, 8)}
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
                            print(`Pressed ${e}`);
                        }}
                        inHotbar={true}
                    />
                ))}
            </frame>
            <LevelBar storyBookControls={storyBookControls} />
        </React.Fragment>
    );
}

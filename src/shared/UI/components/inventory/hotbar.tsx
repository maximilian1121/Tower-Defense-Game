import React, { useEffect } from "@rbxts/react";
import LevelBar from "./levelbar";
import Item from "../shared/item";
import { EMPTY_HOTBAR, Hotbar, HotbarSlot } from "shared/Core/TYPES";
import { Networking } from "shared/Core/Networking";

const paddingUDim8 = new UDim(0, 8);

export default function Hotbar() {
    const [hotbarData, setHotbarData] = React.useState<Hotbar | undefined>(
        EMPTY_HOTBAR,
    );

    useEffect(() => {
        const fetchHotbar = async () => {
            const hotbarRemote = Networking.Get(
                "Inventory",
                "GetHotbar",
                "RemoteFunction",
            );
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
                    Padding={paddingUDim8}
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
                    />
                ))}
            </frame>
            <LevelBar />
        </React.Fragment>
    );
}

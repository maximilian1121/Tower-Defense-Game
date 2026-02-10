import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import ToolTipBase from "./components/tooltips/BaseToolTip";
import { FULL_SIZE } from "./Constants";
import HotbarTowerTooltip from "./components/tooltips/HotbarTowerTooltip";
import RegistryService from "shared/Services/RegistryService/RegistryService";

RegistryService.RegisterAll();

const story = {
    react: React,
    reactRoblox: ReactRoblox,
    story: () => {
        return (
            <frame Size={FULL_SIZE} BackgroundTransparency={1}>
                <uilistlayout
                    HorizontalAlignment={"Center"}
                    VerticalAlignment={"Center"}
                    Padding={new UDim(0, 16)}
                />
                <ToolTipBase visible={true} />
                <HotbarTowerTooltip visible={true} towerId="builderman" />
            </frame>
        );
    },
};

export = story;

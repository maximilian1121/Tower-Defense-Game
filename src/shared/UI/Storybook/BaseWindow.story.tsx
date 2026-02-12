import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import RegistryService from "shared/Services/RegistryService/RegistryService";
import Window from "../components/BaseWindow";
import { StoryControls } from "@rbxts/ui-labs/src/Typing/Typing";

RegistryService.RegisterAll();

type controls = {
    open: boolean;
};

const story = {
    react: React,
    reactRoblox: ReactRoblox,
    controls: {
        open: false,
    },
    story: (controls: StoryControls<controls>) => {
        return (
            <Window
                gradient="Rare"
                name="Test Base Window"
                open={controls.controls.open}
            />
        );
    },
};

export = story;

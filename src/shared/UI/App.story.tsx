import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import App, { AppStoryControls } from "./App";
import { StoryControls } from "@rbxts/ui-labs/src/Typing/Typing";
import { Number } from "@rbxts/ui-labs";
import ItemRegistry from "shared/Services/RegistryService/RegistryService";

ItemRegistry.registerItems();

const story = {
    react: React,
    reactRoblox: ReactRoblox,
    controls: {
        Level: Number(1, 1, undefined, 1, true, 25),
        Progression: Number(0, 0, undefined, 1, true, 1000),
    },
    story: (controls: StoryControls<AppStoryControls>) => {
        return <App storyBookControls={controls.controls} />;
    },
};

export = story;

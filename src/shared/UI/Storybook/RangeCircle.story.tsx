import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import RangeCircle from "../components/tower/rangeCircle";
import { StoryControls } from "@rbxts/ui-labs/src/Typing/Typing";

const controls = {
    Valid: true,
};

const story = {
    react: React,
    reactRoblox: ReactRoblox,
    controls,
    story: (control: StoryControls<typeof controls>) => {
        return <RangeCircle valid={control.controls.Valid} />;
    },
};

export = story;

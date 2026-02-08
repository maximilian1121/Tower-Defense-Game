import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import App from "./App";
import { registerItems } from "shared/Core/Registry/ItemRegistry";

registerItems();

const story = {
    react: React,
    reactRoblox: ReactRoblox,
    controls: undefined,
    story: () => {
        return <App />;
    },
};

export = story;

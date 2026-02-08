import ReactRoblox from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import App from "../shared/UI/App";
import React from "@rbxts/react";
import { registerItems } from "shared/Core/Registry/ItemRegistry";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

registerItems();

const root = ReactRoblox.createRoot(new Instance("ScreenGui", playerGui));
root.render(React.createElement(App));

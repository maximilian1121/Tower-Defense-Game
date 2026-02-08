import ReactRoblox from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import App from "../shared/UI/App";
import React from "@rbxts/react";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

const root = ReactRoblox.createRoot(new Instance("ScreenGui", playerGui));
root.render(React.createElement(App));

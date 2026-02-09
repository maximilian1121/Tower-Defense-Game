import ReactRoblox from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import App from "../shared/UI/App";
import React from "@rbxts/react";
import ItemRegistry from "shared/Services/RegistryService/ItemRegistry";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

ItemRegistry.registerItems();

const GUI = new Instance("ScreenGui");
GUI.Parent = playerGui;
GUI.IgnoreGuiInset = true;

const root = ReactRoblox.createRoot(GUI);
root.render(React.createElement(App));

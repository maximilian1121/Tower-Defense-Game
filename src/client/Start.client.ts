import ReactRoblox from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import App from "../shared/UI/App";
import React from "@rbxts/react";
import RegistryService from "shared/Services/RegistryService/RegistryService";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

RegistryService.RegisterAll();

const GUI = new Instance("ScreenGui");
GUI.Parent = playerGui;
GUI.IgnoreGuiInset = true;
GUI.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

const root = ReactRoblox.createRoot(GUI);
root.render(React.createElement(App));

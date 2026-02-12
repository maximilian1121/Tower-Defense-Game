import ReactRoblox from "@rbxts/react-roblox";
import { Players, RunService } from "@rbxts/services";
import App from "../shared/UI/App";
import React from "@rbxts/react";
import RegistryService from "shared/Services/RegistryService/RegistryService";
import {
    GameState,
    GameStateServiceClient,
} from "shared/Services/GameStateService/GameStateService";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

RegistryService.RegisterAll();

const GUI = new Instance("ScreenGui");
GUI.Parent = playerGui;
GUI.IgnoreGuiInset = true;
GUI.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

const root = ReactRoblox.createRoot(GUI);
root.render(React.createElement(App)); // This function DOES NOT BLOCK! (Note to max)

RunService.RenderStepped.Connect((delta) => {});

const onLocalGameStateChange = (state: GameState) => {
    if (!state) {
        return;
    }
};

GameStateServiceClient.OnLocalGameStateChanged(onLocalGameStateChange);

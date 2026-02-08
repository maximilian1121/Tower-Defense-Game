import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import App from "./App";

const controls = {};

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls: controls,
	story: () => {
		return <App />;
	},
};

export = story;

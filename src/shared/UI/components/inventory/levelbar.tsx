import React from "@rbxts/react";
import { FULL_SIZE } from "shared/UI/Constants";
import { Text } from "../shared/Text";

export default function LevelBar() {
	return (
		<frame Size={UDim2.fromScale(0.4, 0.05)} BackgroundColor3={new Color3(0.5, 1, 0.5)}>
			<uicorner CornerRadius={new UDim(1, 0)} />
			<uistroke Thickness={4} BorderStrokePosition={Enum.BorderStrokePosition.Center} />
			<uigradient
				Color={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromRGB(255, 255, 255)),
						new ColorSequenceKeypoint(0.75, Color3.fromRGB(214, 214, 214)),
						new ColorSequenceKeypoint(1, Color3.fromRGB(102, 102, 102)),
					])
				}
				Rotation={90}
			/>
			<Text BackgroundTransparency={1} Size={FULL_SIZE} Text={"Level x (y/z)"} />
		</frame>
	);
}

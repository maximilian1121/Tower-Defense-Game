import React from "@rbxts/react";
import LevelBar from "./levelbar";
import Item from "../shared/item";

const paddingUDim8 = new UDim(0, 8);

export default function Hotbar() {
	return (
		<React.Fragment>
			<uipadding
				PaddingBottom={paddingUDim8}
				PaddingRight={paddingUDim8}
				PaddingLeft={paddingUDim8}
				PaddingTop={paddingUDim8}
			/>
			<uilistlayout
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				Padding={new UDim(0, 8)}
			/>
			<frame
				Size={UDim2.fromScale(0.45, 0.15)}
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0.5, 1)}
				Position={UDim2.fromScale(0.5, 1)}
			>
				<uilistlayout
					VerticalAlignment={Enum.VerticalAlignment.Center}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					FillDirection={Enum.FillDirection.Horizontal}
					Padding={paddingUDim8}
				/>
				<uipadding
					PaddingBottom={paddingUDim8}
					PaddingRight={paddingUDim8}
					PaddingLeft={paddingUDim8}
					PaddingTop={paddingUDim8}
				/>
				<Item itemId="builderman" />
				<Item itemId="zombob" />
				<Item itemId="teapotspider" />
				<Item itemId="baby" />
				<Item itemId="bubba" />
				<Item itemId="bubbabig" />
			</frame>
			<LevelBar />
	</React.Fragment>
	);
}

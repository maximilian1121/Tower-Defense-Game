import React from "@rbxts/react";
import { STUDS } from "shared/UI/Constants";

type Props = {
	itemId: string;
};

export default function Item({ itemId }: Props)
{
	return (
		<imagebutton
			Size={UDim2.fromScale(1, 1)}
			Image={STUDS}
			BackgroundColor3={new Color3(0.24, 0.24, 0.24)}
		>
			<uiaspectratioconstraint />
		</imagebutton>
	);
}
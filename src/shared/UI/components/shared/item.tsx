import React, { useLayoutEffect, useRef } from "@rbxts/react";
import { Item, ItemRegistry } from "shared/Core/Registry/ItemRegistry";
import { STUDS } from "shared/UI/Constants";
import { useSnackbar } from "../toasting/snackbar";

type Props = {
	itemId: string;
};

export default function Item({ itemId }: Props) {
	const enqueueSnackbar = useSnackbar();
	const itemInformation: Item | undefined = ItemRegistry.getItem(itemId);

	const viewportRef = useRef<ViewportFrame>(undefined);
	const cameraRef = useRef<Camera>(undefined);

	useLayoutEffect(() => {
		const viewport = viewportRef.current;
		const camera = cameraRef.current;

		if (viewport && camera && itemInformation && !typeIs(itemInformation.Icon, "string")) {
			viewport.CurrentCamera = camera;

			const worldModel = new Instance("WorldModel");
			worldModel.Parent = viewport;

			const model = itemInformation.Icon.Clone() as Model;
			model.Parent = worldModel;

			const camPos = model.FindFirstChild("CamPos") as Attachment | undefined;
			const lookAt = model.FindFirstChild("LookAt") as Attachment | undefined;

			camera.CFrame = new CFrame(
				camPos?.WorldPosition || new Vector3(0, 0, 0),
				lookAt?.WorldPosition || new Vector3(0, 0, 0),
			);

			return () => model.Destroy();
		}
	}, [itemInformation]);

	if (!itemInformation) {
		warn(`Item with ID ${itemId} not found in registry.`);
		enqueueSnackbar(`Item with ID ${itemId} not found in registry.`, { variant: "warning" });
		return undefined;
	}

	return (
		<imagebutton
			Size={UDim2.fromScale(1, 1)}
			Image={STUDS}
			BackgroundColor3={new Color3(0.24, 0.24, 0.24)}
			Event={{
				Activated: () => enqueueSnackbar(`Item clicked: ${itemId}`),
			}}
		>
			<uicorner CornerRadius={new UDim(0, 8)} />
			<uiaspectratioconstraint />

			{typeIs(itemInformation.Icon, "string") ? (
				<imagelabel
					key="IconImage"
					Size={UDim2.fromScale(0.8, 0.8)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Image={itemInformation.Icon}
					BackgroundTransparency={1}
				/>
			) : (
				<viewportframe
					key="IconViewport"
					ref={viewportRef}
					Size={UDim2.fromScale(0.8, 0.8)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
				>
					<camera ref={cameraRef} FieldOfView={70} />
				</viewportframe>
			)}
		</imagebutton>
	);
}

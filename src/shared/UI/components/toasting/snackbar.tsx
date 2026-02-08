import React, { createContext, useContext, useState, useCallback, PropsWithChildren } from "@rbxts/react";
import { Text } from "../shared/Text";

interface SnackbarOptions {
	variant?: "info" | "success" | "warning" | "error";
	duration?: number;
}

interface SnackbarItem extends SnackbarOptions {
	id: string;
	message: string;
}

const SnackbarContext = createContext<((message: string, options?: SnackbarOptions) => void) | undefined>(undefined);

export function useSnackbar() {
	const context = useContext(SnackbarContext);
	if (!context) throw "useSnackbar must be used within a SnackbarProvider";
	return context;
}

export default function SnackbarProvider({ children }: PropsWithChildren) {
	const [queue, setQueue] = useState<SnackbarItem[]>([]);

	const enqueueSnackbar = useCallback((message: string, options: SnackbarOptions = {}) => {
		const id = `snack_${os.clock()}_${math.random()}`;

		setQueue((prev) => [...prev, { id, message, ...options }]);

		const waitTime = options.duration ?? 5;
		task.delay(waitTime, () => {
			setQueue((prev) => prev.filter((item) => item.id !== id));
		});
	}, []);

	return (
		<SnackbarContext.Provider value={enqueueSnackbar}>
			{children}
			<screengui ResetOnSpawn={false} DisplayOrder={100} IgnoreGuiInset>
				<frame key="SnackbarAnchor" Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1}>
					<uilistlayout
						VerticalAlignment="Bottom"
						HorizontalAlignment="Center"
						Padding={new UDim(0, 10)}
						SortOrder="LayoutOrder"
					/>
					<uipadding PaddingBottom={new UDim(0, 20)} />

					{queue.map((snack) => (
						<Text
							key={snack.id}
							Text={snack.message}
							Size={new UDim2(0, 300, 0, 50)}
							BackgroundColor3={Color3.fromRGB(30, 30, 30)}
						/>
					))}
				</frame>
			</screengui>
		</SnackbarContext.Provider>
	);
}

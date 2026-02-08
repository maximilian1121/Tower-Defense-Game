import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	PropsWithChildren,
	useEffect,
	useBinding,
} from "@rbxts/react";
import { TweenService } from "@rbxts/services";
import { FULL_SIZE, GetFont, WHITE } from "shared/UI/Constants";

const MAX_SNACKS = 4;
const SNACK_HEIGHT = 32;

const VARIANT_COLORS: Record<string, Color3> = {
	success: Color3.fromRGB(46, 125, 50),
	error: Color3.fromRGB(198, 40, 40),
	warning: Color3.fromRGB(239, 108, 0),
	info: Color3.fromRGB(30, 30, 30),
};

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

function AnimatedSnack({ snack, onExited }: { snack: SnackbarItem; onExited: (id: string) => void }) {
	const [progress, setProgress] = useBinding(0);

	useEffect(() => {
		const animationValue = new Instance("NumberValue");
		animationValue.Value = 0;

		const tweenInfo = new TweenInfo(0.4, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);

		const connection = animationValue.GetPropertyChangedSignal("Value").Connect(() => {
			setProgress(animationValue.Value);
		});

		const entryTween = TweenService.Create(animationValue, tweenInfo, { Value: 1 });
		entryTween.Play();

		const waitTime = snack.duration ?? 5;
		const delay = task.delay(waitTime, () => {
			const exitTween = TweenService.Create(animationValue, tweenInfo, { Value: 0 });
			exitTween.Play();
			exitTween.Completed.Connect(() => {
				onExited(snack.id);
			});
		});

		return () => {
			task.cancel(delay);
			connection.Disconnect();
			animationValue.Destroy();
		};
	}, [snack.id, onExited, snack.duration, setProgress]);

	const animatedPosition = progress.map((p: number) => new UDim2(1 - p, 0, 0, 0));
	const animatedBGTransparency = progress.map((p: number) => 1 - p * 0.5);
	const animatedTXTransparency = progress.map((p: number) => 1 - p);

	return (
		<frame
			key={snack.id}
			Size={new UDim2(1, 0, 0, SNACK_HEIGHT)}
			BackgroundTransparency={1}
			LayoutOrder={-os.time()}
			AutomaticSize={Enum.AutomaticSize.X}
		>
			<frame
				Size={FULL_SIZE}
				BackgroundColor3={VARIANT_COLORS[snack.variant ?? "info"]}
				Position={animatedPosition}
				AutomaticSize={Enum.AutomaticSize.X}
				BackgroundTransparency={animatedBGTransparency}
			>
				<uicorner CornerRadius={new UDim(0, 4)} />
				<uigradient
					Transparency={
						new NumberSequence([new NumberSequenceKeypoint(0, 0), new NumberSequenceKeypoint(1, 0.2)])
					}
				/>
				<uipadding
					PaddingBottom={new UDim(0, 4)}
					PaddingTop={new UDim(0, 4)}
					PaddingLeft={new UDim(0, 8)}
					PaddingRight={new UDim(0, 8)}
				/>
				<textlabel
					Size={FULL_SIZE}
					BackgroundTransparency={1}
					Text={snack.message}
					TextScaled={true}
					TextColor3={WHITE}
					TextXAlignment="Left"
					TextTransparency={animatedTXTransparency}
					FontFace={GetFont()}
				/>
			</frame>
		</frame>
	);
}

export default function SnackbarProvider({ children }: PropsWithChildren) {
	const [queue, setQueue] = useState<SnackbarItem[]>([]);

	const removeSnack = useCallback((id: string) => {
		setQueue((prev) => prev.filter((item) => item.id !== id));
	}, []);

	const enqueueSnackbar = useCallback((message: string, options: SnackbarOptions = {}) => {
		const id = `snack_${os.clock()}_${math.random()}`;

		setQueue((prev) => {
			const newQueue = prev.size() >= MAX_SNACKS ? prev.filter((_, index) => index !== 0) : [...prev];
			return [...newQueue, { id, message, ...options }];
		});
	}, []);

	return (
		<SnackbarContext.Provider value={enqueueSnackbar}>
			{children}
			<screengui ResetOnSpawn={false} DisplayOrder={100} IgnoreGuiInset>
				<frame
					key="SnackbarAnchor"
					Size={new UDim2(0.3, 0, 0.4, 0)}
					Position={new UDim2(0.5, 0, 0.1, 0)}
					AnchorPoint={new Vector2(0.5, 0)}
					BackgroundTransparency={1}
				>
					<uilistlayout
						VerticalAlignment="Top"
						HorizontalAlignment="Center"
						Padding={new UDim(0, 8)}
						SortOrder="LayoutOrder"
					/>
					{queue.map((snack) => (
						<AnimatedSnack key={snack.id} snack={snack} onExited={removeSnack} />
					))}
				</frame>
			</screengui>
		</SnackbarContext.Provider>
	);
}

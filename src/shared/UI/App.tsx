import React, { useEffect, useState } from "@rbxts/react";
import SnackbarProvider from "./components/snackbar";
import Hotbar from "./components/inventory/hotbar";
import { FULL_SIZE, GetFont } from "./Constants";
import {
    ContentProvider,
    ReplicatedFirst,
    ReplicatedStorage,
    RunService,
} from "@rbxts/services";
import CrossPlaceServiceClient from "shared/Services/CrossPlaceService/CrossPlaceServiceClient";
import ProgressBar from "./components/ProgressBar";

type props = {
    storyBookControls: AppStoryControls;
};

export type AppStoryControls = {
    Level: number;
    Progression: 0;
};

export default function App({ storyBookControls }: props) {
    const [loading, setLoading] = useState(true);
    const [preloadPercent, setPreloadPercent] = useState(0);

    useEffect(() => {
        if (RunService.IsStudio()) {
            setLoading(false);
            return;
        }

        ReplicatedFirst.RemoveDefaultLoadingScreen();

        const toLoad = ReplicatedStorage.GetDescendants();

        task.spawn(() => {
            toLoad.forEach((asset: Instance, idx) => {
                const total = toLoad.size();
                setPreloadPercent((idx + 1) / total);
                task.wait();
                ContentProvider.PreloadAsync([asset]);
                task.wait();
            });
            task.wait(2.5);
            setLoading(false);
        });
    }, []);

    return (
        <SnackbarProvider>
            {!loading ? (
                <Hotbar storyBookControls={storyBookControls} />
            ) : (
                <>
                    <imagelabel
                        Size={FULL_SIZE}
                        Image={
                            CrossPlaceServiceClient.GetCurrentLocation()?.Icon
                        }
                    />
                    <frame
                        Size={UDim2.fromScale(1, 1)}
                        BackgroundTransparency={1}
                    >
                        <uilistlayout
                            HorizontalAlignment={"Center"}
                            VerticalAlignment={"Center"}
                            Padding={new UDim(0, 8)}
                        />
                        <textlabel
                            Size={UDim2.fromScale(0, 0)}
                            BackgroundTransparency={1}
                            AutomaticSize={"XY"}
                            AnchorPoint={new Vector2(0.5, 0.5)}
                            Position={UDim2.fromScale(0.5, 0.5)}
                            Text={"Loading!"}
                            TextScaled={true}
                            FontFace={GetFont()}
                            TextColor3={new Color3(1, 1, 1)}
                        >
                            <uistroke
                                Thickness={0.1}
                                StrokeSizingMode={"ScaledSize"}
                                Color={new Color3(0.1, 0.1, 0.1)}
                            />
                            <uitextsizeconstraint MaxTextSize={64} />
                        </textlabel>
                        <textlabel
                            Size={UDim2.fromScale(0, 0)}
                            BackgroundTransparency={1}
                            AutomaticSize={"XY"}
                            AnchorPoint={new Vector2(0.5, 0.5)}
                            Position={UDim2.fromScale(0.5, 0.5)}
                            Text={`Heading to ${
                                CrossPlaceServiceClient.GetCurrentLocation()
                                    ?.Name ?? "Lobby"
                            }!`}
                            TextScaled={true}
                            FontFace={GetFont()}
                            TextColor3={new Color3(1, 1, 1)}
                        >
                            <uistroke
                                Thickness={0.1}
                                StrokeSizingMode={"ScaledSize"}
                                Color={new Color3(0.1, 0.1, 0.1)}
                            />
                            <uitextsizeconstraint MaxTextSize={48} />
                        </textlabel>
                        <ProgressBar
                            text={`${math.round(preloadPercent * 100)}%`}
                            value={preloadPercent}
                            max={1}
                        />
                    </frame>
                </>
            )}
        </SnackbarProvider>
    );
}

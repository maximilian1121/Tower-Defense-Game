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

type props = {
    storyBookControls: AppStoryControls;
};

export type AppStoryControls = {
    Level: number;
    Progression: 0;
};

export default function App({ storyBookControls }: props) {
    const [loading, setLoading] = useState(true);
    const [preloadText, setPreloadText] = useState("");

    useEffect(() => {
        if (!RunService.IsRunning()) {
            setLoading(false);
            return;
        }

        ReplicatedFirst.RemoveDefaultLoadingScreen();

        const toLoad = ReplicatedStorage.GetDescendants();

        task.spawn(() => {
            toLoad.forEach((asset: Instance) => {
                setPreloadText(`Preloading ${asset.Name}`);
                task.wait();
                ContentProvider.PreloadAsync([asset]);
                task.wait();
            });
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
                            Text={"Heading to lobby!"}
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
                        <textlabel
                            Size={UDim2.fromScale(0, 0)}
                            BackgroundTransparency={1}
                            AutomaticSize={"XY"}
                            AnchorPoint={new Vector2(0.5, 0.5)}
                            Position={UDim2.fromScale(0.5, 0.5)}
                            Text={preloadText}
                            TextScaled={true}
                            FontFace={GetFont()}
                            TextColor3={new Color3(1, 1, 1)}
                        >
                            <uistroke
                                Thickness={0.1}
                                StrokeSizingMode={"ScaledSize"}
                                Color={new Color3(0.1, 0.1, 0.1)}
                            />
                            <uitextsizeconstraint MaxTextSize={32} />
                        </textlabel>
                    </frame>
                </>
            )}
        </SnackbarProvider>
    );
}

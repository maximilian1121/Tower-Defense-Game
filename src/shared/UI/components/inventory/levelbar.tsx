import React, { useEffect, useRef, useState } from "@rbxts/react";
import { FULL_SIZE, STUDS } from "shared/UI/Constants";
import { Text } from "../shared/Text";
import { RunService } from "@rbxts/services";
import { useSpring } from "@rbxts/react-spring";
import { AppStoryControls } from "shared/UI/App";
import { LEVEL_DATA_TEMPLATE, LevelData } from "shared/UTILS";
import { DataServiceClient } from "shared/Services/DataService/DataServiceClient";

type props = {
    storyBookControls?: AppStoryControls;
};

export default function LevelBar({ storyBookControls }: props) {
    const [levelBarData, setLevelBarData] = useState<LevelData>(
        storyBookControls
            ? {
                  Level: storyBookControls.Level,
                  Progression: storyBookControls.Progression,
                  NextMilestone: storyBookControls.Level * 25,
              }
            : LEVEL_DATA_TEMPLATE,
    );

    useEffect(() => {
        if (!RunService.IsRunning()) return;
        const fetch = async () => {
            const data = DataServiceClient.GetLevelData();
            setLevelBarData(data ?? LEVEL_DATA_TEMPLATE);
        };
        fetch();
        const conn = DataServiceClient.OnLevelDataChange().Connect(fetch);
        return () => conn.Disconnect();
    }, []);

    function getSize(): UDim2 {
        if (storyBookControls)
            return UDim2.fromScale(
                storyBookControls.Progression / (storyBookControls.Level * 25),
                1,
            );
        return UDim2.fromScale(
            levelBarData.Progression / levelBarData.NextMilestone,
            1,
        );
    }

    const barRef = useRef<CanvasGroup>(undefined);
    const [barHeight, setBarHeight] = useState(20);

    useEffect(() => {
        if (!barRef.current) return;
        setBarHeight(barRef.current.AbsoluteSize.Y);
    }, [barRef.current]);

    const styles = useSpring(
        {
            size: getSize(),
            tile: new UDim2(0, barHeight, 0, barHeight),
            config: { tension: 500, friction: 100 },
            immediate: barHeight === 0,
        },
        [storyBookControls, levelBarData, barHeight],
    );

    return (
        <canvasgroup
            Size={UDim2.fromScale(0.4, 0.05)}
            ref={barRef}
            BackgroundColor3={new Color3(0.22, 0.22, 0.22)}
            ClipsDescendants
        >
            <uicorner CornerRadius={new UDim(1, 0)} />
            <uistroke Thickness={4} BorderStrokePosition="Outer" />
            <imagelabel
                Size={styles.size}
                BackgroundColor3={new Color3(0.5, 1, 0.5)}
                BorderSizePixel={0}
                Image={STUDS}
                ScaleType="Tile"
                TileSize={styles.tile}
            >
                <uicorner CornerRadius={new UDim(1, 0)} />
            </imagelabel>
            <uigradient
                Color={
                    new ColorSequence([
                        new ColorSequenceKeypoint(
                            0,
                            Color3.fromRGB(255, 255, 255),
                        ),
                        new ColorSequenceKeypoint(
                            0.75,
                            Color3.fromRGB(214, 214, 214),
                        ),
                        new ColorSequenceKeypoint(
                            1,
                            Color3.fromRGB(102, 102, 102),
                        ),
                    ])
                }
                Rotation={90}
            />
            <Text
                BackgroundTransparency={1}
                Size={FULL_SIZE}
                Text={
                    storyBookControls
                        ? `Level ${storyBookControls.Level} (${storyBookControls.Progression}/${storyBookControls.Level * 25})`
                        : `Level ${levelBarData.Level} (${levelBarData.Progression}/${levelBarData.NextMilestone})`
                }
            >
                <uistroke
                    Thickness={0.05}
                    StrokeSizingMode="ScaledSize"
                    BorderStrokePosition="Outer"
                />
                <uigradient
                    Color={
                        new ColorSequence([
                            new ColorSequenceKeypoint(
                                0,
                                Color3.fromRGB(255, 255, 255),
                            ),
                            new ColorSequenceKeypoint(
                                0.75,
                                Color3.fromRGB(214, 214, 214),
                            ),
                            new ColorSequenceKeypoint(
                                1,
                                Color3.fromRGB(102, 102, 102),
                            ),
                        ])
                    }
                    Rotation={90}
                />
            </Text>
        </canvasgroup>
    );
}

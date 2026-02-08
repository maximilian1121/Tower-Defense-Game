import React, { useEffect, useState } from "@rbxts/react";
import { FULL_SIZE } from "shared/UI/Constants";
import { Text } from "../shared/Text";
import { Networking } from "shared/Core/Networking";
import { LEVEL_DATA_TEMPLATE, LevelData } from "shared/Core/TYPES";

export default function LevelBar() {
    const [levelBarData, setLevelBarData] =
        useState<LevelData>(LEVEL_DATA_TEMPLATE);

    useEffect(() => {
        const fetchHotbar = async () => {
            const hotbarRemote = Networking.Get(
                "Stats",
                "GetLevelData",
                "RemoteFunction",
            );
            const data = await hotbarRemote.InvokeServer();
            setLevelBarData(data);
        };

        fetchHotbar();

        return () => {};
    }, []);
    return (
        <canvasgroup
            Size={UDim2.fromScale(0.4, 0.05)}
            BackgroundColor3={new Color3(0.22, 0.22, 0.22)}
        >
            <uicorner CornerRadius={new UDim(1, 0)} />
            <uistroke
                Thickness={4}
                BorderStrokePosition={Enum.BorderStrokePosition.Center}
            />
            <frame
                Size={UDim2.fromScale(
                    levelBarData.Progression / levelBarData.NextMilestone,
                    1,
                )}
                BackgroundColor3={new Color3(0.5, 1, 0.5)}
                BorderSizePixel={0}
            >
                <uicorner CornerRadius={new UDim(1, 0)} />
            </frame>
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
                Text={`Level ${levelBarData.Level} (${levelBarData.Progression}/${levelBarData.NextMilestone})`}
            />
        </canvasgroup>
    );
}

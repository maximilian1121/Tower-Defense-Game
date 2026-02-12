import React from "@rbxts/react";
import { useSpring } from "@rbxts/react-spring";
import { FULL_SIZE, GetFont } from "../Constants";
import { Text } from "./Text";

type ProgressBarProps = {
    text: string;
    value: number;
    max: number;
};

export default function ProgressBar({ text, value, max }: ProgressBarProps) {
    const styles = useSpring(
        {
            size: new UDim2(math.max(1, math.min(2, 1 + value / max)), 0, 1, 0),
            config: { tension: 500, friction: 100 },
        },
        [text, value, max],
    );

    return (
        <canvasgroup
            Size={UDim2.fromScale(0.4, 0.05)}
            ClipsDescendants={true}
            BackgroundTransparency={1}
        >
            <frame
                Size={FULL_SIZE}
                BackgroundColor3={new Color3(0.13, 0.13, 0.13)}
                ZIndex={-5}
            >
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
            </frame>
            <uicorner CornerRadius={new UDim(1, 0)} />
            <uistroke
                Thickness={4}
                BorderStrokePosition="Outer"
                Color={new Color3(0.2, 0.2, 0.2)}
            />
            <frame
                Size={styles.size}
                BackgroundColor3={new Color3(0.5, 1, 0.5)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(-1, 0)}
            >
                <uicorner CornerRadius={new UDim(1, 0)} />
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
            </frame>
            <Text
                BackgroundTransparency={1}
                AnchorPoint={new Vector2(0.5, 0.5)}
                Position={UDim2.fromScale(0.5, 0.5)}
                Text={text}
                TextScaled={true}
                FontFace={GetFont()}
                TextColor3={new Color3(1, 1, 1)}
                Size={FULL_SIZE}
            >
                <uistroke
                    Thickness={0.1}
                    StrokeSizingMode={"ScaledSize"}
                    Color={new Color3(0.09, 0.09, 0.09)}
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
                <uitextsizeconstraint MaxTextSize={32} />
            </Text>
        </canvasgroup>
    );
}

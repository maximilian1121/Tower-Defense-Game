import React, { useBinding, useEffect, useMemo } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { useSpring } from "@rbxts/react-spring";
import { darkenColor3, generateGradientForRarity } from "shared/helper";
import { FULL_SIZE, WHITE } from "shared/UI/Constants";

type RangeCircleProps = {
    valid: boolean;
};

export default function RangeCircle({ valid }: RangeCircleProps) {
    const [rotation, setRotation] = useBinding(0);

    useEffect(() => {
        const connection = RunService.RenderStepped.Connect(() => {
            setRotation((os.clock() * 25) % 360);
        });
        return () => connection.Disconnect();
    }, []);

    const validGradient = useMemo(() => generateGradientForRarity("Rare"), []);
    const invalidGradient = useMemo(() => {
        const red = new Color3(1, 0.22, 0.22);
        return new ColorSequence([
            new ColorSequenceKeypoint(0, red),
            new ColorSequenceKeypoint(1, darkenColor3(red, 0.5)),
        ]);
    }, []);

    const spring = useSpring(
        {
            alpha: valid ? 1 : 0,
            config: {
                tension: 1000,
                clamp: true,
            },
        },
        [valid],
    );

    const interpolatedGradient = spring.alpha.map((t: number) => {
        const keypoints: ColorSequenceKeypoint[] = [];
        for (let i = 0; i < validGradient.Keypoints.size(); i++) {
            const vk = validGradient.Keypoints[i];
            const ik =
                invalidGradient.Keypoints[i] ?? invalidGradient.Keypoints[0];

            keypoints.push(
                new ColorSequenceKeypoint(
                    math.clamp(vk.Time, 0, 1),
                    vk.Value.Lerp(ik.Value, math.clamp(1 - t, 0, 1)),
                ),
            );
        }
        return new ColorSequence(keypoints);
    });

    return (
        <frame
            Size={FULL_SIZE}
            AnchorPoint={new Vector2(0.5, 0.5)}
            Position={UDim2.fromScale(0.5, 0.5)}
            BackgroundTransparency={0.75}
        >
            <uicorner CornerRadius={new UDim(1, 0)} />
            <uiaspectratioconstraint />
            <uigradient Color={interpolatedGradient} Rotation={rotation} />

            <uistroke
                Color={WHITE}
                Thickness={8}
                BorderStrokePosition={"Outer"}
                Transparency={0.5}
            >
                <uigradient Color={interpolatedGradient} Rotation={rotation} />
            </uistroke>
        </frame>
    );
}

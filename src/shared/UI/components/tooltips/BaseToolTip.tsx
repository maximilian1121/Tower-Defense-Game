import React, { useBinding, useEffect, useRef } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { FULL_SIZE, WHITE } from "shared/UI/Constants";

type ToolTipBaseProps = {
    children?: React.ReactNode;
    position?: Vector2;
    anchorPoint?: Vector2;
    visible: boolean;
    aspectRatio?: number;
    size?: UDim2;
};

export default function ToolTipBase({
    children,
    position = new Vector2(0, 0),
    anchorPoint = new Vector2(0, 0),
    visible = false,
    aspectRatio = 2 / 1,
    size = UDim2.fromScale(0.25, 1),
}: ToolTipBaseProps) {
    const [rot, setRot] = useBinding(0);
    const tooltipRef = useRef<Frame>();

    useEffect(() => {
        const conn = RunService.RenderStepped.Connect((dt) => {
            const newRot = (rot.getValue() + 120 * dt) % 360;
            setRot(newRot);
        });

        return () => conn.Disconnect();
    }, []);

    return (
        <frame
            Position={UDim2.fromOffset(position.X, position.Y)}
            AnchorPoint={anchorPoint}
            Size={size}
            Visible={visible}
            BorderSizePixel={0}
            BackgroundTransparency={1}
            ref={tooltipRef}
        >
            <uicorner />
            <uiaspectratioconstraint AspectRatio={aspectRatio} />

            <frame Size={FULL_SIZE} BackgroundColor3={WHITE}>
                <uicorner />
                <uigradient
                    Color={
                        new ColorSequence([
                            new ColorSequenceKeypoint(
                                0,
                                new Color3(1, 0.25, 0.25),
                            ),
                            new ColorSequenceKeypoint(
                                0.5,
                                new Color3(1, 0.25, 0.25),
                            ),
                            new ColorSequenceKeypoint(
                                1,
                                new Color3(0.81, 0, 0),
                            ),
                        ])
                    }
                    Rotation={90}
                />

                <uistroke
                    Thickness={5}
                    Color={new Color3(0.8, 0.8, 0.8)}
                    BorderStrokePosition={"Center"}
                    ZIndex={5}
                >
                    <uigradient
                        Color={
                            new ColorSequence([
                                new ColorSequenceKeypoint(
                                    0,
                                    new Color3(1, 0, 0),
                                ),
                                new ColorSequenceKeypoint(
                                    1,
                                    new Color3(0.72, 0, 0),
                                ),
                            ])
                        }
                        Rotation={rot}
                    />
                </uistroke>
                {children}
            </frame>
        </frame>
    );
}

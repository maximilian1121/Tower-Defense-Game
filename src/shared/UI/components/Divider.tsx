import React from "@rbxts/react";
import { WHITE } from "shared/UI/Constants";

type DividerProps = {
    axis?: "Horizontal" | "Vertical";
    thickness?: number;
    colour?: Color3;
};

export default function Divider({
    axis = "Horizontal",
    thickness = 2,
    colour = WHITE,
}: DividerProps) {
    let size = new UDim2(1, 0, 0, thickness);

    if (axis === "Vertical") {
        size = new UDim2(0, thickness, 1, 0);
    }

    return (
        <frame Size={size} BorderSizePixel={0} BackgroundColor3={colour}>
            <uigradient
                Transparency={
                    new NumberSequence([
                        new NumberSequenceKeypoint(0, 1),
                        new NumberSequenceKeypoint(0.05, 1),
                        new NumberSequenceKeypoint(0.25, 0),
                        new NumberSequenceKeypoint(0.5, 0),
                        new NumberSequenceKeypoint(0.75, 0),
                        new NumberSequenceKeypoint(0.95, 1),
                        new NumberSequenceKeypoint(1, 1),
                    ])
                }
            />
        </frame>
    );
}

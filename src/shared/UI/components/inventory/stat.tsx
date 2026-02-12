import React from "@rbxts/react";
import { FULL_SIZE, GetFont, WHITE } from "shared/UI/Constants";

type StatProps = {
    icon: string;
    name?: string;
    value: string | number;
};

export function Stat({ icon, name, value }: StatProps) {
    return (
        <frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
            <uilistlayout
                FillDirection={"Horizontal"}
                VerticalAlignment={"Center"}
                HorizontalAlignment={"Left"}
                Padding={new UDim(0, 16)}
            />
            <imagelabel
                Image={icon}
                Size={UDim2.fromScale(1, 1)}
                BackgroundTransparency={1}
            >
                <uiaspectratioconstraint />
            </imagelabel>
            <textlabel
                Text={name !== undefined ? `${name}: ${value}` : `${value}`}
                Size={FULL_SIZE}
                TextScaled={true}
                BackgroundTransparency={1}
                FontFace={GetFont()}
                TextColor3={WHITE}
                TextXAlignment={"Left"}
            >
                <uitextsizeconstraint MaxTextSize={32} />
                <uistroke
                    Thickness={3}
                    Color={new Color3(0.27, 0.27, 0.27)}
                    BorderStrokePosition={"Center"}
                />
                <uiflexitem FlexMode={"Fill"} />
            </textlabel>
            <uiflexitem FlexMode={"Fill"} />
        </frame>
    );
}

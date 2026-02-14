import React from "@rbxts/react";
import { GetFont, STUDS } from "shared/UI/Constants";

type ControlProps = {
    input: Enum.KeyCode | Enum.UserInputType;
    text: string;
};

export default function Control({ input, text }: ControlProps) {
    const getInputText = () => {
        if (input === Enum.UserInputType.MouseButton1) {
            return "LMB";
        } else if (input === Enum.UserInputType.MouseButton2) {
            return "RMB";
        } else if (input === Enum.UserInputType.MouseButton3) {
            return "MMB";
        } else if (input === Enum.KeyCode.LeftControl) {
            return "Ctrl";
        } else {
            return input.Name;
        }
    };
    const padding = 4;

    return (
        <frame AutomaticSize={"XY"} BackgroundTransparency={1}>
            <uilistlayout
                FillDirection={"Horizontal"}
                Padding={new UDim(0, 16)}
            />
            <imagelabel
                Size={UDim2.fromScale(1, 1)}
                Image={STUDS}
                BackgroundColor3={new Color3(0.24, 0.24, 0.24)}
            >
                <uicorner />
                <uiaspectratioconstraint />
                <textlabel
                    BackgroundTransparency={1}
                    Size={UDim2.fromScale(1, 1)}
                    Text={getInputText()}
                    TextScaled={true}
                    FontFace={GetFont()}
                    TextColor3={new Color3(1, 1, 1)}
                >
                    <uistroke Thickness={2} Color={Color3.fromHex("333333")} />
                </textlabel>
                <uipadding
                    PaddingBottom={new UDim(0, padding)}
                    PaddingTop={new UDim(0, padding)}
                    PaddingLeft={new UDim(0, padding)}
                    PaddingRight={new UDim(0, padding)}
                />
                <uistroke
                    Thickness={4}
                    BorderStrokePosition={"Center"}
                    Color={Color3.fromHex("333333")}
                />
            </imagelabel>
            <textlabel
                BackgroundTransparency={1}
                Size={UDim2.fromScale(0, 1)}
                Text={text}
                TextScaled={true}
                TextXAlignment={"Left"}
                AutomaticSize={"X"}
                FontFace={GetFont()}
                TextColor3={new Color3(1, 1, 1)}
            >
                <uistroke Thickness={2} Color={Color3.fromHex("333333")} />
                <uitextsizeconstraint MaxTextSize={32} />
            </textlabel>
        </frame>
    );
}

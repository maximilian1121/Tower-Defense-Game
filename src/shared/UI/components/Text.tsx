import React from "@rbxts/react";
import { GetFont, WHITE } from "shared/UI/Constants";

interface TextLabelProps extends React.ComponentPropsWithRef<"textlabel"> {
    children?: React.ReactNode;
}

export const Text = (props: TextLabelProps) => {
    return (
        <textlabel
            Text={""}
            TextColor3={WHITE}
            BackgroundTransparency={1}
            FontFace={GetFont()}
            TextScaled={true}
            {...props}
        >
            <uitextsizeconstraint MinTextSize={18} MaxTextSize={64} />
            <uipadding
                PaddingBottom={new UDim(0, 4)}
                PaddingTop={new UDim(0, 4)}
            />
            {props.children}
        </textlabel>
    );
};

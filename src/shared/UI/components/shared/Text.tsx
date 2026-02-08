import React from "@rbxts/react";
import { GetFont, WHITE } from "shared/UI/Constants";

type TextLabelProps = React.ComponentPropsWithRef<"textlabel"> & {};

export const Text = (props: TextLabelProps, children: boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>> | React.ReactFragment | React.ReactPortal | undefined) => {
    return (
        <textlabel
            Text={""}
            TextColor3={WHITE}
            BackgroundTransparency={1}
            FontFace={GetFont()}
            TextScaled={true}
            
            {...props}
        >
            <uitextsizeconstraint 
                MinTextSize={18} 
                MaxTextSize={64} 
            />
            <uipadding PaddingBottom={new UDim(0, 4)} PaddingTop={new UDim(0, 4)} />
            {children}
        </textlabel>
    );
};
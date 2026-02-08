export const FULL_SIZE = UDim2.fromScale(1, 1);
export const WHITE = new Color3(1, 1, 1);
export const STUDS = "rbxassetid://6927295847"

export function GetFont(weight?: Enum.FontWeight, style?: Enum.FontStyle): Font { 
    const selectedWeight = weight ?? Enum.FontWeight.Regular;
    const selectedStyle = style ?? Enum.FontStyle.Normal;
    
    return new Font(
        "rbxasset://fonts/families/ComicNeueAngular.json", 
        selectedWeight, 
        selectedStyle
    );
}
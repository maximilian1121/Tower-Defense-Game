import { ReplicatedStorage } from "@rbxts/services";

type AssetCategory = "tower" | "enemy" | "texture";

const AssetFolder = ReplicatedStorage.WaitForChild("Assets");

function getAsset(category: AssetCategory, name: string) {
    if (category === "tower") {
        return AssetFolder.FindFirstChild("Towers")?.FindFirstChild(
            name,
        ) as Model;
    } else if (category === "texture") {
        const texture =
            AssetFolder.FindFirstChild("Textures")?.FindFirstChild(name);

        if (texture?.IsA("Decal") || texture?.IsA("Texture")) {
            return texture.ColorMapContent.Uri;
        }
        return undefined;
    }
}

export function getTowerAsset(name: string): Model {
    return getAsset("tower", name) as Model;
}

export function getTextureAsset(name: string): string | undefined {
    return getAsset("texture", name) as string | undefined;
}

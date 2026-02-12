import { ReplicatedStorage } from "@rbxts/services";

type AssetCategory = "tower" | "enemy" | "texture" | "sound" | "map";

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
    } else if (category === "sound") {
        return AssetFolder.FindFirstChild("Sounds")?.FindFirstChild(
            name,
        ) as Model;
    } else if (category === "map") {
        return AssetFolder.FindFirstChild("Maps")?.FindFirstChild(name) as
            | Model
            | Folder;
    }
}

export function getTowerAsset(name: string): Model {
    return getAsset("tower", name) as Model;
}

export function getMapAsset(
    name: string | undefined,
): Model | Folder | undefined {
    if (name === undefined) return;
    return getAsset("map", name) as Model;
}

export function getTextureAsset(name: string): string | undefined {
    return getAsset("texture", name) as string | undefined;
}

type Audio = {
    AssetId: string;
    PlayGlobal: () => void;
    PlayDirectional: (parent: Instance) => Sound;
    Completed: RBXScriptSignal;
};

export function getSoundAsset(name: string): Audio | undefined {
    const asset = getAsset("sound", name) as Sound | undefined;
    if (!asset) return undefined;

    return {
        AssetId: asset.SoundId,
        Completed: asset.Stopped,
        PlayGlobal: () => {
            asset.Play();
        },
        PlayDirectional: (parent: Instance) => {
            const clone = asset.Clone() as Sound;
            clone.Parent = parent;
            clone.Play();
            return clone;
        },
    };
}

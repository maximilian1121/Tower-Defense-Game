import { ReplicatedStorage } from "@rbxts/services";

type AssetCategory = "tower" | "enemy";

const AssetFolder = ReplicatedStorage.WaitForChild("Assets");

export default function getAsset(category: AssetCategory, name: string): Instance | undefined {
	if (category === "tower") {
		return AssetFolder.FindFirstChild("Towers")?.FindFirstChild(name);
	}
}

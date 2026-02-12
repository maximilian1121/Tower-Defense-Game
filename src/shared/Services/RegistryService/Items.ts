import { getTowerAsset } from "../AssetService/AssetService";
import { TowerItem } from "./ItemRegistry";

export const builderman: TowerItem = {
    Id: "builderman",
    Name: "Builderman",
    Description: "A powerful builder.",
    Price: 100,
    IsStackable: false,
    IsConsumable: false,
    Count: 1,
    Type: "tower",
    Icon: getTowerAsset("builderman"),
    Rarity: "Common",
    DMG: 10,
    Range: 15,
    FireRate: 1,
    RangeType: "Full",
};

export const items: TowerItem[] = [builderman];

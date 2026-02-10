import { RunService } from "@rbxts/services";
import { getTowerAsset } from "../AssetService/AssetService";
import { items } from "./Items";

export type Rarity =
    | "Common"
    | "Uncommon"
    | "Rare"
    | "Epic"
    | "Legendary"
    | "Mythic"
    | "Exotic";

export type Buff = "Turbo" | "Burn";

export interface ItemBase {
    Id: string;
    Name: string;
    Description: string;
    Price: number;
    ArbitraryData?: unknown;
    IsStackable: boolean;
    IsConsumable: boolean;
    Count: number;
    Rarity: Rarity;
}

export type TowerItem = ItemBase & {
    Type: "tower";
    Icon: Instance;
    DMG: number;
    Range: number;
    FireRate: number;
    RangeType: "Line" | "Full";
    Buffs?: Buff[];
};

export type CrateItem = ItemBase & {
    Type: "crate";
    Icon: string;
};

export type Item = TowerItem | CrateItem;

export class ItemRegistry {
    private static items = new Map<string, Item>();

    public static registerItem(item: Item) {
        if (this.items.has(item.Id)) {
            warn(`Item with ID ${item.Id} is already registered.`);
            return;
        }

        this.items.set(item.Id, item);
    }

    public static getItem(
        id: string,
    ): Item | TowerItem | CrateItem | undefined {
        return this.items.get(id);
    }

    public static getAllItems(): Item[] {
        const itemList: Item[] = [];
        this.items.forEach((item) => {
            itemList.push(item);
        });
        return itemList;
    }

    public static registerItems() {
        // Add default i
        if (RunService.IsStudio() && !RunService.IsRunning()) {
            items.push({
                Id: "builderman0",
                Name: "Builderman",
                Description: "A powerful builder.",
                Price: 1,
                IsStackable: false,
                IsConsumable: false,
                Count: 1,
                Type: "tower",
                Icon: getTowerAsset("builderman"),
                Rarity: "Exotic",
                DMG: 10,
                Range: 15,
                FireRate: 1,
                RangeType: "Full",
                Buffs: ["Burn", "Turbo"],
            });
            items.push({
                Id: "builderman1",
                Name: "Builderman",
                Description: "A powerful builder.",
                Price: 10,
                IsStackable: false,
                IsConsumable: false,
                Count: 1,
                Type: "tower",
                Icon: getTowerAsset("builderman"),
                Rarity: "Uncommon",
                DMG: 10,
                Range: 15,
                FireRate: 1,
                RangeType: "Full",
                Buffs: ["Burn", "Turbo"],
            });
            items.push({
                Id: "builderman2",
                Name: "Builderman",
                Description: "A powerful builder.",
                Price: 100,
                IsStackable: false,
                IsConsumable: false,
                Count: 1,
                Type: "tower",
                Icon: getTowerAsset("builderman"),
                Rarity: "Rare",
                DMG: 100,
                Range: 15,
                FireRate: 1,
                RangeType: "Full",
                Buffs: ["Burn", "Turbo"],
            });
            items.push({
                Id: "builderman3",
                Name: "Builderman",
                Description: "A powerful builder.",
                Price: 150,
                IsStackable: false,
                IsConsumable: false,
                Count: 1,
                Type: "tower",
                Icon: getTowerAsset("builderman"),
                Rarity: "Epic",
                DMG: 10,
                Range: 15,
                FireRate: 1,
                RangeType: "Full",
                Buffs: ["Burn", "Turbo"],
            });
            items.push({
                Id: "builderman4",
                Name: "Builderman",
                Description: "A powerful builder.",
                Price: 250,
                IsStackable: false,
                IsConsumable: false,
                Count: 1,
                Type: "tower",
                Icon: getTowerAsset("builderman"),
                Rarity: "Legendary",
                DMG: 10,
                Range: 15,
                FireRate: 1,
                RangeType: "Full",
                Buffs: ["Burn", "Turbo"],
            });
            items.push({
                Id: "builderman5",
                Name: "Builderman",
                Description: "A powerful builder.",
                Price: 5000,
                IsStackable: false,
                IsConsumable: false,
                Count: 1,
                Type: "tower",
                Icon: getTowerAsset("builderman"),
                Rarity: "Mythic",
                DMG: 10,
                Range: 15,
                FireRate: 1,
                RangeType: "Full",
                Buffs: ["Burn", "Turbo"],
            });
        }

        items.forEach((item) => ItemRegistry.registerItem(item));
    }
}

export default ItemRegistry;

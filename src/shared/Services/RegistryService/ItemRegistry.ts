import { RunService } from "@rbxts/services";
import { builderman, items } from "./Items";

export const rarities = [
    "Common",
    "Uncommon",
    "Rare",
    "Epic",
    "Legendary",
    "Mythic",
    "Exotic",
];

export type Rarity = (typeof rarities)[number];

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
        id?: string | undefined,
    ): Item | TowerItem | CrateItem | undefined {
        if (id === undefined) return undefined;
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
        if (RunService.IsStudio()) {
            for (let i = 0; i < 6; i++) {
                const newItem = table.clone(builderman);
                newItem.Id = `builderman${i}`;
                newItem.Name = `Builderman ${i + 1}`;
                newItem.Price = i + 1;
                newItem.Rarity = rarities[i];
                items.push(newItem);
            }
        }

        items.forEach((item) => ItemRegistry.registerItem(item));
    }
}

export default ItemRegistry;

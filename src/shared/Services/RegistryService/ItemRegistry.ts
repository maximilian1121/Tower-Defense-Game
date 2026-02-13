import { RunService } from "@rbxts/services";
import { builderman, items } from "./Items";

export const rarities = [
    "Common",
    "Uncommon",
    "Rare",
    "Epic",
    "Legendary",
    "Mythic",
    /**
     * Has a rainbow effect so DO NOT USE THIS FOR COLOUR IT RETURNS BLACK
     */
    "Exotic",
];

export type Rarity = (typeof rarities)[number];

export type Buff = "Turbo" | "Burn";

export interface ItemBase {
    /**
     * A unique identifier for the item.
     */
    Id: string;
    /**
     * A NON unique display identifier for the item.
     */
    Name: string;
    /**
     * A description of what the item is/does.
     */
    Description: string;
    /**
     * Self explanatory.
     */
    ArbitraryData?: unknown;
    /**
     * Does this item stack? Towers should never stack.
     */
    IsStackable: boolean;
    /**
     * The amount of items the player has.
     */
    Count: number;
    /**
     * The items rarity.
     */
    Rarity: Rarity;
}

export type TowerItem = ItemBase & {
    /**
     * The type of item.
     */
    Type: "tower";
    /**
     * The icon for the tower. (Usually the asset for it)
     */
    Icon: Instance;
    /**
     * How much damage the tower does.
     */
    DMG: number;
    /**
     * Radius of the towers range!
     */
    Range: number;
    /**
     * How long in seconds it takes to recharge.
     */
    FireRate: number;
    /**
     * What kind of range does this tower have?
     */
    RangeType: "Line" | "Full";
    /**
     * What buffs does this tower have?
     */
    Buffs?: Buff[];
    /**
     * How much does this tower cost in game. NOT SHOP!
     */
    Price: number;
};

export type CrateItem = ItemBase & {
    /**
     * The type of item.
     */
    Type: "crate";
    /**
     * The icon of the crate.
     */
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
        const side = RunService.IsClient() ? "CLIENT" : "SERVER";
        print(`Initializing ${script.Parent?.Name} (${side})`);
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

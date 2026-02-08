import { RunService, ReplicatedStorage } from "@rbxts/services";

export type ItemBase = {
    Id: string;
    Name: string;
    Description: string;
    Price: number;
    ArbitraryData?: unknown;
    IsStackable: boolean;
    IsConsumable: boolean;
    Count: number;
};

export type TowerItem = ItemBase & {
    Type: "tower";
    Icon: Instance;
};

export type CrateItem = ItemBase & {
    Type: "crate";
    Icon: string;
};

export type Item = TowerItem | CrateItem;

const SyncEvent = ReplicatedStorage.FindFirstChild("RegistrySync") as RemoteEvent

const FetchAllRequest = ReplicatedStorage.FindFirstChild("FetchAllRegistry") as RemoteFunction

export class ItemRegistry {
    private static items: Map<string, Item> = new Map();

    public static registerItem(item: Item) {
        if (!RunService.IsServer()) {
            warn(`Client cannot register items.`);
            return;
        }

        if (this.items.has(item.Id)) {
            warn(`Item with ID ${item.Id} is already registered.`);
            return;
        }

        this.items.set(item.Id, item);
        
        SyncEvent.FireAllClients(item);
    }

    public static getItem(id: string): Item | undefined {
        return this.items.get(id);
    }

    public static getAllItems(): Item[] {
        const itemList: Item[] = [];
        for (const [_, item] of this.items) {
            itemList.push(item);
        }
        return itemList;
    }

    static {
        if (RunService.IsServer()) {
            FetchAllRequest.OnServerInvoke = () => {
                return this.getAllItems();
            };
        }

        if (RunService.IsClient()) {
            const existingItems = FetchAllRequest.InvokeServer() as Item[];
            for (const item of existingItems) {
                this.items.set(item.Id, item);
            }

            SyncEvent.OnClientEvent.Connect((item: Item) => {
                this.items.set(item.Id, item);
            });
        }
    }
}
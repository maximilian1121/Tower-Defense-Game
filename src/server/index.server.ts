import getAsset from "shared/Core/AssetManagment";
import { Item, ItemRegistry } from "shared/Core/Registry/ItemRegistry";

const items: Item[] = [
    {
        Id: "builderman",
        Name: "Builderman",
        Description: "A powerful builder.",
        Price: 100,
        IsStackable: false,
        IsConsumable: false,
        Count: 1,
        Type: "tower",
        Icon: getAsset("tower", "builderman") as Instance,
    }
]

items.forEach((item) => ItemRegistry.registerItem(item));
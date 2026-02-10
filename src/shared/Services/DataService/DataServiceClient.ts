import { Hotbar, LevelData } from "shared/helper";
import { NetworkDefinitions } from "../NetworkingService/NetworkingService";

export const DataServiceClient = {
    GetHotbar(): Hotbar | undefined {
        return NetworkDefinitions.Inventory.GetHotbar.InvokeServer();
    },

    GetLevelData(): LevelData | undefined {
        return NetworkDefinitions.Stats.GetLevelData.InvokeServer();
    },

    OnLevelDataChange(): RBXScriptSignal {
        return NetworkDefinitions.Stats.LevelDataChange.OnClientEvent;
    },
};

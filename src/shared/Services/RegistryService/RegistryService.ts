import { RunService } from "@rbxts/services";
import ItemRegistry from "./ItemRegistry";
import MapRegistry from "./MapRegistry";

export default class RegistryService {
    public static RegisterAll() {
        const side = RunService.IsClient() ? "CLIENT" : "SERVER";
        print(`Initializing ${script.Parent?.Name} (${side})`);
        MapRegistry.registerMaps();
        ItemRegistry.registerItems();
    }
}

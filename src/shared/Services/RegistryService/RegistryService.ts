import ItemRegistry from "./ItemRegistry";
import MapRegistry from "./MapRegistry";

export default class RegistryService {
    public static RegisterAll() {
        MapRegistry.registerMaps();
        ItemRegistry.registerItems();
    }
}

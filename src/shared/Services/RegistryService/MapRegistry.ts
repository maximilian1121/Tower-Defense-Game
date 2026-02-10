import { RunService } from "@rbxts/services";
import { maps } from "./Maps";

export interface Map {
    Id: string;
    Name: string;
    Icon: string;
}

export class MapRegistry {
    private static maps = new Map<string, Map>();

    public static registerMap(map: Map) {
        if (this.maps.has(map.Id)) {
            warn(`Map with ID ${map.Id} is already registered.`);
            return;
        }

        this.maps.set(map.Id, map);
    }

    public static getMap(id: string): Map | undefined {
        return this.maps.get(id);
    }

    public static getAllMaps(): Map[] {
        const mapList: Map[] = [];
        this.maps.forEach((map) => {
            mapList.push(map);
        });
        return mapList;
    }

    public static registerMaps() {
        // Add default i
        if (RunService.IsStudio() && !RunService.IsRunning()) {
            // TODO
        }

        maps.forEach((map: Map) => MapRegistry.registerMap(map));
    }
}

export default MapRegistry;

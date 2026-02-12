import { TeleportData } from "./Services/CrossPlaceService/CrossPlaceService";
import { devMap } from "./Services/RegistryService/Maps";

export const TELEPORT_DATA_OVERRIDE: TeleportData | undefined = {
    Location: devMap,
    Host: 0,
};

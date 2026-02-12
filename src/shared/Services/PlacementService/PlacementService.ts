import { TowerItem } from "../RegistryService/ItemRegistry";

export default class PlacementService {
    // Used by both server and clients!

    public static IsValid(
        tower: TowerItem,
        player: Player,
        cf: CFrame,
    ): boolean {
        const playerMoney = player.GetAttribute("money");
        return true;
    }
}

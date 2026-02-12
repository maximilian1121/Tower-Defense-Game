import { TowerItem } from "../RegistryService/ItemRegistry";
import WorldContextService from "../WorldContextService/WorldContextService";

type GameState = "none" | "placing" | "towerOptions";
type GameStateChangeCallback = (state: GameState) => void;

export default class GameStateService {
    private static LoggedCanRunMessage = false;
    private static Listeners: GameStateChangeCallback[] = [];

    public static PlacingTower?: TowerItem = undefined;

    private static CanRun() {
        if (WorldContextService.IsLobby()) {
            if (!this.LoggedCanRunMessage) {
                warn("Cannot run EnemyService on the lobby!");
                this.LoggedCanRunMessage = true;
            }
            return false;
        } else return true;
    }

    private static LocalGameState: GameState = "none";

    public static OnLocalGameStateChanged(callback: GameStateChangeCallback) {
        if (!this.CanRun()) return;
        this.Listeners.push(callback);
    }

    public static GetLocalGameState() {
        if (!this.CanRun()) return;
        return this.LocalGameState;
    }

    public static SetLocalGameState(state: GameState) {
        if (!this.CanRun()) return;
        this.LocalGameState = state;
        this.Listeners.forEach((listener) => listener(this.LocalGameState));
    }
}

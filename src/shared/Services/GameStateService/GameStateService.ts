import ItemRegistry, { TowerItem } from "../RegistryService/ItemRegistry";
import WorldContextService from "../WorldContextService/WorldContextService";

export type GameState =
    | undefined
    | {
          name: "playing";
          wave: number;
          gameSpeed: 1 | 2; // This is the speed modifier (1 is default)
      };
export type LocalGameState =
    | undefined
    | {
          name: "placingTower";
          tower?: TowerItem;
      }
    | {
          name: "towerOptions";
          tower: string; // This is unique to the placed tower (UUID) so we can identify them individually
      };
type GameStateChangeCallback = (state: GameState) => void;
type LocalGameStateChangeCallback = (state: LocalGameState) => void;

export default class GameStateService {
    private static Listeners: GameStateChangeCallback[] = [];
    private static LoggedCanRunMessage = false;

    private static CanRun() {
        if (WorldContextService.IsLobby()) {
            if (!this.LoggedCanRunMessage) {
                warn("Cannot run EnemyService on the lobby!");
                this.LoggedCanRunMessage = true;
            }
            return false;
        } else return true;
    }
}

export class GameStateServiceClient {
    public static PlacingTower?: TowerItem = undefined;
    private static LoggedCanRunMessage = false;
    private static Listeners: LocalGameStateChangeCallback[] = [];

    private static CanRun() {
        if (WorldContextService.IsLobby()) {
            if (!this.LoggedCanRunMessage) {
                warn("Cannot run EnemyService on the lobby!");
                this.LoggedCanRunMessage = true;
            }
            return false;
        } else return true;
    }

    private static LocalGameState: LocalGameState = undefined;

    public static OnLocalGameStateChanged(
        callback: LocalGameStateChangeCallback,
    ) {
        if (!this.CanRun()) return;
        this.Listeners.push(callback);
    }

    public static GetLocalGameState() {
        if (!this.CanRun()) return;
        return this.LocalGameState;
    }

    public static SetLocalGameState(state: LocalGameState) {
        if (!this.CanRun()) return;
        this.LocalGameState = state;
        this.Listeners.forEach((listener) => listener(this.LocalGameState));
    }

    public static SetCurrentlyPlacingTower(towerId?: string) {
        if (!this.CanRun()) return;
        const tower = ItemRegistry.getItem(towerId) as TowerItem;

        if (this.PlacingTower === tower) {
            this.PlacingTower = undefined;
            this.SetLocalGameState(undefined);
            return;
        }

        if (tower) {
            this.PlacingTower = tower;
            this.SetLocalGameState({
                name: "placingTower",
                tower: tower,
            });
            this.Listeners.forEach((listener) => listener(this.LocalGameState));
        }
    }
}

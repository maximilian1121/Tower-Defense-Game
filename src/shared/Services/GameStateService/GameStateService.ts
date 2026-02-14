import { RunService } from "@rbxts/services";
import ItemRegistry, { TowerItem } from "../RegistryService/ItemRegistry";
import WorldContextService from "../WorldContextService/WorldContextService";
import { NetworkDefinitions } from "../NetworkingService/NetworkingService";

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
                warn(`Cannot run ${script.Parent?.Name} on the lobby!`);
                this.LoggedCanRunMessage = true;
            }
            return false;
        } else return true;
    }

    private static GameState: GameState = undefined;

    public static OnGameStateChanged(callback: GameStateChangeCallback) {
        if (!this.CanRun()) return;
        if (RunService.IsClient()) {
            NetworkDefinitions.InGame.OnGameStateChange.OnClientEvent.Connect(
                callback,
            );
            return;
        }
        this.Listeners.push(callback);
    }

    public static GetGameState() {
        if (!this.CanRun()) return;
        if (RunService.IsClient()) {
            return NetworkDefinitions.InGame.GetCurrentGameState.InvokeServer();
        }
        return this.GameState;
    }

    public static SetGameState(state: GameState) {
        if (!this.CanRun()) return;
        if (RunService.IsClient()) {
            return;
        }
        this.GameState = state;
        this.Listeners.forEach((listener) => listener(this.GameState));
    }
}

export class GameStateServiceClient {
    public static PlacingTower?: TowerItem = undefined;
    private static LoggedCanRunMessage = false;
    private static Listeners: LocalGameStateChangeCallback[] = [];

    private static CanRun() {
        if (WorldContextService.IsLobby()) {
            if (!this.LoggedCanRunMessage) {
                warn(`Cannot run ${script.Parent?.Name} on the lobby!`);
                this.LoggedCanRunMessage = true;
            }
            return false;
        } else return true;
    }

    private static LocalGameState: LocalGameState = undefined;

    public static OnLocalGameStateChanged(
        callback: LocalGameStateChangeCallback,
    ) {
        if (!this.CanRun()) return { Disconnect: () => {} };

        (this.Listeners as LocalGameStateChangeCallback[]).push(callback);

        return {
            Disconnect: () => {
                const index = (
                    this.Listeners as LocalGameStateChangeCallback[]
                ).indexOf(callback);
                if (index !== -1)
                    (this.Listeners as LocalGameStateChangeCallback[]).remove(
                        index,
                    );
            },
        };
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
        } else {
            this.PlacingTower = undefined;
            this.SetLocalGameState(undefined);
        }
    }
}

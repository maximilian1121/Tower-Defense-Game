import WorldContextService from "shared/Services/WorldContextService/WorldContextService";

export default class EnemyServiceServer {
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

    public static QueryEnemies(cf: CFrame, range: number) {
        if (!this.CanRun()) return;
    }

    // TODO: Make spawning of enemies happen here
}

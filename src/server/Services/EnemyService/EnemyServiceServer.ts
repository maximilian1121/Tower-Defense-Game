import WorldContextService from "shared/Services/WorldContextService/WorldContextService";

export default class EnemyServiceServer {
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

    // TODO: Make spawning of enemies happen here
}

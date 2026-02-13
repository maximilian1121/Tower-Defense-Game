import { ReplicatedStorage, RunService } from "@rbxts/services";

type RemoteClass = "RemoteEvent" | "RemoteFunction";

// Helper to convert the string literal to the actual Roblox Class type
type InferRemote<T extends RemoteClass> = T extends "RemoteEvent"
    ? RemoteEvent
    : RemoteFunction;

const IS_SERVER = RunService.IsServer();
const ROOT_NAME = "Remotes";

export const Networking = {
    Init() {
        let root = ReplicatedStorage.FindFirstChild(ROOT_NAME);
        if (IS_SERVER && !root) {
            root = new Instance("Folder");
            root.Name = ROOT_NAME;
            root.Parent = ReplicatedStorage;
        } else if (!IS_SERVER) {
            ReplicatedStorage.WaitForChild(ROOT_NAME);
        }
    },

    Get<T extends RemoteClass>(
        namespace: string,
        name: string,
        className: T,
    ): InferRemote<T> {
        if (RunService.IsRunning() === false) {
            // create a mock remote for testing in storybook or other environments
            return new Instance(className) as InferRemote<T>;
        }
        const root = ReplicatedStorage.WaitForChild(ROOT_NAME) as Folder;

        let namespaceFolder = root.FindFirstChild(namespace) as Folder;
        if (IS_SERVER && !namespaceFolder) {
            namespaceFolder = new Instance("Folder");
            namespaceFolder.Name = namespace;
            namespaceFolder.Parent = root;
        } else if (!IS_SERVER) {
            namespaceFolder = root.WaitForChild(namespace) as Folder;
        }

        let remote = namespaceFolder.FindFirstChild(name);

        if (IS_SERVER && !remote) {
            const newRemote = new Instance(
                className as keyof CreatableInstances,
            );
            newRemote.Name = name;
            newRemote.Parent = namespaceFolder;
            remote = newRemote;
        } else if (!IS_SERVER) {
            remote = namespaceFolder.WaitForChild(name);
        }

        return remote as InferRemote<T>;
    },
};

const side = RunService.IsClient() ? "CLIENT" : "SERVER";
print(`Initializing ${script.Parent?.Name} (${side})`);

export const NetworkDefinitions = {
    Inventory: {
        GetHotbar: Networking.Get("Inventory", "GetHotbar", "RemoteFunction"),
    },
    Stats: {
        GetLevelData: Networking.Get("Stats", "GetLevelData", "RemoteFunction"),
        LevelDataChange: Networking.Get(
            "Stats",
            "LevelDataChange",
            "RemoteEvent",
        ),
    },
    CrossPlaceService: {
        GetCurrentLocation: Networking.Get(
            "CrossPlaceService",
            "GetCurrentLocation",
            "RemoteFunction",
        ),
    },
    InGame: {
        GetCurrentGameState: Networking.Get(
            "InGame",
            "GetCurrentGameState",
            "RemoteFunction",
        ),
        OnGameStateChange: Networking.Get(
            "InGame",
            "OnGameStateChange",
            "RemoteEvent",
        ),
    },
};

export type HotbarSlot = `slot${1 | 2 | 3 | 4 | 5 | 6}`;

export type Hotbar = {
    [K in HotbarSlot]: string | undefined;
};

export interface LevelData {
    Level: number;
    Progression: number;
    NextMilestone: number; // LEVEL * 25
}

export interface ProfileData {
    TIX: number;
    Diamonds: number;
    Items: Record<string, unknown>;
    LevelData: LevelData;
    Hotbar: Hotbar;
}

export const LEVEL_DATA_TEMPLATE: LevelData = {
    Level: 1,
    Progression: 0,
    NextMilestone: 1 * 25,
};

export const PROFILE_TEMPLATE: ProfileData = {
    TIX: 0,
    Diamonds: 0,
    Items: {},
    LevelData: LEVEL_DATA_TEMPLATE,
    Hotbar: {
        slot1: "builderman",
        slot2: undefined,
        slot3: undefined,
        slot4: undefined,
        slot5: undefined,
        slot6: undefined,
    },
};

export const EMPTY_HOTBAR: Hotbar = {
    slot1: undefined,
    slot2: undefined,
    slot3: undefined,
    slot4: undefined,
    slot5: undefined,
    slot6: undefined,
};

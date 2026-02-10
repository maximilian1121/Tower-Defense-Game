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

export const STUDIO_HOTBAR: Hotbar = {
    slot1: "builderman0",
    slot2: "builderman1",
    slot3: "builderman2",
    slot4: "builderman3",
    slot5: "builderman4",
    slot6: "builderman5",
};

import { Item } from "shared/Services/RegistryService/ItemRegistry";

export const rarityColors: Record<Item["Rarity"], Color3> = {
    Common: new Color3(0.67, 0.67, 0.67),
    Uncommon: new Color3(0.12, 1, 0.12),
    Rare: new Color3(0.12, 0.75, 1),
    Epic: new Color3(0.75, 0.12, 1),
    Legendary: new Color3(1, 0.59, 0.12),
    Mythic: new Color3(1, 0.97, 0.12),
    Exotic: new Color3(0, 0, 0),
};

export const darkenColor3 = (input: Color3, darkness: number) => {
    return new Color3(
        input.R * darkness,
        input.G * darkness,
        input.B * darkness,
    );
};

export const generateGradientForRarity = (
    rarity: Item["Rarity"] = "Common",
    sections: number = 4,
    darkness: number = 0.5,
): ColorSequence => {
    const baseColor = rarityColors[rarity] || rarityColors.Common;

    if (rarity === "Exotic") {
        const NUM_KEYPOINTS = sections;
        const keypoints: ColorSequenceKeypoint[] = [];

        for (let i = 0; i < NUM_KEYPOINTS; i++) {
            const progress = i / (NUM_KEYPOINTS - 1);

            const color = Color3.fromHSV(progress, 0.5, 1);

            keypoints.push(new ColorSequenceKeypoint(progress, color));
        }

        return new ColorSequence(keypoints);
    }

    const percent = darkness;

    const darkerColor = darkenColor3(baseColor, percent);

    return new ColorSequence([
        new ColorSequenceKeypoint(0, baseColor),
        new ColorSequenceKeypoint(1, darkerColor),
    ]);
};

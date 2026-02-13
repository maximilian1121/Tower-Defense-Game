export type HotbarSlot = `slot${1 | 2 | 3 | 4 | 5 | 6}`;

export type Hotbar = {
    [K in HotbarSlot]: string | undefined;
};

export interface LevelData {
    Level: number;
    Progression: number;
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
    Uncommon: new Color3(0.25, 1, 0.25),
    Rare: new Color3(0.04, 0.73, 1),
    Epic: new Color3(0.75, 0.12, 1),
    Legendary: new Color3(1, 0.53, 0),
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

export const addCommasToNumber = (value: number | string): string => {
    let str = tostring(value);

    let decimal = "";
    const [dotIndex] = string.find(str, "%.");
    if (dotIndex !== undefined) {
        decimal = string.sub(str, dotIndex);
        str = string.sub(str, 1, dotIndex - 1);
    }

    while (true) {
        const [replaced] = string.gsub(str, "^(-?%d+)(%d%d%d)", "%1,%2");
        if (replaced === str) break;
        str = replaced;
    }

    return str + decimal;
};

export const COINS_STAT_NAME = "Coins";

export function subdividePath(
    points: Vector3[],
    subdivisions: number,
): Vector3[] {
    if (points.size() < 2) return points;

    const result: Vector3[] = [];

    const getPoint = (i: number) => {
        if (i < 0) return points[0];
        if (i >= points.size()) return points[points.size() - 1];
        return points[i];
    };

    for (let i = 0; i < points.size() - 1; i++) {
        const p0 = getPoint(i - 1);
        const p1 = getPoint(i);
        const p2 = getPoint(i + 1);
        const p3 = getPoint(i + 2);

        for (let j = 0; j < subdivisions; j++) {
            const t = j / subdivisions;
            const t2 = t * t;
            const t3 = t2 * t;

            const position = p1
                .mul(2)
                .add(p2.sub(p0).mul(t))
                .add(p0.mul(2).sub(p1.mul(5)).add(p2.mul(4)).sub(p3).mul(t2))
                .add(
                    p3
                        .sub(p0)
                        .add(p1.mul(3).sub(p2.mul(3)))
                        .mul(t3),
                )
                .mul(0.5);

            result.push(position);
        }
    }

    result.push(points[points.size() - 1]);
    return result;
}

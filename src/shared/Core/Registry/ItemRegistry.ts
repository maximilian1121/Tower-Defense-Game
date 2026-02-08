export type ItemBase = {
    Id: string;
    Name: string;
    Description: string;
    Price: number;
    ArbitraryData?: unknown;
    IsStackable: boolean;
    IsConsumable: boolean;
    Count: number;
};

export type TowerItem = ItemBase & {
    Type: "tower";
    Icon: Instance;
};

export type CrateItem = ItemBase & {
    Type: "crate";
    Icon: string;
};
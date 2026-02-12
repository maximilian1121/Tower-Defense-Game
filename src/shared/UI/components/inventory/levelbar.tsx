import React, { useEffect, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { AppStoryControls } from "shared/UI/App";
import { DataServiceClient } from "shared/Services/DataService/DataServiceClient";
import { LEVEL_DATA_TEMPLATE, LevelData } from "shared/helper";
import ProgressBar from "../ProgressBar";

type props = {
    storyBookControls?: AppStoryControls;
};

export default function LevelBar({ storyBookControls }: props) {
    const [levelBarData, setLevelBarData] = useState<LevelData>();

    useEffect(() => {
        if (!RunService.IsRunning()) return;
        const fetch = async () => {
            const data = DataServiceClient.GetLevelData();
            setLevelBarData(data ?? LEVEL_DATA_TEMPLATE);
        };
        fetch();
        const conn = DataServiceClient.OnLevelDataChange().Connect(fetch);
        return () => conn.Disconnect();
    }, []);

    const { Level, Progression } = levelBarData ?? {
        Level: storyBookControls?.Level ?? 0,
        Progression: storyBookControls?.Progression ?? 0,
    };

    return (
        <ProgressBar
            text={`Level ${Level} (${Progression}/${Level * 25})`}
            value={Progression}
            max={Level * 25}
        />
    );
}

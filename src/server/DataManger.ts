import { Profile } from "@rbxts/profile-store";
import { ProfileData } from "shared/Core/TYPES";

export const Profiles: Record<number, Profile<ProfileData> | undefined> = {};

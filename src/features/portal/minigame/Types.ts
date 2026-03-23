import { Blast_Skeleton } from "./containers/Blast_Skeleton";
import { Giant_Skeleton } from "./containers/Giant_Skeleton";
import { Menace_Skeleton } from "./containers/Menace_Skeleton";
import { Sniper_Skeleton } from "./containers/Sniper_Skeleton";
import { Referee } from "./containers/Referee";

export type Position = {
    x: number;
    y: number;
}

export type Side = "left" | "right";

export type PlayerFoodType = "cabbage" | "apple" | "potato" | "banana";

export type PlayerFoodConfig = {
    texture: string;
    scale: number;
    hitRadiusScale: number;
    speed: number;
    splatTexture?: string;
    spins?: boolean;
    noEnemyContact?: boolean;
    boomerang?: boolean;
}

export type Enemy = Blast_Skeleton | Giant_Skeleton | Menace_Skeleton | Sniper_Skeleton | Referee;

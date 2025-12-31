"use client";

import { useTimer } from "react-timer-hook";
import { Progress } from "@/components/ui/progress";
import { useMemo } from "react";

export interface TimerProps {
    onExpire?: () => void;
}

export default function Timer(
    { onExpire }: TimerProps 
) {
    const expiryTime = useMemo(() => {
        const t = new Date();
        t.setSeconds(t.getSeconds() + 600); // bài quiz có thời gian 10 phút
        return t;
    }, []);

    const { minutes, seconds } = useTimer({ expiryTimestamp: expiryTime, onExpire });

    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");


    return (
        <div className ="flex flex-col items-center space-y-2">
            <span>{mm}:{ss}</span>
            <Progress value={((minutes * 60) + seconds) / 6} className="w-3/4" />
        </div>
    );
}
import { useEffect, useRef } from "react";


const useGameLoop = (callback: (deltaTime: number) => void, isRunning: boolean) => {
    const requestRef = useRef<number>(0);
    const previousTimeRef = useRef<number>(0);
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!isRunning) {
            cancelAnimationFrame(requestRef.current);
            previousTimeRef.current = 0;
            return;
        }

        const animate = (time: number) => {
            if (previousTimeRef.current !== 0) {
                const deltaTime = time - previousTimeRef.current;
                callbackRef.current(deltaTime);
            }
            previousTimeRef.current = time;
            requestRef.current = requestAnimationFrame(animate);
        }

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(requestRef.current);
            previousTimeRef.current = 0;
        };
    }, [isRunning]);
};

export default useGameLoop;
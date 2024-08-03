// src/context/SceneContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// カウンターの状態と操作を定義
interface SceneContextType {
    data: any;
    setData: any;
}

// コンテキストの初期値
const SceneContext = createContext<SceneContextType | undefined>(undefined);

const SceneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState();
    return <SceneContext.Provider value={{ data, setData }}>{children}</SceneContext.Provider>;
};

// コンテキストを使用するためのカスタムフック
const useSceneContext = (): SceneContextType => {
    const context = useContext(SceneContext);
    if (!context) {
        throw new Error("useSceneContext must be used within a CounterProvider");
    }
    return context;
};

export { SceneProvider, useSceneContext };

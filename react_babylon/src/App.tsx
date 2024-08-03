import React from "react";
import SceneComponent from "./components/SceneComponent"; // uses above component in same directory
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import { SceneProvider } from "./context/SceneContext";
import "./App.css";

const App: React.FC = () => {
    return (
        <>
            <SceneProvider>
                <SceneComponent />
            </SceneProvider>
        </>
    );
};

export default App;

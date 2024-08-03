import React, { useEffect, useRef } from "react";
import { Engine } from "@babylonjs/core/Engines/engine.js";
import { EngineOptions } from "@babylonjs/core/Engines/thinEngine.js";
import { Scene, SceneOptions } from "@babylonjs/core/scene.js";
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";

interface BabylonjsProps {
    antialias?: boolean;
    engineOptions?: EngineOptions;
    adaptToDeviceRatio?: boolean;
    renderChildrenWhenReady?: boolean;
    sceneOptions?: SceneOptions;
    observeCanvasResize?: boolean;
    children?: React.ReactNode;
}

const SceneComponent: React.FC<BabylonjsProps> = ({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, ...rest }) => {
    const reactCanvas = useRef(null);
    let box;

    /**
     * フレームのレンダリングごとに実行される。ボックスをY軸上で回転。
     */
    const onRender = (scene) => {
        if (box !== undefined) {
            const deltaTimeInMillis = scene.getEngine().getDeltaTime();

            const rpm = 10;
            box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
        }
    };

    /**
     * 基本的なエンジンとシーンの設定
     */
    const onSceneReady = (scene) => {
        // フリーカメラ（非メッシュ）の作成
        const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
        // カメラをシーンの原点に向ける
        camera.setTarget(Vector3.Zero());

        const canvas = scene.getEngine().getRenderingCanvas();
        // カメラをキャンバスに取り付け
        camera.attachControl(canvas, true);
        // ライトを作成
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        // ライトの反射率（デフォルトは1）
        light.intensity = 0.7;
        // ボックスの作成
        box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
        // ボックスを高さの半分だけ上に移動
        box.position.y = 1;
        // 地面の作成
        MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
    };

    /**
     * 基本的なエンジンとシーンの設定
     */
    useEffect(() => {
        const { current: canvas } = reactCanvas;

        if (!canvas) return;

        const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
        const scene = new Scene(engine, sceneOptions);

        if (scene.isReady()) {
            onSceneReady(scene);
        } else {
            scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
        }

        engine.runRenderLoop(() => {
            if (typeof onRender === "function") onRender(scene);
            scene.render();
        });

        const resize = () => {
            scene.getEngine().resize();
        };

        if (window) {
            window.addEventListener("resize", resize);
        }

        return () => {
            scene.getEngine().dispose();

            if (window) {
                window.removeEventListener("resize", resize);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions]);

    return <canvas id="canvas" ref={reactCanvas} {...rest} />;
};

export default SceneComponent;

import React, { useEffect, useRef, useState } from "react";
import * as Phaser from "phaser";

import { Button } from "components/ui/Button";
import { CONFIG } from "lib/config";
import { SUNNYSIDE } from "assets/sunnyside";
import { ContentComponentProps } from "../GameOptions";

const STORAGE_KEY = "creator-mode.scene-code.v1";
const MONACO_LOADER_ID = "monaco-amd-loader";
const MONACO_VS_BASE_URL =
  "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs";

const DEFAULT_SCENE_TEMPLATE = `class CreatorScene extends Phaser.Scene {
  constructor() {
    super({ key: "examples_rpg_creator" });
  }

  preload() {
    this.load.spritesheet("bumpkin_idle", "${CONFIG.ANIMATION_URL}/animate/0_v1_32_1_5_15_18_22_23_303/idle", {
      frameWidth: 96,
      frameHeight: 64,
    });
    this.load.spritesheet("bumpkin_walking", "${CONFIG.ANIMATION_URL}/animate/0_v1_32_1_5_15_18_22_23_303/walking", {
      frameWidth: 96,
      frameHeight: 64,
    });
    this.load.spritesheet("bumpkin_run", "${CONFIG.ANIMATION_URL}/animate/0_v1_32_1_5_15_18_22_23_303/run", {
      frameWidth: 96,
      frameHeight: 64,
    });
    this.load.spritesheet("bumpkin_attack", "${CONFIG.ANIMATION_URL}/animate/0_v1_32_1_5_15_18_22_23_303/attack", {
      frameWidth: 96,
      frameHeight: 64,
    });

    this.load.spritesheet("enemy_masked_1", "${CONFIG.ANIMATION_URL}/animate/0_v1_53_2_42_13_18_22_23_165_0_0_0_0_159/walking", {
      frameWidth: 96,
      frameHeight: 64,
    });
    this.load.spritesheet("enemy_masked_1_death", "${CONFIG.ANIMATION_URL}/animate/0_v1_53_2_42_13_18_22_23_165_0_0_0_0_159/death", {
      frameWidth: 96,
      frameHeight: 64,
    });
    this.load.spritesheet("enemy_masked_2", "${CONFIG.ANIMATION_URL}/animate/0_v1_53_127_51_208_18_22_23_178/walking", {
      frameWidth: 96,
      frameHeight: 64,
    });
    this.load.spritesheet("enemy_masked_2_death", "${CONFIG.ANIMATION_URL}/animate/0_v1_53_127_51_208_18_22_23_178/death", {
      frameWidth: 96,
      frameHeight: 64,
    });
    this.load.spritesheet("enemy_masked_3", "${CONFIG.ANIMATION_URL}/animate/0_v1_392_127_6_195_18_22_56/walking", {
      frameWidth: 96,
      frameHeight: 64,
    });
    this.load.spritesheet("enemy_masked_3_death", "${CONFIG.ANIMATION_URL}/animate/0_v1_392_127_6_195_18_22_56/death", {
      frameWidth: 96,
      frameHeight: 64,
    });
    this.load.image("evil_skull", "${SUNNYSIDE.decorations.skull}");

    this.load.image("grass", "world/sand.webp");
    this.load.image("arrow_hint", "world/arrows_to_move.png");
  }

  create() {
    this.cameras.main.setBackgroundColor("#5b8f3a");
    this.cameras.main.roundPixels = true;
    this.physics.world.setBounds(0, 0, 1200, 800);

    this.prevInputState = {};
    this.isAttacking = false;
    this.kills = 0;
    this.timeLeft = 60;
    this.isGameOver = false;
    this.speed = 105;

    this.createPlayerAnimations();

    this.add
      .tileSprite(600, 400, 1200, 800, "grass")
      .setTint(0x7aa35b)
      .setAlpha(0.35);

    this.spawnPlayer();
    this.spawnMaskedEnemies();
    this.createHud();
    this.startTimer();

    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => this.randomizeEnemyMovement(),
    });
  }

  createPlayerAnimations() {
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("bumpkin_idle"),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "walking",
      frames: this.anims.generateFrameNumbers("bumpkin_walking"),
      frameRate: 7,
      repeat: -1,
    });
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("bumpkin_run"),
      frameRate: 9,
      repeat: -1,
    });
    this.anims.create({
      key: "attack",
      frames: this.anims.generateFrameNumbers("bumpkin_attack"),
      frameRate: 14,
      repeat: 0,
    });
    this.anims.create({
      key: "enemy_walk_1",
      frames: this.anims.generateFrameNumbers("enemy_masked_1"),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "enemy_walk_2",
      frames: this.anims.generateFrameNumbers("enemy_masked_2"),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "enemy_walk_3",
      frames: this.anims.generateFrameNumbers("enemy_masked_3"),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "enemy_death_1",
      frames: this.anims.generateFrameNumbers("enemy_masked_1_death"),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "enemy_death_2",
      frames: this.anims.generateFrameNumbers("enemy_masked_2_death"),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "enemy_death_3",
      frames: this.anims.generateFrameNumbers("enemy_masked_3_death"),
      frameRate: 10,
      repeat: 0,
    });
  }

  spawnPlayer() {
    this.player = this.physics.add
      .sprite(96, 96, "bumpkin_idle", 0)
      .setScale(2)
      .setCollideWorldBounds(true);
    this.player.body.setSize(14, 14).setOffset(41, 45);
    this.playerShadow = this.add.ellipse(96, 112, 30, 10, 0x000000, 0.3);
    this.playerShadow.setDepth(0);
    this.player.setDepth(2);
    this.player.play("idle", true);

    this.cameras.main.startFollow(this.player, true, 1, 1);
    this.cameras.main.setZoom(2);
  }

  spawnMaskedEnemies() {
    this.enemies = [];
    const enemySprites = [
      { key: "enemy_masked_1", anim: "enemy_walk_1", deathAnim: "enemy_death_1" },
      { key: "enemy_masked_2", anim: "enemy_walk_2", deathAnim: "enemy_death_2" },
      { key: "enemy_masked_3", anim: "enemy_walk_3", deathAnim: "enemy_death_3" },
    ];

    for (let i = 0; i < 8; i += 1) {
      const x = Phaser.Math.Between(360, 1040);
      const y = Phaser.Math.Between(130, 690);
      const enemyStyle = Phaser.Utils.Array.GetRandom(enemySprites);

      const enemy = this.physics.add
        .sprite(x, y, enemyStyle.key, 0)
        .setScale(2)
        .setDepth(2);
      enemy.play(enemyStyle.anim, true);
      enemy.setData("animKey", enemyStyle.anim);
      enemy.setData("deathAnimKey", enemyStyle.deathAnim);
      enemy.setData("isDying", false);

      enemy.body
        .setSize(Math.max(12, enemy.width * 0.45), Math.max(12, enemy.height * 0.45))
        .setOffset(enemy.width * 0.25, enemy.height * 0.45)
        .setBounce(1, 1)
        .setCollideWorldBounds(true)
        .setVelocity(Phaser.Math.Between(-70, 70), Phaser.Math.Between(-70, 70));

      this.enemies.push(enemy);
    }
  }

  respawnEnemy(enemy) {
    if (this.isGameOver) return;

    const x = Phaser.Math.Between(360, 1040);
    const y = Phaser.Math.Between(130, 690);
    enemy.enableBody(true, x, y, true, true);

    const animKey = enemy.getData("animKey");
    enemy.setData("isDying", false);
    if (animKey) {
      enemy.play(animKey, true);
    }

    const vx = Phaser.Math.Between(-70, 70);
    const vy = Phaser.Math.Between(-70, 70);
    enemy.body
      .setVelocity(vx, vy)
      .setBounce(1, 1)
      .setCollideWorldBounds(true);
    if (vx < -2) enemy.setFlipX(true);
    if (vx > 2) enemy.setFlipX(false);
  }

  createHud() {
    this.add.image(84, 84, "arrow_hint").setScale(0.9).setScrollFactor(0).setDepth(20);
    this.add
      .rectangle(188, 72, 340, 116, 0x1a0207, 0.68)
      .setStrokeStyle(2, 0xbf3b57, 0.9)
      .setScrollFactor(0)
      .setDepth(19);
    this.add
      .image(28, 30, "evil_skull")
      .setScale(0.6)
      .setScrollFactor(0)
      .setDepth(20);
    this.helpText = this.add
      .text(44, 18, "Night Raid\\nWASD / Arrows: Move\\nShift: Run\\nE: Attack", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#ffd7d7",
        lineSpacing: 3,
      })
      .setScrollFactor(0)
      .setDepth(20);

    this.statsPanel = this.add
      .rectangle(this.scale.width - 8, 8, 170, 52, 0x000000, 0.55)
      .setOrigin(1, 0)
      .setStrokeStyle(2, 0xffffff, 0.35)
      .setScrollFactor(0)
      .setDepth(20);

    this.killsText = this.add
      .text(this.scale.width - 16, 10, "Kills: 0", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#ffe066",
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(21);

    this.timerText = this.add
      .text(this.scale.width - 16, 28, "Time: 60s", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#f6f2d5",
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(21);

    this.scale.on("resize", () => {
      this.statsPanel.setPosition(this.scale.width - 8, 8);
      this.killsText.setX(this.scale.width - 16);
      this.timerText.setX(this.scale.width - 16);
    });
  }

  startTimer() {
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.isGameOver) return;

        this.timeLeft = Math.max(0, this.timeLeft - 1);
        this.timerText.setText("Time: " + this.timeLeft + "s");

        if (this.timeLeft <= 0) {
          this.endGame();
        }
      },
    });
  }

  endGame() {
    this.isGameOver = true;
    this.timerEvent?.remove(false);
    this.player.body.setVelocity(0, 0);
    this.enemies.forEach((enemy) => {
      if (!enemy.active) return;
      enemy.body.setVelocity(0, 0);
    });

    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Time Up!", {
        fontFamily: "monospace",
        fontSize: "28px",
        color: "#ffe066",
        backgroundColor: "#00000099",
        padding: { x: 10, y: 6 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(30);
  }

  randomizeEnemyMovement() {
    if (this.isGameOver) return;
    this.enemies.forEach((enemy) => {
      if (!enemy.active) return;
      const vx = Phaser.Math.Between(-70, 70);
      const vy = Phaser.Math.Between(-70, 70);
      enemy.body.setVelocity(vx, vy);
      if (vx < -2) enemy.setFlipX(true);
      if (vx > 2) enemy.setFlipX(false);
    });
  }

  attackMoonseekers() {
    if (this.isGameOver) return;
    let defeated = 0;

    this.enemies.forEach((enemy) => {
      if (!enemy.active) return;

      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
      if (dist > 82) return;
      if (enemy.getData("isDying")) return;

      enemy.setData("isDying", true);
      enemy.body.setVelocity(0, 0);
      enemy.body.enable = false;

      const deathAnimKey = enemy.getData("deathAnimKey");
      if (deathAnimKey) {
        enemy.play(deathAnimKey, true);
        enemy.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          enemy.disableBody(true, true);
          this.time.delayedCall(Phaser.Math.Between(1400, 2600), () => {
            this.respawnEnemy(enemy);
          });
        });
      } else {
        enemy.disableBody(true, true);
        this.time.delayedCall(Phaser.Math.Between(1400, 2600), () => {
          this.respawnEnemy(enemy);
        });
      }
      defeated += 1;
    });

    if (defeated > 0) {
      this.kills += defeated;
      this.killsText.setText("Kills: " + this.kills);
    }
  }

  update() {
    if (this.isGameOver) return;
    const body = this.player.body;
    const running = this.keyDown("ShiftLeft") || this.keyDown("ShiftRight");
    const runMultiplier = running ? 1.55 : 1;
    const speed = this.speed * runMultiplier;

    let vx = 0;
    let vy = 0;
    if (this.keyDown("KeyA") || this.keyDown("ArrowLeft")) vx = -speed;
    if (this.keyDown("KeyD") || this.keyDown("ArrowRight")) vx = speed;
    if (this.keyDown("KeyW") || this.keyDown("ArrowUp")) vy = -speed;
    if (this.keyDown("KeyS") || this.keyDown("ArrowDown")) vy = speed;

    body.setVelocity(vx, vy);
    this.player.x = Math.round(this.player.x);
    this.player.y = Math.round(this.player.y);
    this.playerShadow.setPosition(this.player.x, this.player.y + 14);

    if (vx < 0) this.player.setFlipX(true);
    if (vx > 0) this.player.setFlipX(false);

    if (this.justPressed("KeyE")) {
      this.isAttacking = true;
      this.player.play("attack", true);
      this.player.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.isAttacking = false;
      });
      this.attackMoonseekers();
    }

    if (!this.isAttacking) {
      const isMoving = vx !== 0 || vy !== 0;
      if (isMoving) {
        const key = running ? "run" : "walking";
        if (this.player.anims.currentAnim?.key !== key) {
          this.player.play(key, true);
        }
      } else if (this.player.anims.currentAnim?.key !== "idle") {
        this.player.play("idle", true);
      }
    }

    this.enemies.forEach((enemy) => {
      if (!enemy.active) return;
      const enemyVx = enemy.body.velocity.x;
      if (enemyVx < -2) enemy.setFlipX(true);
      if (enemyVx > 2) enemy.setFlipX(false);
      enemy.x = Math.round(enemy.x);
      enemy.y = Math.round(enemy.y);
    });
  }

  keyDown(code) {
    return !!window.__creatorKeyState?.[code];
  }

  justPressed(code) {
    const currentlyDown = this.keyDown(code);
    const wasDown = !!this.prevInputState[code];
    this.prevInputState[code] = currentlyDown;
    return currentlyDown && !wasDown;
  }
}
`;

type MonacoEditorInstance = {
  getValue: () => string;
  setValue: (value: string) => void;
  dispose: () => void;
  getModel: () => { dispose: () => void } | null;
  onDidChangeModelContent: (listener: () => void) => { dispose: () => void };
};

type MonacoNamespace = {
  Uri: {
    parse: (uri: string) => unknown;
  };
  editor: {
    createModel: (value: string, language?: string, uri?: unknown) => unknown;
    create: (
      element: HTMLElement,
      options: Record<string, unknown>,
    ) => MonacoEditorInstance;
    setTheme: (theme: string) => void;
  };
};

declare global {
  interface Window {
    monaco?: MonacoNamespace;
    require?: {
      config: (config: Record<string, unknown>) => void;
      (dependencies: string[], onLoad: () => void): void;
    };
    __creatorMonacoLoaderPromise?: Promise<MonacoNamespace>;
    __creatorKeyState?: Record<string, boolean>;
  }
}

const loadMonaco = (): Promise<MonacoNamespace> => {
  if (window.monaco?.editor) {
    return Promise.resolve(window.monaco);
  }

  if (window.__creatorMonacoLoaderPromise) {
    return window.__creatorMonacoLoaderPromise;
  }

  window.__creatorMonacoLoaderPromise = new Promise((resolve, reject) => {
    const resolveEditor = () => {
      const amdRequire = window.require;
      if (!amdRequire) {
        reject(new Error("Monaco AMD loader is not available."));
        return;
      }

      amdRequire.config({
        paths: {
          vs: MONACO_VS_BASE_URL,
        },
      });

      amdRequire(["vs/editor/editor.main"], () => {
        if (!window.monaco?.editor) {
          reject(new Error("Monaco editor failed to load."));
          return;
        }

        resolve(window.monaco);
      });
    };

    const existingScript = document.getElementById(MONACO_LOADER_ID);
    if (existingScript) {
      resolveEditor();
      return;
    }

    const script = document.createElement("script");
    script.id = MONACO_LOADER_ID;
    script.src = `${MONACO_VS_BASE_URL}/loader.min.js`;
    script.async = true;
    script.onload = resolveEditor;
    script.onerror = () => reject(new Error("Unable to load Monaco editor."));
    document.body.appendChild(script);
  });

  return window.__creatorMonacoLoaderPromise;
};

export const CreatorMode: React.FC<ContentComponentProps> = ({ onClose }) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<MonacoEditorInstance | null>(null);
  const previewGameRef = useRef<Phaser.Game | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const statsPollIntervalRef = useRef<number | null>(null);
  const changeListenerRef = useRef<{ dispose: () => void } | null>(null);
  const keyStateRef = useRef<Record<string, boolean>>({});

  const [sceneCode, setSceneCode] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_SCENE_TEMPLATE;
  });
  const [isEditorLoading, setIsEditorLoading] = useState(true);
  const [isPreviewRunning, setIsPreviewRunning] = useState(false);
  const [loadError, setLoadError] = useState<string>();
  const [runtimeError, setRuntimeError] = useState<string>();
  const [previewStats, setPreviewStats] = useState<{
    kills?: number;
    timeLeft?: number;
  }>({});

  useEffect(() => {
    let isUnmounted = false;

    const initEditor = async () => {
      try {
        const monaco = await loadMonaco();
        if (isUnmounted || !editorContainerRef.current) return;

        const model = monaco.editor.createModel(
          sceneCode,
          "typescript",
          monaco.Uri.parse("inmemory://creator-mode/scene.ts"),
        );

        monaco.editor.setTheme("vs-dark");

        editorRef.current = monaco.editor.create(editorContainerRef.current, {
          model,
          automaticLayout: true,
          minimap: { enabled: false },
          tabSize: 2,
          wordWrap: "on",
          fontSize: 13,
        });

        changeListenerRef.current = editorRef.current.onDidChangeModelContent(
          () => {
            setSceneCode(editorRef.current?.getValue() ?? "");
          },
        );
      } catch (error) {
        if (!isUnmounted) {
          setLoadError((error as Error).message);
        }
      } finally {
        if (!isUnmounted) {
          setIsEditorLoading(false);
        }
      }
    };

    initEditor();

    return () => {
      isUnmounted = true;
      changeListenerRef.current?.dispose();
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      if (statsPollIntervalRef.current) {
        window.clearInterval(statsPollIntervalRef.current);
      }
      statsPollIntervalRef.current = null;
      previewGameRef.current?.destroy(true);
      setIsPreviewRunning(false);

      const model = editorRef.current?.getModel();
      editorRef.current?.dispose();
      model?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.__creatorKeyState = keyStateRef.current;

    const clearKeyState = () => {
      keyStateRef.current = {};
      window.__creatorKeyState = keyStateRef.current;
    };

    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return true;
      }

      if (target.closest(".monaco-editor")) return true;
      if (
        editorContainerRef.current &&
        editorContainerRef.current.contains(target)
      ) {
        return true;
      }

      return false;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target) || isTypingTarget(document.activeElement)) {
        clearKeyState();
        return;
      }
      keyStateRef.current[event.code] = true;
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target) || isTypingTarget(document.activeElement)) {
        clearKeyState();
        return;
      }
      keyStateRef.current[event.code] = false;
    };
    const onWindowBlur = () => {
      clearKeyState();
    };
    const onFocusIn = (event: FocusEvent) => {
      if (isTypingTarget(event.target)) {
        clearKeyState();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("focusin", onFocusIn, true);

    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("focusin", onFocusIn, true);
      delete window.__creatorKeyState;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, sceneCode);
  }, [sceneCode]);

  const stopScene = () => {
    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = null;
    if (statsPollIntervalRef.current) {
      window.clearInterval(statsPollIntervalRef.current);
    }
    statsPollIntervalRef.current = null;
    previewGameRef.current?.destroy(true);
    previewGameRef.current = null;
    setPreviewStats({});
    setIsPreviewRunning(false);
  };

  const getPreviewSize = () => {
    const width = previewContainerRef.current?.clientWidth ?? 0;
    const height = previewContainerRef.current?.clientHeight ?? 0;

    return {
      width: Math.max(320, Math.floor(width)),
      height: Math.max(220, Math.floor(height)),
    };
  };

  const focusPreviewCanvas = () => {
    const canvas = previewContainerRef.current?.querySelector("canvas");
    if (!canvas) return;

    canvas.setAttribute("tabindex", "0");
    canvas.focus();
  };

  const runScene = () => {
    if (!previewContainerRef.current || !editorRef.current) return;

    const latestCode = editorRef.current.getValue();
    setSceneCode(latestCode);
    setRuntimeError(undefined);

    try {
      const getScene = new Function(
        "Phaser",
        `
${latestCode}
return typeof CreatorScene !== "undefined"
  ? CreatorScene
  : typeof scene !== "undefined"
    ? scene
    : undefined;
      `,
      ) as (phaser: typeof Phaser) => Phaser.Types.Scenes.SettingsConfig;

      const scene = getScene(Phaser);
      if (!scene) {
        throw new Error(
          "No scene found. Define class CreatorScene extends Phaser.Scene.",
        );
      }

      stopScene();
      previewContainerRef.current.innerHTML = "";
      const { width, height } = getPreviewSize();

      previewGameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        parent: previewContainerRef.current,
        width,
        height,
        scale: {
          mode: Phaser.Scale.RESIZE,
          width,
          height,
        },
        pixelArt: true,
        backgroundColor: "#000000",
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
          },
        },
        scene: [scene as Phaser.Types.Scenes.SceneType],
      });

      setIsPreviewRunning(true);
      resizeObserverRef.current = new ResizeObserver(() => {
        const game = previewGameRef.current;
        if (!game) return;

        const next = getPreviewSize();
        game.scale.resize(next.width, next.height);
      });
      resizeObserverRef.current.observe(previewContainerRef.current);
      statsPollIntervalRef.current = window.setInterval(() => {
        const currentScene =
          previewGameRef.current?.scene.getScenes(true)[0] ??
          previewGameRef.current?.scene.getScenes(false)[0];

        if (!currentScene) return;

        const scene = currentScene as Phaser.Scene & {
          kills?: number;
          score?: number;
          timeLeft?: number;
        };

        setPreviewStats({
          kills: scene.kills ?? scene.score,
          timeLeft: scene.timeLeft,
        });
      }, 200);

      // Monaco captures keyboard while focused. Move focus to Phaser canvas on run.
      requestAnimationFrame(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        focusPreviewCanvas();
      });
    } catch (error) {
      setRuntimeError((error as Error).message);
    }
  };

  const resetScene = () => {
    editorRef.current?.setValue(DEFAULT_SCENE_TEMPLATE);
    setSceneCode(DEFAULT_SCENE_TEMPLATE);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#1b1b1b] p-2 sm:p-3 flex flex-col gap-2 pointer-events-auto">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm text-white">Creator Mode</p>
          <p className="text-xs text-gray-300">
            Edit Phaser scene code, run it, and save your draft locally.
          </p>
        </div>
        <Button className="p-1 w-auto" variant="secondary" onClick={onClose}>
          <span>Exit Creator Mode</span>
        </Button>
      </div>

      {isEditorLoading && (
        <p className="text-xs text-center py-2 text-white">
          Loading Monaco editor...
        </p>
      )}

      {loadError && (
        <p className="text-xs text-red-500 text-center py-2">{loadError}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 flex-1 min-h-0">
        <div className="flex flex-col min-h-0">
          <div
            ref={editorContainerRef}
            className="w-full border border-brown-200 rounded-sm flex-1 min-h-[260px]"
          />
        </div>

        <div className="flex flex-col min-h-0 gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
            <Button className="p-1" onClick={runScene} disabled={!!loadError}>
              <span>Run Scene</span>
            </Button>
            <Button
              className="p-1"
              variant="secondary"
              onClick={stopScene}
              disabled={!isPreviewRunning}
            >
              <span>Stop Scene</span>
            </Button>
            <Button className="p-1" variant="secondary" onClick={resetScene}>
              <span>Reset Template</span>
            </Button>
          </div>

          {runtimeError && <p className="text-xs text-red-500">{runtimeError}</p>}

          <div className="relative w-full flex-1 min-h-[260px]">
            <div
              ref={previewContainerRef}
              className="w-full h-full border border-brown-200 rounded-sm bg-black overflow-hidden"
              onClick={focusPreviewCanvas}
            />
            <div className="pointer-events-none absolute top-2 left-2 z-10 bg-black/55 border border-white/30 rounded-sm px-2 py-1">
              <p className="text-[10px] leading-4 text-[#ffd7d7] font-mono">
                Night Raid
                <br />
                WASD / Arrows: Move
                <br />
                Shift: Run
                <br />
                E: Attack
              </p>
            </div>
            <div className="pointer-events-none absolute top-2 right-2 z-10 bg-black/60 border border-white/30 rounded-sm px-2 py-1 min-w-[108px]">
              <p className="text-[10px] leading-4 text-[#ffe066] font-mono">
                {`Kills: ${previewStats.kills ?? 0}`}
              </p>
              <p className="text-[10px] leading-4 text-[#f6f2d5] font-mono">
                {`Time: ${
                  typeof previewStats.timeLeft === "number"
                    ? `${previewStats.timeLeft}s`
                    : "--"
                }`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

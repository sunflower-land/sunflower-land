import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { CONFIG } from "lib/config";
import { Context as GameContext } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Game, AUTO } from "phaser";
import NinePatchPlugin from "phaser3-rex-plugins/plugins/ninepatch-plugin.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";
import { Preloader } from "features/world/scenes/Preloader";
import { useNavigate, useLocation } from "react-router";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

const _apiKey = (state: MachineState) => state.context.apiKey;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Temporary scene for rendering generated content
class GeneratedScene extends Phaser.Scene {
  constructor() {
    super({ key: "generated_scene" });
  }

  create() {
    this.add
      .text(400, 300, "Phaser Scene Ready", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 350, "Waiting for AI generated content...", {
        fontSize: "16px",
        color: "#cccccc",
      })
      .setOrigin(0.5);
  }
}

export const PortalAI: React.FC = () => {
  const { gameService, fromRoute } = useContext(GameContext);
  const apiKey = useSelector(gameService, _apiKey);
  const navigate = useNavigate();
  const location = useLocation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const gameRef = useRef<Game | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    const defaultRoute = "/";

    fromRoute ? navigate(fromRoute) : navigate(defaultRoute);
  }, [location.pathname, fromRoute, navigate]);

  // Exit Portal AI if Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose]);

  // Initialize Phaser game
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: AUTO,
      width: 800,
      height: 600,
      backgroundColor: "#000000",
      parent: "phaser-container",
      autoRound: true,
      pixelArt: true,
      plugins: {
        global: [
          {
            key: "rexNinePatchPlugin",
            plugin: NinePatchPlugin,
            start: true,
          },
          {
            key: "rexVirtualJoystick",
            plugin: VirtualJoystickPlugin,
            start: true,
          },
        ],
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
        },
      },
      scene: [Preloader, GeneratedScene],
    };

    gameRef.current = new Game(config);
    gameRef.current.registry.set("initialScene", "generated_scene");

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await window.fetch(`${CONFIG.API_URL}/claude/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
        },
        body: JSON.stringify({
          prompt: inputValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.response || "Response received",
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Here we would process the response to update the Phaser scene
        // For now, we'll just log the response structure
        // eslint-disable-next-line no-console
        console.log("API Response:", data);

        // If the response contains scene data, we could dynamically load it
        if (data.phaserScene || data.sunflowerAssets || data.sunflowerlandSDK) {
          // TODO: Process and load the generated Phaser content
          // eslint-disable-next-line no-console
          console.log("Generated content received:", {
            phaserScene: data.phaserScene,
            sunflowerAssets: data.sunflowerAssets,
            sunflowerlandSDK: data.sunflowerlandSDK,
          });
        }
      } else {
        throw new Error(data.message || "Failed to get response");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error calling Claude API:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error processing your request.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-[#181425] w-full h-full safe-area-inset-top safe-area-inset-bottom">
      <OuterPanel className="h-full">
        {/* Header */}
        <div
          className="relative flex w-full justify-between pr-10 items-center mr-auto h-[70px] mb-0.5"
          style={{}}
        >
          <div
            className="absolute inset-0 w-full h-full -z-0 rounded-sm"
            style={{
              backgroundImage: `url(${SUNNYSIDE.announcement.marketplace})`,
              imageRendering: "pixelated",
              backgroundSize: "320px",
              backgroundPosition: "center",
            }}
          />
          <div className="z-10 pl-4">
            <p className="text-lg text-white z-10 text-shadow">{"Portal AI"}</p>
            <p className="text-xs text-white z-10 text-shadow">
              {"Create minigames with AI"}
            </p>
          </div>

          <img
            src={SUNNYSIDE.icons.close}
            className="flex-none cursor-pointer absolute right-2 z-10"
            onClick={handleClose}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
              height: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex h-full" style={{ height: "calc(100% - 70px)" }}>
          {/* Left Side - Chat Interface */}
          <div className="w-1/2 flex flex-col border-r border-brown-400 p-2">
            <div className="mb-4">
              <Label type="default">{"AI Minigame Designer"}</Label>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto mb-4 p-2 bg-brown-200 rounded min-h-0">
              {messages.length === 0 && (
                <div className="text-center text-gray-600 mt-8">
                  <p className="text-base mb-2">
                    {"Describe your minigame idea!"}
                  </p>
                  <p className="text-sm">
                    {
                      'Example: "Create a simple platformer where the player collects sunflowers"'
                    }
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-3 p-3 rounded ${
                    message.role === "user"
                      ? "bg-blue-100 ml-8"
                      : "bg-white mr-8"
                  }`}
                >
                  <div className="text-xs font-semibold mb-1 text-gray-700">
                    {message.role === "user" ? "You" : "AI"}
                  </div>
                  <div className="text-sm whitespace-pre-wrap text-gray-800">
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="bg-white mr-8 p-3 rounded mb-3">
                  <div className="text-xs font-semibold mb-1 text-gray-700">
                    {"AI"}
                  </div>
                  <div className="text-sm text-gray-800">{"Thinking..."}</div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your minigame..."
                className="flex-1 p-2 rounded resize-none border border-gray-300"
                rows={3}
                disabled={loading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || loading}
                className="px-4 h-fit"
              >
                {"Send"}
              </Button>
            </div>
          </div>

          {/* Right Side - Phaser Scene */}
          <div className="w-1/2 flex flex-col p-2">
            <div className="mb-4">
              <Label type="default">{"Game Preview"}</Label>
            </div>

            <div className="flex-1 bg-black rounded overflow-hidden min-h-0">
              <div id="phaser-container" className="w-full h-full" />
            </div>

            <div className="mt-2 text-xs text-gray-400">
              {"Generated minigame will appear here"}
            </div>
          </div>
        </div>
      </OuterPanel>
    </div>
  );
};

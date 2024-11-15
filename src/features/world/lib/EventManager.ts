import { InventoryItemName } from "features/game/types/game";
import { BaseScene } from "../scenes/BaseScene";
import { ReactionName } from "features/pumpkinPlaza/components/Reactions";
import { Message } from "features/pumpkinPlaza/components/ChatUI";

export class EventManager {
  constructor(private scene: BaseScene) {
    this.registerListeners();
  }

  destroy() {
    return;
  }

  registerListeners() {
    this.scene.mmoServer.onMessage(
      "player:reaction",
      this.onPlayerReaction.bind(this),
    );

    this.scene.mmoServer.onMessage(
      "player:toast",
      this.onPlayerToast.bind(this),
    );

    this.scene.mmoServer.state.messages.onAdd(this.onMessage.bind(this));
  }

  onPlayerReaction(data: {
    createdAt: number;
    reaction: ReactionName;
    sessionId: string;
    sceneId: string;
  }) {
    if (data.sceneId !== this.scene.sceneId) return;

    if (data.sessionId === this.scene.mmoServer.sessionId) {
      this.scene.currentPlayer?.react(data.reaction);
    } else {
      this.scene.playerEntities[data.sessionId]?.react(data.reaction);
    }
  }

  onPlayerToast(data: {
    createdAt: number;
    icon: InventoryItemName;
    quantity: number;
    sessionId: string;
    sceneId: string;
  }) {
    if (data.sceneId !== this.scene.sceneId) return;

    if (data.sessionId === this.scene.mmoServer.sessionId) {
      this.scene.currentPlayer?.react(data.icon, data.quantity);
    } else {
      this.scene.playerEntities[data.sessionId]?.react(
        data.icon,
        data.quantity,
      );
    }
  }

  onMessage(message: Message) {
    if (message.sceneId !== this.scene.sceneId) return;

    if (message.authorSessionId === this.scene.mmoServer.sessionId) {
      this.scene.currentPlayer?.speak(message.text);
    } else {
      this.scene.playerEntities[message.authorSessionId]?.speak(message.text);
    }
  }
}

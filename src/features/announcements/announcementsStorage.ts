import { Announcements } from "features/game/types/announcements";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";

export function getGameRulesLastRead(): Date | null {
  const value = localStorage.getItem("gameRulesLastRead");
  if (!value) return null;

  return new Date(value);
}

export function acknowledgeGameRules() {
  return localStorage.setItem("gameRulesLastRead", new Date().toISOString());
}

export function getCodeOfConductLastRead(): Date | null {
  const value = localStorage.getItem("codeOfConductLastRead");
  if (!value) return null;

  return new Date(value);
}

export function acknowledgeCodeOfConduct() {
  return localStorage.setItem(
    "codeOfConductLastRead",
    new Date().toISOString(),
  );
}

export function getIntroductionRead(): Date | null {
  const value = localStorage.getItem("islesIntroduction");
  if (!value) return null;

  return new Date(value);
}

export function acknowledgeIntroduction() {
  return localStorage.setItem("islesIntroduction", new Date().toISOString());
}

export function getVipRead(): Date | null {
  const value = localStorage.getItem(`vipIsRead`);
  if (!value) return null;

  return new Date(value);
}

export function acknowledgeVIP() {
  return localStorage.setItem(`vipIsRead`, new Date().toISOString());
}

export function getBudsRead(): Date | null {
  const value = localStorage.getItem("budsDrop");
  if (!value) return null;

  return new Date(value);
}

export function acknowledgeBuds() {
  return localStorage.setItem("budsDrop", new Date().toISOString());
}

export function hasUnreadMail(
  announcements: Announcements,
  mailbox: GameState["mailbox"],
): boolean {
  const lastRead = localStorage.getItem("mailboxRead");
  localStorage.setItem("mailboxRead", new Date().toISOString());

  // Do not read mailbox on first load
  if (!lastRead) return false;

  const hasAnnouncement = getKeys(announcements ?? {})
    // Ensure they haven't read it already
    .some((id) => {
      const announceAt = announcements[id].announceAt ?? 0;

      if (new Date(lastRead) > new Date(announceAt)) return false;

      return !mailbox.read.find((message) => message.id === id);
    });

  return hasAnnouncement;
}

export function acknowledgeSpecialEvent() {
  localStorage.setItem("specialEventRead", new Date().toISOString());
}

export function specialEventLastAcknowledged(): Date | null {
  const value = localStorage.getItem("specialEventRead");
  if (!value) return null;

  return new Date(value);
}

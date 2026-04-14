import { CONFIG } from "lib/config";
import React, { useContext, useEffect, useRef } from "react";
import { useGame } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";

export const TelegramLogin: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  // Refs
  const telegramWrapperRef = useRef<HTMLDivElement>(null);

  const { gameService } = useGame();

  const onLogin = (payload: {
    hash: string;
    auth_date: number;
    signature: string;
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    photo_url: string;
  }) => {
    gameService.send("telegram.linked", {
      effect: {
        type: "telegram.linked",
        auth_date: payload.auth_date,
        hash: payload.hash,
        first_name: payload.first_name,
        id: payload.id,
        last_name: payload.last_name,
        username: payload.username,
        photo_url: payload.photo_url,
      },
      authToken: authState.context.user.rawToken as string,
    });
  };

  useEffect(() => {
    (window as any).onTelegramAuth = onLogin;

    const scriptElement = document.createElement("script");
    scriptElement.src = "https://telegram.org/js/telegram-widget.js?22";
    scriptElement.setAttribute("data-telegram-login", CONFIG.TELEGRAM_BOT);
    scriptElement.setAttribute("data-size", "large");
    scriptElement.setAttribute("data-onauth", "onTelegramAuth(user)");
    scriptElement.async = true;

    telegramWrapperRef.current?.appendChild(scriptElement);

    // Clear window.onTelegramAuth
    return () => {
      (window as any).onTelegramAuth = undefined;
    };
  }, [telegramWrapperRef]);

  return <div ref={telegramWrapperRef}></div>;
};

export default TelegramLogin;

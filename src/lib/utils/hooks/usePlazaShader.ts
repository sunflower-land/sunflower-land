import { translate } from "lib/i18n/translate";
import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "settings.plazaShader";
export const PLAZA_SHADER_EVENT = "plazaShaderChanged";

export type PlazaShader = "none" | "night";

export const PlazaShaders: Record<PlazaShader, string> = {
  none: translate("plazaShader.none"),
  night: translate("plazaShader.night"),
};

export function cachePlazaShaderSetting(value: PlazaShader) {
  localStorage.setItem(LOCAL_STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent(PLAZA_SHADER_EVENT, { detail: value }));
}

export function getPlazaShaderSetting(): PlazaShader {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY) as PlazaShader;
  return cached ?? "none";
}

export const usePlazaShader = () => {
  const [plazaShader, setPlazaShader] = useState(getPlazaShaderSetting());

  const togglePlazaShader = (shader: PlazaShader) => {
    setPlazaShader(shader);
    cachePlazaShaderSetting(shader);
  };

  useEffect(() => {
    const handlePlazaShaderChange = (event: CustomEvent) => {
      setPlazaShader(event.detail);
    };

    window.addEventListener(PLAZA_SHADER_EVENT as any, handlePlazaShaderChange);

    return () => {
      window.removeEventListener(
        PLAZA_SHADER_EVENT as any,
        handlePlazaShaderChange,
      );
    };
  }, []);

  return { plazaShader, togglePlazaShader };
};

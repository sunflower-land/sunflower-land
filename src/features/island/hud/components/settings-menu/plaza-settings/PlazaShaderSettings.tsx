import React from "react";
import { Button } from "components/ui/Button";
import {
  cachePlazaShaderSetting,
  PlazaShader,
  PlazaShaders,
} from "lib/utils/hooks/usePlazaShader";

export const PlazaShaderSettings: React.FC = () => {
  const plazaShaders = Object.keys(PlazaShaders) as PlazaShader[];

  return (
    <>
      {plazaShaders.map((shader) => (
        <Button
          key={shader}
          className="mb-1"
          onClick={() => cachePlazaShaderSetting(shader)}
        >
          <span>{PlazaShaders[shader]}</span>
        </Button>
      ))}
    </>
  );
};

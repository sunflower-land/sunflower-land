import { PIXEL_SCALE } from "features/game/lib/constants";
import React, { Component, ReactNode } from "react";
import ocean from "assets/decorations/ocean.webp";
import { SomethingWentWrong } from "./SomethingWentWrong";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <>
          <div
            className="absolute inset-0 bg-repeat w-full h-full"
            style={{
              backgroundImage: `url(${ocean})`,
              backgroundSize: `${64 * PIXEL_SCALE}px`,
              imageRendering: "pixelated",
            }}
          />
          <Modal show={true} centered>
            <Panel>
              <SomethingWentWrong />
            </Panel>
          </Modal>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import { PIXEL_SCALE } from "features/game/lib/constants";
import React, { Component, type ReactNode } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { BoundaryError } from "./SomethingWentWrong";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { isExternalDomMutationError } from "lib/errorLogger";

interface Props {
  children?: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Set once we have auto-reloaded this tab. A browser extension that keeps
 * mutating the DOM would otherwise put the player in a reload loop.
 */
const RELOAD_FLAG = "sfl.external-dom-mutation-reload";

const hasAlreadyReloaded = () => {
  try {
    return sessionStorage.getItem(RELOAD_FLAG) !== null;
  } catch {
    // Private mode / locked-down WebViews throw on sessionStorage access.
    // Treat as "already reloaded" so we never loop.
    return true;
  }
};

const markReloaded = () => {
  try {
    sessionStorage.setItem(RELOAD_FLAG, "1");
  } catch {
    // Ignored - hasAlreadyReloaded() has already bailed out in this case.
  }
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    error: null,
  };

  private refreshPage = () => {
    window.location.reload();
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  public componentDidCatch(error: Error) {
    // Not a game bug: something outside React (an extension, or the browser
    // translating the page) moved the nodes React was tracking. A remount
    // recovers the player rather than parking them behind the error modal.
    if (!isExternalDomMutationError(error) || hasAlreadyReloaded()) return;

    markReloaded();

    // Deferred so BoundaryError's mount effect can fire its keepalive report
    // before the page goes away - otherwise we lose the telemetry.
    window.setTimeout(() => window.location.reload(), 500);
  }

  public render() {
    if (this.state.error !== null) {
      return (
        <>
          <div
            className="absolute inset-0 bg-repeat w-full h-full"
            style={{
              backgroundImage: `url(${SUNNYSIDE.decorations.ocean})`,
              backgroundSize: `${64 * PIXEL_SCALE}px`,
              imageRendering: "pixelated",
            }}
          />
          <Modal show={true}>
            <Panel>
              <BoundaryError
                error={this.state.error.message}
                stack={this.state.error.stack}
                onAcknowledge={this.refreshPage}
              />
            </Panel>
          </Modal>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import { Component, ReactNode } from "react";
interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class CommunityBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

export default CommunityBoundary;

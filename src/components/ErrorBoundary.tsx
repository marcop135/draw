import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  onReset?: () => void;
};

type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Panel failed to load:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="app-modal-backdrop">
        <div className="app-modal" role="alertdialog" aria-label="Load failed">
          <div className="app-modal-header">
            <span>Couldn't load that panel</span>
          </div>
          <div className="app-modal-body">
            <p style={{ margin: 0 }}>
              A part of the app failed to load. This usually clears up after a
              reload.
            </p>
          </div>
          <div className="app-modal-footer">
            <button
              className="app-btn"
              type="button"
              onClick={() => {
                this.setState({ error: null });
                this.props.onReset?.();
              }}
            >
              Dismiss
            </button>
            <button
              className="app-btn"
              type="button"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}

import React, { ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RefreshCw, Terminal, Copy, Check, ShieldAlert } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

export default class GlobalErrorBoundary extends React.Component<Props, State> {
  public props!: Props;
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    copied: false,
  };
  public setState!: (state: Partial<State> | ((prevState: State) => Partial<State>)) => void;

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("GlobalErrorBoundary caught an unhandled error:", error, errorInfo);
    if (typeof this.setState === "function") {
      this.setState({ errorInfo });
    }
  }

  private handleReset = () => {
    if (typeof this.setState === "function") {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
    window.location.href = "/";
  };

  private handleCopy = () => {
    const errorText = `${this.state.error?.toString()}\n\nStack:\n${this.state.errorInfo?.componentStack}`;
    navigator.clipboard.writeText(errorText);
    if (typeof this.setState === "function") {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100/90 via-pink-50/80 to-sky-100/90 text-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          
          {/* Glossy Section Box */}
          <div className="max-w-3xl w-full bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-[0_20px_60px_rgba(244,63,94,0.12)] p-6 sm:p-10 relative overflow-hidden">
            <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shadow-lg shadow-rose-500/10 animate-pulse">
                <AlertOctagon size={42} />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-900 text-xs font-mono font-bold uppercase tracking-wider mb-2 shadow-xs">
                  <ShieldAlert size={14} className="text-rose-600" /> Unhandled React Runtime Error Boundary
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Application Exception Shield Activated
                </h1>
                <p className="text-slate-600 text-sm max-w-lg mx-auto mt-2 leading-relaxed font-medium">
                  An unexpected render exception was safely intercepted by the Bussinest Error Shield. You can recover the session or inspect the component stack trace below.
                </p>
              </div>

              {/* Action Options */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-sky-500/25 cursor-pointer"
                >
                  <RefreshCw size={16} /> Recover Session & Home
                </button>
                <button
                  onClick={() => this.setState && this.setState({ showDetails: !this.state.showDetails })}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <Terminal size={16} /> {this.state.showDetails ? "Hide Stack Trace" : "View Stack Trace"}
                </button>
              </div>

              {/* Collapsible Error Diagnostics Box */}
              {this.state.showDetails && (
                <div className="w-full text-left p-4 rounded-2xl bg-rose-50/90 border border-rose-200 font-mono text-xs text-rose-950 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                    <span className="text-rose-900 font-bold">Error Message:</span>
                    <button
                      onClick={this.handleCopy}
                      className="text-rose-900 hover:bg-rose-200 flex items-center gap-1 text-[11px] bg-white border border-rose-200 px-2.5 py-1 rounded cursor-pointer font-bold"
                    >
                      {this.state.copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      {this.state.copied ? "Copied!" : "Copy Trace"}
                    </button>
                  </div>
                  <p className="text-rose-900 font-bold break-all">{this.state.error?.toString()}</p>

                  <div className="pt-2 border-t border-rose-200">
                    <p className="text-rose-800 text-[10px] uppercase font-bold tracking-wider mb-1">Component Stack:</p>
                    <pre className="text-[11px] text-rose-900 font-semibold whitespace-pre-wrap overflow-x-auto max-h-48 custom-scrollbar">
                      {this.state.errorInfo?.componentStack || "No stack trace available"}
                    </pre>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      );
    }

    return this.props.children;
  }
}

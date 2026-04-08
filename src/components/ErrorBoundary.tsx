"use client";
import React from "react";

interface State { hasError: boolean; error?: Error }

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] items-center justify-center p-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-200 dark:text-neutral-800">Oops</p>
            <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-neutral-100">Something went wrong</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">{this.state.error?.message}</p>
            <button onClick={() => this.setState({ hasError: false })} className="mt-4 px-4 py-2 text-sm font-medium bg-gray-900 dark:bg-neutral-100 text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-neutral-200 transition-colors">
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

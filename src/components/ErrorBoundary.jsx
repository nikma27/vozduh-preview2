import React from "react";

/**
 * Error Boundary — перехватывает ошибки в дочерних компонентах
 * и показывает запасной UI вместо падения всего приложения.
 * В React только class-компоненты могут быть Error Boundary.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-medium text-slate-900 mb-4">
              Что-то пошло не так
            </h1>
            <p className="text-slate-600 mb-6">
              Произошла ошибка. Обновите страницу или попробуйте позже.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-normal hover:bg-blue-500 transition-colors"
            >
              Обновить страницу
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: ''
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error('UI crashed:', error);
  }

  handleReset = () => {
    localStorage.removeItem('trader_diary_current_user');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
          <div className="max-w-lg w-full rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
            <h1 className="text-xl font-bold text-slate-800 mb-2">Что-то пошло не так</h1>
            <p className="text-slate-600 mb-4">Похоже, приложение столкнулось с ошибкой и не смогло отрисоваться.</p>
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-3 mb-4">
              {this.state.message || 'Unknown error'}
            </p>
            <button
              onClick={this.handleReset}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2"
            >
              Сбросить текущую сессию и перезапустить
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

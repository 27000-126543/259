import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { routes } from '@/router';
import { useAppStore } from '@/store';
import { useEffect, useState } from 'react';

function AppRoutes() {
  return useRoutes(routes);
}

export default function App() {
  const initApp = useAppStore(state => state.initApp);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initApp();
      setLoading(false);
    };
    init();
  }, [initApp]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">系统加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

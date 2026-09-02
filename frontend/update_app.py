import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add imports
imports_to_add = """import { useEffect, useState } from 'react';
import { fetchUnreadNotificationCount } from './api/dashboardApi';
import NotificationCenter from './components/NotificationCenter';
"""
content = imports_to_add + content

# Update NavBar
navbar_replacement = """function NavBar() {
    const { logout } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const count = await fetchUnreadNotificationCount();
                setUnreadCount(count);
            } catch (err) {
                console.error("Failed to fetch unread count", err);
            }
        };
        fetchCount();
        const intervalId = setInterval(fetchCount, 30000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <nav className="bg-slate-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl">SmartBed</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Dashboard
                            </Link>
                            <Link to="/command-center" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Command Center
                            </Link>
                            <Link to="/beds" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Beds
                            </Link>
                            <Link to="/events" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Events
                            </Link>
                            <Link to="/notifications" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-slate-300 text-sm font-medium">
                                Notifications
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/notifications" className="relative p-1 text-slate-300 hover:text-white">
                            <span className="sr-only">View notifications</span>
                            <span className="text-xl">🔔</span>
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-center text-[10px] font-bold leading-4 text-white transform translate-x-1/2 -translate-y-1/4">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                        <button onClick={logout} className="text-sm font-medium hover:text-slate-300">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}"""

content = re.sub(r'function NavBar\(\) \{.*?\n\}\n', navbar_replacement + '\n', content, flags=re.DOTALL)

# Add Route
route_str = """          <Route path="/notifications" element={
            <ProtectedRoute>
              <Layout>
                  <NotificationCenter />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />"""

content = content.replace('<Route path="*" element={<Navigate to="/" replace />} />', route_str)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

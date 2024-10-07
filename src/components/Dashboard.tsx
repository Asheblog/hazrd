import React from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Users, AlertTriangle, UserPlus } from 'lucide-react'

interface DashboardProps {
  userRole: string
  onLogout: () => void
}

const Dashboard: React.FC<DashboardProps> = ({ userRole, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">隐患管理数据分析系统</h1>
              </div>
            </div>
            <div className="flex items-center">
              {userRole === 'admin' && (
                <>
                  <Link
                    to="/user-management"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <Users className="inline-block mr-1" size={18} />
                    用户管理
                  </Link>
                  <Link
                    to="/personnel-management"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <UserPlus className="inline-block mr-1" size={18} />
                    人员信息库
                  </Link>
                </>
              )}
              <Link
                to="/hazard-management"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                <AlertTriangle className="inline-block mr-1" size={18} />
                隐患管理
              </Link>
              <button
                onClick={onLogout}
                className="ml-4 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogOut className="inline-block mr-1" size={18} />
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900">欢迎，{userRole === 'admin' ? '管理员' : '用户'}</h2>
          <p className="mt-2 text-gray-600">这里是隐患管理数据分析系统的仪表板。您可以在这里查看和管理隐患数据。</p>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
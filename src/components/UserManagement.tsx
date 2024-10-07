import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Edit, Trash2 } from 'lucide-react'
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage'

interface UserData {
  id: number
  username: string
  password: string
  role: string
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([])
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' })

  useEffect(() => {
    const savedUsers = loadFromLocalStorage('users') as UserData[] || []
    if (savedUsers.length === 0) {
      // 如果没有用户，创建默认的超级管理员账号
      const defaultAdmin: UserData = {
        id: 1,
        username: 'decro',
        password: '123456',
        role: 'admin'
      }
      setUsers([defaultAdmin])
      saveToLocalStorage('users', [defaultAdmin])
    } else {
      setUsers(savedUsers)
    }
  }, [])

  useEffect(() => {
    if (users.length > 0) {
      saveToLocalStorage('users', users)
    }
  }, [users])

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (newUser.username && newUser.password) {
      const updatedUsers = [...users, { id: users.length + 1, ...newUser }]
      setUsers(updatedUsers)
      saveToLocalStorage('users', updatedUsers)
      setNewUser({ username: '', password: '', role: 'user' })
    }
  }

  const handleDeleteUser = (id: number) => {
    const updatedUsers = users.filter(user => user.id !== id)
    setUsers(updatedUsers)
    saveToLocalStorage('users', updatedUsers)
  }

  const handleEditUser = (id: number, updatedUser: Partial<UserData>) => {
    const updatedUsers = users.map(user => user.id === id ? { ...user, ...updatedUser } : user)
    setUsers(updatedUsers)
    saveToLocalStorage('users', updatedUsers)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">用户管理</h1>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                返回仪表板
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">添加新用户</h2>
          <form onSubmit={handleAddUser} className="mb-8">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  用户名
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  密码
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  角色
                </label>
                <select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="user">普通用户</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                添加用户
              </button>
            </div>
          </form>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">用户列表</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex text-sm">
                          <p className="font-medium text-indigo-600 truncate">{user.username}</p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            {user.role === 'admin' ? '管理员' : '普通用户'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <button
                        onClick={() => handleEditUser(user.id, { role: user.role === 'admin' ? 'user' : 'admin' })}
                        className="mr-2 text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserManagement
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Upload, Users, Edit, Trash2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage'

interface PersonnelData {
  id: number
  name: string
  department: string
  startDate: string
  endDate: string
}

const PersonnelManagement: React.FC = () => {
  const [personnel, setPersonnel] = useState<PersonnelData[]>([])

  useEffect(() => {
    const savedPersonnel = loadFromLocalStorage('personnel')
    if (savedPersonnel) {
      setPersonnel(savedPersonnel)
    }
  }, [])

  useEffect(() => {
    saveToLocalStorage('personnel', personnel)
  }, [personnel])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet)
        processExcelData(json as any[])
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const processExcelData = (data: any[]) => {
    const processedData: PersonnelData[] = data.map((row, index) => ({
      id: index + 1,
      name: row['姓名'] || '',
      department: row['部门'] || '',
      startDate: row['开始日期'] || '',
      endDate: row['结束日期'] || '',
    }))

    setPersonnel(prevPersonnel => {
      const updatedPersonnel = [...prevPersonnel]
      processedData.forEach(newPerson => {
        const existingIndex = updatedPersonnel.findIndex(p => p.name === newPerson.name && p.department === newPerson.department)
        if (existingIndex !== -1) {
          updatedPersonnel[existingIndex] = newPerson
        } else {
          updatedPersonnel.push(newPerson)
        }
      })
      return updatedPersonnel
    })
  }

  const handleDelete = (id: number) => {
    setPersonnel(personnel.filter(person => person.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">人员信息库管理</h1>
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
          <div className="mb-6">
            <label htmlFor="file-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span>上传人员信息 Excel 文件</span>
              <input id="file-upload" name="file-upload" type="file" accept=".xlsx, .xls" className="sr-only" onChange={handleFileUpload} />
            </label>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">人员列表</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {personnel.map((person) => (
                <li key={person.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex text-sm">
                          <p className="font-medium text-indigo-600 truncate">{person.name}</p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            {person.department}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <p>
                              {person.startDate} - {person.endDate || '至今'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <button className="mr-2 text-indigo-600 hover:text-indigo-900">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
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

export default PersonnelManagement
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Upload, FileSpreadsheet, AlertTriangle, Edit, Lock, Unlock } from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage'

interface HazardData {
  id: number
  oaMainProcessNumber: string
  oaSubProcessNumber: string
  initiator: string
  inspectionDate: string
  factoryArea: string
  hazardType: string
  location: string
  description: string
  responsibleDepartment: string
  responsiblePerson: string
  deadline: string
  progress: string
  currentHandler: string
  completionDate: string
  deductPoints: boolean
  overdueDays: number
  manualLock: boolean
}

const HazardManagement: React.FC = () => {
  const [hazards, setHazards] = useState<HazardData[]>([])
  const [editingHazard, setEditingHazard] = useState<HazardData | null>(null)

  useEffect(() => {
    const savedHazards = loadFromLocalStorage('hazards')
    if (savedHazards) {
      setHazards(savedHazards)
    }
  }, [])

  useEffect(() => {
    saveToLocalStorage('hazards', hazards)
  }, [hazards])

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
    const processedData: HazardData[] = data.map((row, index) => ({
      id: index + 1,
      oaMainProcessNumber: row['主流程单号'] || '',
      oaSubProcessNumber: extractSubProcessNumber(row['单据编号：'] || ''),
      initiator: row['创建人'] || '',
      inspectionDate: row['检查日期'] || '',
      factoryArea: row['隐患所属厂区'] || '',
      hazardType: row['隐患类型'] || '',
      location: row['隐患所属位置'] || '',
      description: row['隐患描述及整改建议'] || '',
      responsibleDepartment: row['整改责任部门'] || '',
      responsiblePerson: row['变更整改责任人'] || row['整改责任人'] || '',
      deadline: getLaterDate(row['整改期限'], row['整改延期至']),
      progress: row['当前节点'] || '',
      currentHandler: getCurrentHandler(row['当前节点'], row['未操作者']),
      completionDate: row['归档日期'] || '',
      deductPoints: row['是否扣分'] === '是',
      overdueDays: calculateOverdueDays(row['当前节点'], row['隐患整改期限']),
      manualLock: false
    }))

    setHazards(prevHazards => {
      const updatedHazards = [...prevHazards]
      processedData.forEach(newHazard => {
        const existingIndex = updatedHazards.findIndex(h => h.oaSubProcessNumber === newHazard.oaSubProcessNumber)
        if (existingIndex !== -1) {
          if (!updatedHazards[existingIndex].manualLock) {
            updatedHazards[existingIndex] = { ...newHazard, manualLock: updatedHazards[existingIndex].manualLock }
          }
        } else {
          updatedHazards.push(newHazard)
        }
      })
      return updatedHazards
    })
  }

  const extractSubProcessNumber = (text: string) => {
    const match = text.match(/单据编号：(.+)/)
    return match ? match[1] : ''
  }

  const getLaterDate = (date1: string, date2: string) => {
    if (!date1) return date2
    if (!date2) return date1
    return new Date(date1) > new Date(date2) ? date1 : date2
  }

  const getCurrentHandler = (currentNode: string, unoperatedPerson: string) => {
    const relevantNodes = ['审核', '反馈', '变更责任人/延期反馈']
    return relevantNodes.includes(currentNode) ? unoperatedPerson : ''
  }

  const calculateOverdueDays = (currentNode: string, deadline: string) => {
    const relevantNodes = ['审核', '反馈', '变更责任人/延期反馈']
    if (relevantNodes.includes(currentNode) && deadline) {
      const today = new Date()
      const deadlineDate = new Date(deadline)
      const diffTime = Math.ceil((today.getTime() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24))
      return diffTime > 0 ? diffTime : 0
    }
    return 0
  }

  const handleEdit = (hazard: HazardData) => {
    setEditingHazard(hazard)
  }

  const handleSave = (updatedHazard: HazardData) => {
    setHazards(hazards.map(h => h.id === updatedHazard.id ? updatedHazard : h))
    setEditingHazard(null)
  }

  const handleCancel = () => {
    setEditingHazard(null)
  }

  const toggleLock = (id: number) => {
    setHazards(hazards.map(h => h.id === id ? { ...h, manualLock: !h.manualLock } : h))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">隐患数据管理</h1>
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
              <span>上传 Excel 文件</span>
              <input id="file-upload" name="file-upload" type="file" accept=".xlsx, .xls" className="sr-only" onChange={handleFileUpload} />
            </label>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">隐患列表</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {hazards.map((hazard) => (
                <li key={hazard.id}>
                  {editingHazard && editingHazard.id === hazard.id ? (
                    <div className="px-4 py-4 sm:px-6">
                      {/* 编辑表单 */}
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        handleSave(editingHazard)
                      }}>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label htmlFor="responsiblePerson" className="block text-sm font-medium text-gray-700">
                              整改责任人
                            </label>
                            <input
                              type="text"
                              name="responsiblePerson"
                              id="responsiblePerson"
                              value={editingHazard.responsiblePerson}
                              onChange={(e) => setEditingHazard({ ...editingHazard, responsiblePerson: e.target.value })}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                              整改期限
                            </label>
                            <input
                              type="date"
                              name="deadline"
                              id="deadline"
                              value={editingHazard.deadline}
                              onChange={(e) => setEditingHazard({ ...editingHazard, deadline: e.target.value })}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            保存
                          </button>
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            取消
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="px-4 py-4 flex items-center sm:px-6">
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <div className="flex text-sm">
                            <p className="font-medium text-indigo-600 truncate">{hazard.oaSubProcessNumber}</p>
                            <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                              {hazard.factoryArea} - {hazard.hazardType}
                            </p>
                          </div>
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-gray-500">
                              <FileSpreadsheet className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <p>
                                责任人: {hazard.responsiblePerson} | 进度: {hazard.progress}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-5 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(hazard)}
                          className="mr-2 text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => toggleLock(hazard.id)}
                          className={`mr-2 ${hazard.manualLock ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          {hazard.manualLock ? <Lock size={18} /> : <Unlock size={18} />}
                        </button>
                        {hazard.overdueDays > 0 && (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HazardManagement
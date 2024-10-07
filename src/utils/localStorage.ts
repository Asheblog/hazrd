// 用于处理本地存储的工具函数

export const saveToLocalStorage = (key: string, data: any) => {
  try {
    const serializedData = JSON.stringify(data)
    localStorage.setItem(key, serializedData)
  } catch (error) {
    console.error('Error saving data to localStorage:', error)
  }
}

export const loadFromLocalStorage = (key: string) => {
  try {
    const serializedData = localStorage.getItem(key)
    if (serializedData === null) {
      return undefined
    }
    return JSON.parse(serializedData)
  } catch (error) {
    console.error('Error loading data from localStorage:', error)
    return undefined
  }
}
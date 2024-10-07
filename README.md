# hazrd

# 隐患管理数据分析系统

## 项目概述

本项目是一个基于 React 和 TypeScript 的隐患管理数据分析系统。它旨在提高企业对隐患管理的效率和准确性，支持多用户、多等级管理，并提供从 Excel 文档批量导入隐患数据的功能，同时具备数据对比、自动更新、人员信息库维护等功能。

## 主要功能

1. 用户管理：支持多用户和多等级管理，不同等级的用户拥有不同的权限。
2. 隐患数据管理：支持从 Excel 文档批量导入隐患数据，并自动对比更新。
3. 人员信息库管理：支持人员信息的维护，包括批量导入和编辑功能。
4. 数据分析：预留了数据分析与图表功能，方便后期扩展。

## 技术栈

- React
- TypeScript
- Tailwind CSS
- Vite
- xlsx (用于 Excel 文件处理)

## 项目结构

```
src/
├── components/
│   ├── Dashboard.tsx
│   ├── DataAnalysis.tsx
│   ├── HazardManagement.tsx
│   ├── Login.tsx
│   ├── PersonnelManagement.tsx
│   └── UserManagement.tsx
├── utils/
│   └── localStorage.ts
├── App.tsx
└── main.tsx
```

## 安装和运行

1. 克隆项目仓库：
   ```
   git clone [项目仓库URL]
   ```

2. 安装依赖：
   ```
   npm install
   ```

3. 运行开发服务器：
   ```
   npm run dev
   ```

4. 构建生产版本：
   ```
   npm run build
   ```

## 使用说明

1. 登录系统：使用提供的账号和密码登录系统。
2. 隐患管理：在隐患管理页面，可以查看、编辑隐患数据，以及上传 Excel 文件导入新的隐患数据。
3. 人员管理：在人员管理页面，可以管理人员信息，包括添加、编辑和删除人员记录。
4. 数据分析：在数据分析页面，可以查看各种统计数据和图表（功能待开发）。

## 注意事项

- 确保上传的 Excel 文件格式符合系统要求。
- 定期备份重要数据。
- 遵循数据隐私和安全规定，不要泄露敏感信息。

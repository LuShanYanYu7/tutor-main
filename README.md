# 阅读 APP 管理后台

基于 Vue 3 + TypeScript + Element Plus 开发的阅读 APP 管理后台系统。

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- yarn 或 npm

### 安装运行

1. 安装依赖

```bash
yarn install
```

使用 yarn
yarn install
或使用 npm
npm install

2. 启动开发服务器

```bash
# 使用 yarn
yarn dev

# 或使用 npm
npm run dev
```

3. 在浏览器中访问 http://localhost:5173

## 主要功能

### 书籍管理

- 书籍列表展示与搜索
  - 支持按书名、作者、年级、标签搜索
  - 支持按上架/下架状态筛选
- 书籍信息管理
  - 新增/编辑书籍信息
  - 上传书籍封面和知识库文件
  - 书籍上架/下架操作

### 用户管理

- 用户列表展示与搜索
  - 支持按用户 ID、昵称搜索
  - 支持按性别、年级筛选
  - 支持按电话号码查询
- 用户信息查看

## 项目结构

```
src/
├── layouts/          # 布局组件
│   └── MainLayout.vue  # 主布局组件
├── views/            # 页面组件
│   ├── book/         # 书籍管理
│   │   └── BookList.vue
│   └── user/         # 用户管理
│       └── UserList.vue
├── router/           # 路由配置
├── App.vue           # 根组件
└── main.ts           # 入口文件
```

## 技术栈

- Vue 3
- TypeScript
- Vue Router
- Element Plus
- Vite

## 开发说明

- 使用 Vue 3 的 `<script setup>` 语法
- 使用 TypeScript 进行类型检查
- 使用 Element Plus UI 组件库
- 采用响应式布局设计

## 注意事项

- 当前版本使用模拟数据，实际使用时需配置后端 API
- 建议使用最新版本的 Chrome、Firefox、Safari 或 Edge 浏览器

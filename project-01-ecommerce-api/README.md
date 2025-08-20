# 电商平台后端API

这是180天NestJS学习计划的第一个项目 - 一个功能完整的电商平台后端API系统。

## 项目特性

- 🚀 基于 NestJS 框架构建
- 🔐 JWT 认证与授权
- 📦 商品管理系统
- 🛒 购物车与订单处理
- 💳 支付集成
- 📊 后台管理功能
- 📚 Swagger API 文档
- 🐳 Docker 容器化部署
- 🧪 单元测试与集成测试

## 技术栈

- **框架**: NestJS 10.x + TypeScript
- **数据库**: PostgreSQL 15.x + TypeORM
- **缓存**: Redis 7.x
- **认证**: JWT + Passport
- **文档**: Swagger/OpenAPI
- **测试**: Jest + Supertest
- **容器化**: Docker + Docker Compose

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动数据库服务
```bash
docker-compose up -d postgres redis
```

### 3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件配置数据库等信息
```

### 4. 启动开发服务器
```bash
npm run start:dev
```

### 5. 访问API文档
打开浏览器访问: http://localhost:3000/api/docs

## API 端点

### 认证相关
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/auth/profile` - 获取用户信息

### 商品管理
- `GET /api/v1/products` - 获取商品列表
- `GET /api/v1/products/:id` - 获取单个商品
- `POST /api/v1/products` - 创建商品
- `PUT /api/v1/products/:id` - 更新商品
- `DELETE /api/v1/products/:id` - 删除商品

### 订单管理
- `GET /api/v1/orders` - 获取订单列表
- `POST /api/v1/orders` - 创建订单
- `GET /api/v1/orders/:id` - 获取订单详情
- `PUT /api/v1/orders/:id/status` - 更新订单状态

## 开发命令

```bash
# 开发环境启动
npm run start:dev

# 构建生产版本
npm run build

# 运行测试
npm run test

# 运行端到端测试
npm run test:e2e

# 生成测试覆盖率报告
npm run test:cov

# 数据库迁移
npm run migration:generate -- -n MigrationName
npm run migration:run
```

## 数据库管理

### 使用 pgAdmin
访问 http://localhost:5050
- 邮箱: admin@admin.com  
- 密码: admin

### 连接数据库
- 主机: postgres (或 localhost)
- 端口: 5432
- 数据库: ecommerce
- 用户名: postgres
- 密码: password

## 项目结构

```
src/
├── auth/              # 认证模块
├── users/             # 用户管理
├── products/          # 商品管理
├── categories/        # 分类管理
├── orders/            # 订单管理
├── payments/          # 支付处理
├── admin/             # 后台管理
├── common/            # 公共模块
├── config/            # 配置管理
└── database/          # 数据库相关
```

## 学习目标

通过这个项目，你将掌握：
- NestJS 核心概念和装饰器
- TypeORM 数据库操作
- JWT 认证机制
- RESTful API 设计
- 单元测试编写
- Docker 容器化
- API 文档生成
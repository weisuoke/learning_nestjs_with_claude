# NestJS 10天基础学习计划

> 专为快速掌握NestJS核心概念设计的密集学习计划

## 学习目标

通过10天的学习，你将掌握：
- NestJS框架的核心架构和设计模式
- TypeScript在服务端开发中的应用
- RESTful API的设计与实现
- 数据库集成和ORM操作
- 身份认证与授权系统
- 单元测试和集成测试
- 项目部署和容器化

---

## 第1天：NestJS架构基础

### 学习重点
- **模块系统 (Modules)**：应用架构的核心
- **控制器 (Controllers)**：处理HTTP请求
- **服务 (Services)**：业务逻辑层

### 实践任务
1. 创建用户管理模块
2. 实现基础CRUD控制器
3. 创建用户服务类

### 代码示例位置
- `src/users/users.module.ts`
- `src/users/users.controller.ts` 
- `src/users/users.service.ts`

### 关键概念
- `@Module()` 装饰器的作用
- `@Controller()` 路由前缀
- `@Injectable()` 服务注入

---

## 第2天：依赖注入与装饰器

### 学习重点
- **依赖注入 (DI)**：NestJS的核心设计模式
- **装饰器系统**：元数据编程
- **生命周期钩子**：组件初始化和销毁

### 实践任务
1. 理解构造函数注入
2. 实现自定义装饰器
3. 添加生命周期钩子

### 代码示例
```typescript
// 依赖注入示例
@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}
  
  onModuleInit() {
    console.log('UsersService initialized');
  }
}
```

### 关键概念
- 构造函数注入 vs 属性注入
- 循环依赖问题解决
- Provider作用域

---

## 第3天：HTTP处理与路由

### 学习重点
- **HTTP方法**：GET, POST, PUT, DELETE
- **路由参数**：路径参数、查询参数、请求体
- **请求响应**：状态码、错误处理

### 实践任务
1. 实现完整的用户CRUD API
2. 添加参数验证
3. 自定义响应格式

### API端点设计
```
GET    /users           # 获取用户列表
GET    /users/:id       # 获取单个用户
POST   /users           # 创建用户
PUT    /users/:id       # 更新用户
DELETE /users/:id       # 删除用户
```

### 关键装饰器
- `@Get()`, `@Post()`, `@Put()`, `@Delete()`
- `@Param()`, `@Query()`, `@Body()`
- `@Res()`, `@Req()`

---

## 第4天：数据验证与DTO

### 学习重点
- **DTO (Data Transfer Object)**：数据传输对象
- **验证管道 (Validation Pipes)**：输入验证
- **异常处理**：错误响应统一处理

### 实践任务
1. 创建用户DTO类
2. 添加验证规则
3. 实现全局异常过滤器

### DTO示例
```typescript
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

### 关键概念
- `class-validator` 装饰器
- `ValidationPipe` 配置
- 自定义验证器

---

## 第5天：数据库集成基础

### 学习重点
- **TypeORM**：对象关系映射
- **实体定义**：数据模型设计
- **数据库连接**：配置和连接池

### 实践任务
1. 配置PostgreSQL连接
2. 创建User实体
3. 实现基础数据库操作

### 实体示例
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 关键概念
- 实体装饰器：`@Entity()`, `@Column()`, `@PrimaryGeneratedColumn()`
- Repository模式
- 数据库配置

---

## 第6天：高级数据库操作

### 学习重点
- **关系映射**：一对一、一对多、多对多
- **查询构建器**：复杂查询
- **事务处理**：数据一致性

### 实践任务
1. 创建Category和Product实体
2. 建立实体关系
3. 实现复杂查询

### 关系示例
```typescript
// 一对多关系
@Entity()
export class Category {
  @OneToMany(() => Product, product => product.category)
  products: Product[];
}

@Entity()
export class Product {
  @ManyToOne(() => Category, category => category.products)
  category: Category;
}
```

### 关键概念
- `@OneToMany()`, `@ManyToOne()`, `@ManyToMany()`
- 查询关系数据
- 级联操作

---

## 第7天：身份认证基础

### 学习重点
- **Passport.js**：认证中间件
- **JWT策略**：无状态认证
- **密码加密**：bcrypt哈希

### 实践任务
1. 安装认证相关依赖
2. 实现用户注册/登录
3. JWT令牌生成和验证

### 认证流程
```typescript
@Post('login')
async login(@Body() loginDto: LoginDto) {
  const user = await this.authService.validateUser(loginDto);
  return this.authService.login(user);
}
```

### 关键概念
- Passport策略配置
- JWT令牌结构
- 密码哈希和验证

---

## 第8天：授权与守卫

### 学习重点
- **守卫 (Guards)**：访问控制
- **角色权限**：基于角色的访问控制
- **自定义守卫**：业务逻辑授权

### 实践任务
1. 创建JWT认证守卫
2. 实现角色权限系统
3. 保护敏感API端点

### 守卫示例
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {}
```

### 关键概念
- `@UseGuards()` 装饰器
- 角色装饰器 `@Roles()`
- 守卫执行顺序

---

## 第9天：测试开发

### 学习重点
- **单元测试**：Jest测试框架
- **集成测试**：端到端测试
- **Mock对象**：依赖模拟

### 实践任务
1. 编写服务层单元测试
2. 创建控制器集成测试
3. 模拟数据库操作

### 测试示例
```typescript
describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });
});
```

### 关键概念
- Jest测试套件
- NestJS测试模块
- Mock和Spy

---

## 第10天：部署与优化

### 学习重点
- **环境配置**：开发、测试、生产环境
- **Docker容器化**：应用打包和部署
- **性能优化**：缓存、压缩、监控

### 实践任务
1. 配置多环境变量
2. 创建Dockerfile
3. 设置生产环境优化

### Docker配置
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### 关键概念
- 环境变量管理
- 容器编排
- 生产环境最佳实践

---

## 每日学习安排

### 时间分配（每天3-4小时）
- **理论学习**：1-1.5小时（阅读文档，观看视频）
- **动手实践**：2-2.5小时（编写代码，运行测试）
- **总结反思**：30分钟（记录笔记，整理问题）

### 学习方法
1. **先理解概念**：阅读官方文档和相关资料
2. **动手实践**：在项目中实际应用所学知识
3. **解决问题**：遇到错误时查阅资料和调试
4. **代码review**：对比最佳实践优化代码
5. **总结记录**：记录学习要点和踩坑经验

### 学习资源
- [NestJS官方文档](https://docs.nestjs.com/)
- [TypeScript文档](https://www.typescriptlang.org/docs/)
- [TypeORM文档](https://typeorm.io/)
- [Jest测试文档](https://jestjs.io/docs/getting-started)

### 实践项目
基于现有的 `project-01-ecommerce-api` 进行学习实践，确保所学知识能够在真实项目中应用。

### 进度检查点
- **第3天**：能够创建基本的CRUD API
- **第6天**：完成数据库集成和基本查询
- **第8天**：实现完整的认证授权系统
- **第10天**：项目能够完整运行并通过测试

---

## 学习成果验收

完成10天学习后，你应该能够：

1. ✅ 独立搭建NestJS项目架构
2. ✅ 设计和实现RESTful API
3. ✅ 集成数据库进行数据持久化
4. ✅ 实现用户认证和授权系统
5. ✅ 编写单元测试和集成测试
6. ✅ 部署应用到生产环境
7. ✅ 解决常见的开发问题

**祝你学习愉快！🚀**
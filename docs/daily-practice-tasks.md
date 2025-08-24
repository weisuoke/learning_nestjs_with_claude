# NestJS 10天学习 - 每日实践任务清单

> 详细的动手实践任务，确保理论与实践相结合

---

## 第1天：NestJS架构基础

### 🎯 今日目标
掌握NestJS的模块、控制器、服务三大核心概念

### ✅ 实践任务清单

#### 任务1.1：创建用户模块 (30分钟)
- [ ] 使用CLI创建用户模块：`nest g module users`
- [ ] 查看生成的 `users.module.ts` 文件
- [ ] 理解 `@Module()` 装饰器的结构
- [ ] 在 `app.module.ts` 中查看模块如何被导入

#### 任务1.2：创建用户控制器 (45分钟)  
- [ ] 创建用户控制器：`nest g controller users`
- [ ] 实现基础路由：
  ```typescript
  @Get()
  findAll() {
    return 'This action returns all users';
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} user`;
  }
  ```
- [ ] 使用Postman或curl测试API端点
- [ ] 观察控制器如何在模块中注册

#### 任务1.3：创建用户服务 (45分钟)
- [ ] 创建用户服务：`nest g service users`
- [ ] 实现基础业务逻辑：
  ```typescript
  @Injectable()
  export class UsersService {
    private readonly users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];

    findAll() {
      return this.users;
    }

    findOne(id: number) {
      return this.users.find(user => user.id === id);
    }
  }
  ```
- [ ] 在控制器中注入并使用服务
- [ ] 测试完整的请求流程

#### 任务1.4：理解项目结构 (30分钟)
- [ ] 分析 `main.ts` 启动文件
- [ ] 理解 `app.module.ts` 根模块
- [ ] 查看 `nest-cli.json` 配置文件
- [ ] 运行 `npm run start:dev` 启动开发服务器

### 🔍 关键检查点
- [ ] 能够解释模块、控制器、服务的作用和关系
- [ ] 用户API能够正常响应GET请求
- [ ] 理解依赖注入的基本概念

### 📝 今日总结模板
```
## 第1天学习总结

### 掌握的概念：
- [ ] NestJS模块系统
- [ ] 控制器路由处理
- [ ] 服务业务逻辑

### 遇到的问题：
1. 
2. 

### 明日重点：
- 深入理解依赖注入
- 学习装饰器系统
```

---

## 第2天：依赖注入与装饰器

### 🎯 今日目标
深入理解NestJS的依赖注入系统和装饰器机制

### ✅ 实践任务清单

#### 任务2.1：理解构造函数注入 (30分钟)
- [ ] 在 `UsersController` 中通过构造函数注入 `UsersService`
- [ ] 观察服务实例的创建和共享
- [ ] 尝试注入多个服务

#### 任务2.2：探索装饰器系统 (60分钟)
- [ ] 创建自定义装饰器：
  ```typescript
  // decorators/user.decorator.ts
  export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    },
  );
  ```
- [ ] 在控制器中使用自定义装饰器
- [ ] 研究常用装饰器：`@Injectable()`, `@Controller()`, `@Module()`

#### 任务2.3：实现生命周期钩子 (45分钟)
- [ ] 在服务中实现 `OnModuleInit` 接口：
  ```typescript
  export class UsersService implements OnModuleInit {
    onModuleInit() {
      console.log('UsersService has been initialized.');
    }
  }
  ```
- [ ] 测试其他生命周期钩子：`OnModuleDestroy`
- [ ] 观察钩子的执行顺序

#### 任务2.4：Provider作用域 (45分钟)
- [ ] 创建不同作用域的服务：
  ```typescript
  @Injectable({ scope: Scope.REQUEST })
  export class RequestScopedService {
    private readonly id = Math.random();
    getId() { return this.id; }
  }
  ```
- [ ] 比较单例和请求作用域的差异
- [ ] 理解性能影响

### 🔍 关键检查点
- [ ] 能够解释依赖注入的工作原理
- [ ] 成功创建和使用自定义装饰器
- [ ] 理解Provider的不同作用域

---

## 第3天：HTTP处理与路由

### 🎯 今日目标
掌握HTTP请求处理和RESTful API设计

### ✅ 实践任务清单

#### 任务3.1：实现完整CRUD操作 (90分钟)
- [ ] 实现创建用户：
  ```typescript
  @Post()
  create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }
  ```
- [ ] 实现更新用户：`PUT /users/:id`
- [ ] 实现删除用户：`DELETE /users/:id`
- [ ] 在服务层实现对应的业务逻辑

#### 任务3.2：处理不同类型的参数 (60分钟)
- [ ] 路径参数：`@Param('id') id: string`
- [ ] 查询参数：`@Query('page') page: number`
- [ ] 请求体：`@Body() data: any`
- [ ] 请求头：`@Headers('authorization') auth: string`

#### 任务3.3：自定义响应格式 (30分钟)
- [ ] 设置HTTP状态码：`@HttpCode(201)`
- [ ] 自定义响应头：`@Header('Cache-Control', 'none')`
- [ ] 使用响应对象：`@Res() response: Response`

### 🔍 关键检查点
- [ ] 完整的用户CRUD API能够正常工作
- [ ] 理解不同HTTP方法的使用场景
- [ ] 能够处理各种类型的请求参数

---

## 第4天：数据验证与DTO

### 🎯 今日目标
实现输入验证和错误处理机制

### ✅ 实践任务清单

#### 任务4.1：创建DTO类 (45分钟)
```typescript
// dto/create-user.dto.ts
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string;
}
```

#### 任务4.2：配置全局验证管道 (30分钟)
- [ ] 在 `main.ts` 中配置全局验证：
  ```typescript
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  ```

#### 任务4.3：实现异常过滤器 (45分钟)
- [ ] 创建自定义异常过滤器
- [ ] 处理验证错误响应格式
- [ ] 测试各种错误场景

#### 任务4.4：创建更新DTO (30分钟)
- [ ] 创建 `UpdateUserDto` 继承 `PartialType(CreateUserDto)`
- [ ] 实现部分更新逻辑

### 🔍 关键检查点
- [ ] 输入验证能够正常工作
- [ ] 错误响应格式统一且友好
- [ ] DTO能够正确转换数据类型

---

## 第5天：数据库集成基础

### 🎯 今日目标
集成PostgreSQL数据库，实现数据持久化

### ✅ 实践任务清单

#### 任务5.1：配置数据库连接 (45分钟)
- [ ] 安装依赖：`npm install @nestjs/typeorm typeorm pg`
- [ ] 配置数据库连接：
  ```typescript
  // config/database.config.ts
  export const databaseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'nestjs_learning',
    entities: [User],
    synchronize: true, // 仅开发环境
  };
  ```
- [ ] 在 `app.module.ts` 中导入TypeORM模块

#### 任务5.2：创建User实体 (60分钟)
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### 任务5.3：实现Repository操作 (75分钟)
- [ ] 在服务中注入Repository：
  ```typescript
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  ```
- [ ] 实现基础CRUD操作：
  - `create()`: 创建用户
  - `findAll()`: 查询所有用户
  - `findOne()`: 根据ID查询用户
  - `update()`: 更新用户
  - `remove()`: 删除用户

#### 任务5.4：测试数据库操作 (30分钟)
- [ ] 启动PostgreSQL数据库
- [ ] 测试所有CRUD操作
- [ ] 查看数据库中的表结构和数据

### 🔍 关键检查点
- [ ] 数据库连接成功
- [ ] User实体能够正确映射到数据库表
- [ ] 所有CRUD操作能够正常工作

---

## 第6天：高级数据库操作

### 🎯 今日目标
掌握复杂查询、关系映射和事务处理

### ✅ 实践任务清单

#### 任务6.1：创建Category和Product实体 (60分钟)
```typescript
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @ManyToOne(() => User, user => user.products)
  owner: User;
}
```

#### 任务6.2：实现复杂查询 (90分钟)
- [ ] 使用Query Builder：
  ```typescript
  async findUsersWithProducts() {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.products', 'product')
      .leftJoinAndSelect('product.category', 'category')
      .getMany();
  }
  ```
- [ ] 实现分页查询
- [ ] 添加排序和过滤功能
- [ ] 实现搜索功能

#### 任务6.3：事务处理 (45分钟)
- [ ] 实现事务操作：
  ```typescript
  async createUserWithProducts(userData, productsData) {
    return this.dataSource.transaction(async manager => {
      const user = await manager.save(User, userData);
      const products = productsData.map(p => ({ ...p, owner: user }));
      await manager.save(Product, products);
      return user;
    });
  }
  ```

#### 任务6.4：数据库迁移 (30分钟)
- [ ] 生成迁移文件：`npm run migration:generate -- -n CreateTables`
- [ ] 运行迁移：`npm run migration:run`
- [ ] 理解迁移文件结构

### 🔍 关键检查点
- [ ] 实体关系正确建立
- [ ] 复杂查询能够正常执行
- [ ] 事务处理确保数据一致性

---

## 第7天：身份认证基础

### 🎯 今日目标
实现用户注册、登录和JWT认证

### ✅ 实践任务清单

#### 任务7.1：安装认证依赖 (15分钟)
```bash
npm install @nestjs/passport @nestjs/jwt passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

#### 任务7.2：创建认证模块 (45分钟)
- [ ] 创建认证模块：`nest g module auth`
- [ ] 创建认证服务：`nest g service auth`
- [ ] 创建认证控制器：`nest g controller auth`

#### 任务7.3：实现密码加密 (30分钟)
```typescript
// auth.service.ts
async hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
```

#### 任务7.4：实现用户注册 (60分钟)
- [ ] 创建注册DTO
- [ ] 实现注册逻辑：
  ```typescript
  async register(registerDto: RegisterDto) {
    const hashedPassword = await this.hashPassword(registerDto.password);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
    return this.generateToken(user);
  }
  ```

#### 任务7.5：实现用户登录和JWT (90分钟)
- [ ] 配置JWT模块
- [ ] 实现登录验证：
  ```typescript
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.comparePasswords(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  ```
- [ ] 生成JWT令牌
- [ ] 实现登录端点

### 🔍 关键检查点
- [ ] 用户能够成功注册
- [ ] 密码被正确加密存储
- [ ] 登录能够返回有效的JWT令牌

---

## 第8天：授权与守卫

### 🎯 今日目标
实现访问控制和基于角色的权限系统

### ✅ 实践任务清单

#### 任务8.1：创建JWT策略 (45分钟)
```typescript
// strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
```

#### 任务8.2：创建JWT守卫 (30分钟)
```typescript
// guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

#### 任务8.3：实现角色系统 (60分钟)
- [ ] 创建角色枚举：
  ```typescript
  export enum Role {
    USER = 'user',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
  }
  ```
- [ ] 创建角色装饰器：
  ```typescript
  export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
  ```
- [ ] 在User实体中添加role字段

#### 任务8.4：创建角色守卫 (45分钟)
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) return true;
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
```

#### 任务8.5：保护路由 (45分钟)
- [ ] 保护用户管理路由：
  ```typescript
  @Controller('users')
  @UseGuards(JwtAuthGuard)
  export class UsersController {
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }
    
    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
      return this.usersService.remove(+id);
    }
  }
  ```

#### 任务8.6：测试权限系统 (30分钟)
- [ ] 测试无令牌访问保护路由
- [ ] 测试不同角色的访问权限
- [ ] 验证JWT令牌过期处理

### 🔍 关键检查点
- [ ] JWT认证守卫能够正确验证令牌
- [ ] 角色权限系统正常工作
- [ ] 受保护的路由只能被授权用户访问

---

## 第9天：测试开发

### 🎯 今日目标
编写单元测试和集成测试，确保代码质量

### ✅ 实践任务清单

#### 任务9.1：配置测试环境 (30分钟)
- [ ] 检查 `jest.config.js` 配置
- [ ] 创建测试数据库配置
- [ ] 安装测试相关依赖

#### 任务9.2：编写用户服务单元测试 (90分钟)
```typescript
// users.service.spec.ts
describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 1, username: 'test', email: 'test@test.com' }];
      jest.spyOn(repository, 'find').mockResolvedValue(users as User[]);
      
      expect(await service.findAll()).toBe(users);
    });
  });
  
  // 添加更多测试用例...
});
```

#### 任务9.3：编写控制器测试 (60分钟)
- [ ] 测试HTTP请求处理
- [ ] 模拟服务依赖
- [ ] 验证响应格式

#### 任务9.4：编写端到端测试 (75分钟)
```typescript
// app.e2e-spec.ts
describe('Users (e2e)', () => {
  let app: INestApplication;
  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});
```

#### 任务9.5：测试认证流程 (45分钟)
- [ ] 测试用户注册
- [ ] 测试用户登录
- [ ] 测试JWT令牌验证
- [ ] 测试权限保护

### 🔍 关键检查点
- [ ] 所有单元测试通过
- [ ] 集成测试覆盖主要功能
- [ ] 测试覆盖率达到80%以上

---

## 第10天：部署与优化

### 🎯 今日目标
准备生产环境部署，优化应用性能

### ✅ 实践任务清单

#### 任务10.1：环境配置管理 (45分钟)
- [ ] 安装配置模块：`npm install @nestjs/config`
- [ ] 创建环境变量文件：
  ```bash
  # .env
  NODE_ENV=development
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=postgres
  DB_PASSWORD=password
  DB_DATABASE=nestjs_learning
  JWT_SECRET=your_secret_key_here
  JWT_EXPIRES_IN=24h
  ```
- [ ] 配置不同环境：development, staging, production

#### 任务10.2：创建Docker配置 (60分钟)
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制包文件
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "run", "start:prod"]
```

- [ ] 创建 `docker-compose.yml`：
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
    
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: nestjs_app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### 任务10.3：性能优化 (90分钟)
- [ ] 添加响应压缩：
  ```typescript
  import * as compression from 'compression';
  app.use(compression());
  ```
- [ ] 配置CORS：
  ```typescript
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  ```
- [ ] 添加请求限流：
  ```bash
  npm install @nestjs/throttler
  ```
- [ ] 实现Redis缓存（可选）

#### 任务10.4：监控和日志 (45分钟)
- [ ] 添加健康检查端点：
  ```typescript
  @Get('health')
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
  ```
- [ ] 配置应用日志
- [ ] 添加错误监控

#### 任务10.5：部署测试 (60分钟)
- [ ] 构建生产版本：`npm run build`
- [ ] 运行Docker容器：`docker-compose up`
- [ ] 测试所有API端点
- [ ] 验证数据库连接
- [ ] 检查应用性能

#### 任务10.6：创建部署文档 (30分钟)
- [ ] 编写部署指南
- [ ] 记录环境变量说明
- [ ] 创建故障排除手册

### 🔍 关键检查点
- [ ] 应用能够在Docker中正常运行
- [ ] 所有环境变量正确配置
- [ ] 生产环境优化措施已实施
- [ ] 监控和日志系统工作正常

---

## 📊 学习进度跟踪表

| 天数 | 主题 | 理论学习 | 实践任务 | 测试验证 | 状态 |
|------|------|----------|----------|----------|------|
| 1 | NestJS基础架构 | ⏱️ 90分钟 | ⏱️ 120分钟 | ⏱️ 30分钟 | ⏳ |
| 2 | 依赖注入与装饰器 | ⏱️ 90分钟 | ⏱️ 120分钟 | ⏱️ 30分钟 | ⏳ |
| 3 | HTTP处理与路由 | ⏱️ 60分钟 | ⏱️ 150分钟 | ⏱️ 30分钟 | ⏳ |
| 4 | 数据验证与DTO | ⏱️ 60分钟 | ⏱️ 120分钟 | ⏱️ 30分钟 | ⏳ |
| 5 | 数据库集成基础 | ⏱️ 90分钟 | ⏱️ 150分钟 | ⏱️ 30分钟 | ⏳ |
| 6 | 高级数据库操作 | ⏱️ 90分钟 | ⏱️ 150分钟 | ⏱️ 30分钟 | ⏳ |
| 7 | 身份认证基础 | ⏱️ 90分钟 | ⏱️ 150分钟 | ⏱️ 30分钟 | ⏳ |
| 8 | 授权与守卫 | ⏱️ 90分钟 | ⏱️ 150分钟 | ⏱️ 30分钟 | ⏳ |
| 9 | 测试开发 | ⏱️ 90分钟 | ⏱️ 150分钟 | ⏱️ 30分钟 | ⏳ |
| 10 | 部署与优化 | ⏱️ 90分钟 | ⏱️ 180分钟 | ⏱️ 30分钟 | ⏳ |

## 🎯 每日学习检查清单

### 开始学习前
- [ ] 复习前一天的学习内容
- [ ] 准备开发环境
- [ ] 确认今日学习目标

### 学习过程中
- [ ] 按照任务清单逐步完成
- [ ] 遇到问题及时记录
- [ ] 测试每个功能点

### 学习结束后
- [ ] 完成今日总结
- [ ] 标记完成状态
- [ ] 预览明日学习内容

**祝你学习顺利！每一天的积累都会让你更接近NestJS专家！🚀**
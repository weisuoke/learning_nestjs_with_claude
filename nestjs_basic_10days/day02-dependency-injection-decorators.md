# NestJS入门 - 第2天：依赖注入与装饰器 | NestJS Introduction - Day 2: Dependency Injection and Decorators

## 学习目标 | Learning Objectives
- 深入理解依赖注入的工作原理和设计模式 | Deeply understand the working principles and design patterns of dependency injection
- 掌握NestJS中各种装饰器的使用和自定义方法 | Master the usage and customization methods of various decorators in NestJS
- 学会使用生命周期钩子管理组件的初始化和销毁 | Learn to use lifecycle hooks to manage component initialization and destruction
- 理解Provider的不同作用域和注入方式 | Understand different scopes and injection methods of Providers
- 能够设计可测试和松耦合的应用架构 | Be able to design testable and loosely coupled application architecture
- 掌握装饰器工厂和元数据反射的高级用法 | Master advanced usage of decorator factories and metadata reflection

## 详细内容 | Detailed Content

### 1. 依赖注入深度解析 | Dependency Injection Deep Dive (1小时 | 1 hour)

- **依赖注入的核心原理 | Core Principles of Dependency Injection**
  
  **概念定义 | Concept Definition:**
  依赖注入是一种控制反转(IoC)的实现方式，通过外部容器负责创建和管理对象依赖关系，而不是对象自身创建依赖，实现了松耦合和高可测试性的代码结构。| Dependency Injection is an implementation of Inversion of Control (IoC), where external containers are responsible for creating and managing object dependencies rather than objects creating dependencies themselves, achieving loosely coupled and highly testable code structure.
  
  **核心特征 | Key Characteristics:**
  - 控制反转：将依赖创建的控制权交给外部容器 | Inversion of Control: Transfer control of dependency creation to external container
  - 松耦合：减少类之间的直接依赖关系 | Loose Coupling: Reduce direct dependencies between classes
  - 可测试性：便于模拟依赖进行单元测试 | Testability: Easy to mock dependencies for unit testing
  - 生命周期管理：容器负责管理对象的创建和销毁 | Lifecycle Management: Container manages object creation and destruction
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 依赖注入是否意味着对象不能创建任何内部对象？| Does dependency injection mean objects cannot create any internal objects?
     **答案 | Answer:** 否 | No - 依赖注入主要针对外部依赖，对象仍可创建内部辅助对象或值对象 | DI mainly targets external dependencies; objects can still create internal helper objects or value objects
  2. 使用依赖注入是否会影响应用程序的启动性能？| Does using dependency injection affect application startup performance?  
     **答案 | Answer:** 略微影响 | Slightly - 启动时需要构建依赖图，但运行时性能更好，且提供更多架构优势 | Requires building dependency graph at startup, but provides better runtime performance and architectural benefits
  3. 循环依赖在依赖注入中是否总是错误的？| Are circular dependencies always wrong in dependency injection?
     **答案 | Answer:** 通常是 | Usually yes - 循环依赖表明设计问题，但NestJS提供forwardRef()作为临时解决方案 | Circular dependencies indicate design issues, but NestJS provides forwardRef() as temporary solution
  4. 依赖注入容器是否在编译时解析依赖？| Does the dependency injection container resolve dependencies at compile time?
     **答案 | Answer:** 否 | No - 依赖在运行时解析，但TypeScript的类型信息在编译时用于生成元数据 | Dependencies are resolved at runtime, but TypeScript type information is used at compile time to generate metadata
  
  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  // 传统方式 - 紧耦合 | Traditional approach - Tight coupling
  class BadEmailService {
    private smtpClient = new SMTPClient('smtp.gmail.com'); // 硬编码依赖 | Hard-coded dependency
    
    send(to: string, subject: string, body: string) {
      return this.smtpClient.send({ to, subject, body });
    }
  }
  
  // 依赖注入方式 - 松耦合 | Dependency injection approach - Loose coupling
  interface EmailProvider {
    send(to: string, subject: string, body: string): Promise<boolean>;
  }
  
  @Injectable()
  class SMTPEmailProvider implements EmailProvider {
    constructor(private config: ConfigService) {} // 注入配置服务 | Inject configuration service
    
    async send(to: string, subject: string, body: string): Promise<boolean> {
      const smtpHost = this.config.get('SMTP_HOST'); // 从配置获取 | Get from configuration
      // SMTP发送逻辑 | SMTP sending logic
      console.log(`通过${smtpHost}发送邮件到${to} | Sending email to ${to} via ${smtpHost}`);
      return true;
    }
  }
  
  @Injectable()
  class MockEmailProvider implements EmailProvider {
    async send(to: string, subject: string, body: string): Promise<boolean> {
      console.log(`模拟发送邮件：${to} - ${subject} | Mock email sent: ${to} - ${subject}`);
      return true;
    }
  }
  
  @Injectable()
  class NotificationService {
    // 依赖注入：不关心具体实现 | Dependency injection: doesn't care about concrete implementation
    constructor(private emailProvider: EmailProvider) {}
    
    async sendWelcomeNotification(userEmail: string, userName: string) {
      return this.emailProvider.send(
        userEmail,
        '欢迎加入！| Welcome!',
        `你好 ${userName}，欢迎加入我们的平台！| Hello ${userName}, welcome to our platform!`
      );
    }
  }
  ```
  
  **实践检查问题 | Practice Checking Questions:**
  - NotificationService是否需要知道邮件是如何发送的？| Does NotificationService need to know how emails are sent?
    **答案 | Answer:** 否 | No - 它只依赖EmailProvider接口，具体实现由容器决定 | It only depends on EmailProvider interface, concrete implementation is decided by container
  - 如何在测试中替换EmailProvider？| How to replace EmailProvider in tests?
    **答案 | Answer:** 使用MockEmailProvider或测试模块配置不同的provider | Use MockEmailProvider or configure different provider in test module
  
  **常见误区检查 | Common Misconception Checks:**
  - 依赖注入是否只适用于大型应用？| Is dependency injection only suitable for large applications?
    **答案 | Answer:** 否 | No - 即使小型应用也能从DI的可测试性和灵活性中受益，且NestJS让DI使用变得简单 | Even small applications benefit from DI's testability and flexibility, and NestJS makes DI usage simple
  - 使用依赖注入是否意味着不能使用静态方法？| Does using dependency injection mean static methods cannot be used?
    **答案 | Answer:** 否 | No - 静态方法在某些场景下仍然有用，DI主要用于管理有状态的依赖关系 | Static methods are still useful in certain scenarios; DI mainly manages stateful dependencies

- **Provider作用域和注入策略 | Provider Scopes and Injection Strategies**
  
  **概念定义 | Concept Definition:**
  Provider作用域定义了实例的生命周期和共享方式，包括单例(Singleton)、请求作用域(Request-scoped)和瞬时(Transient)三种类型，不同作用域影响性能和数据共享。| Provider scopes define instance lifecycle and sharing patterns, including Singleton, Request-scoped, and Transient types, different scopes affect performance and data sharing.
  
  **作用域类型 | Scope Types:**
  - 单例作用域(DEFAULT)：整个应用生命周期内共享一个实例 | Singleton Scope (DEFAULT): Share one instance throughout application lifecycle
  - 请求作用域(REQUEST)：每个HTTP请求创建新实例 | Request Scope: Create new instance for each HTTP request
  - 瞬时作用域(TRANSIENT)：每次注入都创建新实例 | Transient Scope: Create new instance for each injection
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 单例作用域的Provider在多线程环境下是否安全？| Are singleton-scoped Providers safe in multi-threaded environments?
     **答案 | Answer:** Node.js是单线程 | Node.js is single-threaded - Node.js的事件循环是单线程的，但需要注意异步操作的状态管理 | Node.js event loop is single-threaded, but pay attention to state management in async operations
  2. 请求作用域的Provider是否会影响应用性能？| Do request-scoped Providers affect application performance?  
     **答案 | Answer:** 是 | Yes - 每个请求都创建新实例，增加内存使用和GC压力，应谨慎使用 | Creating new instances for each request increases memory usage and GC pressure, use cautiously
  3. 瞬时作用域适合用于什么类型的服务？| What types of services are transient scope suitable for?
     **答案 | Answer:** 无状态服务 | Stateless services - 适合需要独立状态或每次调用都需要新实例的服务 | Suitable for services that need independent state or require new instances for each call
  
  **实际应用示例 | Real-world Application Examples:**
  ```typescript
  import { Injectable, Scope } from '@nestjs/common';
  
  // 单例作用域 - 默认，应用级别共享 | Singleton scope - Default, application-level sharing
  @Injectable()
  export class DatabaseService {
    private connections: Map<string, any> = new Map();
    
    getConnection(name: string = 'default') {
      if (!this.connections.has(name)) {
        console.log(`创建新的数据库连接：${name} | Creating new database connection: ${name}`);
        // 创建数据库连接的逻辑 | Database connection creation logic
        this.connections.set(name, { connected: true, name });
      }
      return this.connections.get(name);
    }
  }
  
  // 请求作用域 - 每个HTTP请求独立实例 | Request scope - Independent instance per HTTP request
  @Injectable({ scope: Scope.REQUEST })
  export class RequestContextService {
    private requestId: string;
    private startTime: number;
    
    constructor() {
      this.requestId = `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      this.startTime = Date.now();
      console.log(`请求上下文已创建：${this.requestId} | Request context created: ${this.requestId}`);
    }
    
    getRequestId(): string {
      return this.requestId;
    }
    
    getElapsedTime(): number {
      return Date.now() - this.startTime;
    }
    
    setUserInfo(userId: number, username: string) {
      console.log(`请求${this.requestId}设置用户信息：${username} | Request ${this.requestId} set user info: ${username}`);
    }
  }
  
  // 瞬时作用域 - 每次注入都创建新实例 | Transient scope - New instance for each injection
  @Injectable({ scope: Scope.TRANSIENT })
  export class LoggerService {
    private context: string;
    
    constructor() {
      this.context = `logger_${Date.now()}`;
      console.log(`新的日志器实例已创建：${this.context} | New logger instance created: ${this.context}`);
    }
    
    setContext(context: string) {
      this.context = context;
    }
    
    log(message: string) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${this.context}] ${message}`);
    }
  }
  
  // 演示不同作用域的使用 | Demonstrate usage of different scopes
  @Injectable()
  export class BusinessService {
    constructor(
      private databaseService: DatabaseService,      // 单例 | Singleton
      private requestContext: RequestContextService, // 请求作用域 | Request-scoped
      private logger: LoggerService,                 // 瞬时 | Transient
    ) {
      this.logger.setContext('BusinessService');
    }
    
    async processBusinessLogic(data: any) {
      const requestId = this.requestContext.getRequestId();
      this.logger.log(`开始处理业务逻辑，请求ID：${requestId} | Starting business logic, request ID: ${requestId}`);
      
      const db = this.databaseService.getConnection();
      this.logger.log(`获取数据库连接：${db.name} | Got database connection: ${db.name}`);
      
      // 模拟业务处理 | Simulate business processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const elapsedTime = this.requestContext.getElapsedTime();
      this.logger.log(`业务逻辑处理完成，耗时：${elapsedTime}ms | Business logic completed, elapsed: ${elapsedTime}ms`);
      
      return { success: true, requestId, elapsedTime };
    }
  }
  ```

### 2. 装饰器系统全面解析 | Comprehensive Decorator System Analysis (1小时15分钟 | 1 hour 15 minutes)

- **装饰器的工作机制与元数据系统 | Decorator Mechanisms and Metadata System**
  
  **概念定义 | Concept Definition:**
  装饰器是TypeScript的实验性特性，通过@符号语法为类、方法、属性或参数添加元数据和行为修改，在NestJS中用于声明路由、注入依赖、验证数据等核心功能。| Decorators are experimental TypeScript features that use @ syntax to add metadata and behavior modifications to classes, methods, properties, or parameters, used in NestJS for declaring routes, injecting dependencies, validating data, and other core functionalities.
  
  **核心特征 | Key Characteristics:**
  - 元数据存储：使用reflect-metadata库存储类型和自定义信息 | Metadata Storage: Use reflect-metadata library to store type and custom information
  - 编译时处理：TypeScript编译器处理装饰器语法 | Compile-time Processing: TypeScript compiler processes decorator syntax
  - 运行时访问：通过反射API访问存储的元数据 | Runtime Access: Access stored metadata through reflection API
  - 链式执行：多个装饰器可以组合使用 | Chained Execution: Multiple decorators can be combined
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 装饰器是否会改变被装饰对象的原始代码？| Do decorators change the original code of decorated objects?
     **答案 | Answer:** 否 | No - 装饰器添加元数据和行为，但不修改原始类定义和方法实现 | Decorators add metadata and behavior but don't modify original class definitions and method implementations
  2. 多个装饰器的执行顺序是从上到下还是从下到上？| Do multiple decorators execute from top to bottom or bottom to top?  
     **答案 | Answer:** 从下到上 | Bottom to top - 最接近被装饰目标的装饰器先执行 | The decorator closest to the decorated target executes first
  3. 装饰器是否可以接收参数？| Can decorators accept parameters?
     **答案 | Answer:** 是 | Yes - 通过装饰器工厂模式，返回实际的装饰器函数 | Through decorator factory pattern, returning the actual decorator function
  4. 自定义装饰器是否需要reflect-metadata支持？| Do custom decorators need reflect-metadata support?
     **答案 | Answer:** 通常是 | Usually yes - 如果需要存储和检索元数据信息，需要reflect-metadata库 | If need to store and retrieve metadata information, reflect-metadata library is required
  
  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  import 'reflect-metadata';
  import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
  
  // 1. 类装饰器 - 为类添加元数据 | Class Decorator - Add metadata to class
  const CONTROLLER_METADATA = 'controller';
  
  function ApiController(prefix: string = '') {
    return function (target: any) {
      console.log(`应用控制器装饰器到：${target.name} | Applying controller decorator to: ${target.name}`);
      
      // 存储路径前缀元数据 | Store path prefix metadata
      Reflect.defineMetadata(CONTROLLER_METADATA, { prefix }, target);
      
      // 可以修改类的原型 | Can modify class prototype
      target.prototype.getControllerInfo = function() {
        const metadata = Reflect.getMetadata(CONTROLLER_METADATA, target);
        return `控制器：${target.name}，前缀：${metadata.prefix} | Controller: ${target.name}, prefix: ${metadata.prefix}`;
      };
    };
  }
  
  // 2. 方法装饰器 - 为方法添加行为和元数据 | Method Decorator - Add behavior and metadata to methods
  function LogExecution(includeArgs: boolean = false) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      
      descriptor.value = async function (...args: any[]) {
        const start = Date.now();
        console.log(`开始执行方法：${target.constructor.name}.${propertyName} | Starting method execution: ${target.constructor.name}.${propertyName}`);
        
        if (includeArgs) {
          console.log(`方法参数：| Method arguments:`, args);
        }
        
        try {
          const result = await originalMethod.apply(this, args);
          const duration = Date.now() - start;
          console.log(`方法执行完成：${propertyName}，耗时：${duration}ms | Method execution completed: ${propertyName}, duration: ${duration}ms`);
          return result;
        } catch (error) {
          const duration = Date.now() - start;
          console.log(`方法执行失败：${propertyName}，耗时：${duration}ms，错误：${error.message} | Method execution failed: ${propertyName}, duration: ${duration}ms, error: ${error.message}`);
          throw error;
        }
      };
      
      return descriptor;
    };
  }
  
  // 3. 属性装饰器 - 为属性添加验证和转换 | Property Decorator - Add validation and transformation to properties
  const VALIDATION_METADATA = 'validation';
  
  function MinLength(min: number) {
    return function (target: any, propertyName: string) {
      const existingRules = Reflect.getMetadata(VALIDATION_METADATA, target, propertyName) || [];
      existingRules.push({ type: 'minLength', value: min });
      Reflect.defineMetadata(VALIDATION_METADATA, existingRules, target, propertyName);
    };
  }
  
  function IsEmail() {
    return function (target: any, propertyName: string) {
      const existingRules = Reflect.getMetadata(VALIDATION_METADATA, target, propertyName) || [];
      existingRules.push({ type: 'isEmail' });
      Reflect.defineMetadata(VALIDATION_METADATA, existingRules, target, propertyName);
    };
  }
  
  // 4. 参数装饰器 - 提取和转换参数 | Parameter Decorator - Extract and transform parameters
  const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      const user = request.user;
      
      console.log(`提取当前用户信息 | Extracting current user info:`, user);
      
      return data ? user?.[data] : user;
    },
  );
  
  // 5. 组合装饰器的使用示例 | Combined decorator usage example
  @ApiController('demo')
  class DemoController {
    @MinLength(3)
    @IsEmail()
    userEmail: string;
    
    @LogExecution(true)
    async getUserProfile(@CurrentUser() user: any, @CurrentUser('id') userId: number) {
      console.log(`获取用户档案，用户ID：${userId} | Getting user profile, user ID: ${userId}`);
      
      // 验证属性 | Validate properties
      this.validateProperty('userEmail', this.userEmail);
      
      return {
        id: userId,
        email: user?.email,
        profile: `用户${userId}的档案信息 | Profile info for user ${userId}`
      };
    }
    
    private validateProperty(propertyName: string, value: any) {
      const rules = Reflect.getMetadata(VALIDATION_METADATA, this, propertyName);
      if (!rules) return;
      
      for (const rule of rules) {
        switch (rule.type) {
          case 'minLength':
            if (!value || value.length < rule.value) {
              throw new Error(`${propertyName} 长度必须至少${rule.value}个字符 | ${propertyName} must be at least ${rule.value} characters`);
            }
            break;
          case 'isEmail':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              throw new Error(`${propertyName} 必须是有效的邮箱地址 | ${propertyName} must be a valid email address`);
            }
            break;
        }
      }
      console.log(`属性${propertyName}验证通过 | Property ${propertyName} validation passed`);
    }
  }
  ```
  
  **实践检查问题 | Practice Checking Questions:**
  - LogExecution装饰器是否会改变原方法的返回值？| Does LogExecution decorator change the return value of the original method?
    **答案 | Answer:** 否 | No - 它包装了原方法但保持相同的返回值，只添加了日志功能 | It wraps the original method but maintains the same return value, only adding logging functionality
  - 多个属性装饰器如何协同工作？| How do multiple property decorators work together?
    **答案 | Answer:** 每个装饰器独立添加元数据，可以通过反射API获取所有元数据 | Each decorator independently adds metadata, all metadata can be retrieved through reflection API

- **自定义装饰器的高级模式 | Advanced Patterns for Custom Decorators**
  
  **概念定义 | Concept Definition:**
  自定义装饰器允许开发者创建特定于业务需求的声明式功能，通过装饰器工厂、元数据组合和反射机制实现复杂的横切关注点，如缓存、权限控制、数据转换等。| Custom decorators allow developers to create declarative functionality specific to business needs, implementing complex cross-cutting concerns like caching, permission control, data transformation through decorator factories, metadata composition, and reflection mechanisms.
  
  **高级模式 | Advanced Patterns:**
  - 装饰器工厂：接受参数的装饰器函数 | Decorator Factory: Decorator functions that accept parameters
  - 元数据组合：多个装饰器协同工作 | Metadata Composition: Multiple decorators working together
  - 条件装饰器：基于环境或条件应用装饰器 | Conditional Decorators: Apply decorators based on environment or conditions
  - 装饰器继承：子类继承父类的装饰器元数据 | Decorator Inheritance: Subclasses inherit parent class decorator metadata
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 装饰器工厂是否可以访问被装饰目标的运行时信息？| Can decorator factories access runtime information of decorated targets?
     **答案 | Answer:** 部分可以 | Partially - 编译时可以访问类型信息，运行时可以通过反射访问元数据，但不能直接访问实例状态 | Can access type information at compile time and metadata at runtime through reflection, but cannot directly access instance state
  2. 自定义装饰器是否可以修改类的继承关系？| Can custom decorators modify class inheritance relationships?  
     **答案 | Answer:** 理论上可以但不推荐 | Theoretically yes but not recommended - 技术上可以但会破坏代码可读性和类型安全 | Technically possible but breaks code readability and type safety
  3. 装饰器是否可以动态地添加或移除？| Can decorators be dynamically added or removed?
     **答案 | Answer:** 否 | No - 装饰器在编译时确定，运行时无法动态修改，但可以通过元数据控制行为 | Decorators are determined at compile time and cannot be dynamically modified at runtime, but behavior can be controlled through metadata
  
  **综合应用示例 | Comprehensive Application Example:**
  ```typescript
  import { SetMetadata, applyDecorators } from '@nestjs/common';
  import 'reflect-metadata';
  
  // 高级装饰器：缓存装饰器 | Advanced decorator: Cache decorator
  interface CacheOptions {
    ttl: number; // 生存时间(秒) | Time to live (seconds)
    key?: string; // 缓存键模板 | Cache key template
    condition?: (args: any[]) => boolean; // 缓存条件 | Cache condition
  }
  
  const CACHE_METADATA = 'cache';
  const cacheStorage = new Map<string, { value: any; expiry: number }>();
  
  function Cache(options: CacheOptions) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      
      // 存储缓存配置 | Store cache configuration
      Reflect.defineMetadata(CACHE_METADATA, options, target, propertyName);
      
      descriptor.value = async function (...args: any[]) {
        // 检查缓存条件 | Check cache condition
        if (options.condition && !options.condition(args)) {
          console.log(`缓存条件不满足，直接执行方法 | Cache condition not met, executing method directly`);
          return originalMethod.apply(this, args);
        }
        
        // 生成缓存键 | Generate cache key
        const cacheKey = options.key 
          ? options.key.replace(/\{(\d+)\}/g, (_, index) => args[index])
          : `${target.constructor.name}.${propertyName}:${JSON.stringify(args)}`;
        
        // 检查缓存 | Check cache
        const cached = cacheStorage.get(cacheKey);
        if (cached && cached.expiry > Date.now()) {
          console.log(`缓存命中：${cacheKey} | Cache hit: ${cacheKey}`);
          return cached.value;
        }
        
        // 执行原方法并缓存结果 | Execute original method and cache result
        console.log(`缓存未命中，执行方法并缓存：${cacheKey} | Cache miss, executing method and caching: ${cacheKey}`);
        const result = await originalMethod.apply(this, args);
        
        cacheStorage.set(cacheKey, {
          value: result,
          expiry: Date.now() + (options.ttl * 1000)
        });
        
        return result;
      };
      
      return descriptor;
    };
  }
  
  // 权限装饰器 | Permission decorator
  interface PermissionOptions {
    roles: string[];
    resource?: string;
    action?: string;
  }
  
  const PERMISSION_METADATA = 'permission';
  
  function RequirePermission(options: PermissionOptions) {
    return SetMetadata(PERMISSION_METADATA, options);
  }
  
  // 审计日志装饰器 | Audit log decorator
  interface AuditOptions {
    action: string;
    resource: string;
    sensitiveFields?: string[];
  }
  
  const AUDIT_METADATA = 'audit';
  
  function Audit(options: AuditOptions) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      
      Reflect.defineMetadata(AUDIT_METADATA, options, target, propertyName);
      
      descriptor.value = async function (...args: any[]) {
        const start = Date.now();
        const auditLog = {
          timestamp: new Date().toISOString(),
          action: options.action,
          resource: options.resource,
          user: 'current-user', // 在实际应用中从上下文获取 | In real app, get from context
          args: options.sensitiveFields ? 
            this.maskSensitiveData(args, options.sensitiveFields) : args,
          duration: 0,
          success: false,
          error: null
        };
        
        try {
          const result = await originalMethod.apply(this, args);
          auditLog.success = true;
          auditLog.duration = Date.now() - start;
          
          console.log(`审计日志 | Audit log:`, auditLog);
          return result;
        } catch (error) {
          auditLog.error = error.message;
          auditLog.duration = Date.now() - start;
          
          console.log(`审计日志(错误) | Audit log (error):`, auditLog);
          throw error;
        }
      };
      
      return descriptor;
    };
  }
  
  // 组合装饰器 | Composite decorator
  function SecureCachedMethod(cacheOptions: CacheOptions, permissionOptions: PermissionOptions) {
    return applyDecorators(
      Cache(cacheOptions),
      RequirePermission(permissionOptions),
      Audit({
        action: 'method_call',
        resource: 'secure_cached_method'
      })
    );
  }
  
  // 使用示例 | Usage example
  @Injectable()
  class AdvancedService {
    
    @Cache({
      ttl: 60,
      key: 'user:{0}',
      condition: (args) => args[0] > 0
    })
    async getUserById(userId: number) {
      console.log(`从数据库获取用户：${userId} | Fetching user from database: ${userId}`);
      // 模拟数据库查询 | Simulate database query
      await new Promise(resolve => setTimeout(resolve, 100));
      return { id: userId, name: `用户${userId} | User ${userId}`, email: `user${userId}@example.com` };
    }
    
    @SecureCachedMethod(
      { ttl: 30, key: 'sensitive:{0}' },
      { roles: ['admin', 'manager'], resource: 'sensitive_data' }
    )
    async getSensitiveData(dataId: number) {
      console.log(`获取敏感数据：${dataId} | Getting sensitive data: ${dataId}`);
      return { id: dataId, sensitiveInfo: '敏感信息 | Sensitive information' };
    }
    
    private maskSensitiveData(data: any[], sensitiveFields: string[]): any[] {
      // 简单的敏感数据掩码实现 | Simple sensitive data masking implementation
      return data.map(item => {
        if (typeof item === 'object' && item !== null) {
          const masked = { ...item };
          sensitiveFields.forEach(field => {
            if (masked[field]) {
              masked[field] = '***';
            }
          });
          return masked;
        }
        return item;
      });
    }
  }
  ```

### 3. 生命周期钩子深度应用 | Lifecycle Hooks Deep Application (45分钟 | 45 minutes)

- **组件生命周期管理 | Component Lifecycle Management**
  
  **概念定义 | Concept Definition:**
  生命周期钩子是NestJS提供的一系列接口，允许开发者在组件的不同生命周期阶段执行自定义逻辑，包括初始化、销毁和应用启动等关键时刻的处理。| Lifecycle hooks are a series of interfaces provided by NestJS that allow developers to execute custom logic at different lifecycle phases of components, including initialization, destruction, and application startup critical moments.
  
  **核心生命周期钩子 | Core Lifecycle Hooks:**
  - OnModuleInit：模块初始化后调用 | Called after module initialization
  - OnApplicationBootstrap：应用完全启动后调用 | Called after application fully bootstrapped  
  - OnModuleDestroy：模块销毁前调用 | Called before module destruction
  - OnApplicationShutdown：应用关闭前调用 | Called before application shutdown
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 生命周期钩子是否在所有Provider实例上都会调用？| Are lifecycle hooks called on all Provider instances?
     **答案 | Answer:** 只有实现了相应接口的类 | Only classes that implement corresponding interfaces - 只有显式实现生命周期接口的类才会调用钩子方法 | Only classes that explicitly implement lifecycle interfaces will have hook methods called
  2. OnModuleInit和OnApplicationBootstrap的执行顺序是？| What's the execution order of OnModuleInit and OnApplicationBootstrap?  
     **答案 | Answer:** OnModuleInit先执行 | OnModuleInit executes first - 所有模块的OnModuleInit完成后才执行OnApplicationBootstrap | OnApplicationBootstrap executes only after all modules' OnModuleInit complete
  3. 生命周期钩子中的异步操作是否会阻塞应用启动？| Do async operations in lifecycle hooks block application startup?
     **答案 | Answer:** 是 | Yes - NestJS会等待所有异步生命周期钩子完成后才完成启动过程 | NestJS waits for all async lifecycle hooks to complete before finishing startup process
  4. 在生命周期钩子中抛出异常会怎样？| What happens if exceptions are thrown in lifecycle hooks?
     **答案 | Answer:** 应用启动失败 | Application startup fails - 未处理的异常会导致整个应用启动失败或关闭失败 | Unhandled exceptions cause entire application startup or shutdown failure
  
  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  import { 
    Injectable, Module, OnModuleInit, OnApplicationBootstrap,
    OnModuleDestroy, OnApplicationShutdown, Logger 
  } from '@nestjs/common';
  
  // 数据库连接服务示例 | Database connection service example
  @Injectable()
  export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(DatabaseService.name);
    private isConnected = false;
    private connections: Map<string, any> = new Map();
    
    async onModuleInit() {
      this.logger.log('正在初始化数据库连接... | Initializing database connections...');
      
      try {
        // 模拟数据库连接建立 | Simulate database connection establishment
        await this.connectToDatabase();
        this.isConnected = true;
        
        this.logger.log('数据库连接初始化完成 | Database connections initialized successfully');
      } catch (error) {
        this.logger.error(`数据库连接初始化失败: ${error.message} | Database connection initialization failed: ${error.message}`);
        throw error; // 重新抛出错误以阻止应用启动 | Re-throw error to prevent app startup
      }
    }
    
    async onModuleDestroy() {
      this.logger.log('正在关闭数据库连接... | Closing database connections...');
      
      try {
        await this.closeConnections();
        this.isConnected = false;
        this.logger.log('数据库连接已安全关闭 | Database connections closed safely');
      } catch (error) {
        this.logger.error(`关闭数据库连接时出错: ${error.message} | Error closing database connections: ${error.message}`);
      }
    }
    
    private async connectToDatabase(): Promise<void> {
      // 模拟异步连接过程 | Simulate async connection process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 创建多个数据库连接 | Create multiple database connections
      this.connections.set('primary', { 
        host: 'localhost', 
        database: 'primary_db', 
        connected: true,
        createdAt: new Date()
      });
      
      this.connections.set('cache', { 
        host: 'localhost', 
        database: 'cache_db', 
        connected: true,
        createdAt: new Date()
      });
      
      this.logger.log(`已建立${this.connections.size}个数据库连接 | Established ${this.connections.size} database connections`);
    }
    
    private async closeConnections(): Promise<void> {
      const promises = Array.from(this.connections.entries()).map(async ([name, conn]) => {
        this.logger.log(`关闭连接: ${name} | Closing connection: ${name}`);
        // 模拟连接关闭 | Simulate connection closure
        await new Promise(resolve => setTimeout(resolve, 200));
        conn.connected = false;
      });
      
      await Promise.all(promises);
      this.connections.clear();
    }
    
    getConnection(name: string = 'primary') {
      if (!this.isConnected) {
        throw new Error('数据库未连接 | Database not connected');
      }
      return this.connections.get(name);
    }
  }
  
  // 缓存服务示例 | Cache service example
  @Injectable()
  export class CacheService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(CacheService.name);
    private cache: Map<string, any> = new Map();
    private cleanupTimer: NodeJS.Timeout | null = null;
    
    async onModuleInit() {
      this.logger.log('初始化缓存服务... | Initializing cache service...');
      
      // 启动清理定时器 | Start cleanup timer
      this.startCleanupTimer();
      
      this.logger.log('缓存服务初始化完成 | Cache service initialized');
    }
    
    async onModuleDestroy() {
      this.logger.log('正在停止缓存服务... | Stopping cache service...');
      
      // 停止清理定时器 | Stop cleanup timer
      if (this.cleanupTimer) {
        clearInterval(this.cleanupTimer);
        this.cleanupTimer = null;
      }
      
      // 清空缓存 | Clear cache
      const cacheSize = this.cache.size;
      this.cache.clear();
      
      this.logger.log(`缓存服务已停止，清理了${cacheSize}个缓存项 | Cache service stopped, cleared ${cacheSize} cache items`);
    }
    
    private startCleanupTimer() {
      this.cleanupTimer = setInterval(() => {
        const now = Date.now();
        let cleanedCount = 0;
        
        for (const [key, value] of this.cache.entries()) {
          if (value.expiry && value.expiry < now) {
            this.cache.delete(key);
            cleanedCount++;
          }
        }
        
        if (cleanedCount > 0) {
          this.logger.log(`清理了${cleanedCount}个过期缓存项 | Cleaned up ${cleanedCount} expired cache items`);
        }
      }, 30000); // 每30秒清理一次 | Cleanup every 30 seconds
    }
    
    set(key: string, value: any, ttlSeconds: number = 300) {
      this.cache.set(key, {
        data: value,
        expiry: Date.now() + (ttlSeconds * 1000)
      });
    }
    
    get(key: string) {
      const item = this.cache.get(key);
      if (!item) return null;
      
      if (item.expiry && item.expiry < Date.now()) {
        this.cache.delete(key);
        return null;
      }
      
      return item.data;
    }
  }
  
  // 应用监控服务 | Application monitoring service
  @Injectable()
  export class MonitoringService implements OnApplicationBootstrap, OnApplicationShutdown {
    private readonly logger = new Logger(MonitoringService.name);
    private startTime: number;
    private shutdownTime: number;
    
    constructor(
      private databaseService: DatabaseService,
      private cacheService: CacheService,
    ) {}
    
    onApplicationBootstrap() {
      this.startTime = Date.now();
      this.logger.log('应用程序已完全启动 | Application fully bootstrapped');
      
      // 记录应用启动信息 | Log application startup info
      this.logSystemInfo();
      
      // 开始健康检查 | Start health checks
      this.startHealthChecks();
    }
    
    async onApplicationShutdown(signal?: string) {
      this.shutdownTime = Date.now();
      const uptime = this.shutdownTime - this.startTime;
      
      this.logger.log(`应用程序正在关闭，信号: ${signal || '未知'} | Application shutting down, signal: ${signal || 'unknown'}`);
      this.logger.log(`应用运行时间: ${Math.round(uptime / 1000)}秒 | Application uptime: ${Math.round(uptime / 1000)} seconds`);
      
      // 执行优雅关闭 | Perform graceful shutdown
      await this.performGracefulShutdown();
    }
    
    private logSystemInfo() {
      const info = {
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        pid: process.pid
      };
      
      this.logger.log('系统信息 | System Info:', JSON.stringify(info, null, 2));
    }
    
    private startHealthChecks() {
      setInterval(() => {
        const health = {
          timestamp: new Date().toISOString(),
          database: this.databaseService.getConnection() ? 'healthy' : 'unhealthy',
          cache: this.cacheService.get('health_check') !== undefined ? 'healthy' : 'testing',
          memory: process.memoryUsage(),
          uptime: Date.now() - this.startTime
        };
        
        // 设置健康检查缓存 | Set health check cache
        this.cacheService.set('health_check', health, 60);
        
        this.logger.debug(`健康检查 | Health check:`, health);
      }, 30000); // 每30秒检查一次 | Check every 30 seconds
    }
    
    private async performGracefulShutdown() {
      this.logger.log('开始优雅关闭流程... | Starting graceful shutdown process...');
      
      try {
        // 等待当前请求完成 | Wait for current requests to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.logger.log('优雅关闭完成 | Graceful shutdown completed');
      } catch (error) {
        this.logger.error(`优雅关闭过程中出错: ${error.message} | Error during graceful shutdown: ${error.message}`);
      }
    }
  }
  
  // 生命周期演示模块 | Lifecycle demonstration module
  @Module({
    providers: [DatabaseService, CacheService, MonitoringService],
    exports: [DatabaseService, CacheService],
  })
  export class LifecycleModule implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(LifecycleModule.name);
    
    async onModuleInit() {
      this.logger.log('生命周期演示模块初始化开始 | Lifecycle demo module initialization started');
      // 模块级别的初始化逻辑 | Module-level initialization logic
      await new Promise(resolve => setTimeout(resolve, 500));
      this.logger.log('生命周期演示模块初始化完成 | Lifecycle demo module initialization completed');
    }
    
    async onModuleDestroy() {
      this.logger.log('生命周期演示模块正在销毁 | Lifecycle demo module being destroyed');
      // 模块级别的清理逻辑 | Module-level cleanup logic
      await new Promise(resolve => setTimeout(resolve, 200));
      this.logger.log('生命周期演示模块销毁完成 | Lifecycle demo module destruction completed');
    }
  }
  ```
  
  **实践检查问题 | Practice Checking Questions:**
  - 如果DatabaseService的onModuleInit抛出异常，会发生什么？| What happens if DatabaseService's onModuleInit throws an exception?
    **答案 | Answer:** 整个应用启动失败 | Entire application startup fails - NestJS会停止启动过程并报告错误 | NestJS stops the startup process and reports the error
  - MonitoringService的健康检查是否会在模块销毁时自动停止？| Will MonitoringService's health checks automatically stop when the module is destroyed?
    **答案 | Answer:** 需要手动停止 | Need to stop manually - 定时器需要在onApplicationShutdown中手动清理 | Timers need to be manually cleaned up in onApplicationShutdown

### 4. 高级依赖注入模式 | Advanced Dependency Injection Patterns (45分钟 | 45 minutes)

- **Provider配置与自定义Factory | Provider Configuration and Custom Factory**
  
  **概念定义 | Concept Definition:**
  Provider配置允许开发者自定义依赖创建方式，包括值提供者、工厂提供者、类提供者等不同模式，以及异步Provider的使用，实现更灵活的依赖管理。| Provider configuration allows developers to customize dependency creation methods, including value providers, factory providers, class providers, and async provider usage, achieving more flexible dependency management.
  
  **Provider类型 | Provider Types:**
  - 类提供者：直接使用类作为提供者 | Class Provider: Use class directly as provider
  - 值提供者：提供预定义的值 | Value Provider: Provide predefined values
  - 工厂提供者：通过工厂函数创建实例 | Factory Provider: Create instances through factory functions
  - 异步提供者：异步创建的提供者 | Async Provider: Asynchronously created providers
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 工厂提供者是否可以注入其他依赖？| Can factory providers inject other dependencies?
     **答案 | Answer:** 是 | Yes - 工厂函数可以接收注入的依赖作为参数 | Factory functions can receive injected dependencies as parameters
  2. 异步提供者是否会延迟应用启动？| Do async providers delay application startup?  
     **答案 | Answer:** 是 | Yes - NestJS等待所有异步Provider完成初始化后才完成应用启动 | NestJS waits for all async providers to complete initialization before finishing app startup
  3. 值提供者是否支持工厂函数？| Do value providers support factory functions?
     **答案 | Answer:** 否 | No - 值提供者直接提供值，不执行函数；需要动态创建使用工厂提供者 | Value providers directly provide values without executing functions; use factory providers for dynamic creation
  
  **综合应用示例 | Comprehensive Application Example:**
  ```typescript
  import { Injectable, Module, Inject } from '@nestjs/common';
  
  // 配置接口和令牌 | Configuration interface and tokens
  export interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  }
  
  export interface CacheConfig {
    ttl: number;
    maxSize: number;
  }
  
  export const DATABASE_CONFIG = 'DATABASE_CONFIG';
  export const CACHE_CONFIG = 'CACHE_CONFIG';
  export const HTTP_CLIENT = 'HTTP_CLIENT';
  
  // 异步配置提供者 | Async configuration provider
  const databaseConfigProvider = {
    provide: DATABASE_CONFIG,
    useFactory: async (): Promise<DatabaseConfig> => {
      console.log('异步加载数据库配置... | Async loading database config...');
      
      // 模拟从远程配置服务获取配置 | Simulate fetching config from remote service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'nestjs_app'
      };
    },
  };
  
  // 值提供者 | Value provider
  const cacheConfigProvider = {
    provide: CACHE_CONFIG,
    useValue: {
      ttl: 300,
      maxSize: 1000
    } as CacheConfig,
  };
  
  // 工厂提供者示例 | Factory provider example
  const httpClientProvider = {
    provide: HTTP_CLIENT,
    useFactory: (dbConfig: DatabaseConfig, cacheConfig: CacheConfig) => {
      console.log('创建HTTP客户端实例 | Creating HTTP client instance');
      
      return {
        baseURL: `http://${dbConfig.host}:3000`,
        timeout: 5000,
        retries: 3,
        cache: {
          enabled: true,
          ttl: cacheConfig.ttl
        },
        request: async (url: string, options: any = {}) => {
          console.log(`HTTP请求: ${options.method || 'GET'} ${url} | HTTP request: ${options.method || 'GET'} ${url}`);
          // 模拟HTTP请求 | Simulate HTTP request
          await new Promise(resolve => setTimeout(resolve, 100));
          return { status: 200, data: `来自${url}的响应 | Response from ${url}` };
        }
      };
    },
    inject: [DATABASE_CONFIG, CACHE_CONFIG], // 注入依赖 | Inject dependencies
  };
  
  // 使用自定义Provider的服务 | Service using custom providers
  @Injectable()
  export class ConfigurableService {
    constructor(
      @Inject(DATABASE_CONFIG) private dbConfig: DatabaseConfig,
      @Inject(CACHE_CONFIG) private cacheConfig: CacheConfig,
      @Inject(HTTP_CLIENT) private httpClient: any,
    ) {
      console.log('ConfigurableService初始化，数据库主机:', this.dbConfig.host);
      console.log('ConfigurableService initialized, database host:', this.dbConfig.host);
    }
    
    async fetchData(endpoint: string) {
      console.log(`使用配置获取数据: ${endpoint} | Fetching data using config: ${endpoint}`);
      console.log(`缓存TTL: ${this.cacheConfig.ttl}秒 | Cache TTL: ${this.cacheConfig.ttl} seconds`);
      
      return this.httpClient.request(endpoint);
    }
    
    getDatabaseInfo() {
      return {
        host: this.dbConfig.host,
        port: this.dbConfig.port,
        database: this.dbConfig.database
      };
    }
  }
  
  // 条件提供者 | Conditional provider
  interface Logger {
    log(message: string): void;
    error(message: string): void;
  }
  
  class ConsoleLogger implements Logger {
    log(message: string) {
      console.log(`[LOG] ${message}`);
    }
    
    error(message: string) {
      console.error(`[ERROR] ${message}`);
    }
  }
  
  class FileLogger implements Logger {
    log(message: string) {
      console.log(`[FILE LOG] ${message}`); // 实际应用中会写入文件 | In real app, would write to file
    }
    
    error(message: string) {
      console.error(`[FILE ERROR] ${message}`); // 实际应用中会写入文件 | In real app, would write to file
    }
  }
  
  const LOGGER = 'LOGGER';
  
  const loggerProvider = {
    provide: LOGGER,
    useFactory: (): Logger => {
      const isProduction = process.env.NODE_ENV === 'production';
      console.log(`创建日志器，生产环境: ${isProduction} | Creating logger, production: ${isProduction}`);
      
      return isProduction ? new FileLogger() : new ConsoleLogger();
    },
  };
  
  @Injectable()
  export class BusinessLogicService {
    constructor(@Inject(LOGGER) private logger: Logger) {}
    
    performOperation(data: any) {
      this.logger.log(`执行业务操作 | Performing business operation`);
      
      try {
        // 业务逻辑 | Business logic
        const result = { processed: true, data };
        this.logger.log(`操作成功完成 | Operation completed successfully`);
        return result;
      } catch (error) {
        this.logger.error(`操作失败: ${error.message} | Operation failed: ${error.message}`);
        throw error;
      }
    }
  }
  
  // 高级依赖注入模块 | Advanced dependency injection module
  @Module({
    providers: [
      databaseConfigProvider,    // 异步工厂提供者 | Async factory provider
      cacheConfigProvider,       // 值提供者 | Value provider
      httpClientProvider,        // 依赖工厂提供者 | Dependent factory provider
      loggerProvider,           // 条件工厂提供者 | Conditional factory provider
      ConfigurableService,
      BusinessLogicService,
    ],
    exports: [ConfigurableService, BusinessLogicService],
  })
  export class AdvancedDIModule {}
  ```

### 5. 测试友好的依赖注入设计 | Test-Friendly Dependency Injection Design (30分钟 | 30 minutes)

- **模拟和测试策略 | Mocking and Testing Strategies**
  
  **关键原则 | Key Principles:**
  - 依赖接口而非具体实现 | Depend on interfaces rather than concrete implementations
  - 使用依赖注入便于测试时替换依赖 | Use dependency injection to facilitate dependency replacement in tests
  - 设计可模拟的服务边界 | Design mockable service boundaries
  
  **实践验证问题 | Practice Verification Questions:**
  1. 如何在测试中模拟数据库服务？| How to mock database service in tests?
     **答案 | Answer:** 使用TestingModule.overrideProvider()方法提供模拟实现 | Use TestingModule.overrideProvider() method to provide mock implementation
  2. 异步Provider在测试中如何处理？| How to handle async providers in tests?
     **答案 | Answer:** 使用同步的模拟值或快速完成的异步模拟 | Use synchronous mock values or quickly completing async mocks
  3. 如何测试生命周期钩子的执行？| How to test lifecycle hook execution?
     **答案 | Answer:** 通过spy监视钩子方法的调用，或验证钩子执行后的副作用 | Monitor hook method calls with spies or verify side effects after hook execution

### 6. 依赖注入最佳实践总结 | Dependency Injection Best Practices Summary (15分钟 | 15 minutes)

- **设计原则与性能优化 | Design Principles and Performance Optimization**
  
  **关键原则 | Key Principles:**
  - 优先使用构造函数注入 | Prefer constructor injection
  - 避免循环依赖，重新设计架构 | Avoid circular dependencies, redesign architecture
  - 合理选择Provider作用域 | Choose provider scopes wisely
  - 为测试设计可替换的依赖 | Design replaceable dependencies for testing
  
  **实践验证问题 | Practice Verification Questions:**
  1. 什么时候应该使用请求作用域的Provider？| When should request-scoped providers be used?
     **答案 | Answer:** 当需要存储请求特定数据或实现请求级别的状态隔离时 | When need to store request-specific data or implement request-level state isolation
  2. 如何优化大量依赖的注入性能？| How to optimize injection performance with many dependencies?
     **答案 | Answer:** 使用延迟加载、合并相关依赖到聚合服务、考虑模块化设计 | Use lazy loading, combine related dependencies into aggregate services, consider modular design

## 实践项目：高级用户管理系统 | Practical Project: Advanced User Management System

### 目标 | Objective
构建一个具有高级依赖注入特性的用户管理系统，演示自定义装饰器、生命周期钩子、多种Provider类型和测试友好设计的综合应用 | Build a user management system with advanced dependency injection features, demonstrating comprehensive application of custom decorators, lifecycle hooks, multiple provider types, and test-friendly design

### 概念应用检查 | Concept Application Check
在开始项目前，请确认对以下概念的理解 | Before starting the project, please confirm understanding of the following concepts:

1. 依赖注入是否只是为了解耦代码？| Is dependency injection only for decoupling code?
   **答案 | Answer:** 否 | No - 还提供了更好的可测试性、生命周期管理、配置管理等多重好处 | Also provides better testability, lifecycle management, configuration management, and other multiple benefits
2. 自定义装饰器如何存储和检索元数据？| How do custom decorators store and retrieve metadata?
   **答案 | Answer:** 使用reflect-metadata库的Reflect.defineMetadata和Reflect.getMetadata | Use reflect-metadata library's Reflect.defineMetadata and Reflect.getMetadata
3. 生命周期钩子中的异步操作是否会影响应用启动？| Do async operations in lifecycle hooks affect application startup?
   **答案 | Answer:** 是 | Yes - NestJS会等待所有生命周期钩子完成再继续启动流程 | NestJS waits for all lifecycle hooks to complete before continuing startup process

### 步骤 | Steps
1. 设计配置管理和多Provider架构 | Design configuration management and multi-provider architecture
2. 实现自定义装饰器用于缓存和审计 | Implement custom decorators for caching and auditing
3. 创建具有生命周期钩子的服务 | Create services with lifecycle hooks
4. 构建控制器使用所有高级特性 | Build controllers using all advanced features
5. 编写测试验证依赖注入和装饰器功能 | Write tests to verify dependency injection and decorator functionality

### 示例代码 | Example Code
```typescript
/**
 * 高级用户管理系统 | Advanced User Management System
 * 项目描述：演示高级依赖注入、自定义装饰器和生命周期钩子 | Project description: Demonstrate advanced DI, custom decorators, and lifecycle hooks
 * 
 * 本项目演示以下概念的综合应用：| This project demonstrates comprehensive application of:
 * - 多种Provider类型和配置 | Multiple provider types and configurations
 * - 自定义装饰器和元数据编程 | Custom decorators and metadata programming
 * - 生命周期钩子的实际应用 | Practical application of lifecycle hooks
 * - 测试友好的依赖注入设计 | Test-friendly dependency injection design
 */

import { Injectable, Module, Controller, Get, Post, Put, Delete, Body, Param, Inject, OnModuleInit, OnModuleDestroy, Logger, createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import 'reflect-metadata';

// ================== 配置和接口定义 | Configuration and Interface Definitions ==================
export interface AppConfig {
  database: {
    host: string;
    port: number;
    name: string;
  };
  cache: {
    ttl: number;
    maxSize: number;
  };
  features: {
    auditEnabled: boolean;
    cacheEnabled: boolean;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  lastActiveAt?: Date;
}

// 配置令牌 | Configuration tokens
const APP_CONFIG = 'APP_CONFIG';
const USER_REPOSITORY = 'USER_REPOSITORY';
const CACHE_SERVICE = 'CACHE_SERVICE';
const AUDIT_SERVICE = 'AUDIT_SERVICE';

// ================== 自定义装饰器实现 | Custom Decorator Implementations ==================

// 缓存装饰器 | Cache decorator
const CACHE_METADATA = 'cache';
interface CacheOptions {
  ttl?: number;
  key?: string;
  condition?: (args: any[]) => boolean;
}

function Cacheable(options: CacheOptions = {}) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    Reflect.defineMetadata(CACHE_METADATA, options, target, propertyName);
    
    descriptor.value = async function (...args: any[]) {
      const cacheService = this.cacheService || this.constructor.prototype.cacheService;
      
      if (!cacheService || !cacheService.isEnabled()) {
        return originalMethod.apply(this, args);
      }
      
      // 检查缓存条件 | Check cache condition
      if (options.condition && !options.condition(args)) {
        return originalMethod.apply(this, args);
      }
      
      // 生成缓存键 | Generate cache key
      const cacheKey = options.key 
        ? options.key.replace(/\{(\d+)\}/g, (_, index) => args[index])
        : `${target.constructor.name}.${propertyName}:${JSON.stringify(args)}`;
      
      // 尝试从缓存获取 | Try to get from cache
      const cached = await cacheService.get(cacheKey);
      if (cached !== null) {
        console.log(`缓存命中: ${cacheKey} | Cache hit: ${cacheKey}`);
        return cached;
      }
      
      // 执行原方法并缓存 | Execute original method and cache
      const result = await originalMethod.apply(this, args);
      await cacheService.set(cacheKey, result, options.ttl);
      
      console.log(`缓存设置: ${cacheKey} | Cache set: ${cacheKey}`);
      return result;
    };
    
    return descriptor;
  };
}

// 审计装饰器 | Audit decorator
const AUDIT_METADATA = 'audit';
interface AuditOptions {
  action: string;
  resource: string;
  includeResult?: boolean;
}

function Auditable(options: AuditOptions) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    Reflect.defineMetadata(AUDIT_METADATA, options, target, propertyName);
    
    descriptor.value = async function (...args: any[]) {
      const auditService = this.auditService || this.constructor.prototype.auditService;
      
      const auditLog = {
        timestamp: new Date(),
        action: options.action,
        resource: options.resource,
        method: `${target.constructor.name}.${propertyName}`,
        args: args,
        user: 'system', // 在实际应用中从上下文获取 | In real app, get from context
        success: false,
        result: null,
        error: null,
        duration: 0
      };
      
      const startTime = Date.now();
      
      try {
        const result = await originalMethod.apply(this, args);
        auditLog.success = true;
        if (options.includeResult) {
          auditLog.result = result;
        }
        auditLog.duration = Date.now() - startTime;
        
        if (auditService && auditService.isEnabled()) {
          await auditService.log(auditLog);
        }
        
        return result;
      } catch (error) {
        auditLog.error = error.message;
        auditLog.duration = Date.now() - startTime;
        
        if (auditService && auditService.isEnabled()) {
          await auditService.log(auditLog);
        }
        
        throw error;
      }
    };
    
    return descriptor;
  };
}

// 参数装饰器 | Parameter decorator
const CurrentTimestamp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return new Date().toISOString();
  },
);

// ================== 服务实现 | Service Implementations ==================

// 缓存服务接口和实现 | Cache service interface and implementation
interface ICacheService {
  isEnabled(): boolean;
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  clear(): Promise<void>;
}

@Injectable()
class InMemoryCacheService implements ICacheService, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(InMemoryCacheService.name);
  private cache = new Map<string, { value: any; expiry: number }>();
  private cleanupTimer: NodeJS.Timeout | null = null;
  private enabled = true;
  
  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}
  
  async onModuleInit() {
    this.enabled = this.config.features.cacheEnabled;
    this.logger.log(`内存缓存服务初始化，启用状态: ${this.enabled} | In-memory cache service initialized, enabled: ${this.enabled}`);
    
    if (this.enabled) {
      this.startCleanupTimer();
    }
  }
  
  async onModuleDestroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    const size = this.cache.size;
    this.cache.clear();
    this.logger.log(`缓存服务已停止，清理了${size}个项目 | Cache service stopped, cleared ${size} items`);
  }
  
  isEnabled(): boolean {
    return this.enabled;
  }
  
  async get(key: string): Promise<any> {
    if (!this.enabled) return null;
    
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  async set(key: string, value: any, ttl: number = this.config.cache.ttl): Promise<void> {
    if (!this.enabled) return;
    
    this.cache.set(key, {
      value,
      expiry: Date.now() + (ttl * 1000)
    });
  }
  
  async clear(): Promise<void> {
    this.cache.clear();
  }
  
  private startCleanupTimer() {
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      let cleanedCount = 0;
      
      for (const [key, item] of this.cache.entries()) {
        if (item.expiry < now) {
          this.cache.delete(key);
          cleanedCount++;
        }
      }
      
      if (cleanedCount > 0) {
        this.logger.debug(`清理了${cleanedCount}个过期缓存项 | Cleaned up ${cleanedCount} expired cache items`);
      }
    }, 30000);
  }
}

// 审计服务 | Audit service
interface IAuditService {
  isEnabled(): boolean;
  log(auditLog: any): Promise<void>;
}

@Injectable()
class DatabaseAuditService implements IAuditService, OnModuleInit {
  private readonly logger = new Logger(DatabaseAuditService.name);
  private enabled = true;
  
  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}
  
  async onModuleInit() {
    this.enabled = this.config.features.auditEnabled;
    this.logger.log(`审计服务初始化，启用状态: ${this.enabled} | Audit service initialized, enabled: ${this.enabled}`);
  }
  
  isEnabled(): boolean {
    return this.enabled;
  }
  
  async log(auditLog: any): Promise<void> {
    if (!this.enabled) return;
    
    // 在实际应用中，这里会写入数据库 | In real app, this would write to database
    this.logger.log(`审计日志 | Audit log:`, JSON.stringify(auditLog, null, 2));
  }
}

// 用户仓储接口和实现 | User repository interface and implementation
interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  update(id: number, userData: Partial<User>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}

@Injectable()
class InMemoryUserRepository implements IUserRepository, OnModuleInit {
  private readonly logger = new Logger(InMemoryUserRepository.name);
  private users: User[] = [];
  private currentId = 1;
  
  async onModuleInit() {
    // 初始化一些测试数据 | Initialize some test data
    await this.create({ username: 'admin', email: 'admin@example.com' });
    await this.create({ username: 'user1', email: 'user1@example.com' });
    
    this.logger.log(`用户仓储初始化，预载${this.users.length}个用户 | User repository initialized with ${this.users.length} users`);
  }
  
  async findAll(): Promise<User[]> {
    return [...this.users];
  }
  
  async findById(id: number): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }
  
  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      id: this.currentId++,
      ...userData,
      createdAt: new Date(),
    };
    
    this.users.push(newUser);
    return newUser;
  }
  
  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    this.users[index] = {
      ...this.users[index],
      ...userData,
    };
    
    return this.users[index];
  }
  
  async delete(id: number): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    this.users.splice(index, 1);
    return true;
  }
}

// 高级用户服务 | Advanced user service
@Injectable()
export class AdvancedUserService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AdvancedUserService.name);
  
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
    @Inject(CACHE_SERVICE) private cacheService: ICacheService,
    @Inject(AUDIT_SERVICE) private auditService: IAuditService,
  ) {}
  
  async onModuleInit() {
    this.logger.log('高级用户服务初始化完成 | Advanced user service initialized');
  }
  
  async onModuleDestroy() {
    this.logger.log('高级用户服务正在销毁 | Advanced user service being destroyed');
    // 清理缓存 | Clear cache
    await this.cacheService.clear();
  }
  
  @Cacheable({ ttl: 60, key: 'users:all' })
  @Auditable({ action: 'READ', resource: 'users' })
  async getAllUsers(): Promise<User[]> {
    this.logger.log('从仓储获取所有用户 | Fetching all users from repository');
    return this.userRepository.findAll();
  }
  
  @Cacheable({ 
    ttl: 300, 
    key: 'user:{0}',
    condition: (args) => args[0] > 0 
  })
  @Auditable({ action: 'READ', resource: 'user', includeResult: false })
  async getUserById(id: number): Promise<User | null> {
    this.logger.log(`从仓储获取用户: ${id} | Fetching user from repository: ${id}`);
    const user = await this.userRepository.findById(id);
    
    if (user) {
      // 更新最后活跃时间 | Update last active time
      await this.userRepository.update(id, { lastActiveAt: new Date() });
    }
    
    return user;
  }
  
  @Auditable({ action: 'CREATE', resource: 'user', includeResult: true })
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    this.logger.log(`创建新用户: ${userData.username} | Creating new user: ${userData.username}`);
    
    // 检查用户名是否已存在 | Check if username already exists
    const users = await this.userRepository.findAll();
    const existing = users.find(u => u.username === userData.username || u.email === userData.email);
    
    if (existing) {
      throw new Error('用户名或邮箱已存在 | Username or email already exists');
    }
    
    const newUser = await this.userRepository.create(userData);
    
    // 清除相关缓存 | Clear related cache
    await this.cacheService.clear();
    
    return newUser;
  }
  
  @Auditable({ action: 'UPDATE', resource: 'user', includeResult: true })
  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    this.logger.log(`更新用户: ${id} | Updating user: ${id}`);
    
    const updatedUser = await this.userRepository.update(id, userData);
    
    if (updatedUser) {
      // 清除相关缓存 | Clear related cache
      await this.cacheService.clear();
    }
    
    return updatedUser;
  }
  
  @Auditable({ action: 'DELETE', resource: 'user' })
  async deleteUser(id: number): Promise<boolean> {
    this.logger.log(`删除用户: ${id} | Deleting user: ${id}`);
    
    const result = await this.userRepository.delete(id);
    
    if (result) {
      // 清除相关缓存 | Clear related cache
      await this.cacheService.clear();
    }
    
    return result;
  }
}

// ================== 控制器实现 | Controller Implementation ==================
@Controller('advanced-users')
export class AdvancedUserController {
  constructor(private readonly userService: AdvancedUserService) {}
  
  @Get()
  async getAllUsers(@CurrentTimestamp() timestamp: string) {
    console.log(`获取所有用户请求时间戳: ${timestamp} | Get all users request timestamp: ${timestamp}`);
    return this.userService.getAllUsers();
  }
  
  @Get(':id')
  async getUserById(@Param('id') id: string, @CurrentTimestamp() timestamp: string) {
    console.log(`获取用户${id}请求时间戳: ${timestamp} | Get user ${id} request timestamp: ${timestamp}`);
    const userId = parseInt(id, 10);
    const user = await this.userService.getUserById(userId);
    
    if (!user) {
      throw new Error('用户未找到 | User not found');
    }
    
    return user;
  }
  
  @Post()
  async createUser(@Body() userData: Omit<User, 'id' | 'createdAt'>, @CurrentTimestamp() timestamp: string) {
    console.log(`创建用户请求时间戳: ${timestamp} | Create user request timestamp: ${timestamp}`);
    return this.userService.createUser(userData);
  }
  
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userData: Partial<User>, @CurrentTimestamp() timestamp: string) {
    console.log(`更新用户${id}请求时间戳: ${timestamp} | Update user ${id} request timestamp: ${timestamp}`);
    const userId = parseInt(id, 10);
    const updatedUser = await this.userService.updateUser(userId, userData);
    
    if (!updatedUser) {
      throw new Error('用户未找到 | User not found');
    }
    
    return updatedUser;
  }
  
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @CurrentTimestamp() timestamp: string) {
    console.log(`删除用户${id}请求时间戳: ${timestamp} | Delete user ${id} request timestamp: ${timestamp}`);
    const userId = parseInt(id, 10);
    const result = await this.userService.deleteUser(userId);
    
    if (!result) {
      throw new Error('用户未找到 | User not found');
    }
    
    return { success: true, message: '用户已删除 | User deleted' };
  }
}

// ================== 模块配置 | Module Configuration ==================
@Module({
  providers: [
    // 配置提供者 | Configuration provider
    {
      provide: APP_CONFIG,
      useFactory: (): AppConfig => ({
        database: {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          name: process.env.DB_NAME || 'advanced_users'
        },
        cache: {
          ttl: parseInt(process.env.CACHE_TTL || '300'),
          maxSize: parseInt(process.env.CACHE_MAX_SIZE || '1000')
        },
        features: {
          auditEnabled: process.env.AUDIT_ENABLED !== 'false',
          cacheEnabled: process.env.CACHE_ENABLED !== 'false'
        }
      }),
    },
    
    // 服务提供者 | Service providers
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
    {
      provide: CACHE_SERVICE,
      useClass: InMemoryCacheService,
    },
    {
      provide: AUDIT_SERVICE,
      useClass: DatabaseAuditService,
    },
    
    AdvancedUserService,
  ],
  controllers: [AdvancedUserController],
  exports: [AdvancedUserService],
})
export class AdvancedUserModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AdvancedUserModule.name);
  
  async onModuleInit() {
    this.logger.log('高级用户管理模块初始化完成 | Advanced user management module initialized');
  }
  
  async onModuleDestroy() {
    this.logger.log('高级用户管理模块正在销毁 | Advanced user management module being destroyed');
  }
}

// ================== 测试示例 | Test Examples ==================
describe('AdvancedUserModule', () => {
  let userService: AdvancedUserService;
  let cacheService: ICacheService;
  let auditService: IAuditService;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: APP_CONFIG,
          useValue: {
            database: { host: 'localhost', port: 5432, name: 'test' },
            cache: { ttl: 60, maxSize: 100 },
            features: { auditEnabled: true, cacheEnabled: true }
          } as AppConfig,
        },
        {
          provide: USER_REPOSITORY,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findById: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({ id: 1, username: 'test', email: 'test@example.com', createdAt: new Date() }),
            update: jest.fn().mockResolvedValue(null),
            delete: jest.fn().mockResolvedValue(false),
          },
        },
        {
          provide: CACHE_SERVICE,
          useValue: {
            isEnabled: jest.fn().mockReturnValue(true),
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue(undefined),
            clear: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: AUDIT_SERVICE,
          useValue: {
            isEnabled: jest.fn().mockReturnValue(true),
            log: jest.fn().mockResolvedValue(undefined),
          },
        },
        AdvancedUserService,
      ],
    }).compile();
    
    userService = module.get<AdvancedUserService>(AdvancedUserService);
    cacheService = module.get<ICacheService>(CACHE_SERVICE);
    auditService = module.get<IAuditService>(AUDIT_SERVICE);
  });
  
  describe('用户服务测试 | User Service Tests', () => {
    it('应该成功获取所有用户 | should successfully get all users', async () => {
      const result = await userService.getAllUsers();
      expect(result).toEqual([]);
      expect(auditService.log).toHaveBeenCalled();
    });
    
    it('应该成功创建用户 | should successfully create user', async () => {
      const userData = { username: 'newuser', email: 'newuser@example.com' };
      const result = await userService.createUser(userData);
      
      expect(result.username).toBe('newuser');
      expect(auditService.log).toHaveBeenCalled();
      expect(cacheService.clear).toHaveBeenCalled();
    });
  });
});

// ================== 应用启动示例 | Application Bootstrap Example ==================
async function bootstrapAdvancedApp() {
  const { NestFactory } = require('@nestjs/core');
  
  @Module({
    imports: [AdvancedUserModule],
  })
  class AppModule {}
  
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  
  console.log('高级用户管理系统已启动：http://localhost:3000 | Advanced user management system started at: http://localhost:3000');
  console.log('API端点 | API Endpoints:');
  console.log('GET    /advanced-users     - 获取所有用户 | Get all users');
  console.log('GET    /advanced-users/:id - 获取用户详情 | Get user details');
  console.log('POST   /advanced-users     - 创建用户 | Create user');
  console.log('PUT    /advanced-users/:id - 更新用户 | Update user');
  console.log('DELETE /advanced-users/:id - 删除用户 | Delete user');
  
  return app;
}
```

### 项目完成检查 | Project Completion Check
1. 项目是否正确应用了多种Provider类型？| Does the project correctly apply multiple provider types?
   **验证 | Verification:** 使用了值提供者、类提供者、工厂提供者和接口抽象 | Uses value providers, class providers, factory providers, and interface abstractions
2. 自定义装饰器是否能正确存储和使用元数据？| Do custom decorators correctly store and use metadata?
   **验证 | Verification:** 缓存和审计装饰器都正确使用了reflect-metadata API | Cache and audit decorators correctly use reflect-metadata API
3. 生命周期钩子是否在正确的时机执行？| Do lifecycle hooks execute at the correct times?
   **验证 | Verification:** 服务和模块的初始化和销毁钩子按预期顺序执行 | Service and module initialization and destruction hooks execute in expected order

## 扩展练习 | Extension Exercises

### 概念深化练习 | Concept Deepening Exercises

1. **循环依赖解决练习 | Circular Dependency Resolution Exercise**
   - **练习描述 | Exercise Description:** 创建两个相互依赖的服务，使用forwardRef()解决循环依赖问题
   - **概念检查 | Concept Check:** 循环依赖为什么会导致依赖注入失败？
   - **学习目标 | Learning Objective:** 理解循环依赖的本质和解决方案

2. **请求作用域Provider练习 | Request-Scoped Provider Exercise**
   - **练习描述 | Exercise Description:** 创建请求作用域的用户上下文服务，存储当前请求的用户信息
   - **概念检查 | Concept Check:** 请求作用域Provider如何在不同请求间保持隔离？
   - **学习目标 | Learning Objective:** 掌握不同Provider作用域的使用场景

3. **装饰器组合练习 | Decorator Composition Exercise**
   - **练习描述 | Exercise Description:** 创建一个组合装饰器，结合验证、缓存和日志功能
   - **概念检查 | Concept Check:** 多个装饰器如何协同工作？
   - **学习目标 | Learning Objective:** 发展装饰器设计的系统性思维

4. **异步Provider练习 | Async Provider Exercise**
   - **练习描述 | Exercise Description:** 创建异步配置提供者，从远程API获取配置信息
   - **概念检查 | Concept Check:** 异步Provider如何影响应用启动流程？
   - **学习目标 | Learning Objective:** 掌握异步依赖的管理和错误处理

5. **测试友好设计练习 | Test-Friendly Design Exercise**
   - **练习描述 | Exercise Description:** 重构现有代码，使其更容易进行单元测试
   - **概念检查 | Concept Check:** 什么样的依赖注入设计有利于测试？
   - **学习目标 | Learning Objective:** 培养测试驱动的架构设计能力

6. **元数据反射练习 | Metadata Reflection Exercise**
   - **练习描述 | Exercise Description:** 创建一个服务，动态分析其他服务的装饰器元数据
   - **概念检查 | Concept Check:** 如何在运行时访问和解析装饰器元数据？
   - **学习目标 | Learning Objective:** 深入理解元数据系统的工作原理

7. **生产级生命周期管理练习 | Production-Level Lifecycle Management Exercise**
   - **练习描述 | Exercise Description:** 实现优雅关闭机制，确保所有资源正确释放
   - **概念检查 | Concept Check:** 如何确保异步资源在应用关闭时得到正确清理？
   - **学习目标 | Learning Objective:** 提高生产环境的稳定性和可靠性

## 学习资源 | Learning Resources
- [NestJS官方文档 - 依赖注入](https://docs.nestjs.com/fundamentals/dependency-injection) | [NestJS Official Documentation - Dependency Injection](https://docs.nestjs.com/fundamentals/dependency-injection)
- [NestJS官方文档 - 自定义装饰器](https://docs.nestjs.com/custom-decorators) | [NestJS Official Documentation - Custom Decorators](https://docs.nestjs.com/custom-decorators)
- [NestJS官方文档 - 生命周期事件](https://docs.nestjs.com/fundamentals/lifecycle-events) | [NestJS Official Documentation - Lifecycle Events](https://docs.nestjs.com/fundamentals/lifecycle-events)
- [TypeScript装饰器深入指南](https://www.typescriptlang.org/docs/handbook/decorators.html) | [TypeScript Decorators In-Depth Guide](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [reflect-metadata库文档](https://rbuckton.github.io/reflect-metadata/) | [reflect-metadata Library Documentation](https://rbuckton.github.io/reflect-metadata/)
- [依赖注入模式详解](https://martinfowler.com/articles/injection.html) | [Dependency Injection Pattern Explained](https://martinfowler.com/articles/injection.html)

---

✅ **完成检查清单 | Completion Checklist**
- [ ] 深入理解依赖注入的工作原理和设计优势 | Deeply understand the working principles and design advantages of dependency injection
- [ ] 掌握不同类型Provider的配置和使用方法 | Master configuration and usage methods of different provider types
- [ ] 能够创建和使用自定义装饰器实现横切关注点 | Be able to create and use custom decorators to implement cross-cutting concerns
- [ ] 理解装饰器的元数据系统和反射机制 | Understand decorator metadata system and reflection mechanism
- [ ] 熟练使用生命周期钩子管理资源和状态 | Proficiently use lifecycle hooks to manage resources and state
- [ ] 掌握异步Provider和工厂Provider的高级用法 | Master advanced usage of async providers and factory providers
- [ ] 能够设计测试友好的依赖注入架构 | Be able to design test-friendly dependency injection architecture
- [ ] 正确回答所有概念检查问题CCQs | Correctly answer all Concept Checking Questions (CCQs)
- [ ] 成功实现并测试高级用户管理系统项目 | Successfully implement and test the advanced user management system project
- [ ] 完成至少4个扩展练习并验证理解程度 | Complete at least 4 extension exercises and verify understanding level

**概念掌握验证 | Concept Mastery Verification:**
在标记完成前，请确保能够正确回答本日所有CCQs，并能够向他人清晰解释依赖注入的工作原理、装饰器的元数据机制、生命周期钩子的使用场景，以及如何设计可测试和可维护的服务架构。
Before marking as complete, ensure you can correctly answer all CCQs from today and clearly explain the working principles of dependency injection, decorator metadata mechanisms, usage scenarios of lifecycle hooks, and how to design testable and maintainable service architectures to others.
# NestJS入门 - 第5天：数据库集成基础 | NestJS Introduction - Day 5: Database Integration Basics

## 学习目标 | Learning Objectives
- 掌握TypeORM在NestJS中的配置和使用 | Master TypeORM configuration and usage in NestJS
- 理解实体定义和数据模型设计原则 | Understand entity definition and data model design principles
- 学会配置数据库连接和连接池管理 | Learn to configure database connections and connection pool management
- 实现基础的CRUD数据库操作 | Implement basic CRUD database operations
- 掌握数据库迁移和种子数据管理 | Master database migrations and seed data management
- 理解事务处理和错误处理最佳实践 | Understand transaction handling and error handling best practices

## 详细内容 | Detailed Content

### 1. TypeORM基础配置 | TypeORM Basic Configuration (1.5小时 | 1.5 hours)

- **TypeORM概念与特性 | TypeORM Concepts and Features**
  
  **概念定义 | Concept Definition:**
  TypeORM是一个功能强大的对象关系映射(ORM)框架，它允许我们使用TypeScript/JavaScript类来表示数据库表，并提供了丰富的API来操作数据库，无需编写SQL语句。
  | TypeORM is a powerful Object-Relational Mapping (ORM) framework that allows us to represent database tables using TypeScript/JavaScript classes and provides rich APIs for database operations without writing SQL statements.
  
  **核心特征 | Key Characteristics:**
  - 支持多种数据库类型(PostgreSQL, MySQL, SQLite等) | Supports multiple database types (PostgreSQL, MySQL, SQLite, etc.)
  - 提供装饰器语法定义实体关系 | Provides decorator syntax for defining entity relationships
  - 支持自动迁移和同步功能 | Supports automatic migrations and synchronization
  - 集成查询构建器和原生SQL查询 | Integrates query builder and raw SQL queries
  - 支持事务、连接池和缓存机制 | Supports transactions, connection pooling, and caching mechanisms
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. TypeORM可以完全替代SQL语句吗？| Can TypeORM completely replace SQL statements?
     **答案 | Answer:** 否 | No - TypeORM提供便捷的API，但在复杂查询时仍可能需要原生SQL | TypeORM provides convenient APIs, but raw SQL may still be needed for complex queries
  2. TypeORM是否支持多种数据库？| Does TypeORM support multiple databases?
     **答案 | Answer:** 是 | Yes - 支持PostgreSQL、MySQL、MariaDB、SQLite、Oracle等 | Supports PostgreSQL, MySQL, MariaDB, SQLite, Oracle, etc.
  3. 使用TypeORM是否必须了解SQL？| Is SQL knowledge required to use TypeORM?
     **答案 | Answer:** 建议了解 | Recommended - 虽然不是必须，但SQL知识有助于优化查询和调试 | While not mandatory, SQL knowledge helps with query optimization and debugging
  4. TypeORM的装饰器是强制性的吗？| Are TypeORM decorators mandatory?
     **答案 | Answer:** 是 | Yes - 装饰器用于定义实体元数据，是TypeORM的核心机制 | Decorators define entity metadata and are core to TypeORM's mechanism
  
  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  // TypeORM基础配置示例 | TypeORM basic configuration example
  import { TypeOrmModule } from '@nestjs/typeorm';
  
  // 应用模块中的数据库配置 | Database configuration in app module
  @Module({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres', // 数据库类型 | Database type
        host: 'localhost', // 数据库主机 | Database host
        port: 5432, // 数据库端口 | Database port
        username: 'postgres', // 用户名 | Username
        password: 'password', // 密码 | Password
        database: 'nestjs_demo', // 数据库名 | Database name
        entities: [User], // 实体类数组 | Entity classes array
        synchronize: true, // 开发环境自动同步 | Auto sync in development
        logging: true, // 启用SQL日志 | Enable SQL logging
        retryAttempts: 3, // 连接重试次数 | Connection retry attempts
        retryDelay: 3000, // 重试延迟(毫秒) | Retry delay (ms)
      }),
    ],
  })
  export class AppModule {}
  ```
  
  **实践检查问题 | Practice Checking Questions:**
  - synchronize选项在生产环境中应该如何设置？| How should the synchronize option be set in production?
    **答案 | Answer:** false - 生产环境应使用迁移而不是自动同步 | false - Production should use migrations instead of auto-sync
  - logging选项的作用是什么？| What is the purpose of the logging option?
    **答案 | Answer:** 在控制台显示执行的SQL语句，便于开发调试 | Displays executed SQL statements in console for development debugging
  
  **常见误区检查 | Common Misconception Checks:**
  - TypeORM配置可以在任何模块中使用吗？| Can TypeORM configuration be used in any module?
    **答案 | Answer:** forRoot()只能在根模块使用，其他模块使用forFeature() | forRoot() only in root module, other modules use forFeature()
  - 所有数据库设置都必须硬编码吗？| Must all database settings be hard-coded?
    **答案 | Answer:** 不是，应使用环境变量和配置模块管理 | No, should use environment variables and configuration modules

- **环境配置管理 | Environment Configuration Management**
  
  **概念定义 | Concept Definition:**
  环境配置管理是指根据不同环境(开发、测试、生产)动态配置数据库连接参数，确保应用在不同环境中的正确运行。
  | Environment configuration management refers to dynamically configuring database connection parameters based on different environments (development, testing, production) to ensure correct application operation across environments.
  
  **核心特征 | Key Characteristics:**
  - 支持多环境配置文件(.env.development, .env.production) | Supports multi-environment config files
  - 配置验证和类型安全保障 | Configuration validation and type safety
  - 敏感信息加密存储机制 | Encrypted storage for sensitive information
  - 配置热重载和动态更新 | Hot reload and dynamic configuration updates
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 数据库密码应该直接写在代码中吗？| Should database passwords be written directly in code?
     **答案 | Answer:** 否 | No - 应使用环境变量存储敏感信息 | Should use environment variables for sensitive information
  2. 不同环境可以使用不同的数据库类型吗？| Can different environments use different database types?
     **答案 | Answer:** 是 | Yes - 如开发用SQLite，生产用PostgreSQL | Like SQLite for development, PostgreSQL for production
  3. 配置模块是必需的吗？| Is a configuration module required?
     **答案 | Answer:** 建议使用 | Recommended - 提供类型安全和验证功能 | Provides type safety and validation features
  4. 环境变量可以有默认值吗？| Can environment variables have default values?
     **答案 | Answer:** 是 | Yes - 在配置文件中可以设置默认值 | Default values can be set in configuration files

### 2. 实体定义与关系映射 | Entity Definition and Relationship Mapping (2小时 | 2 hours)

- **实体基础概念 | Entity Basic Concepts**
  
  **概念定义 | Concept Definition:**
  实体(Entity)是TypeORM中代表数据库表的TypeScript类，通过装饰器定义表结构、字段属性、索引和约束条件。
  | An Entity is a TypeScript class in TypeORM that represents a database table, defining table structure, field attributes, indexes, and constraints through decorators.
  
  **核心特征 | Key Characteristics:**
  - @Entity()装饰器标识实体类 | @Entity() decorator identifies entity classes
  - @PrimaryGeneratedColumn()定义主键 | @PrimaryGeneratedColumn() defines primary keys
  - @Column()装饰器配置字段属性 | @Column() decorator configures field attributes
  - 支持各种数据类型和约束 | Supports various data types and constraints
  - 自动时间戳和软删除功能 | Automatic timestamps and soft delete functionality
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 每个实体类都必须有主键吗？| Must every entity class have a primary key?
     **答案 | Answer:** 是 | Yes - 数据库表必须有唯一标识符 | Database tables must have unique identifiers
  2. @Column()装饰器可以省略吗？| Can the @Column() decorator be omitted?
     **答案 | Answer:** 不能 | No - 除了关系字段，所有持久化字段都需要@Column() | Except for relationship fields, all persistent fields need @Column()
  3. TypeScript类型会自动映射到数据库类型吗？| Do TypeScript types automatically map to database types?
     **答案 | Answer:** 部分是 | Partially - TypeORM提供智能映射，但复杂类型需要显式指定 | TypeORM provides smart mapping, but complex types need explicit specification
  4. 实体字段可以是可选的吗？| Can entity fields be optional?
     **答案 | Answer:** 是 | Yes - 使用nullable: true或TypeScript可选属性 | Use nullable: true or TypeScript optional properties
  
  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  // 用户实体定义示例 | User entity definition example
  import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
  
  @Entity('users') // 指定表名 | Specify table name
  @Index(['email'], { unique: true }) // 创建唯一索引 | Create unique index
  export class User {
    @PrimaryGeneratedColumn('uuid') // UUID主键 | UUID primary key
    id: string;
  
    @Column({
      type: 'varchar',
      length: 50,
      nullable: false,
      comment: '用户名 | Username'
    })
    username: string;
  
    @Column({
      type: 'varchar',
      length: 100,
      unique: true, // 唯一约束 | Unique constraint
      comment: '邮箱地址 | Email address'
    })
    email: string;
  
    @Column({
      type: 'varchar',
      length: 255,
      select: false, // 默认查询时不包含 | Exclude from default queries
      comment: '密码哈希 | Password hash'
    })
    passwordHash: string;
  
    @Column({
      type: 'enum',
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
      comment: '用户状态 | User status'
    })
    status: 'active' | 'inactive' | 'suspended';
  
    @Column({
      type: 'json',
      nullable: true,
      comment: '用户偏好设置 | User preferences'
    })
    preferences: Record<string, any>;
  
    @CreateDateColumn({
      type: 'timestamptz',
      comment: '创建时间 | Creation timestamp'
    })
    createdAt: Date;
  
    @UpdateDateColumn({
      type: 'timestamptz', 
      comment: '更新时间 | Update timestamp'
    })
    updatedAt: Date;
  
    @Column({
      type: 'timestamptz',
      nullable: true,
      comment: '软删除时间 | Soft delete timestamp'
    })
    deletedAt?: Date;
  }
  ```

- **实体关系映射 | Entity Relationship Mapping**
  
  **概念定义 | Concept Definition:**
  实体关系映射定义数据库表之间的关联关系，包括一对一(OneToOne)、一对多(OneToMany)、多对一(ManyToOne)和多对多(ManyToMany)关系。
  | Entity relationship mapping defines associations between database tables, including One-to-One, One-to-Many, Many-to-One, and Many-to-Many relationships.
  
  **关系类型特征 | Relationship Type Characteristics:**
  - OneToOne: 一个实体对应另一个实体的唯一记录 | One entity corresponds to one unique record of another entity
  - OneToMany/ManyToOne: 父子关系，一个父记录对应多个子记录 | Parent-child relationship, one parent record corresponds to multiple child records
  - ManyToMany: 多对多关系，通过中间表实现 | Many-to-many relationship implemented through junction table
  - 支持级联操作和延迟加载 | Supports cascade operations and lazy loading
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. OneToMany关系需要在两个实体中都定义吗？| Must OneToMany relationships be defined in both entities?
     **答案 | Answer:** 建议是 | Recommended - 双向关系提供更好的导航能力 | Bidirectional relationships provide better navigation capabilities
  2. ManyToMany关系会自动创建中间表吗？| Does ManyToMany relationship automatically create junction tables?
     **答案 | Answer:** 是 | Yes - TypeORM自动创建和管理中间表 | TypeORM automatically creates and manages junction tables
  3. 关系字段需要@Column装饰器吗？| Do relationship fields need @Column decorators?
     **答案 | Answer:** 否 | No - 关系字段使用@OneToMany, @ManyToOne等装饰器 | Relationship fields use @OneToMany, @ManyToOne, etc. decorators
  4. 级联删除是默认启用的吗？| Is cascade delete enabled by default?
     **答案 | Answer:** 否 | No - 需要显式配置cascade选项 | Need to explicitly configure cascade options

### 3. 数据库连接池配置 | Database Connection Pool Configuration (1小时 | 1 hour)

- **连接池管理概念 | Connection Pool Management Concepts**
  
  **概念定义 | Concept Definition:**
  连接池是数据库连接的缓存，用于重用连接以提高性能，避免频繁创建和销毁连接的开销，同时控制并发连接数量。
  | A connection pool is a cache of database connections used to reuse connections for better performance, avoiding the overhead of frequent connection creation/destruction while controlling concurrent connection numbers.
  
  **核心特征 | Key Characteristics:**
  - 最小和最大连接数控制 | Minimum and maximum connection count control
  - 连接超时和空闲超时管理 | Connection timeout and idle timeout management
  - 连接健康检查和自动恢复 | Connection health checks and automatic recovery
  - 连接泄露检测和监控 | Connection leak detection and monitoring
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 连接池大小应该设置得越大越好吗？| Should connection pool size be set as large as possible?
     **答案 | Answer:** 否 | No - 过大的连接池会消耗过多资源，需要根据应用负载调优 | Oversized pools waste resources, optimization based on application load needed
  2. 连接池会自动处理断开的连接吗？| Does connection pool automatically handle disconnected connections?
     **答案 | Answer:** 是 | Yes - 现代连接池提供健康检查和自动重连机制 | Modern connection pools provide health checks and auto-reconnection
  3. 每个数据库操作都会创建新连接吗？| Does each database operation create a new connection?
     **答案 | Answer:** 否 | No - 连接池重用现有连接，只在必要时创建新连接 | Connection pool reuses existing connections, creates new ones only when necessary
  4. 连接池配置影响应用性能吗？| Does connection pool configuration affect application performance?
     **答案 | Answer:** 是 | Yes - 合适的配置可以显著提升数据库操作性能 | Proper configuration can significantly improve database operation performance

### 4. 基础CRUD操作实现 | Basic CRUD Operations Implementation (1.5小时 | 1.5 hours)

- **Repository模式概念 | Repository Pattern Concepts**
  
  **概念定义 | Concept Definition:**
  Repository模式是一种数据访问层设计模式，它将数据访问逻辑封装在Repository类中，提供统一的接口来执行CRUD操作，实现业务逻辑与数据访问的分离。
  | The Repository pattern is a data access layer design pattern that encapsulates data access logic in Repository classes, providing unified interfaces for CRUD operations and separating business logic from data access.
  
  **核心特征 | Key Characteristics:**
  - 标准CRUD方法接口 | Standard CRUD method interfaces
  - 查询构建器支持复杂查询 | Query builder support for complex queries
  - 事务和批量操作支持 | Transaction and batch operation support
  - 自动类型推断和智能提示 | Automatic type inference and intelligent suggestions
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. Repository是由TypeORM自动生成的吗？| Are Repositories automatically generated by TypeORM?
     **答案 | Answer:** 是 | Yes - TypeORM为每个实体自动提供Repository | TypeORM automatically provides Repository for each entity
  2. 可以扩展默认的Repository功能吗？| Can default Repository functionality be extended?
     **答案 | Answer:** 是 | Yes - 可以创建自定义Repository继承基础功能 | Can create custom Repositories inheriting base functionality
  3. Repository方法都是异步的吗？| Are all Repository methods asynchronous?
     **答案 | Answer:** 是 | Yes - 数据库操作本质上是异步的 | Database operations are inherently asynchronous
  4. Repository能处理关系数据的加载吗？| Can Repository handle relationship data loading?
     **答案 | Answer:** 是 | Yes - 支持relations选项和join操作 | Supports relations option and join operations
  
  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  // 用户服务中的CRUD操作实现 | User service CRUD operations implementation
  import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
  import { User } from './entities/user.entity';
  import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto';
  
  @Injectable()
  export class UserService {
    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>, // 注入用户Repository | Inject User Repository
    ) {}
  
    // 创建用户 | Create user
    async create(createUserDto: CreateUserDto): Promise<User> {
      try {
        // 检查邮箱是否已存在 | Check if email already exists
        const existingUser = await this.userRepository.findOne({
          where: { email: createUserDto.email }
        });
  
        if (existingUser) {
          throw new BadRequestException('邮箱已被使用 | Email already in use');
        }
  
        // 创建新用户实例 | Create new user instance
        const user = this.userRepository.create({
          ...createUserDto,
          passwordHash: await this.hashPassword(createUserDto.password), // 密码哈希 | Password hashing
        });
  
        // 保存到数据库 | Save to database
        return await this.userRepository.save(user);
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw error;
        }
        throw new BadRequestException('用户创建失败 | User creation failed');
      }
    }
  
    // 分页查询用户 | Paginated user query
    async findAll(queryDto: QueryUserDto) {
      const {
        page = 1,
        limit = 10,
        status,
        search,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = queryDto;
  
      const queryBuilder = this.userRepository.createQueryBuilder('user');
  
      // 状态过滤 | Status filtering
      if (status) {
        queryBuilder.andWhere('user.status = :status', { status });
      }
  
      // 搜索功能 | Search functionality
      if (search) {
        queryBuilder.andWhere(
          '(user.username ILIKE :search OR user.email ILIKE :search)',
          { search: `%${search}%` }
        );
      }
  
      // 排序 | Sorting
      queryBuilder.orderBy(`user.${sortBy}`, sortOrder);
  
      // 分页 | Pagination
      queryBuilder.skip((page - 1) * limit).take(limit);
  
      // 执行查询并获取总数 | Execute query and get total count
      const [users, total] = await queryBuilder.getManyAndCount();
  
      return {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
  
    // 根据ID查找用户 | Find user by ID
    async findOne(id: string, options: FindOneOptions<User> = {}): Promise<User> {
      const user = await this.userRepository.findOne({
        where: { id },
        ...options,
      });
  
      if (!user) {
        throw new NotFoundException('用户不存在 | User not found');
      }
  
      return user;
    }
  
    // 更新用户 | Update user
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
      // 检查用户是否存在 | Check if user exists
      const user = await this.findOne(id);
  
      // 如果更新邮箱，检查是否已被使用 | If updating email, check if already in use
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: updateUserDto.email }
        });
  
        if (existingUser) {
          throw new BadRequestException('邮箱已被使用 | Email already in use');
        }
      }
  
      // 合并更新数据 | Merge update data
      Object.assign(user, updateUserDto);
  
      // 保存更新 | Save updates
      return await this.userRepository.save(user);
    }
  
    // 软删除用户 | Soft delete user
    async remove(id: string): Promise<void> {
      const user = await this.findOne(id);
      
      // 设置软删除时间戳 | Set soft delete timestamp
      user.deletedAt = new Date();
      await this.userRepository.save(user);
    }
  
    // 批量操作示例 | Batch operation example
    async batchUpdateStatus(ids: string[], status: string): Promise<void> {
      await this.userRepository.update(
        { id: In(ids) },
        { status }
      );
    }
  
    // 私有方法：密码哈希 | Private method: password hashing
    private async hashPassword(password: string): Promise<string> {
      // 实际应用中使用bcrypt等库 | Use bcrypt etc. in real applications
      return `hashed_${password}`;
    }
  }
  ```

### 5. 数据库迁移管理 | Database Migration Management (45分钟 | 45 minutes)

- **迁移概念与最佳实践 | Migration Concepts and Best Practices**
  
  **概念定义 | Concept Definition:**
  数据库迁移是管理数据库架构变更的系统化方法，通过版本控制的方式记录和应用数据库结构的变化，确保不同环境间的数据库一致性。
  | Database migration is a systematic approach to manage database schema changes, recording and applying database structure changes through version control to ensure consistency across different environments.
  
  **核心特征 | Key Characteristics:**
  - 版本化的架构变更管理 | Versioned schema change management
  - 向前和向后迁移支持 | Forward and backward migration support
  - 自动生成和手动编写结合 | Combination of automatic generation and manual writing
  - 生产环境安全的部署策略 | Production-safe deployment strategies
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 每次实体更改都需要创建迁移吗？| Does every entity change require creating a migration?
     **答案 | Answer:** 在生产环境是 | Yes in production - 开发环境可用synchronize，生产环境必须用迁移 | Development can use synchronize, production must use migrations
  2. 迁移可以自动回滚吗？| Can migrations be automatically rolled back?
     **答案 | Answer:** 部分可以 | Partially - 简单操作可以，复杂变更需要手动编写回滚逻辑 | Simple operations yes, complex changes need manual rollback logic
  3. 生成的迁移文件可以修改吗？| Can generated migration files be modified?
     **答案 | Answer:** 是 | Yes - 应该审查和优化生成的迁移代码 | Should review and optimize generated migration code
  4. 迁移失败时数据库会处于什么状态？| What state is the database in when migration fails?
     **答案 | Answer:** 取决于事务设置 | Depends on transaction settings - 建议在事务中执行迁移 | Recommended to run migrations within transactions

### 6. 事务处理与错误处理 | Transaction Handling and Error Management (30分钟 | 30 minutes)

- **数据库事务管理 | Database Transaction Management**
  
  **概念定义 | Concept Definition:**
  事务是一组数据库操作的逻辑单元，这些操作要么全部成功执行，要么全部回滚，确保数据的一致性和完整性。
  | A transaction is a logical unit of database operations where all operations either succeed completely or are rolled back entirely, ensuring data consistency and integrity.
  
  **ACID原则特征 | ACID Principle Characteristics:**
  - 原子性(Atomicity): 事务中的操作要么全部执行，要么全部不执行 | All operations in a transaction either execute completely or not at all
  - 一致性(Consistency): 事务执行后数据库状态保持一致 | Database state remains consistent after transaction execution
  - 隔离性(Isolation): 并发事务相互隔离，不互相干扰 | Concurrent transactions are isolated and don't interfere with each other
  - 持久性(Durability): 已提交的事务永久保存 | Committed transactions are permanently saved
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. TypeORM中的save方法会自动创建事务吗？| Does TypeORM's save method automatically create transactions?
     **答案 | Answer:** 是 | Yes - 单个操作默认在事务中执行 | Single operations execute in transactions by default
  2. 事务失败时会自动回滚吗？| Do transactions automatically rollback on failure?
     **答案 | Answer:** 是 | Yes - 未处理的异常会触发自动回滚 | Unhandled exceptions trigger automatic rollback
  3. 嵌套事务是支持的吗？| Are nested transactions supported?
     **答案 | Answer:** 取决于数据库 | Depends on database - PostgreSQL支持保存点，MySQL有限支持 | PostgreSQL supports savepoints, MySQL has limited support
  4. 事务应该在Service层还是Repository层管理？| Should transactions be managed at Service or Repository layer?
     **答案 | Answer:** Service层 | Service layer - 业务逻辑层更适合管理事务边界 | Business logic layer is better suited for managing transaction boundaries

## 实践项目：用户管理系统数据持久化 | Practical Project: User Management System Data Persistence

### 目标 | Objective
构建一个完整的用户管理系统数据持久化层，综合应用TypeORM配置、实体定义、CRUD操作、迁移管理和事务处理等概念，实现生产级别的数据访问层。
| Build a complete user management system data persistence layer, comprehensively applying TypeORM configuration, entity definition, CRUD operations, migration management, and transaction handling concepts to implement a production-level data access layer.

### 概念应用检查 | Concept Application Check
在开始项目前，请确认对以下概念的理解 | Before starting the project, please confirm understanding of the following concepts:

1. TypeORM实体装饰器的作用是什么？| What is the role of TypeORM entity decorators?
   **答案 | Answer:** 定义数据库表结构、字段属性、关系和约束 | Define database table structure, field attributes, relationships, and constraints
2. Repository模式如何分离数据访问逻辑？| How does Repository pattern separate data access logic?
   **答案 | Answer:** 将数据操作封装在专门的类中，与业务逻辑解耦 | Encapsulates data operations in dedicated classes, decoupling from business logic
3. 数据库迁移相比synchronize有什么优势？| What advantages do database migrations have over synchronize?
   **答案 | Answer:** 版本控制、生产安全、可回滚、团队协作友好 | Version control, production-safe, rollbackable, team-friendly

### 步骤 | Steps
1. **环境配置 | Environment Setup**
   - 配置PostgreSQL数据库连接
   - 设置TypeORM模块和环境变量管理
   
2. **实体设计 | Entity Design**
   - 创建User实体，包含完整的字段定义和约束
   - 设计Profile实体，建立一对一关系
   - 创建Role实体和UserRole关系，实现多对多关系
   
3. **Repository层实现 | Repository Layer Implementation**
   - 实现用户CRUD操作服务
   - 添加复杂查询和分页功能
   - 实现批量操作和事务管理
   
4. **迁移管理 | Migration Management**
   - 生成和自定义数据库迁移
   - 创建种子数据迁移
   
5. **测试验证 | Testing and Validation**
   - 单元测试数据访问层
   - 集成测试数据库操作

### 示例代码 | Example Code
```typescript
/**
 * 用户管理系统数据持久化项目 | User Management System Data Persistence Project
 * 综合演示TypeORM在NestJS中的完整应用 | Comprehensive demonstration of TypeORM complete application in NestJS
 * 
 * 本项目演示以下概念的综合应用：| This project demonstrates comprehensive application of:
 * - TypeORM配置和实体定义 | TypeORM configuration and entity definition
 * - 复杂的数据库关系映射 | Complex database relationship mapping  
 * - 完整的CRUD操作实现 | Complete CRUD operations implementation
 * - 数据库迁移和事务管理 | Database migrations and transaction management
 * - 查询优化和性能监控 | Query optimization and performance monitoring
 */

// 1. 数据库配置模块 | Database Configuration Module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Role } from './entities/role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE', 'nestjs_user_system'),
        entities: [User, Profile, Role],
        migrations: ['dist/migrations/*.js'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('DB_LOGGING', false),
        extra: {
          // 连接池配置 | Connection pool configuration
          max: configService.get<number>('DB_POOL_MAX', 10),
          min: configService.get<number>('DB_POOL_MIN', 2),
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

// 2. 用户实体定义 | User Entity Definition
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  @Exclude()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'suspended', 'deleted'],
    default: 'active',
  })
  status: 'active' | 'inactive' | 'suspended' | 'deleted';

  @Column({ type: 'json', nullable: true })
  preferences: Record<string, any>;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.passwordHash && !this.passwordHash.startsWith('$2a$')) {
      this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}

// 3. 用户档案实体 | User Profile Entity
@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarUrl: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

// 4. 角色实体 | Role Entity
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', default: {} })
  permissions: Record<string, boolean>;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

// 5. 用户服务实现 | User Service Implementation
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In, FindManyOptions } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly dataSource: DataSource, // 事务管理 | Transaction management
  ) {}

  // 创建完整用户信息 | Create complete user information
  async createUserWithProfile(userData: CreateUserWithProfileDto): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      // 检查用户名和邮箱唯一性 | Check username and email uniqueness
      const existingUser = await manager.findOne(User, {
        where: [
          { username: userData.username },
          { email: userData.email },
        ],
      });

      if (existingUser) {
        throw new BadRequestException('用户名或邮箱已存在 | Username or email already exists');
      }

      // 创建用户 | Create user
      const user = manager.create(User, {
        username: userData.username,
        email: userData.email,
        passwordHash: userData.password,
      });
      await manager.save(User, user);

      // 创建用户档案 | Create user profile
      if (userData.profile) {
        const profile = manager.create(Profile, {
          ...userData.profile,
          user,
        });
        await manager.save(Profile, profile);
        user.profile = profile;
      }

      // 分配默认角色 | Assign default roles
      const defaultRole = await manager.findOne(Role, { where: { name: 'user' } });
      if (defaultRole) {
        user.roles = [defaultRole];
        await manager.save(User, user);
      }

      return user;
    });
  }

  // 高级查询功能 | Advanced query functionality
  async findUsersWithFilters(filters: UserFilterDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      roles,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      includeProfile = false,
      includeRoles = false,
    } = filters;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.profile', 'profile')
      .leftJoin('user.roles', 'roles');

    // 搜索条件 | Search conditions
    if (search) {
      queryBuilder.andWhere(
        '(user.username ILIKE :search OR user.email ILIKE :search OR profile.firstName ILIKE :search OR profile.lastName ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // 状态过滤 | Status filtering
    if (status && status.length > 0) {
      queryBuilder.andWhere('user.status IN (:...status)', { status });
    }

    // 角色过滤 | Role filtering
    if (roles && roles.length > 0) {
      queryBuilder.andWhere('roles.name IN (:...roles)', { roles });
    }

    // 软删除过滤 | Soft delete filtering
    queryBuilder.andWhere('user.deletedAt IS NULL');

    // 包含关联数据 | Include related data
    if (includeProfile) {
      queryBuilder.addSelect([
        'profile.id',
        'profile.firstName',
        'profile.lastName',
        'profile.bio',
        'profile.avatarUrl',
      ]);
    }

    if (includeRoles) {
      queryBuilder.addSelect(['roles.id', 'roles.name', 'roles.description']);
    }

    // 排序 | Sorting
    queryBuilder.orderBy(`user.${sortBy}`, sortOrder);

    // 分页 | Pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 批量角色管理 | Batch role management
  async assignRolesToUsers(userIds: string[], roleIds: string[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const users = await manager.findByIds(User, userIds, { relations: ['roles'] });
      const roles = await manager.findByIds(Role, roleIds);

      if (users.length !== userIds.length) {
        throw new NotFoundException('部分用户不存在 | Some users not found');
      }

      if (roles.length !== roleIds.length) {
        throw new NotFoundException('部分角色不存在 | Some roles not found');
      }

      for (const user of users) {
        // 合并现有角色和新角色 | Merge existing and new roles
        const existingRoleIds = user.roles.map(role => role.id);
        const newRoles = roles.filter(role => !existingRoleIds.includes(role.id));
        user.roles = [...user.roles, ...newRoles];
        await manager.save(User, user);
      }
    });
  }

  // 用户统计信息 | User statistics
  async getUserStatistics(): Promise<UserStatisticsDto> {
    const totalUsers = await this.userRepository.count({ where: { deletedAt: null } });
    const activeUsers = await this.userRepository.count({ 
      where: { status: 'active', deletedAt: null } 
    });
    const recentUsers = await this.userRepository.count({
      where: {
        createdAt: MoreThanOrEqual(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
        deletedAt: null
      }
    });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      recentUsers,
      usersByStatus: await this.getUserCountByStatus(),
    };
  }

  private async getUserCountByStatus() {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .select('user.status', 'status')
      .addSelect('COUNT(user.id)', 'count')
      .where('user.deletedAt IS NULL')
      .groupBy('user.status')
      .getRawMany();

    return result.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {});
  }
}

// 6. 数据迁移示例 | Database Migration Example
import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class CreateUsersTable1640000000000 implements MigrationInterface {
  name = 'CreateUsersTable1640000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'username',
            type: 'varchar',
            length: '50',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password_hash',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive', 'suspended', 'deleted'],
            default: "'active'",
          },
          {
            name: 'preferences',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'users',
      new Index({
        name: 'IDX_USERS_EMAIL',
        columnNames: ['email'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'users',
      new Index({
        name: 'IDX_USERS_USERNAME',
        columnNames: ['username'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

### 项目完成检查 | Project Completion Check
1. TypeORM配置是否正确且支持多环境？| Is TypeORM configuration correct and multi-environment compatible?
2. 实体关系是否正确定义且包含必要约束？| Are entity relationships correctly defined with necessary constraints?
3. CRUD操作是否包含完整的错误处理？| Do CRUD operations include comprehensive error handling?
4. 是否实现了事务管理和批量操作？| Are transaction management and batch operations implemented?
5. 数据库迁移是否可以安全地在生产环境运行？| Can database migrations run safely in production?

## 扩展练习 | Extension Exercises

### 概念深化练习 | Concept Deepening Exercises

1. **TypeORM高级特性练习 | TypeORM Advanced Features Exercise**
   - **练习描述 | Exercise Description:** 实现自定义Repository，添加复杂查询方法和缓存机制
   - **概念检查 | Concept Check:** 如何扩展TypeORM Repository的默认功能？
   - **学习目标 | Learning Objective:** 深入理解Repository模式和查询优化技术

2. **数据库关系优化练习 | Database Relationship Optimization Exercise**
   - **练习描述 | Exercise Description:** 设计多层级的实体关系，实现延迟加载和预加载策略
   - **概念检查 | Concept Check:** 什么情况下使用lazy loading vs eager loading？
   - **学习目标 | Learning Objective:** 掌握关系数据的性能优化技术

3. **事务边界管理练习 | Transaction Boundary Management Exercise**
   - **练习描述 | Exercise Description:** 实现复杂业务场景的事务管理，包括嵌套事务和分布式事务
   - **概念检查 | Concept Check:** 如何确定事务的合理边界？
   - **学习目标 | Learning Objective:** 理解事务管理的最佳实践和性能考量

4. **数据库性能监控练习 | Database Performance Monitoring Exercise**
   - **练习描述 | Exercise Description:** 集成SQL查询日志分析，实现慢查询检测和优化
   - **概念检查 | Concept Check:** 如何识别和优化数据库性能瓶颈？
   - **学习目标 | Learning Objective:** 建立数据库性能监控和优化能力

5. **迁移策略实践练习 | Migration Strategy Practice Exercise**
   - **练习描述 | Exercise Description:** 设计零停机部署的迁移策略，包括数据迁移和回滚方案
   - **概念检查 | Concept Check:** 生产环境迁移需要考虑哪些风险因素？
   - **学习目标 | Learning Objective:** 掌握生产级数据库迁移策略

6. **多数据源管理练习 | Multiple Data Sources Management Exercise**
   - **练习描述 | Exercise Description:** 配置和管理多个数据库连接，实现读写分离
   - **概念检查 | Concept Check:** 多数据源场景下如何管理事务一致性？
   - **学习目标 | Learning Objective:** 理解复杂数据架构的设计和实现

7. **数据访问层测试练习 | Data Access Layer Testing Exercise**
   - **练习描述 | Exercise Description:** 编写comprehensive的单元测试和集成测试，包括数据库测试容器
   - **概念检查 | Concept Check:** 如何有效测试数据访问层的各种场景？
   - **学习目标 | Learning Objective:** 建立完整的数据层测试策略和实践

## 学习资源 | Learning Resources
- **[TypeORM官方文档](https://typeorm.io/)** - 完整的TypeORM使用指南
- **[NestJS数据库集成](https://docs.nestjs.com/techniques/database)** - NestJS中的数据库使用
- **[PostgreSQL官方文档](https://www.postgresql.org/docs/)** - PostgreSQL数据库详细文档
- **[数据库设计最佳实践](https://www.vertabelo.com/blog/database-design-best-practices/)** - 数据库设计指南

---

✅ **完成检查清单 | Completion Checklist**
- [ ] TypeORM配置和环境管理理解掌握 | TypeORM configuration and environment management understood
- [ ] 实体定义和关系映射正确实现 | Entity definition and relationship mapping correctly implemented
- [ ] 数据库连接池配置和优化完成 | Database connection pool configured and optimized
- [ ] 基础CRUD操作和复杂查询实现 | Basic CRUD operations and complex queries implemented
- [ ] 数据库迁移创建和管理掌握 | Database migration creation and management mastered
- [ ] 事务处理和错误处理机制建立 | Transaction handling and error handling mechanisms established
- [ ] 实践项目完整实现并测试通过 | Practical project completely implemented and tested
- [ ] Repository模式的设计原则理解 | Repository pattern design principles understood
- [ ] 数据库性能优化基础知识掌握 | Database performance optimization basics mastered
- [ ] 扩展练习至少完成3个 | At least 3 extension exercises completed

**概念掌握验证 | Concept Mastery Verification:**
在标记完成前，请确保能够正确回答本日所有CCQs，并能够独立设计和实现一个完整的数据访问层，包括实体关系、CRUD操作、事务管理和错误处理。
Before marking as complete, ensure you can correctly answer all CCQs from today and independently design and implement a complete data access layer including entity relationships, CRUD operations, transaction management, and error handling.
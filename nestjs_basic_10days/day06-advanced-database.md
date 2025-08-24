# NestJS入门 - 第6天：高级数据库操作 | NestJS Introduction - Day 6: Advanced Database Operations

## 学习目标 | Learning Objectives
- 掌握TypeORM实体关系映射 | Master TypeORM entity relationship mapping
- 理解一对一、一对多、多对多关系 | Understand OneToOne, OneToMany, ManyToMany relationships
- 学会使用查询构建器构建复杂查询 | Learn to build complex queries with Query Builder
- 掌握数据库事务处理和数据一致性 | Master database transaction handling and data consistency
- 实现高级数据库操作和优化 | Implement advanced database operations and optimization
- 理解数据库性能调优和最佳实践 | Understand database performance tuning and best practices

## 详细内容 | Detailed Content

### 1. 实体关系映射 | Entity Relationship Mapping (1小时 | 1 hour)

- **实体关系基础 | Entity Relationship Fundamentals**
  
  **概念定义 | Concept Definition:**
  实体关系映射是将数据库中的表关系通过面向对象的方式在代码中表现的技术。TypeORM提供了装饰器来定义不同类型的关系，包括一对一(OneToOne)、一对多(OneToMany)、多对一(ManyToOne)和多对多(ManyToMany)关系。 | Entity relationship mapping is the technique of representing database table relationships in code through an object-oriented approach. TypeORM provides decorators to define different types of relationships, including OneToOne, OneToMany, ManyToOne, and ManyToMany relationships.
  
  **核心特征 | Key Characteristics:**
  - 双向关系维护：通过装饰器自动维护关系的双向性 | Bidirectional relationship maintenance: automatically maintain bidirectional relationships through decorators
  - 延迟加载支持：支持eager和lazy loading策略 | Lazy loading support: supports eager and lazy loading strategies
  - 关系级联操作：支持cascade插入、更新和删除 | Relationship cascade operations: supports cascade insert, update and delete
  - 外键约束管理：自动创建和维护外键约束 | Foreign key constraint management: automatically create and maintain foreign key constraints
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 一对多关系中，外键存储在哪一侧？| In a one-to-many relationship, which side stores the foreign key?
     **答案 | Answer:** 多(Many)的一侧 | The "Many" side - 外键总是存储在关系的多的一侧
  2. @JoinColumn装饰器用于哪种关系类型？| Which relationship type uses the @JoinColumn decorator?
     **答案 | Answer:** OneToOne和ManyToOne | OneToOne and ManyToOne - 用于指定拥有外键的一侧
  3. 级联操作可以自动处理哪些数据库操作？| What database operations can cascade operations handle automatically?
     **答案 | Answer:** 插入、更新、删除 | Insert, update, delete - 可以通过cascade选项自动传播操作
  4. eager loading和lazy loading的区别是什么？| What's the difference between eager loading and lazy loading?
     **答案 | Answer:** eager立即加载相关数据，lazy按需加载 | Eager loads related data immediately, lazy loads data on demand
  
  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  // 一对一关系示例 | OneToOne relationship example
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    // 一对一关系：用户 -> 用户资料 | OneToOne: User -> UserProfile
    @OneToOne(() => UserProfile, profile => profile.user, {
      cascade: true, // 级联保存和更新 | Cascade save and update
      eager: true,   // 立即加载 | Eager loading
    })
    @JoinColumn() // 指定外键在此表 | Specify foreign key in this table
    profile: UserProfile;
  }

  @Entity('user_profiles')
  export class UserProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    // 反向一对一关系 | Reverse OneToOne relationship
    @OneToOne(() => User, user => user.profile)
    user: User;
  }

  // 一对多关系示例 | OneToMany relationship example
  @Entity('categories')
  export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    // 一对多关系：分类 -> 产品 | OneToMany: Category -> Products
    @OneToMany(() => Product, product => product.category, {
      cascade: ['insert', 'update'], // 部分级联操作 | Partial cascade operations
    })
    products: Product[];
  }

  @Entity('products')
  export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    // 多对一关系：产品 -> 分类 | ManyToOne: Product -> Category
    @ManyToOne(() => Category, category => category.products, {
      nullable: false, // 必须属于某个分类 | Must belong to a category
    })
    @JoinColumn({ name: 'category_id' }) // 指定外键列名 | Specify foreign key column name
    category: Category;
  }
  ```
  
  **实践检查问题 | Practice Checking Questions:**
  - 在上述代码中，UserProfile表会包含哪个外键字段？| Which foreign key field will the UserProfile table contain in the above code?
    **答案 | Answer:** 不包含，因为@JoinColumn在User实体中 | None, because @JoinColumn is in the User entity
  - Product实体中的category_id外键是如何定义的？| How is the category_id foreign key defined in the Product entity?
    **答案 | Answer:** 通过@JoinColumn({ name: 'category_id' }) | Through @JoinColumn({ name: 'category_id' })
  
  **常见误区检查 | Common Misconception Checks:**
  - @JoinColumn可以用在关系的任意一侧吗？| Can @JoinColumn be used on any side of a relationship?
    **答案 | Answer:** 错误，只能用在拥有外键的一侧 | False, it can only be used on the side that owns the foreign key
  - eager: true会影响查询性能吗？| Does eager: true affect query performance?
    **答案 | Answer:** 是的，会增加查询复杂度但减少查询次数 | Yes, it increases query complexity but reduces the number of queries

- **多对多关系 | Many-to-Many Relationships**
  
  **概念定义 | Concept Definition:**
  多对多关系需要通过中间表来实现，TypeORM提供@ManyToMany和@JoinTable装饰器来处理这种复杂关系。中间表可以是简单的关联表，也可以包含额外的字段和业务逻辑。 | Many-to-many relationships require an intermediate table, TypeORM provides @ManyToMany and @JoinTable decorators to handle these complex relationships. The intermediate table can be a simple association table or contain additional fields and business logic.
  
  **与基础概念的关系 | Relationship to Basic Concepts:**
  多对多关系建立在一对多关系的基础上，实际上是两个一对多关系的组合，通过中间表连接两个实体。 | Many-to-many relationships build on one-to-many relationships, actually being a combination of two one-to-many relationships connected through an intermediate table.
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 多对多关系需要几个数据库表？| How many database tables are needed for a many-to-many relationship?
     **答案 | Answer:** 3个表 | 3 tables - 两个实体表加一个中间关联表
  2. @JoinTable装饰器应该放在哪一侧？| Which side should the @JoinTable decorator be placed on?
     **答案 | Answer:** 关系的拥有者一侧 | The owning side of the relationship
  3. 中间表可以包含额外的字段吗？| Can the intermediate table contain additional fields?
     **答案 | Answer:** 可以，需要创建显式的中间实体 | Yes, requires creating an explicit intermediate entity
  4. 如何查询多对多关系中的相关数据？| How to query related data in many-to-many relationships?
     **答案 | Answer:** 使用relations选项或查询构建器 | Use relations option or query builder
  5. 多对多关系的级联删除应该如何处理？| How should cascade deletion be handled in many-to-many relationships?
     **答案 | Answer:** 谨慎使用，通常只在中间表执行 | Use carefully, usually only execute on intermediate table
  
  **复杂代码示例 | Complex Code Examples:**
  ```typescript
  // 简单多对多关系 | Simple Many-to-Many relationship
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    // 多对多关系：用户 <-> 角色 | Many-to-many: Users <-> Roles
    @ManyToMany(() => Role, role => role.users, {
      cascade: true,
    })
    @JoinTable({
      name: 'user_roles',           // 中间表名 | Intermediate table name
      joinColumn: {                 // 当前实体的外键 | Foreign key for current entity
        name: 'user_id',
        referencedColumnName: 'id'
      },
      inverseJoinColumn: {          // 关联实体的外键 | Foreign key for related entity
        name: 'role_id',
        referencedColumnName: 'id'
      }
    })
    roles: Role[];
  }

  @Entity('roles')
  export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    // 反向多对多关系 | Inverse many-to-many relationship
    @ManyToMany(() => User, user => user.roles)
    users: User[];
  }

  // 带额外字段的多对多关系实现 | Many-to-many with additional fields
  @Entity('user_project_assignments')
  export class UserProjectAssignment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // 多对一到用户 | Many-to-one to User
    @ManyToOne(() => User, user => user.projectAssignments)
    @JoinColumn({ name: 'user_id' })
    user: User;

    // 多对一到项目 | Many-to-one to Project
    @ManyToOne(() => Project, project => project.userAssignments)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    // 额外字段：分配时间 | Additional field: assignment date
    @CreateDateColumn()
    assignedAt: Date;

    // 额外字段：角色 | Additional field: role
    @Column({
      type: 'enum',
      enum: ['owner', 'collaborator', 'viewer'],
      default: 'collaborator'
    })
    role: 'owner' | 'collaborator' | 'viewer';

    // 额外字段：是否活跃 | Additional field: is active
    @Column({ default: true })
    isActive: boolean;
  }

  @Entity('projects')
  export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    // 一对多到用户项目分配 | One-to-many to user project assignments
    @OneToMany(() => UserProjectAssignment, assignment => assignment.project)
    userAssignments: UserProjectAssignment[];
  }

  // 用户实体需要相应更新 | User entity needs corresponding update
  @Entity('users')
  export class User {
    // ... 其他字段
    
    @OneToMany(() => UserProjectAssignment, assignment => assignment.user)
    projectAssignments: UserProjectAssignment[];
  }
  ```
  
  **综合应用检查 | Comprehensive Application Check:**
  - 如何为用户分配项目并设置特定角色？| How to assign a project to a user with a specific role?
  - 中间表的复合主键如何处理？| How to handle composite primary keys in intermediate tables?
  - 如何查询某个用户在所有项目中的角色？| How to query a user's roles in all projects?

### 2. 查询构建器高级应用 | Advanced Query Builder Applications (1小时 | 1 hour)

- **复杂查询构建 | Complex Query Construction**
  
  **概念定义 | Concept Definition:**
  查询构建器(QueryBuilder)是TypeORM提供的程序化构建SQL查询的工具，支持复杂的连接、子查询、条件筛选、聚合函数等操作，提供了比简单的find方法更强大的数据检索能力。 | QueryBuilder is a tool provided by TypeORM for programmatically building SQL queries, supporting complex operations like joins, subqueries, conditional filtering, aggregate functions, providing more powerful data retrieval capabilities than simple find methods.
  
  **解决的问题 | Problems It Solves:**
  - 复杂多表关联查询：需要连接多个表并应用复杂条件 | Complex multi-table join queries: need to join multiple tables with complex conditions
  - 动态查询条件：根据用户输入动态构建查询条件 | Dynamic query conditions: dynamically build query conditions based on user input
  - 聚合和统计查询：计算总数、平均值、分组统计等 | Aggregation and statistical queries: calculate counts, averages, group statistics, etc.
  - 性能优化查询：精确控制查询字段和连接方式 | Performance-optimized queries: precisely control query fields and join methods
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 查询构建器相比find方法有什么优势？| What advantages does QueryBuilder have over find methods?
     **答案 | Answer:** 更灵活的查询控制和更高的性能 | More flexible query control and higher performance
  2. leftJoinAndSelect和innerJoinAndSelect的区别是什么？| What's the difference between leftJoinAndSelect and innerJoinAndSelect?
     **答案 | Answer:** left join返回左表所有记录，inner join只返回匹配的记录 | Left join returns all records from left table, inner join only returns matching records
  3. 子查询在查询构建器中如何使用？| How are subqueries used in QueryBuilder?
     **答案 | Answer:** 通过subQuery方法或where条件中嵌套查询 | Through subQuery method or nested queries in where conditions
  4. 查询构建器支持哪些聚合函数？| What aggregate functions does QueryBuilder support?
     **答案 | Answer:** COUNT、SUM、AVG、MIN、MAX等 | COUNT, SUM, AVG, MIN, MAX, etc.
  
  **实际应用示例 | Real-world Application Examples:**
  ```typescript
  @Injectable()
  export class ProductService {
    constructor(
      @InjectRepository(Product)
      private productRepository: Repository<Product>,
      @InjectRepository(Category)
      private categoryRepository: Repository<Category>,
      private dataSource: DataSource
    ) {}

    // 复杂查询：带分页和筛选的产品搜索 | Complex query: product search with pagination and filtering
    async searchProducts(searchParams: ProductSearchDto): Promise<{
      products: Product[];
      total: number;
      totalPages: number;
    }> {
      const queryBuilder = this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.reviews', 'reviews')
        .leftJoinAndSelect('reviews.user', 'reviewer');

      // 动态条件构建 | Dynamic condition building
      if (searchParams.name) {
        queryBuilder.andWhere('product.name ILIKE :name', {
          name: `%${searchParams.name}%`
        });
      }

      if (searchParams.categoryIds?.length) {
        queryBuilder.andWhere('category.id IN (:...categoryIds)', {
          categoryIds: searchParams.categoryIds
        });
      }

      if (searchParams.priceRange) {
        queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
          minPrice: searchParams.priceRange.min,
          maxPrice: searchParams.priceRange.max
        });
      }

      // 只查询活跃产品 | Only query active products
      queryBuilder.andWhere('product.isActive = :isActive', { isActive: true });

      // 排序逻辑 | Sorting logic
      switch (searchParams.sortBy) {
        case 'price':
          queryBuilder.orderBy('product.price', searchParams.sortOrder || 'ASC');
          break;
        case 'name':
          queryBuilder.orderBy('product.name', searchParams.sortOrder || 'ASC');
          break;
        case 'createdAt':
          queryBuilder.orderBy('product.createdAt', searchParams.sortOrder || 'DESC');
          break;
        default:
          // 默认按评分排序 | Default sort by rating
          queryBuilder.orderBy('product.averageRating', 'DESC');
      }

      // 分页计算 | Pagination calculation
      const page = searchParams.page || 1;
      const limit = searchParams.limit || 20;
      const offset = (page - 1) * limit;

      // 执行查询和计数 | Execute query and count
      const [products, total] = await queryBuilder
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      return {
        products,
        total,
        totalPages: Math.ceil(total / limit)
      };
    }

    // 聚合查询：分类统计 | Aggregate query: category statistics
    async getCategoryStatistics(): Promise<CategoryStatsDto[]> {
      const stats = await this.productRepository
        .createQueryBuilder('product')
        .select([
          'category.id as categoryId',
          'category.name as categoryName',
          'COUNT(product.id) as productCount',
          'AVG(product.price) as averagePrice',
          'MIN(product.price) as minPrice',
          'MAX(product.price) as maxPrice',
          'SUM(CASE WHEN product.isActive THEN 1 ELSE 0 END) as activeProductCount'
        ])
        .innerJoin('product.category', 'category')
        .groupBy('category.id, category.name')
        .having('COUNT(product.id) > 0')
        .orderBy('productCount', 'DESC')
        .getRawMany();

      return stats.map(stat => ({
        categoryId: stat.categoryid,
        categoryName: stat.categoryname,
        productCount: parseInt(stat.productcount),
        averagePrice: parseFloat(stat.averageprice),
        minPrice: parseFloat(stat.minprice),
        maxPrice: parseFloat(stat.maxprice),
        activeProductCount: parseInt(stat.activeproductcount)
      }));
    }

    // 子查询应用：查找热门产品 | Subquery application: find popular products
    async getPopularProducts(limit: number = 10): Promise<Product[]> {
      return this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .where(qb => {
          const subQuery = qb.subQuery()
            .select('review.productId')
            .from('reviews', 'review')
            .groupBy('review.productId')
            .having('COUNT(review.id) >= :minReviewCount', { minReviewCount: 10 })
            .andHaving('AVG(review.rating) >= :minRating', { minRating: 4.0 })
            .getQuery();
          
          return `product.id IN ${subQuery}`;
        })
        .orderBy('product.averageRating', 'DESC')
        .addOrderBy('product.reviewCount', 'DESC')
        .take(limit)
        .getMany();
    }

    // 复杂统计查询：销售报表 | Complex statistical query: sales report
    async getSalesReport(startDate: Date, endDate: Date): Promise<SalesReportDto> {
      const salesData = await this.dataSource
        .createQueryBuilder()
        .select([
          'DATE(order.createdAt) as saleDate',
          'category.name as categoryName',
          'COUNT(DISTINCT order.id) as orderCount',
          'COUNT(orderItem.id) as itemsSold',
          'SUM(orderItem.quantity * orderItem.price) as totalRevenue',
          'AVG(orderItem.price) as averageItemPrice'
        ])
        .from('orders', 'order')
        .innerJoin('order_items', 'orderItem', 'orderItem.orderId = order.id')
        .innerJoin('products', 'product', 'product.id = orderItem.productId')
        .innerJoin('categories', 'category', 'category.id = product.categoryId')
        .where('order.createdAt BETWEEN :startDate AND :endDate', {
          startDate,
          endDate
        })
        .andWhere('order.status = :status', { status: 'completed' })
        .groupBy('DATE(order.createdAt), category.id, category.name')
        .orderBy('saleDate', 'ASC')
        .addOrderBy('totalRevenue', 'DESC')
        .getRawMany();

      // 处理和转换数据 | Process and transform data
      return this.transformSalesData(salesData);
    }

    // 原生SQL查询示例 | Native SQL query example
    async getAdvancedAnalytics(): Promise<AnalyticsDto> {
      const result = await this.dataSource.query(`
        WITH monthly_sales AS (
          SELECT 
            DATE_TRUNC('month', o.created_at) as month,
            c.name as category_name,
            SUM(oi.quantity * oi.price) as revenue,
            COUNT(DISTINCT o.id) as order_count
          FROM orders o
          JOIN order_items oi ON o.id = oi.order_id
          JOIN products p ON oi.product_id = p.id
          JOIN categories c ON p.category_id = c.id
          WHERE o.status = 'completed'
            AND o.created_at >= CURRENT_DATE - INTERVAL '12 months'
          GROUP BY DATE_TRUNC('month', o.created_at), c.id, c.name
        )
        SELECT 
          month,
          category_name,
          revenue,
          order_count,
          LAG(revenue) OVER (PARTITION BY category_name ORDER BY month) as prev_month_revenue,
          ROUND(
            ((revenue - LAG(revenue) OVER (PARTITION BY category_name ORDER BY month)) 
            / LAG(revenue) OVER (PARTITION BY category_name ORDER BY month) * 100), 2
          ) as growth_rate
        FROM monthly_sales
        ORDER BY month DESC, revenue DESC
      `);

      return this.processAnalyticsData(result);
    }

    private transformSalesData(rawData: any[]): SalesReportDto {
      // 数据转换逻辑 | Data transformation logic
      return {
        totalRevenue: rawData.reduce((sum, item) => sum + parseFloat(item.totalrevenue), 0),
        totalOrders: rawData.reduce((sum, item) => sum + parseInt(item.ordercount), 0),
        dailyBreakdown: rawData.map(item => ({
          date: item.saledate,
          revenue: parseFloat(item.totalrevenue),
          orderCount: parseInt(item.ordercount),
          categoryName: item.categoryname
        }))
      };
    }

    private processAnalyticsData(rawData: any[]): AnalyticsDto {
      // 高级分析数据处理 | Advanced analytics data processing
      return {
        monthlyTrends: rawData.map(item => ({
          month: item.month,
          categoryName: item.category_name,
          revenue: parseFloat(item.revenue),
          orderCount: parseInt(item.order_count),
          growthRate: item.growth_rate ? parseFloat(item.growth_rate) : null
        }))
      };
    }
  }

  // DTO定义 | DTO definitions
  export class ProductSearchDto {
    name?: string;
    categoryIds?: string[];
    priceRange?: {
      min: number;
      max: number;
    };
    sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
  }

  export class CategoryStatsDto {
    categoryId: string;
    categoryName: string;
    productCount: number;
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
    activeProductCount: number;
  }
  ```

### 3. 事务处理与数据一致性 | Transaction Processing and Data Consistency (1小时 | 1 hour)

- **数据库事务管理 | Database Transaction Management**
  
  **概念定义 | Concept Definition:**
  数据库事务是一个不可分割的数据库操作序列，遵循ACID原则(原子性、一致性、隔离性、持久性)。在NestJS中，TypeORM提供了多种事务管理方式，包括装饰器方式、手动管理和查询运行器方式。 | Database transactions are indivisible sequences of database operations that follow ACID principles (Atomicity, Consistency, Isolation, Durability). In NestJS, TypeORM provides multiple transaction management approaches, including decorator-based, manual management, and query runner approaches.
  
  **关键原则 | Key Principles:**
  - 原子性(Atomicity)：事务中的所有操作要么全部成功，要么全部回滚 | Atomicity: All operations in a transaction either succeed completely or rollback entirely
  - 一致性(Consistency)：事务执行前后数据库状态保持一致 | Consistency: Database state remains consistent before and after transaction execution
  - 隔离性(Isolation)：并发事务之间不相互干扰 | Isolation: Concurrent transactions do not interfere with each other
  - 持久性(Durability)：事务提交后的更改永久保存 | Durability: Changes are permanently saved after transaction commit
  
  **实践验证问题 | Practice Verification Questions:**
  1. 什么情况下需要使用数据库事务？| When should database transactions be used?
  2. 事务回滚如何影响相关的数据操作？| How does transaction rollback affect related data operations?
  3. 嵌套事务是如何处理的？| How are nested transactions handled?

- **事务实现策略 | Transaction Implementation Strategies**
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. @Transaction装饰器适用于哪种事务场景？| What transaction scenarios is the @Transaction decorator suitable for?
     **答案 | Answer:** 简单的方法级事务，不需要复杂控制流程 | Simple method-level transactions without complex control flow
  2. QueryRunner方式的事务有什么优势？| What advantages does QueryRunner-based transactions have?
     **答案 | Answer:** 更精细的控制和更好的错误处理 | More fine-grained control and better error handling
  3. 事务中发生异常时会自动回滚吗？| Do transactions automatically rollback when exceptions occur?
     **答案 | Answer:** 是的，未捕获的异常会触发自动回滚 | Yes, uncaught exceptions trigger automatic rollback
  4. 如何处理长时间运行的事务？| How to handle long-running transactions?
     **答案 | Answer:** 分解为较小的事务或使用批处理 | Break into smaller transactions or use batch processing
  5. 事务隔离级别如何影响并发性能？| How do transaction isolation levels affect concurrent performance?
     **答案 | Answer:** 更高的隔离级别会降低并发性能但提高数据一致性 | Higher isolation levels reduce concurrent performance but improve data consistency
  
  **复杂代码示例 | Complex Code Examples:**
  ```typescript
  @Injectable()
  export class OrderService {
    constructor(
      @InjectRepository(Order)
      private orderRepository: Repository<Order>,
      @InjectRepository(Product)
      private productRepository: Repository<Product>,
      @InjectRepository(User)
      private userRepository: Repository<User>,
      private dataSource: DataSource,
    ) {}

    // 装饰器方式事务 | Decorator-based transaction
    @Transactional()
    async createSimpleOrder(
      userId: string, 
      orderItems: CreateOrderItemDto[]
    ): Promise<Order> {
      // 验证用户 | Validate user
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException('用户不存在 | User not found');
      }

      // 创建订单 | Create order
      const order = this.orderRepository.create({
        user,
        status: 'pending',
        totalAmount: 0,
        items: []
      });

      let totalAmount = 0;
      const orderItemEntities = [];

      // 处理订单项 | Process order items
      for (const item of orderItems) {
        const product = await this.productRepository.findOne({
          where: { id: item.productId }
        });

        if (!product || product.stock < item.quantity) {
          throw new BadRequestException(`产品库存不足 | Insufficient stock for product ${item.productId}`);
        }

        // 减少库存 | Reduce stock
        product.stock -= item.quantity;
        await this.productRepository.save(product);

        const orderItem = {
          product,
          quantity: item.quantity,
          price: product.price,
          subtotal: product.price * item.quantity
        };

        orderItemEntities.push(orderItem);
        totalAmount += orderItem.subtotal;
      }

      order.items = orderItemEntities;
      order.totalAmount = totalAmount;

      return this.orderRepository.save(order);
    }

    // 手动事务管理 | Manual transaction management
    async createComplexOrder(
      userId: string,
      orderData: CreateComplexOrderDto
    ): Promise<{
      order: Order;
      appliedCoupons: Coupon[];
      loyaltyPointsEarned: number;
    }> {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // 在事务中执行所有操作 | Execute all operations within transaction
        const manager = queryRunner.manager;

        // 1. 验证和锁定用户(悲观锁) | Validate and lock user (pessimistic lock)
        const user = await manager.findOne(User, {
          where: { id: userId },
          lock: { mode: 'pessimistic_write' }
        });

        if (!user || !user.isActive) {
          throw new BadRequestException('用户不可用 | User unavailable');
        }

        // 2. 验证和处理优惠券 | Validate and process coupons
        const appliedCoupons = [];
        let totalDiscount = 0;

        if (orderData.couponCodes?.length) {
          for (const couponCode of orderData.couponCodes) {
            const coupon = await manager.findOne(Coupon, {
              where: { 
                code: couponCode, 
                isActive: true,
                expiresAt: MoreThan(new Date())
              },
              lock: { mode: 'pessimistic_write' }
            });

            if (!coupon || coupon.usageCount >= coupon.maxUsage) {
              throw new BadRequestException(`无效或已过期的优惠券: ${couponCode} | Invalid or expired coupon: ${couponCode}`);
            }

            // 更新优惠券使用次数 | Update coupon usage count
            coupon.usageCount += 1;
            await manager.save(Coupon, coupon);

            appliedCoupons.push(coupon);
            totalDiscount += coupon.discountAmount;
          }
        }

        // 3. 处理产品库存和订单项 | Process product inventory and order items
        let subtotal = 0;
        const orderItems = [];

        for (const itemData of orderData.items) {
          const product = await manager.findOne(Product, {
            where: { id: itemData.productId },
            lock: { mode: 'pessimistic_write' }
          });

          if (!product) {
            throw new BadRequestException(`产品不存在: ${itemData.productId} | Product not found: ${itemData.productId}`);
          }

          if (product.stock < itemData.quantity) {
            throw new BadRequestException(`库存不足: ${product.name} | Insufficient stock: ${product.name}`);
          }

          // 原子性库存扣减 | Atomic stock deduction
          const updateResult = await manager.update(
            Product,
            { id: product.id, stock: MoreThanOrEqual(itemData.quantity) },
            { stock: () => `stock - ${itemData.quantity}` }
          );

          if (updateResult.affected === 0) {
            throw new BadRequestException(`库存扣减失败: ${product.name} | Stock deduction failed: ${product.name}`);
          }

          const orderItem = manager.create(OrderItem, {
            product,
            quantity: itemData.quantity,
            unitPrice: product.price,
            subtotal: product.price * itemData.quantity
          });

          orderItems.push(orderItem);
          subtotal += orderItem.subtotal;
        }

        // 4. 计算最终金额 | Calculate final amount
        const finalAmount = Math.max(0, subtotal - totalDiscount);

        // 5. 检查用户余额(如果使用钱包支付) | Check user balance (if using wallet payment)
        if (orderData.paymentMethod === 'wallet') {
          if (user.walletBalance < finalAmount) {
            throw new BadRequestException('钱包余额不足 | Insufficient wallet balance');
          }

          // 扣减钱包余额 | Deduct wallet balance
          user.walletBalance -= finalAmount;
          await manager.save(User, user);
        }

        // 6. 创建订单 | Create order
        const order = manager.create(Order, {
          user,
          items: orderItems,
          subtotal,
          discountAmount: totalDiscount,
          finalAmount,
          paymentMethod: orderData.paymentMethod,
          status: 'confirmed',
          appliedCoupons
        });

        await manager.save(Order, order);

        // 7. 计算和更新积分 | Calculate and update loyalty points
        const loyaltyPointsEarned = Math.floor(finalAmount / 10); // 每10元1积分 | 1 point per 10 currency units
        user.loyaltyPoints += loyaltyPointsEarned;
        await manager.save(User, user);

        // 8. 创建积分记录 | Create loyalty points record
        const loyaltyTransaction = manager.create(LoyaltyTransaction, {
          user,
          order,
          pointsEarned: loyaltyPointsEarned,
          transactionType: 'earned',
          description: `订单消费获得积分 | Points earned from order ${order.id}`
        });

        await manager.save(LoyaltyTransaction, loyaltyTransaction);

        // 9. 发送通知(异步处理，不影响事务) | Send notifications (async, doesn't affect transaction)
        await this.scheduleOrderNotifications(order.id, manager);

        // 提交事务 | Commit transaction
        await queryRunner.commitTransaction();

        return {
          order,
          appliedCoupons,
          loyaltyPointsEarned
        };

      } catch (error) {
        // 发生错误时回滚事务 | Rollback transaction on error
        await queryRunner.rollbackTransaction();
        
        // 记录错误日志 | Log error
        console.error('订单创建失败 | Order creation failed:', {
          userId,
          error: error.message,
          stack: error.stack
        });

        // 重新抛出异常 | Re-throw exception
        throw error;
      } finally {
        // 释放连接 | Release connection
        await queryRunner.release();
      }
    }

    // 批量事务处理 | Batch transaction processing
    async processBulkOrders(bulkOrderData: BulkOrderDto[]): Promise<ProcessBulkResult> {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();

      const results = {
        successful: [],
        failed: [],
        totalProcessed: 0
      };

      // 使用保存点进行批量处理 | Use savepoints for batch processing
      await queryRunner.startTransaction();

      try {
        for (const [index, orderData] of bulkOrderData.entries()) {
          const savePointName = `order_${index}`;
          
          try {
            // 创建保存点 | Create savepoint
            await queryRunner.createSavepoint(savePointName);

            // 处理单个订单 | Process individual order
            const order = await this.processSingleOrderInTransaction(
              orderData, 
              queryRunner.manager
            );

            results.successful.push({
              index,
              orderId: order.id,
              orderData
            });

          } catch (error) {
            // 回滚到保存点 | Rollback to savepoint
            await queryRunner.rollbackToSavepoint(savePointName);

            results.failed.push({
              index,
              orderData,
              error: error.message
            });

            // 继续处理下一个订单 | Continue with next order
          } finally {
            // 释放保存点 | Release savepoint
            await queryRunner.releaseSavepoint(savePointName);
          }

          results.totalProcessed++;
        }

        // 如果有任何成功的订单，提交事务 | Commit if any orders succeeded
        if (results.successful.length > 0) {
          await queryRunner.commitTransaction();
        } else {
          await queryRunner.rollbackTransaction();
        }

        return results;

      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    }

    // 分布式事务协调(Saga模式) | Distributed transaction coordination (Saga pattern)
    async createOrderWithSaga(orderData: CreateOrderDto): Promise<Order> {
      const sagaId = uuid();
      const sagaLog = [];

      try {
        // 步骤1: 预留库存 | Step 1: Reserve inventory
        const reservationResult = await this.reserveInventory(orderData.items, sagaId);
        sagaLog.push({ action: 'reserve_inventory', data: reservationResult });

        // 步骤2: 预授权支付 | Step 2: Pre-authorize payment
        const paymentResult = await this.preAuthorizePayment(orderData.paymentInfo, sagaId);
        sagaLog.push({ action: 'preauthorize_payment', data: paymentResult });

        // 步骤3: 创建订单 | Step 3: Create order
        const order = await this.createOrderRecord(orderData, sagaId);
        sagaLog.push({ action: 'create_order', data: { orderId: order.id } });

        // 步骤4: 确认支付 | Step 4: Confirm payment
        await this.confirmPayment(paymentResult.transactionId, sagaId);
        sagaLog.push({ action: 'confirm_payment', data: { transactionId: paymentResult.transactionId } });

        // 步骤5: 确认库存扣减 | Step 5: Confirm inventory deduction
        await this.confirmInventoryDeduction(reservationResult.reservationId, sagaId);
        sagaLog.push({ action: 'confirm_inventory', data: { reservationId: reservationResult.reservationId } });

        return order;

      } catch (error) {
        // 执行补偿操作 | Execute compensation operations
        await this.executeSagaCompensation(sagaLog, sagaId);
        throw error;
      }
    }

    private async scheduleOrderNotifications(orderId: string, manager: EntityManager): Promise<void> {
      // 创建通知任务记录 | Create notification task record
      const notificationTask = manager.create(NotificationTask, {
        orderId,
        type: 'order_confirmation',
        status: 'pending',
        scheduledAt: new Date()
      });

      await manager.save(NotificationTask, notificationTask);
    }

    private async processSingleOrderInTransaction(
      orderData: any, 
      manager: EntityManager
    ): Promise<Order> {
      // 在事务中处理单个订单的业务逻辑 | Business logic for processing single order in transaction
      // 实现细节... | Implementation details...
      return null; // 返回创建的订单 | Return created order
    }

    private async executeSagaCompensation(sagaLog: any[], sagaId: string): Promise<void> {
      // 按相反顺序执行补偿操作 | Execute compensation operations in reverse order
      for (let i = sagaLog.length - 1; i >= 0; i--) {
        const logEntry = sagaLog[i];
        try {
          switch (logEntry.action) {
            case 'confirm_inventory':
              await this.compensateInventoryConfirmation(logEntry.data.reservationId);
              break;
            case 'confirm_payment':
              await this.compensatePaymentConfirmation(logEntry.data.transactionId);
              break;
            case 'create_order':
              await this.compensateOrderCreation(logEntry.data.orderId);
              break;
            case 'preauthorize_payment':
              await this.compensatePaymentPreauthorization(logEntry.data);
              break;
            case 'reserve_inventory':
              await this.compensateInventoryReservation(logEntry.data);
              break;
          }
        } catch (compensationError) {
          // 记录补偿失败，可能需要手工介入 | Log compensation failure, may require manual intervention
          console.error(`补偿操作失败 | Compensation failed for ${logEntry.action}:`, compensationError);
        }
      }
    }
  }

  // 事务相关的DTO和实体 | Transaction-related DTOs and entities
  export class CreateComplexOrderDto {
    items: Array<{
      productId: string;
      quantity: number;
    }>;
    couponCodes?: string[];
    paymentMethod: 'card' | 'wallet' | 'points';
    shippingAddress: AddressDto;
    specialInstructions?: string;
  }

  export class ProcessBulkResult {
    successful: Array<{
      index: number;
      orderId: string;
      orderData: any;
    }>;
    failed: Array<{
      index: number;
      orderData: any;
      error: string;
    }>;
    totalProcessed: number;
  }
  ```

### 4. 数据库性能优化 | Database Performance Optimization (1小时 | 1 hour)

- **索引策略与查询优化 | Index Strategy and Query Optimization**
  
  **概念定义 | Concept Definition:**
  数据库性能优化涉及通过适当的索引设计、查询优化、连接池配置等手段提升数据库操作效率。在TypeORM中，可以通过索引装饰器、查询分析、缓存策略等方式实现性能提升。 | Database performance optimization involves improving database operation efficiency through proper index design, query optimization, connection pool configuration, etc. In TypeORM, performance can be improved through index decorators, query analysis, caching strategies, etc.
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 什么类型的字段应该创建索引？| What types of fields should have indexes?
     **答案 | Answer:** 经常用于WHERE、JOIN、ORDER BY的字段 | Fields frequently used in WHERE, JOIN, ORDER BY clauses
  2. 复合索引的字段顺序重要吗？| Does the field order in composite indexes matter?
     **答案 | Answer:** 是的，应该按查询频率和选择性排序 | Yes, should be ordered by query frequency and selectivity
  3. 过多的索引会有什么负面影响？| What negative effects can too many indexes have?
     **答案 | Answer:** 增加写操作成本和存储空间 | Increase write operation costs and storage space
  4. N+1查询问题如何解决？| How to solve N+1 query problems?
     **答案 | Answer:** 使用eager loading或JOIN查询 | Use eager loading or JOIN queries
  5. 数据库连接池如何配置最优？| How to optimally configure database connection pools?
     **答案 | Answer:** 根据并发量和数据库性能调整大小 | Adjust size based on concurrency and database performance

- **实际应用示例 | Real-world Application Examples**
  
  **实际应用示例 | Real-world Application Examples:**
  ```typescript
  // 性能优化的实体设计 | Performance-optimized entity design
  @Entity('products')
  @Index(['name', 'isActive']) // 复合索引用于搜索 | Composite index for search
  @Index(['categoryId', 'createdAt']) // 分类排序索引 | Category sorting index
  @Index(['price', 'isActive']) // 价格筛选索引 | Price filtering index
  export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index() // 单字段索引 | Single field index
    name: string;

    @Column('text')
    description: string; // 不建索引的大文本 | Large text without index

    @Column('decimal', { 
      precision: 10, 
      scale: 2,
      transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value)
      }
    })
    price: number;

    @Column({ name: 'category_id' })
    @Index() // 外键索引 | Foreign key index
    categoryId: string;

    @ManyToOne(() => Category, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ default: true })
    @Index() // 状态筛选索引 | Status filtering index
    isActive: boolean;

    @CreateDateColumn()
    @Index() // 时间排序索引 | Time sorting index
    createdAt: Date;

    @Column({ nullable: true })
    @Index({ sparse: true }) // 稀疏索引，只对非null值建索引 | Sparse index, only for non-null values
    featuredAt: Date;

    // 冗余字段用于性能优化 | Redundant fields for performance optimization
    @Column('int', { default: 0 })
    reviewCount: number;

    @Column('decimal', { precision: 3, scale: 2, default: 0 })
    averageRating: number;
  }

  @Injectable()
  export class OptimizedProductService {
    constructor(
      @InjectRepository(Product)
      private productRepository: Repository<Product>,
      private dataSource: DataSource,
      private redis: Redis, // 假设使用Redis缓存 | Assuming Redis cache
    ) {}

    // 优化的分页查询 | Optimized pagination query
    async getProductsPaginated(options: {
      page: number;
      limit: number;
      category?: string;
      search?: string;
      sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
      sortOrder?: 'ASC' | 'DESC';
    }): Promise<{
      products: Product[];
      total: number;
      hasNext: boolean;
    }> {
      const cacheKey = `products:${JSON.stringify(options)}`;
      
      // 尝试从缓存获取 | Try to get from cache
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const queryBuilder = this.productRepository
        .createQueryBuilder('product')
        .select([
          'product.id',
          'product.name', 
          'product.price',
          'product.averageRating',
          'product.reviewCount',
          'product.createdAt'
        ]); // 只选择需要的字段 | Select only needed fields

      // 使用索引优化的条件 | Use index-optimized conditions
      if (options.category) {
        queryBuilder.andWhere('product.categoryId = :categoryId', {
          categoryId: options.category
        });
      }

      if (options.search) {
        // 使用全文搜索或like查询 | Use full-text search or like query
        queryBuilder.andWhere('product.name ILIKE :search', {
          search: `%${options.search}%`
        });
      }

      // 只查询活跃产品 | Only query active products
      queryBuilder.andWhere('product.isActive = true');

      // 优化的排序 | Optimized sorting
      const sortField = `product.${options.sortBy || 'createdAt'}`;
      const sortOrder = options.sortOrder || 'DESC';
      queryBuilder.orderBy(sortField, sortOrder);

      // 高效的分页 | Efficient pagination
      const offset = (options.page - 1) * options.limit;
      queryBuilder.skip(offset).take(options.limit + 1); // 多取一个判断是否有下一页 | Take one extra to check if there's a next page

      const products = await queryBuilder.getMany();
      
      // 判断是否有下一页 | Check if there's a next page
      const hasNext = products.length > options.limit;
      if (hasNext) {
        products.pop(); // 移除多取的那个 | Remove the extra one
      }

      // 获取总数(只在第一页时查询) | Get total count (only query on first page)
      let total = 0;
      if (options.page === 1) {
        const countQueryBuilder = this.productRepository
          .createQueryBuilder('product')
          .select('COUNT(*)', 'count');

        // 应用相同的筛选条件 | Apply same filtering conditions
        if (options.category) {
          countQueryBuilder.andWhere('product.categoryId = :categoryId', {
            categoryId: options.category
          });
        }
        if (options.search) {
          countQueryBuilder.andWhere('product.name ILIKE :search', {
            search: `%${options.search}%`
          });
        }
        countQueryBuilder.andWhere('product.isActive = true');

        const result = await countQueryBuilder.getRawOne();
        total = parseInt(result.count);
      }

      const result = { products, total, hasNext };

      // 缓存结果5分钟 | Cache result for 5 minutes
      await this.redis.setex(cacheKey, 300, JSON.stringify(result));

      return result;
    }

    // 批量更新优化 | Batch update optimization
    async updateProductRatings(): Promise<void> {
      // 使用原生SQL进行批量更新 | Use native SQL for batch updates
      await this.dataSource.query(`
        UPDATE products 
        SET 
          review_count = subquery.review_count,
          average_rating = subquery.avg_rating,
          updated_at = CURRENT_TIMESTAMP
        FROM (
          SELECT 
            product_id,
            COUNT(*) as review_count,
            ROUND(AVG(rating), 2) as avg_rating
          FROM reviews 
          WHERE is_active = true
          GROUP BY product_id
        ) AS subquery
        WHERE products.id = subquery.product_id
      `);

      // 清除相关缓存 | Clear related cache
      const keys = await this.redis.keys('products:*');
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    }

    // 使用物化视图进行复杂统计 | Use materialized views for complex statistics
    async refreshProductStats(): Promise<void> {
      // 创建或刷新物化视图 | Create or refresh materialized view
      await this.dataSource.query(`
        REFRESH MATERIALIZED VIEW CONCURRENTLY product_statistics;
      `);
    }

    // 数据库连接池监控 | Database connection pool monitoring
    async getConnectionPoolStats(): Promise<any> {
      const poolSize = this.dataSource.driver.master.poolSize;
      const availableConnections = this.dataSource.driver.master.available;
      const pendingConnections = this.dataSource.driver.master.pending;

      return {
        poolSize,
        availableConnections,
        pendingConnections,
        usage: ((poolSize - availableConnections) / poolSize * 100).toFixed(2) + '%'
      };
    }

    // 慢查询分析 | Slow query analysis
    async analyzeSlowQueries(): Promise<any[]> {
      // PostgreSQL慢查询分析 | PostgreSQL slow query analysis
      const slowQueries = await this.dataSource.query(`
        SELECT 
          query,
          calls,
          total_time,
          mean_time,
          stddev_time,
          rows
        FROM pg_stat_statements 
        WHERE mean_time > 100 -- 超过100ms的查询 | Queries over 100ms
        ORDER BY mean_time DESC 
        LIMIT 10;
      `);

      return slowQueries;
    }

    // 索引使用情况分析 | Index usage analysis
    async analyzeIndexUsage(): Promise<any[]> {
      const indexStats = await this.dataSource.query(`
        SELECT 
          schemaname,
          tablename,
          indexname,
          idx_tup_read,
          idx_tup_fetch,
          idx_scan
        FROM pg_stat_user_indexes
        WHERE idx_scan = 0 -- 未使用的索引 | Unused indexes
        ORDER BY schemaname, tablename;
      `);

      return indexStats;
    }
  }

  // 数据库配置优化 | Database configuration optimization
  export const optimizedDatabaseConfig = {
    type: 'postgres' as const,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    
    // 连接池优化 | Connection pool optimization
    extra: {
      max: 20,                    // 最大连接数 | Maximum connections
      min: 5,                     // 最小连接数 | Minimum connections
      acquire: 30000,             // 获取连接超时 | Connection acquire timeout
      idle: 10000,                // 连接空闲时间 | Connection idle time
      evict: 1000,                // 连接回收间隔 | Connection eviction interval
      handleDisconnects: true,    // 处理断线重连 | Handle disconnections
    },

    // 性能相关配置 | Performance-related configuration
    logging: process.env.NODE_ENV === 'development' ? 'all' : ['error'],
    maxQueryExecutionTime: 5000,   // 慢查询阈值 | Slow query threshold
    
    // 查询缓存 | Query caching
    cache: {
      type: 'redis',
      options: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        password: process.env.REDIS_PASSWORD,
      },
      duration: 300000, // 5分钟 | 5 minutes
    },
  };
  ```

### 5. 数据库迁移与版本管理 | Database Migration and Version Management (30分钟 | 30 minutes)

- **迁移策略与最佳实践 | Migration Strategy and Best Practices**
  
  **关键原则 | Key Principles:**
  - 版本化管理：每个数据库变更都有对应的迁移文件 | Version management: Each database change has a corresponding migration file
  - 可回滚性：提供向上和向下迁移能力 | Rollback capability: Provide up and down migration capabilities
  - 环境一致性：确保开发、测试、生产环境结构一致 | Environment consistency: Ensure consistent structure across dev, test, and production
  - 安全性：迁移前备份，迁移中监控 | Safety: Backup before migration, monitor during migration
  
  **实践验证问题 | Practice Verification Questions:**
  1. 如何创建一个新的迁移文件？| How to create a new migration file?
  2. 迁移失败时如何回滚？| How to rollback when migration fails?
  3. 生产环境迁移需要注意什么？| What should be noted for production migrations?

### 6. 知识巩固与最佳实践总结 | Knowledge Consolidation and Best Practices Summary (30分钟 | 30 minutes)

- **高级数据库操作最佳实践 | Advanced Database Operations Best Practices**
  
  **综合概念检查 | Comprehensive Concept Check:**
  1. 在设计实体关系时，如何平衡查询性能和数据一致性？| How to balance query performance and data consistency when designing entity relationships?
     **答案 | Answer:** 根据业务需求选择合适的关系类型和加载策略 | Choose appropriate relationship types and loading strategies based on business requirements
  2. 什么情况下应该使用事务，什么情况下可以避免？| When should transactions be used and when can they be avoided?
     **答案 | Answer:** 多表操作和数据一致性要求高时使用事务 | Use transactions for multi-table operations and high data consistency requirements
  3. 如何监控和优化数据库性能？| How to monitor and optimize database performance?
     **答案 | Answer:** 通过慢查询日志、索引分析和连接池监控 | Through slow query logs, index analysis, and connection pool monitoring
  4. 复杂查询构建器与原生SQL查询如何选择？| How to choose between complex query builders and native SQL queries?
     **答案 | Answer:** 简单查询用QueryBuilder，复杂统计用原生SQL | Use QueryBuilder for simple queries, native SQL for complex statistics
  5. 数据库迁移在团队开发中如何管理？| How to manage database migrations in team development?
     **答案 | Answer:** 版本控制迁移文件，定期同步数据库状态 | Version control migration files, regularly sync database states

## 实践项目：电商产品管理系统高级功能 | Practical Project: E-commerce Product Management System Advanced Features

### 目标 | Objective
构建一个包含复杂实体关系、事务处理、查询优化和性能监控的电商产品管理系统，综合应用本日所学的高级数据库操作概念。 | Build an e-commerce product management system with complex entity relationships, transaction processing, query optimization, and performance monitoring, comprehensively applying today's advanced database operation concepts.

### 概念应用检查 | Concept Application Check
在开始项目前，请确认对以下概念的理解 | Before starting the project, please confirm understanding of the following concepts:

1. 实体关系映射可以处理哪些类型的业务关系？| What types of business relationships can entity relationship mapping handle?
   **答案 | Answer:** 一对一(用户-资料)、一对多(分类-产品)、多对多(产品-标签)关系
2. 数据库事务在电商场景中解决什么问题？| What problems do database transactions solve in e-commerce scenarios?
   **答案 | Answer:** 订单创建时的库存扣减、支付确认、积分更新等操作的原子性
3. 查询构建器如何提升复杂搜索的性能？| How does QueryBuilder improve the performance of complex searches?
   **答案 | Answer:** 通过精确控制查询字段、JOIN方式和条件筛选减少数据传输

### 步骤 | Steps
1. 设计包含多种关系类型的实体模型 | Design entity models with multiple relationship types
2. 实现基于事务的订单处理流程 | Implement transaction-based order processing flow
3. 构建高性能的产品搜索和统计功能 | Build high-performance product search and statistics features
4. 添加数据库性能监控和优化机制 | Add database performance monitoring and optimization mechanisms
5. 实现数据库迁移和版本管理 | Implement database migration and version management

### 示例代码 | Example Code
```typescript
"""
电商产品管理系统高级功能 | E-commerce Product Management System Advanced Features
项目描述：构建包含复杂实体关系、事务处理和性能优化的完整电商产品管理系统 | Project description: Build a complete e-commerce product management system with complex entity relationships, transaction processing, and performance optimization

本项目演示以下概念的综合应用：| This project demonstrates comprehensive application of:
- 实体关系映射 | Entity relationship mapping
- 查询构建器高级应用 | Advanced QueryBuilder applications  
- 数据库事务处理 | Database transaction processing
- 性能优化策略 | Performance optimization strategies
- 数据库迁移管理 | Database migration management
"""

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
  Index,
  Repository,
  DataSource,
  QueryRunner,
  EntityManager,
} from 'typeorm';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// ==================== 实体定义 | Entity Definitions ====================

// 用户实体 | User entity
@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  walletBalance: number;

  @Column('int', { default: 0 })
  loyaltyPoints: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 一对一关系：用户资料 | OneToOne: User profile
  @OneToOne(() => UserProfile, profile => profile.user, { cascade: true })
  @JoinColumn()
  profile: UserProfile;

  // 一对多关系：订单 | OneToMany: Orders
  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  // 一对多关系：积分交易 | OneToMany: Loyalty transactions
  @OneToMany(() => LoyaltyTransaction, transaction => transaction.user)
  loyaltyTransactions: LoyaltyTransaction[];

  // 多对多关系：收藏的产品 | ManyToMany: Favorite products
  @ManyToMany(() => Product, product => product.favoriteByUsers)
  @JoinTable({
    name: 'user_favorite_products',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' }
  })
  favoriteProducts: Product[];
}

// 用户资料实体 | User profile entity
@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column('date', { nullable: true })
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'other'],
    nullable: true
  })
  gender: 'male' | 'female' | 'other';

  // 反向一对一关系 | Reverse OneToOne relationship
  @OneToOne(() => User, user => user.profile)
  user: User;
}

// 分类实体 | Category entity
@Entity('categories')
@Index(['slug'], { unique: true })
@Index(['parentId', 'isActive'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  parentId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('int', { default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  // 自引用关系：父分类 | Self-referencing: Parent category
  @ManyToOne(() => Category, category => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  // 自引用关系：子分类 | Self-referencing: Child categories
  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  // 一对多关系：产品 | OneToMany: Products
  @OneToMany(() => Product, product => product.category)
  products: Product[];
}

// 产品实体 | Product entity
@Entity('products')
@Index(['name', 'isActive'])
@Index(['categoryId', 'isActive'])
@Index(['price', 'isActive'])
@Index(['createdAt'])
@Index(['averageRating', 'reviewCount'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column('json', { nullable: true })
  specifications: Record<string, any>;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  comparePrice: number;

  @Column('int', { default: 0 })
  stock: number;

  @Column('int', { default: 0 })
  reservedStock: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column('simple-array', { nullable: true })
  imageUrls: string[];

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column('int', { default: 0 })
  reviewCount: number;

  @Column('int', { default: 0 })
  viewCount: number;

  @Column('int', { default: 0 })
  favoriteCount: number;

  @Column({ nullable: true })
  categoryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 多对一关系：分类 | ManyToOne: Category
  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // 一对多关系：评论 | OneToMany: Reviews
  @OneToMany(() => ProductReview, review => review.product)
  reviews: ProductReview[];

  // 一对多关系：订单项 | OneToMany: Order items
  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  // 多对多关系：标签 | ManyToMany: Tags
  @ManyToMany(() => ProductTag, tag => tag.products)
  @JoinTable({
    name: 'product_tag_relations',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  tags: ProductTag[];

  // 多对多关系：收藏用户 | ManyToMany: Users who favorited this product
  @ManyToMany(() => User, user => user.favoriteProducts)
  favoriteByUsers: User[];
}

// 产品标签实体 | Product tag entity
@Entity('product_tags')
@Index(['name'], { unique: true })
export class ProductTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // 多对多关系：产品 | ManyToMany: Products
  @ManyToMany(() => Product, product => product.tags)
  products: Product[];
}

// 产品评论实体 | Product review entity
@Entity('product_reviews')
@Index(['productId', 'isActive'])
@Index(['userId', 'createdAt'])
@Index(['rating'])
export class ProductReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column('int', { default: 5 })
  rating: number;

  @Column('simple-array', { nullable: true })
  imageUrls: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column('int', { default: 0 })
  helpfulCount: number;

  @Column()
  userId: string;

  @Column()
  productId: string;

  @CreateDateColumn()
  createdAt: Date;

  // 多对一关系：用户 | ManyToOne: User
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 多对一关系：产品 | ManyToOne: Product
  @ManyToOne(() => Product, product => product.reviews)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}

// 订单实体 | Order entity
@Entity('orders')
@Index(['userId', 'status'])
@Index(['status', 'createdAt'])
@Index(['orderNumber'], { unique: true })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderNumber: string;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  shippingAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  })
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  })
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';

  @Column({
    type: 'enum',
    enum: ['card', 'wallet', 'points', 'bank_transfer'],
    default: 'card'
  })
  paymentMethod: 'card' | 'wallet' | 'points' | 'bank_transfer';

  @Column('json', { nullable: true })
  shippingAddress: Record<string, any>;

  @Column('text', { nullable: true })
  notes: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 多对一关系：用户 | ManyToOne: User
  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 一对多关系：订单项 | OneToMany: Order items
  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];

  // 一对多关系：积分交易 | OneToMany: Loyalty transactions
  @OneToMany(() => LoyaltyTransaction, transaction => transaction.order)
  loyaltyTransactions: LoyaltyTransaction[];
}

// 订单项实体 | Order item entity
@Entity('order_items')
@Index(['orderId'])
@Index(['productId'])
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column()
  orderId: string;

  @Column()
  productId: string;

  // 多对一关系：订单 | ManyToOne: Order
  @ManyToOne(() => Order, order => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  // 多对一关系：产品 | ManyToOne: Product
  @ManyToOne(() => Product, product => product.orderItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}

// 积分交易实体 | Loyalty transaction entity
@Entity('loyalty_transactions')
@Index(['userId', 'createdAt'])
@Index(['transactionType'])
export class LoyaltyTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  pointsEarned: number;

  @Column('int', { default: 0 })
  pointsSpent: number;

  @Column({
    type: 'enum',
    enum: ['earned', 'spent', 'expired', 'bonus'],
    default: 'earned'
  })
  transactionType: 'earned' | 'spent' | 'expired' | 'bonus';

  @Column('text')
  description: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  orderId: string;

  @CreateDateColumn()
  createdAt: Date;

  // 多对一关系：用户 | ManyToOne: User
  @ManyToOne(() => User, user => user.loyaltyTransactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 多对一关系：订单 | ManyToOne: Order (optional)
  @ManyToOne(() => Order, order => order.loyaltyTransactions, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}

// ==================== 服务层实现 | Service Layer Implementation ====================

@Injectable()
export class AdvancedProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(ProductTag)
    private tagRepository: Repository<ProductTag>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private dataSource: DataSource,
  ) {}

  // 复杂产品搜索功能 | Complex product search functionality
  async searchProductsAdvanced(searchParams: {
    query?: string;
    categoryIds?: string[];
    tagIds?: string[];
    priceRange?: { min: number; max: number };
    rating?: number;
    inStock?: boolean;
    featured?: boolean;
    sortBy?: 'name' | 'price' | 'rating' | 'popularity' | 'newest';
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
  }): Promise<{
    products: Product[];
    total: number;
    facets: {
      categories: Array<{ id: string; name: string; count: number }>;
      tags: Array<{ id: string; name: string; count: number }>;
      priceRanges: Array<{ range: string; count: number }>;
    };
  }> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.tags', 'tags')
      .where('product.isActive = :isActive', { isActive: true });

    // 文本搜索 | Text search
    if (searchParams.query) {
      queryBuilder.andWhere(
        '(product.name ILIKE :query OR product.description ILIKE :query OR category.name ILIKE :query)',
        { query: `%${searchParams.query}%` }
      );
    }

    // 分类筛选 | Category filtering
    if (searchParams.categoryIds?.length) {
      queryBuilder.andWhere('product.categoryId IN (:...categoryIds)', {
        categoryIds: searchParams.categoryIds
      });
    }

    // 标签筛选 | Tag filtering
    if (searchParams.tagIds?.length) {
      queryBuilder.andWhere('tags.id IN (:...tagIds)', {
        tagIds: searchParams.tagIds
      });
    }

    // 价格范围筛选 | Price range filtering
    if (searchParams.priceRange) {
      queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice: searchParams.priceRange.min,
        maxPrice: searchParams.priceRange.max
      });
    }

    // 评分筛选 | Rating filtering
    if (searchParams.rating) {
      queryBuilder.andWhere('product.averageRating >= :rating', {
        rating: searchParams.rating
      });
    }

    // 库存筛选 | Stock filtering
    if (searchParams.inStock) {
      queryBuilder.andWhere('product.stock > 0');
    }

    // 精选产品筛选 | Featured products filtering
    if (searchParams.featured) {
      queryBuilder.andWhere('product.isFeatured = true');
    }

    // 排序逻辑 | Sorting logic
    switch (searchParams.sortBy) {
      case 'price':
        queryBuilder.orderBy('product.price', searchParams.sortOrder || 'ASC');
        break;
      case 'rating':
        queryBuilder.orderBy('product.averageRating', searchParams.sortOrder || 'DESC');
        break;
      case 'popularity':
        queryBuilder.orderBy('product.viewCount', 'DESC')
                    .addOrderBy('product.favoriteCount', 'DESC');
        break;
      case 'newest':
        queryBuilder.orderBy('product.createdAt', 'DESC');
        break;
      default:
        queryBuilder.orderBy('product.name', searchParams.sortOrder || 'ASC');
    }

    // 分页处理 | Pagination
    const page = searchParams.page || 1;
    const limit = searchParams.limit || 20;
    const offset = (page - 1) * limit;

    const [products, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    // 构建面向搜索的统计信息 | Build faceted search statistics
    const facets = await this.buildSearchFacets(searchParams);

    return { products, total, facets };
  }

  private async buildSearchFacets(searchParams: any) {
    // 分类统计 | Category statistics
    const categoryStats = await this.productRepository
      .createQueryBuilder('product')
      .select([
        'category.id as id',
        'category.name as name',
        'COUNT(product.id) as count'
      ])
      .innerJoin('product.category', 'category')
      .where('product.isActive = true')
      .groupBy('category.id, category.name')
      .orderBy('count', 'DESC')
      .getRawMany();

    // 标签统计 | Tag statistics
    const tagStats = await this.productRepository
      .createQueryBuilder('product')
      .select([
        'tags.id as id',
        'tags.name as name',
        'COUNT(product.id) as count'
      ])
      .innerJoin('product.tags', 'tags')
      .where('product.isActive = true')
      .groupBy('tags.id, tags.name')
      .orderBy('count', 'DESC')
      .limit(20)
      .getRawMany();

    // 价格区间统计 | Price range statistics
    const priceRangeStats = await this.productRepository
      .createQueryBuilder('product')
      .select([
        `CASE 
          WHEN product.price < 100 THEN '0-100'
          WHEN product.price < 500 THEN '100-500'
          WHEN product.price < 1000 THEN '500-1000'
          ELSE '1000+' 
         END as range`,
        'COUNT(product.id) as count'
      ])
      .where('product.isActive = true')
      .groupBy('range')
      .getRawMany();

    return {
      categories: categoryStats.map(stat => ({
        id: stat.id,
        name: stat.name,
        count: parseInt(stat.count)
      })),
      tags: tagStats.map(stat => ({
        id: stat.id,
        name: stat.name,
        count: parseInt(stat.count)
      })),
      priceRanges: priceRangeStats.map(stat => ({
        range: stat.range,
        count: parseInt(stat.count)
      }))
    };
  }

  // 事务处理：复杂订单创建 | Transaction processing: Complex order creation
  async createOrderWithTransaction(
    userId: string,
    orderData: {
      items: Array<{ productId: string; quantity: number }>;
      couponCode?: string;
      usePoints?: number;
      shippingAddress: any;
    }
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      // 1. 验证用户并锁定 | Validate and lock user
      const user = await manager.findOne(User, {
        where: { id: userId, isActive: true },
        lock: { mode: 'pessimistic_write' }
      });

      if (!user) {
        throw new NotFoundException('用户未找到 | User not found');
      }

      // 2. 验证和锁定产品库存 | Validate and lock product stock
      let subtotal = 0;
      const orderItems = [];

      for (const itemData of orderData.items) {
        const product = await manager.findOne(Product, {
          where: { id: itemData.productId, isActive: true },
          lock: { mode: 'pessimistic_write' }
        });

        if (!product) {
          throw new BadRequestException(`产品未找到: ${itemData.productId} | Product not found: ${itemData.productId}`);
        }

        const availableStock = product.stock - product.reservedStock;
        if (availableStock < itemData.quantity) {
          throw new BadRequestException(`库存不足: ${product.name} | Insufficient stock: ${product.name}`);
        }

        // 预留库存 | Reserve stock
        product.reservedStock += itemData.quantity;
        await manager.save(Product, product);

        const orderItem = {
          productId: product.id,
          quantity: itemData.quantity,
          unitPrice: product.price,
          totalPrice: product.price * itemData.quantity
        };

        orderItems.push(orderItem);
        subtotal += orderItem.totalPrice;
      }

      // 3. 处理优惠券 | Process coupon
      let discountAmount = 0;
      if (orderData.couponCode) {
        // 优惠券处理逻辑 | Coupon processing logic
        // 这里简化处理 | Simplified processing here
        discountAmount = subtotal * 0.1; // 10% 折扣 | 10% discount
      }

      // 4. 处理积分消费 | Process points consumption
      let pointsDiscount = 0;
      if (orderData.usePoints && orderData.usePoints > 0) {
        if (user.loyaltyPoints < orderData.usePoints) {
          throw new BadRequestException('积分不足 | Insufficient points');
        }

        pointsDiscount = orderData.usePoints / 10; // 10积分=1元 | 10 points = 1 currency unit
        user.loyaltyPoints -= orderData.usePoints;
        await manager.save(User, user);
      }

      // 5. 计算最终金额 | Calculate final amount
      const totalAmount = Math.max(0, subtotal - discountAmount - pointsDiscount);

      // 6. 生成订单号 | Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // 7. 创建订单 | Create order
      const order = manager.create(Order, {
        orderNumber,
        subtotal,
        discountAmount: discountAmount + pointsDiscount,
        totalAmount,
        status: 'confirmed',
        paymentStatus: 'pending',
        shippingAddress: orderData.shippingAddress,
        userId: user.id,
        items: orderItems.map(item => manager.create(OrderItem, item))
      });

      await manager.save(Order, order);

      // 8. 确认库存扣减 | Confirm stock deduction
      for (const itemData of orderData.items) {
        await manager.update(Product, 
          { id: itemData.productId },
          { 
            stock: () => `stock - ${itemData.quantity}`,
            reservedStock: () => `reserved_stock - ${itemData.quantity}`
          }
        );
      }

      // 9. 创建积分交易记录 | Create loyalty points transaction
      if (orderData.usePoints) {
        const loyaltyTransaction = manager.create(LoyaltyTransaction, {
          pointsSpent: orderData.usePoints,
          transactionType: 'spent',
          description: `订单消费积分: ${order.orderNumber} | Points spent on order: ${order.orderNumber}`,
          userId: user.id,
          orderId: order.id
        });

        await manager.save(LoyaltyTransaction, loyaltyTransaction);
      }

      // 10. 计算新获得的积分 | Calculate newly earned points
      const earnedPoints = Math.floor(totalAmount / 10);
      user.loyaltyPoints += earnedPoints;
      await manager.save(User, user);

      // 11. 创建积分获得记录 | Create points earned record
      if (earnedPoints > 0) {
        const earnedTransaction = manager.create(LoyaltyTransaction, {
          pointsEarned: earnedPoints,
          transactionType: 'earned',
          description: `订单购买获得积分: ${order.orderNumber} | Points earned from order: ${order.orderNumber}`,
          userId: user.id,
          orderId: order.id
        });

        await manager.save(LoyaltyTransaction, earnedTransaction);
      }

      // 提交事务 | Commit transaction
      await queryRunner.commitTransaction();

      // 返回完整的订单信息 | Return complete order information
      return await this.orderRepository.findOne({
        where: { id: order.id },
        relations: ['user', 'items', 'items.product']
      });

    } catch (error) {
      // 回滚事务 | Rollback transaction
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 释放连接 | Release connection
      await queryRunner.release();
    }
  }

  // 高级统计分析 | Advanced statistical analysis
  async getAdvancedAnalytics(dateRange: { start: Date; end: Date }) {
    // 销售趋势分析 | Sales trend analysis
    const salesTrend = await this.dataSource.query(`
      SELECT 
        DATE(o.created_at) as date,
        COUNT(o.id) as order_count,
        SUM(o.total_amount) as total_revenue,
        AVG(o.total_amount) as average_order_value,
        COUNT(DISTINCT o.user_id) as unique_customers
      FROM orders o
      WHERE o.created_at BETWEEN $1 AND $2
        AND o.status NOT IN ('cancelled', 'refunded')
      GROUP BY DATE(o.created_at)
      ORDER BY date ASC
    `, [dateRange.start, dateRange.end]);

    // 产品性能分析 | Product performance analysis
    const productPerformance = await this.dataSource.query(`
      SELECT 
        p.id,
        p.name,
        p.category_id,
        c.name as category_name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total_price) as total_revenue,
        COUNT(DISTINCT o.user_id) as unique_buyers,
        p.average_rating,
        p.review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.created_at BETWEEN $1 AND $2
      WHERE p.is_active = true
      GROUP BY p.id, p.name, p.category_id, c.name, p.average_rating, p.review_count
      HAVING SUM(oi.quantity) > 0
      ORDER BY total_revenue DESC
      LIMIT 50
    `, [dateRange.start, dateRange.end]);

    // 用户行为分析 | User behavior analysis
    const userBehavior = await this.dataSource.query(`
      SELECT 
        u.id,
        u.username,
        COUNT(o.id) as order_count,
        SUM(o.total_amount) as total_spent,
        AVG(o.total_amount) as avg_order_value,
        MAX(o.created_at) as last_order_date,
        u.loyalty_points,
        COUNT(DISTINCT ufp.product_id) as favorite_products_count
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id 
        AND o.created_at BETWEEN $1 AND $2 
        AND o.status NOT IN ('cancelled', 'refunded')
      LEFT JOIN user_favorite_products ufp ON u.id = ufp.user_id
      WHERE u.is_active = true
      GROUP BY u.id, u.username, u.loyalty_points
      HAVING COUNT(o.id) > 0
      ORDER BY total_spent DESC
      LIMIT 100
    `, [dateRange.start, dateRange.end]);

    return {
      salesTrend: salesTrend.map(row => ({
        date: row.date,
        orderCount: parseInt(row.order_count),
        totalRevenue: parseFloat(row.total_revenue) || 0,
        averageOrderValue: parseFloat(row.average_order_value) || 0,
        uniqueCustomers: parseInt(row.unique_customers)
      })),
      productPerformance: productPerformance.map(row => ({
        id: row.id,
        name: row.name,
        categoryId: row.category_id,
        categoryName: row.category_name,
        totalSold: parseInt(row.total_sold) || 0,
        totalRevenue: parseFloat(row.total_revenue) || 0,
        uniqueBuyers: parseInt(row.unique_buyers) || 0,
        averageRating: parseFloat(row.average_rating) || 0,
        reviewCount: parseInt(row.review_count) || 0
      })),
      userBehavior: userBehavior.map(row => ({
        id: row.id,
        username: row.username,
        orderCount: parseInt(row.order_count),
        totalSpent: parseFloat(row.total_spent) || 0,
        avgOrderValue: parseFloat(row.avg_order_value) || 0,
        lastOrderDate: row.last_order_date,
        loyaltyPoints: parseInt(row.loyalty_points),
        favoriteProductsCount: parseInt(row.favorite_products_count) || 0
      }))
    };
  }

  // 批量数据处理 | Batch data processing
  async batchUpdateProductRatings(): Promise<{ updated: number; errors: string[] }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    let updated = 0;
    const errors = [];

    try {
      // 获取需要更新评分的产品 | Get products that need rating updates
      const productsNeedingUpdate = await queryRunner.query(`
        SELECT DISTINCT p.id 
        FROM products p
        INNER JOIN product_reviews pr ON p.id = pr.product_id
        WHERE pr.created_at > p.updated_at
          OR p.average_rating = 0
      `);

      // 批量处理每个产品 | Batch process each product
      for (const product of productsNeedingUpdate) {
        const savepoint = `update_product_${product.id.replace('-', '_')}`;

        try {
          await queryRunner.createSavepoint(savepoint);

          // 计算新的评分统计 | Calculate new rating statistics
          const ratingStats = await queryRunner.query(`
            SELECT 
              COUNT(*) as review_count,
              AVG(rating) as average_rating
            FROM product_reviews
            WHERE product_id = $1 AND is_active = true
          `, [product.id]);

          const stats = ratingStats[0];
          const newReviewCount = parseInt(stats.review_count) || 0;
          const newAverageRating = parseFloat(stats.average_rating) || 0;

          // 更新产品统计信息 | Update product statistics
          await queryRunner.query(`
            UPDATE products 
            SET 
              review_count = $1,
              average_rating = $2,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
          `, [newReviewCount, newAverageRating, product.id]);

          updated++;

        } catch (error) {
          await queryRunner.rollbackToSavepoint(savepoint);
          errors.push(`产品 ${product.id} 更新失败: ${error.message}`);
        } finally {
          await queryRunner.releaseSavepoint(savepoint);
        }
      }

      return { updated, errors };

    } catch (error) {
      errors.push(`批量更新失败: ${error.message}`);
      return { updated, errors };
    } finally {
      await queryRunner.release();
    }
  }

  // 性能监控方法 | Performance monitoring methods
  async getPerformanceMetrics(): Promise<{
    slowQueries: any[];
    indexUsage: any[];
    connectionStats: any;
    tableStats: any[];
  }> {
    // 慢查询统计 | Slow query statistics
    const slowQueries = await this.dataSource.query(`
      SELECT 
        query,
        calls,
        total_time,
        mean_time,
        stddev_time
      FROM pg_stat_statements
      WHERE mean_time > 100
      ORDER BY mean_time DESC
      LIMIT 10
    `).catch(() => []);

    // 索引使用情况 | Index usage statistics
    const indexUsage = await this.dataSource.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        idx_scan,
        idx_tup_read,
        idx_tup_fetch
      FROM pg_stat_user_indexes
      ORDER BY idx_scan DESC
      LIMIT 20
    `).catch(() => []);

    // 连接池统计 | Connection pool statistics
    const connectionStats = {
      total: this.dataSource.driver.master?.poolSize || 0,
      active: this.dataSource.driver.master?.pool?._allObjects?.length || 0,
      idle: this.dataSource.driver.master?.pool?._availableObjects?.length || 0,
    };

    // 表统计信息 | Table statistics
    const tableStats = await this.dataSource.query(`
      SELECT 
        schemaname,
        tablename,
        n_tup_ins,
        n_tup_upd,
        n_tup_del,
        n_live_tup,
        n_dead_tup,
        last_vacuum,
        last_analyze
      FROM pg_stat_user_tables
      ORDER BY n_live_tup DESC
    `).catch(() => []);

    return {
      slowQueries,
      indexUsage,
      connectionStats,
      tableStats
    };
  }
}

// ==================== 控制器实现 | Controller Implementation ====================

import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';

@Controller('advanced-products')
export class AdvancedProductController {
  constructor(private readonly productService: AdvancedProductService) {}

  @Get('search')
  async searchProducts(@Query() searchParams: any) {
    return this.productService.searchProductsAdvanced(searchParams);
  }

  @Post('orders')
  async createOrder(
    @Body() orderData: any,
    @Body('userId') userId: string
  ) {
    return this.productService.createOrderWithTransaction(userId, orderData);
  }

  @Get('analytics')
  async getAnalytics(@Query() dateRange: { start: string; end: string }) {
    return this.productService.getAdvancedAnalytics({
      start: new Date(dateRange.start),
      end: new Date(dateRange.end)
    });
  }

  @Post('batch/update-ratings')
  async batchUpdateRatings() {
    return this.productService.batchUpdateProductRatings();
  }

  @Get('performance')
  async getPerformanceMetrics() {
    return this.productService.getPerformanceMetrics();
  }
}

// ==================== 模块配置 | Module Configuration ====================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      Category,
      Product,
      ProductTag,
      ProductReview,
      Order,
      OrderItem,
      LoyaltyTransaction,
    ]),
  ],
  controllers: [AdvancedProductController],
  providers: [AdvancedProductService],
  exports: [AdvancedProductService],
})
export class AdvancedProductModule {}

// ==================== 迁移示例 | Migration Example ====================

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdvancedProductTables1703001234567 implements MigrationInterface {
  name = 'CreateAdvancedProductTables1703001234567';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建所有表和索引 | Create all tables and indexes
    await queryRunner.query(`
      -- 创建用户表 | Create users table
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "username" varchar NOT NULL UNIQUE,
        "email" varchar NOT NULL UNIQUE,
        "password_hash" varchar NOT NULL,
        "wallet_balance" decimal(10,2) DEFAULT 0,
        "loyalty_points" integer DEFAULT 0,
        "is_active" boolean DEFAULT true,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- 创建索引 | Create indexes
      CREATE INDEX IF NOT EXISTS "IDX_users_email" ON "users" ("email");
      CREATE INDEX IF NOT EXISTS "IDX_users_username" ON "users" ("username");
    `);

    // 继续创建其他表... | Continue creating other tables...
    // 这里为了简洁，省略了完整的表创建语句 | Omitted complete table creation statements for brevity
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 回滚操作 | Rollback operations
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE;`);
    // 继续删除其他表... | Continue dropping other tables...
  }
}
```

### 项目完成检查 | Project Completion Check
1. 项目是否正确实现了多种类型的实体关系映射？| Does the project correctly implement multiple types of entity relationship mapping?
2. 事务处理是否确保了数据的一致性和完整性？| Does transaction processing ensure data consistency and integrity?
3. 查询构建器是否提供了高效的复杂查询功能？| Does the query builder provide efficient complex query functionality?
4. 性能优化策略是否得到有效应用？| Are performance optimization strategies effectively applied?
5. 代码是否体现了数据库操作的最佳实践？| Does the code reflect best practices for database operations?

## 扩展练习 | Extension Exercises

### 概念深化练习 | Concept Deepening Exercises

1. **实体关系设计挑战练习 | Entity Relationship Design Challenge Exercise**
   - **练习描述 | Exercise Description:** 设计一个支持多租户的博客系统，包含用户、博客、文章、评论、标签等实体，并实现复杂的权限管理关系
   - **概念检查 | Concept Check:** 如何在多对多关系中添加额外的权限字段？如何设计继承关系？
   - **学习目标 | Learning Objective:** 深入理解复杂业务场景下的实体关系设计

2. **事务边界优化练习 | Transaction Boundary Optimization Exercise**
   - **练习描述 | Exercise Description:** 重构一个包含多个微服务调用的订单处理流程，优化事务边界和补偿机制
   - **概念检查 | Concept Check:** 分布式事务的SAGA模式如何实现？如何处理部分失败？
   - **学习目标 | Learning Objective:** 掌握分布式系统中的事务处理策略

3. **查询性能调优练习 | Query Performance Tuning Exercise**
   - **练习描述 | Exercise Description:** 对一个包含千万级数据的电商系统进行查询优化，包括索引设计、查询重写、缓存策略
   - **概念检查 | Concept Check:** 复合索引的最优字段顺序如何确定？查询计划如何分析？
   - **学习目标 | Learning Objective:** 提升大数据量场景下的查询优化能力

4. **数据库连接池调优练习 | Database Connection Pool Tuning Exercise**
   - **练习描述 | Exercise Description:** 根据不同的并发场景调整数据库连接池参数，监控和分析连接池性能
   - **概念检查 | Concept Check:** 连接池大小如何根据业务负载动态调整？连接泄漏如何检测？
   - **学习目标 | Learning Objective:** 掌握生产环境下的数据库连接管理

5. **数据一致性测试练习 | Data Consistency Testing Exercise**
   - **练习描述 | Exercise Description:** 设计并实现高并发场景下的数据一致性测试，包括脏读、幻读、死锁等问题的检测
   - **概念检查 | Concept Check:** 不同隔离级别如何影响并发性能？如何检测和解决死锁？
   - **学习目标 | Learning Objective:** 深入理解数据库并发控制机制

6. **迁移策略实践练习 | Migration Strategy Practice Exercise**
   - **练习描述 | Exercise Description:** 设计一个零停机的大规模数据库迁移方案，包括数据迁移、索引重建、回滚计划
   - **概念检查 | Concept Check:** 在线迁移如何避免锁表？如何验证迁移的正确性？
   - **学习目标 | Learning Objective:** 掌握企业级数据库迁移最佳实践

7. **监控告警系统练习 | Monitoring and Alerting System Exercise**
   - **练习描述 | Exercise Description:** 构建完整的数据库性能监控和告警系统，包括慢查询监控、连接数监控、锁等待监控
   - **概念检查 | Concept Check:** 哪些指标需要实时监控？告警阈值如何设置？
   - **学习目标 | Learning Objective:** 建立完整的数据库运维监控体系

## 学习资源 | Learning Resources
- [TypeORM官方文档 - 关系映射](https://typeorm.io/relations) | [TypeORM Official Documentation - Relations]
- [数据库事务处理最佳实践](https://martinfowler.com/articles/patterns-of-distributed-systems/) | [Database Transaction Processing Best Practices]
- [PostgreSQL查询优化指南](https://www.postgresql.org/docs/current/performance-tips.html) | [PostgreSQL Query Optimization Guide]
- [数据库索引设计原理](https://use-the-index-luke.com/) | [Database Index Design Principles]

---

✅ **完成检查清单 | Completion Checklist**
- [ ] 实体关系映射理解和应用 | Entity relationship mapping understanding and application
- [ ] 一对一、一对多、多对多关系实现 | OneToOne, OneToMany, ManyToMany relationship implementation
- [ ] 查询构建器复杂查询构建 | Complex query building with QueryBuilder
- [ ] 数据库事务处理和ACID原则 | Database transaction processing and ACID principles
- [ ] 性能优化策略实施 | Performance optimization strategy implementation
- [ ] 索引设计和查询优化 | Index design and query optimization
- [ ] 连接池配置和监控 | Connection pool configuration and monitoring
- [ ] 数据库迁移管理 | Database migration management
- [ ] 实践项目完整实现 | Complete implementation of practical project
- [ ] 扩展练习至少完成3个 | At least 3 extension exercises completed

**概念掌握验证 | Concept Mastery Verification:**
在标记完成前，请确保能够正确回答本日所有CCQs，并能够独立设计和实现包含复杂关系的数据库应用系统。
Before marking as complete, ensure you can correctly answer all CCQs from today and independently design and implement database applications with complex relationships.
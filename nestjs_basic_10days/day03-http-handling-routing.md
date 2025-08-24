# NestJS入门 - 第3天：HTTP处理与路由 | NestJS Introduction - Day 3: HTTP Handling and Routing

## 学习目标 | Learning Objectives
- 掌握NestJS中的HTTP方法处理 | Master HTTP method handling in NestJS
- 理解路由参数的各种类型和使用方法 | Understand different types of route parameters and their usage
- 学会请求体验证和数据转换 | Learn request body validation and data transformation
- 掌握响应状态码和错误处理 | Master response status codes and error handling
- 实现完整的RESTful API设计 | Implement complete RESTful API design
- 理解中间件在HTTP处理中的作用 | Understand the role of middleware in HTTP processing

## 详细内容 | Detailed Content

### 1. HTTP方法与装饰器 | HTTP Methods and Decorators (1小时 | 1 hour)

- **HTTP方法装饰器 | HTTP Method Decorators**
  
  **概念定义 | Concept Definition:**
  HTTP方法装饰器是NestJS提供的用于定义控制器方法响应特定HTTP请求的装饰器，包括@Get()、@Post()、@Put()、@Delete()等 | HTTP method decorators are NestJS-provided decorators used to define controller methods that respond to specific HTTP requests, including @Get(), @Post(), @Put(), @Delete(), etc.
  
  **核心特征 | Key Characteristics:**
  - 每个装饰器对应特定的HTTP方法 | Each decorator corresponds to a specific HTTP method
  - 可以指定路由路径参数 | Can specify route path parameters
  - 支持路径模式匹配和通配符 | Support path pattern matching and wildcards
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. @Get()装饰器只能处理HTTP GET请求吗？| Does the @Get() decorator only handle HTTP GET requests?
     **答案 | Answer:** 是 | Yes - @Get()装饰器专门用于处理HTTP GET请求 | The @Get() decorator is specifically for handling HTTP GET requests
  2. 一个控制器方法可以同时使用多个HTTP方法装饰器吗？| Can a controller method use multiple HTTP method decorators simultaneously?
     **答案 | Answer:** 否 | No - 一个方法只能有一个HTTP方法装饰器 | A method can only have one HTTP method decorator
  3. @Post('/users')和@Post('users')有区别吗？| Is there a difference between @Post('/users') and @Post('users')?
     **答案 | Answer:** 否 | No - 两者效果相同，都创建相同的路由路径 | Both have the same effect, creating the same route path
  4. HTTP方法装饰器必须写在方法参数前面吗？| Must HTTP method decorators be written before method parameters?
     **答案 | Answer:** 否 | No - 装饰器写在方法定义前，不是参数前 | Decorators are written before method definition, not before parameters
  
  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
  
  @Controller('users') // 控制器基础路径 | Controller base path
  export class UsersController {
    
    @Get() // 处理 GET /users | Handle GET /users
    findAll() {
      return { message: '获取所有用户 | Get all users' };
    }
    
    @Get(':id') // 处理 GET /users/:id | Handle GET /users/:id
    findOne(@Param('id') id: string) {
      return { message: `获取用户 ${id} | Get user ${id}` };
    }
    
    @Post() // 处理 POST /users | Handle POST /users
    create(@Body() createUserDto: any) {
      return { message: '创建用户 | Create user', data: createUserDto };
    }
    
    @Put(':id') // 处理 PUT /users/:id | Handle PUT /users/:id
    update(@Param('id') id: string, @Body() updateUserDto: any) {
      return { message: `更新用户 ${id} | Update user ${id}`, data: updateUserDto };
    }
    
    @Delete(':id') // 处理 DELETE /users/:id | Handle DELETE /users/:id
    remove(@Param('id') id: string) {
      return { message: `删除用户 ${id} | Delete user ${id}` };
    }
  }
  ```
  
  **实践检查问题 | Practice Checking Questions:**
  - @Get(':id')装饰器会匹配什么样的URL路径？| What URL paths will the @Get(':id') decorator match?
    **答案 | Answer:** /users/1, /users/abc, /users/任何值 | /users/1, /users/abc, /users/any-value
  - 如果同时有@Get()和@Get(':id')，哪个优先级更高？| If there are both @Get() and @Get(':id'), which has higher priority?
    **答案 | Answer:** @Get()优先级更高，因为它是精确匹配 | @Get() has higher priority as it's an exact match
  
  **常见误区检查 | Common Misconception Checks:**
  - HTTP方法装饰器可以不传参数吗？| Can HTTP method decorators be used without parameters?
    **答案 | Answer:** 可以 | Yes - 不传参数时匹配控制器基础路径 | When no parameters are passed, it matches the controller base path
  - @Post()方法必须有@Body()参数吗？| Must @Post() methods have @Body() parameters?
    **答案 | Answer:** 不必须 | Not required - 取决于业务需要 | Depends on business requirements

- **路由路径模式 | Route Path Patterns**
  
  **概念定义 | Concept Definition:**
  路由路径模式是定义URL路径结构的规则，支持参数化路径、通配符匹配和正则表达式验证 | Route path patterns are rules that define URL path structures, supporting parameterized paths, wildcard matching, and regex validation
  
  **核心特征 | Key Characteristics:**
  - 支持路径参数(:id)和查询参数(?page=1) | Support path parameters (:id) and query parameters (?page=1)
  - 可使用通配符(*)进行模糊匹配 | Can use wildcards (*) for fuzzy matching
  - 支持正则表达式约束参数格式 | Support regex constraints for parameter format
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 路径参数:id可以匹配数字和字符串吗？| Can path parameter :id match both numbers and strings?
     **答案 | Answer:** 是 | Yes - 默认情况下路径参数匹配任何非'/'字符 | By default, path parameters match any non-'/' characters
  2. @Get('users/*')会匹配'/users/profile/settings'吗？| Will @Get('users/*') match '/users/profile/settings'?
     **答案 | Answer:** 是 | Yes - 通配符匹配任意子路径 | Wildcards match any sub-paths
  3. 可以在一个路径中使用多个参数吗？| Can multiple parameters be used in one path?
     **答案 | Answer:** 是 | Yes - 如@Get('users/:userId/posts/:postId') | Yes - like @Get('users/:userId/posts/:postId')
  4. 路径参数的名称必须和方法参数名相同吗？| Must path parameter names match method parameter names?
     **答案 | Answer:** 是 | Yes - 通过@Param('参数名')进行绑定 | Yes - bound through @Param('paramName')

### 2. 路由参数处理 | Route Parameter Handling (1小时 | 1 hour)

- **路径参数与查询参数 | Path Parameters and Query Parameters**
  
  **概念定义 | Concept Definition:**
  路径参数是URL路径中的动态部分(如/users/:id中的id)，查询参数是URL?后的键值对参数(如?page=1&limit=10) | Path parameters are dynamic parts of the URL path (like id in /users/:id), while query parameters are key-value pairs after ? in the URL (like ?page=1&limit=10)
  
  **与基础概念的关系 | Relationship to Basic Concepts:**
  路径参数基于HTTP方法装饰器的路径定义，查询参数是HTTP请求的标准组成部分 | Path parameters are based on path definitions in HTTP method decorators, while query parameters are standard components of HTTP requests
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. @Param()和@Query()装饰器的作用有什么不同？| What's the difference between @Param() and @Query() decorators?
     **答案 | Answer:** @Param()提取路径参数，@Query()提取查询参数 | @Param() extracts path parameters, @Query() extracts query parameters
  2. 查询参数是必需的吗？| Are query parameters required?
     **答案 | Answer:** 否 | No - 查询参数是可选的，可以有默认值 | Query parameters are optional and can have default values
  3. 路径参数可以为空吗？| Can path parameters be empty?
     **答案 | Answer:** 否 | No - 空的路径参数会导致路由不匹配 | Empty path parameters would cause route mismatch
  4. @Param()可以不指定参数名称吗？| Can @Param() be used without specifying parameter names?
     **答案 | Answer:** 可以 | Yes - 不指定时返回所有路径参数对象 | When not specified, returns all path parameters as an object
  5. 查询参数的类型总是字符串吗？| Are query parameters always strings?
     **答案 | Answer:** 是 | Yes - 需要手动转换为其他类型 | Yes - need manual conversion to other types
  
  **复杂代码示例 | Complex Code Examples:**
  ```typescript
  import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
  
  // 定义数据传输对象 | Define Data Transfer Objects
  interface PaginationQuery {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
  }
  
  interface UserFilterQuery extends PaginationQuery {
    status?: 'active' | 'inactive';
    role?: string;
    search?: string;
  }
  
  @Controller('api/users')
  export class UsersController {
    
    // 复杂查询参数处理 | Complex query parameter handling
    @Get()
    findAll(@Query() query: UserFilterQuery) {
      // 查询参数默认处理 | Default query parameter processing
      const {
        page = 1,
        limit = 10,
        sort = 'createdAt',
        order = 'DESC',
        status,
        role,
        search
      } = query;
      
      // 构建过滤条件 | Build filter conditions
      const filters: any = {};
      if (status) filters.status = status;
      if (role) filters.role = role;
      if (search) filters.search = search;
      
      return {
        message: '获取用户列表 | Get user list',
        data: {
          users: [], // 模拟用户数据 | Mock user data
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: 100,
            totalPages: Math.ceil(100 / Number(limit))
          },
          filters,
          sort: { field: sort, order }
        }
      };
    }
    
    // 单个路径参数处理 | Single path parameter handling
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      // ParseIntPipe确保id是数字类型 | ParseIntPipe ensures id is a number
      return {
        message: `获取用户详情 | Get user details`,
        data: {
          id,
          name: `User ${id}`,
          email: `user${id}@example.com`
        }
      };
    }
    
    // 多层路径参数处理 | Multi-level path parameter handling
    @Get(':userId/posts/:postId')
    getUserPost(
      @Param('userId', ParseIntPipe) userId: number,
      @Param('postId', ParseIntPipe) postId: number,
      @Query() query: { include?: string } = {}
    ) {
      const { include = '' } = query;
      const includeParts = include.split(',').filter(Boolean);
      
      return {
        message: '获取用户文章 | Get user post',
        data: {
          userId,
          postId,
          post: {
            id: postId,
            title: `Post ${postId} by User ${userId}`,
            authorId: userId
          },
          includes: includeParts
        }
      };
    }
    
    // 获取所有参数的示例 | Example of getting all parameters
    @Get('profile/:id/settings/:section')
    getUserSettings(
      @Param() params: Record<string, string>, // 获取所有路径参数 | Get all path parameters
      @Query() query: Record<string, any> // 获取所有查询参数 | Get all query parameters
    ) {
      return {
        message: '获取用户设置 | Get user settings',
        pathParams: params, // { id: '1', section: 'privacy' }
        queryParams: query // { tab: 'general', lang: 'en' }
      };
    }
  }
  ```
  
  **综合应用检查 | Comprehensive Application Check:**
  - 如何处理可选的路径参数？| How to handle optional path parameters?
  - 查询参数的类型转换最佳实践是什么？| What are best practices for query parameter type conversion?
  - 如何验证路径参数的格式？| How to validate path parameter formats?

### 3. 请求体处理与验证 | Request Body Handling and Validation (1小时 | 1 hour)

- **请求体数据绑定 | Request Body Data Binding**
  
  **概念定义 | Concept Definition:**
  请求体数据绑定是将HTTP请求中的JSON/XML等格式数据自动映射到TypeScript对象的过程，通过@Body()装饰器实现 | Request body data binding is the process of automatically mapping JSON/XML format data from HTTP requests to TypeScript objects through the @Body() decorator
  
  **解决的问题 | Problems It Solves:**
  - 自动化数据解析和类型转换 | Automated data parsing and type conversion
  - 提供类型安全的数据访问 | Provide type-safe data access
  - 统一的数据验证和错误处理 | Unified data validation and error handling
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. @Body()装饰器可以获取部分请求体数据吗？| Can the @Body() decorator get partial request body data?
     **答案 | Answer:** 可以 | Yes - 通过@Body('fieldName')获取特定字段 | Yes - get specific fields through @Body('fieldName')
  2. 请求体必须是JSON格式吗？| Must the request body be in JSON format?
     **答案 | Answer:** 不必须 | Not required - 支持多种格式，取决于Content-Type | Support multiple formats, depends on Content-Type
  3. NestJS会自动验证请求体数据类型吗？| Does NestJS automatically validate request body data types?
     **答案 | Answer:** 否 | No - 需要使用ValidationPipe和class-validator | Need to use ValidationPipe and class-validator
  4. 空的请求体会导致错误吗？| Will an empty request body cause errors?
     **答案 | Answer:** 不会 | No - @Body()返回undefined或空对象 | No - @Body() returns undefined or empty object
  
  **实际应用示例 | Real-world Application Examples:**
  ```typescript
  import { Controller, Post, Put, Body, Param, ValidationPipe, UsePipes } from '@nestjs/common';
  import { IsEmail, IsString, IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator';
  import { Transform } from 'class-transformer';
  
  // 数据传输对象定义 | Data Transfer Object definitions
  export class CreateUserDto {
    @IsString({ message: '姓名必须是字符串 | Name must be a string' })
    @Transform(({ value }) => value?.trim()) // 自动去除空格 | Automatically trim spaces
    name: string;
    
    @IsEmail({}, { message: '请输入有效的邮箱地址 | Please enter a valid email address' })
    @Transform(({ value }) => value?.toLowerCase()) // 自动转换小写 | Automatically convert to lowercase
    email: string;
    
    @IsInt({ message: '年龄必须是整数 | Age must be an integer' })
    @Min(18, { message: '年龄不能小于18岁 | Age cannot be less than 18' })
    @Max(120, { message: '年龄不能超过120岁 | Age cannot exceed 120' })
    age: number;
    
    @IsOptional()
    @IsString()
    phone?: string;
    
    @IsEnum(['admin', 'user', 'moderator'], {
      message: '角色必须是admin、user或moderator中的一个 | Role must be one of: admin, user, moderator'
    })
    role: 'admin' | 'user' | 'moderator';
  }
  
  export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: '姓名必须是字符串 | Name must be a string' })
    @Transform(({ value }) => value?.trim())
    name?: string;
    
    @IsOptional()
    @IsEmail({}, { message: '请输入有效的邮箱地址 | Please enter a valid email address' })
    @Transform(({ value }) => value?.toLowerCase())
    email?: string;
    
    @IsOptional()
    @IsInt({ message: '年龄必须是整数 | Age must be an integer' })
    @Min(18, { message: '年龄不能小于18岁 | Age cannot be less than 18' })
    @Max(120, { message: '年龄不能超过120岁 | Age cannot exceed 120' })
    age?: number;
    
    @IsOptional()
    @IsString()
    phone?: string;
  }
  
  @Controller('users')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // 启用全局验证 | Enable global validation
  export class UsersController {
    
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
      try {
        // 模拟业务逻辑 | Simulate business logic
        console.log('Received data:', createUserDto);
        
        // 模拟数据库保存 | Simulate database save
        const newUser = {
          id: Date.now(),
          ...createUserDto,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        return {
          success: true,
          message: '用户创建成功 | User created successfully',
          data: newUser
        };
      } catch (error) {
        return {
          success: false,
          message: '用户创建失败 | User creation failed',
          error: error.message
        };
      }
    }
    
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateUserDto: UpdateUserDto
    ) {
      try {
        // 验证用户是否存在 | Validate if user exists
        const existingUser = { id, name: 'Existing User' }; // 模拟查询 | Mock query
        
        if (!existingUser) {
          return {
            success: false,
            message: `用户 ${id} 不存在 | User ${id} not found`,
            statusCode: 404
          };
        }
        
        // 合并更新数据 | Merge update data
        const updatedUser = {
          ...existingUser,
          ...updateUserDto,
          updatedAt: new Date()
        };
        
        return {
          success: true,
          message: '用户更新成功 | User updated successfully',
          data: updatedUser
        };
      } catch (error) {
        return {
          success: false,
          message: '用户更新失败 | User update failed',
          error: error.message
        };
      }
    }
    
    // 部分数据更新示例 | Partial data update example
    @Post('profile')
    updateProfile(@Body('profile') profile: { avatar?: string; bio?: string }) {
      return {
        message: '个人资料更新成功 | Profile updated successfully',
        profile
      };
    }
  }
  ```

### 4. 响应状态码与错误处理 | Response Status Codes and Error Handling (1小时 | 1 hour)

- **HTTP状态码管理 | HTTP Status Code Management**
  
  **多概念整合 | Multi-concept Integration:**
  HTTP状态码管理结合了错误处理、响应格式化和业务逻辑验证，为客户端提供标准化的API响应 | HTTP status code management combines error handling, response formatting, and business logic validation to provide standardized API responses to clients
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. @HttpCode()装饰器和抛出HttpException哪个优先级更高？| Which has higher priority: @HttpCode() decorator or throwing HttpException?
     **答案 | Answer:** HttpException优先级更高 | HttpException has higher priority - 异常会覆盖装饰器设定的状态码 | Exception overrides decorator-set status codes
  2. NestJS的默认错误过滤器会处理所有异常吗？| Does NestJS's default error filter handle all exceptions?
     **答案 | Answer:** 是 | Yes - 包括HTTP异常和未处理的其他异常 | Yes - includes HTTP exceptions and other unhandled exceptions
  3. 自定义异常过滤器可以修改响应格式吗？| Can custom exception filters modify response formats?
     **答案 | Answer:** 可以 | Yes - 完全控制错误响应的结构和内容 | Yes - full control over error response structure and content
  4. 什么时候应该使用HttpStatus枚举而不是直接写状态码？| When should HttpStatus enum be used instead of writing status codes directly?
     **答案 | Answer:** 总是使用枚举 | Always use enum - 提高代码可读性和维护性 | Always use enum - improves code readability and maintainability
  
  ```typescript
  import { 
    Controller, Get, Post, Put, Delete, Body, Param, 
    HttpCode, HttpStatus, HttpException, NotFoundException,
    BadRequestException, ConflictException, InternalServerErrorException,
    UseFilters, ExceptionFilter, Catch, ArgumentsHost
  } from '@nestjs/common';
  import { Response } from 'express';
  
  // 自定义异常类 | Custom Exception Classes
  export class UserNotFoundError extends NotFoundException {
    constructor(userId: string) {
      super({
        message: `用户 ${userId} 不存在 | User ${userId} not found`,
        error: 'USER_NOT_FOUND',
        statusCode: 404,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  export class DuplicateEmailError extends ConflictException {
    constructor(email: string) {
      super({
        message: `邮箱 ${email} 已被使用 | Email ${email} already in use`,
        error: 'DUPLICATE_EMAIL',
        statusCode: 409,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // 全局异常过滤器 | Global Exception Filter
  @Catch()
  export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest();
      
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = '内部服务器错误 | Internal Server Error';
      let error = 'INTERNAL_ERROR';
      
      // 处理HTTP异常 | Handle HTTP Exceptions
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as any;
        
        if (typeof exceptionResponse === 'object') {
          message = exceptionResponse.message || exception.message;
          error = exceptionResponse.error || 'HTTP_EXCEPTION';
        } else {
          message = exceptionResponse;
        }
      }
      
      // 统一错误响应格式 | Unified error response format
      const errorResponse = {
        success: false,
        statusCode: status,
        error,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method
      };
      
      response.status(status).json(errorResponse);
    }
  }
  
  @Controller('users')
  @UseFilters(new GlobalExceptionFilter()) // 应用异常过滤器 | Apply exception filter
  export class UsersController {
    private users = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ];
    
    @Get()
    @HttpCode(HttpStatus.OK) // 明确设置状态码 | Explicitly set status code
    findAll() {
      return {
        success: true,
        message: '用户列表获取成功 | User list retrieved successfully',
        data: this.users,
        total: this.users.length
      };
    }
    
    @Get(':id')
    findOne(@Param('id') id: string) {
      const user = this.users.find(u => u.id === id);
      
      if (!user) {
        // 抛出自定义异常 | Throw custom exception
        throw new UserNotFoundError(id);
      }
      
      return {
        success: true,
        message: '用户详情获取成功 | User details retrieved successfully',
        data: user
      };
    }
    
    @Post()
    @HttpCode(HttpStatus.CREATED) // 创建成功返回201 | Return 201 for successful creation
    create(@Body() createUserDto: { name: string; email: string }) {
      // 检查邮箱是否已存在 | Check if email already exists
      const existingUser = this.users.find(u => u.email === createUserDto.email);
      if (existingUser) {
        throw new DuplicateEmailError(createUserDto.email);
      }
      
      // 简单的数据验证 | Simple data validation
      if (!createUserDto.name || !createUserDto.email) {
        throw new BadRequestException({
          message: '姓名和邮箱为必填字段 | Name and email are required fields',
          error: 'VALIDATION_ERROR',
          fields: ['name', 'email']
        });
      }
      
      const newUser = {
        id: (this.users.length + 1).toString(),
        ...createUserDto
      };
      
      this.users.push(newUser);
      
      return {
        success: true,
        message: '用户创建成功 | User created successfully',
        data: newUser
      };
    }
    
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: { name?: string; email?: string }) {
      const userIndex = this.users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        throw new UserNotFoundError(id);
      }
      
      // 检查邮箱冲突(如果要更新邮箱) | Check email conflict (if updating email)
      if (updateUserDto.email) {
        const emailExists = this.users.some(u => u.id !== id && u.email === updateUserDto.email);
        if (emailExists) {
          throw new DuplicateEmailError(updateUserDto.email);
        }
      }
      
      // 更新用户信息 | Update user information
      this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
      
      return {
        success: true,
        message: '用户更新成功 | User updated successfully',
        data: this.users[userIndex]
      };
    }
    
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // 删除成功返回204 | Return 204 for successful deletion
    remove(@Param('id') id: string) {
      const userIndex = this.users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        throw new UserNotFoundError(id);
      }
      
      this.users.splice(userIndex, 1);
      
      // 204状态码通常不返回响应体 | 204 status usually doesn't return response body
      return;
    }
    
    // 演示服务器错误处理 | Demonstrate server error handling
    @Get('error/server')
    serverError() {
      // 模拟服务器内部错误 | Simulate internal server error
      throw new InternalServerErrorException({
        message: '服务器内部错误 | Internal server error occurred',
        error: 'DATABASE_CONNECTION_FAILED',
        details: '无法连接到数据库 | Unable to connect to database'
      });
    }
    
    // 演示业务逻辑错误 | Demonstrate business logic error
    @Post(':id/activate')
    activate(@Param('id') id: string) {
      const user = this.users.find(u => u.id === id);
      
      if (!user) {
        throw new UserNotFoundError(id);
      }
      
      // 模拟业务规则验证 | Simulate business rule validation
      if (user.email.endsWith('@blocked.com')) {
        throw new BadRequestException({
          message: '该邮箱域名已被禁用 | This email domain is blocked',
          error: 'BLOCKED_EMAIL_DOMAIN',
          domain: user.email.split('@')[1]
        });
      }
      
      return {
        success: true,
        message: '用户激活成功 | User activated successfully',
        data: { ...user, status: 'active' }
      };
    }
  }
  ```

### 5. 中间件与拦截器 | Middleware and Interceptors (30分钟 | 30 minutes)

- **HTTP请求处理管道 | HTTP Request Processing Pipeline**
  
  **关键原则 | Key Principles:**
  - 中间件在路由处理器之前执行 | Middleware executes before route handlers
  - 拦截器可以在请求处理前后执行 | Interceptors can execute before and after request processing
  - 管道用于数据转换和验证 | Pipes are used for data transformation and validation
  
  **实践验证问题 | Practice Verification Questions:**
  1. 中间件和拦截器的执行顺序是什么？| What's the execution order of middleware and interceptors?
     **答案 | Answer:** 中间件 → 守卫 → 拦截器(前) → 管道 → 路由处理器 → 拦截器(后) | Middleware → Guards → Interceptors(before) → Pipes → Route Handler → Interceptors(after)
  2. 全局中间件如何注册？| How to register global middleware?
     **答案 | Answer:** 在main.ts中使用app.use()或在模块中配置 | Use app.use() in main.ts or configure in modules
  3. 拦截器可以修改响应数据吗？| Can interceptors modify response data?
     **答案 | Answer:** 可以 | Yes - 通过RxJS操作符转换响应流 | Yes - transform response stream through RxJS operators

### 6. API文档与测试 | API Documentation and Testing (30分钟 | 30 minutes)

- **Swagger/OpenAPI集成 | Swagger/OpenAPI Integration**
  
  **综合概念检查 | Comprehensive Concept Check:**
  1. Swagger装饰器需要和验证装饰器一起使用吗？| Do Swagger decorators need to be used together with validation decorators?
     **答案 | Answer:** 不必须但推荐 | Not required but recommended - 保持文档和验证的一致性 | Maintain consistency between documentation and validation
  2. @ApiResponse装饰器可以定义多个响应状态吗？| Can @ApiResponse decorator define multiple response statuses?
     **答案 | Answer:** 可以 | Yes - 为每个状态码使用单独的装饰器 | Yes - use separate decorators for each status code
  3. 如何在Swagger中隐藏某些API端点？| How to hide certain API endpoints in Swagger?
     **答案 | Answer:** 使用@ApiExcludeEndpoint()装饰器 | Use @ApiExcludeEndpoint() decorator
  4. OpenAPI规范支持请求示例吗？| Does OpenAPI specification support request examples?
     **答案 | Answer:** 支持 | Yes - 通过@ApiBody()和example属性 | Yes - through @ApiBody() and example property
  5. 如何为查询参数生成文档？| How to generate documentation for query parameters?
     **答案 | Answer:** 使用@ApiQuery()装饰器 | Use @ApiQuery() decorator

## 实践项目：用户管理API系统 | Practical Project: User Management API System

### 目标 | Objective
构建一个完整的用户管理RESTful API，综合应用HTTP方法、路由参数、请求验证、错误处理和API文档等概念 | Build a complete user management RESTful API that comprehensively applies HTTP methods, route parameters, request validation, error handling, and API documentation concepts

### 概念应用检查 | Concept Application Check
在开始项目前，请确认对以下概念的理解 | Before starting the project, please confirm understanding of the following concepts:

1. HTTP方法装饰器如何绑定特定的请求类型？| How do HTTP method decorators bind specific request types?
   **答案 | Answer:** 通过@Get()、@Post()等装饰器将方法与HTTP请求方法关联 | Through @Get(), @Post() decorators to associate methods with HTTP request methods
2. 路径参数和查询参数在控制器方法中如何获取？| How to retrieve path parameters and query parameters in controller methods?
   **答案 | Answer:** 使用@Param()获取路径参数，@Query()获取查询参数 | Use @Param() for path parameters, @Query() for query parameters
3. ValidationPipe如何与DTO类配合进行数据验证？| How does ValidationPipe work with DTO classes for data validation?
   **答案 | Answer:** ValidationPipe读取DTO类上的验证装饰器，自动验证请求数据 | ValidationPipe reads validation decorators on DTO classes to automatically validate request data

### 步骤 | Steps
1. 设计RESTful API端点结构 | Design RESTful API endpoint structure
2. 创建数据传输对象(DTO)和验证规则 | Create Data Transfer Objects (DTO) and validation rules
3. 实现控制器方法和路由处理 | Implement controller methods and route handling
4. 添加错误处理和状态码管理 | Add error handling and status code management
5. 集成Swagger API文档 | Integrate Swagger API documentation

### 示例代码 | Example Code
```typescript
"""
用户管理API系统 | User Management API System
完整的RESTful API实现，展示HTTP处理与路由的核心概念 | Complete RESTful API implementation demonstrating core concepts of HTTP handling and routing

本项目演示以下概念的综合应用：| This project demonstrates comprehensive application of:
- HTTP方法装饰器(@Get, @Post, @Put, @Delete) | HTTP method decorators (@Get, @Post, @Put, @Delete)
- 路由参数处理(@Param, @Query, @Body) | Route parameter handling (@Param, @Query, @Body)
- 请求验证和数据转换 | Request validation and data transformation
- 响应状态码和错误处理 | Response status codes and error handling
- API文档生成 | API documentation generation
"""

// 1. 安装必要依赖 | Install necessary dependencies
// npm install @nestjs/common @nestjs/core @nestjs/platform-express
// npm install class-validator class-transformer
// npm install @nestjs/swagger swagger-ui-express

// 2. 数据传输对象定义 | Data Transfer Object definitions
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsInt, Min, Max, IsEnum, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    description: '用户姓名 | User name',
    example: 'John Doe',
    minLength: 2,
    maxLength: 50
  })
  @IsNotEmpty({ message: '姓名不能为空 | Name cannot be empty' })
  @IsString({ message: '姓名必须是字符串 | Name must be a string' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: '用户邮箱 | User email',
    example: 'john.doe@example.com',
    format: 'email'
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址 | Please enter a valid email address' })
  @Transform(({ value }) => value?.toLowerCase())
  email: string;

  @ApiProperty({
    description: '用户年龄 | User age',
    example: 25,
    minimum: 18,
    maximum: 120
  })
  @IsInt({ message: '年龄必须是整数 | Age must be an integer' })
  @Min(18, { message: '年龄不能小于18岁 | Age cannot be less than 18' })
  @Max(120, { message: '年龄不能超过120岁 | Age cannot exceed 120' })
  age: number;

  @ApiPropertyOptional({
    description: '用户角色 | User role',
    enum: ['admin', 'user', 'moderator'],
    default: 'user'
  })
  @IsOptional()
  @IsEnum(['admin', 'user', 'moderator'], {
    message: '角色必须是admin、user或moderator中的一个 | Role must be one of: admin, user, moderator'
  })
  role?: 'admin' | 'user' | 'moderator' = 'user';

  @ApiPropertyOptional({
    description: '用户电话 | User phone',
    example: '+86-138-0000-0000'
  })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: '用户姓名 | User name' })
  @IsOptional()
  @IsString({ message: '姓名必须是字符串 | Name must be a string' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiPropertyOptional({ description: '用户邮箱 | User email' })
  @IsOptional()
  @IsEmail({}, { message: '请输入有效的邮箱地址 | Please enter a valid email address' })
  @Transform(({ value }) => value?.toLowerCase())
  email?: string;

  @ApiPropertyOptional({ description: '用户年龄 | User age' })
  @IsOptional()
  @IsInt({ message: '年龄必须是整数 | Age must be an integer' })
  @Min(18, { message: '年龄不能小于18岁 | Age cannot be less than 18' })
  @Max(120, { message: '年龄不能超过120岁 | Age cannot exceed 120' })
  age?: number;

  @ApiPropertyOptional({ description: '用户电话 | User phone' })
  @IsOptional()
  @IsString()
  phone?: string;
}

// 3. 控制器实现 | Controller implementation
import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  HttpCode, HttpStatus, ValidationPipe, UsePipes,
  NotFoundException, BadRequestException, ConflictException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('用户管理 | User Management')
@Controller('api/users')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
export class UsersController {
  private users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', age: 30, role: 'admin' as const, phone: '+1-555-0101' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 25, role: 'user' as const, phone: '+1-555-0102' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 35, role: 'moderator' as const }
  ];

  @Get()
  @ApiOperation({ summary: '获取用户列表 | Get user list' })
  @ApiQuery({ name: 'page', required: false, description: '页码 | Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量 | Items per page', example: 10 })
  @ApiQuery({ name: 'role', required: false, description: '角色过滤 | Filter by role', enum: ['admin', 'user', 'moderator'] })
  @ApiQuery({ name: 'search', required: false, description: '搜索关键词 | Search keyword' })
  @ApiResponse({ 
    status: 200, 
    description: '成功返回用户列表 | Successfully return user list'
  })
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('role') role?: 'admin' | 'user' | 'moderator',
    @Query('search') search?: string
  ) {
    let filteredUsers = [...this.users];

    // 角色过滤 | Filter by role
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // 搜索过滤 | Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // 分页处理 | Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // 最大限制100 | Max limit 100
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      success: true,
      message: '用户列表获取成功 | User list retrieved successfully',
      data: paginatedUsers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limitNum)
      }
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情 | Get user details' })
  @ApiParam({ name: 'id', description: '用户ID | User ID', example: '1' })
  @ApiResponse({ 
    status: 200, 
    description: '成功返回用户详情 | Successfully return user details'
  })
  @ApiResponse({ 
    status: 404, 
    description: '用户不存在 | User not found'
  })
  findOne(@Param('id') id: string) {
    const user = this.users.find(u => u.id === id);
    
    if (!user) {
      throw new NotFoundException({
        message: `用户 ${id} 不存在 | User ${id} not found`,
        error: 'USER_NOT_FOUND',
        statusCode: 404
      });
    }

    return {
      success: true,
      message: '用户详情获取成功 | User details retrieved successfully',
      data: user
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '创建新用户 | Create new user' })
  @ApiResponse({ 
    status: 201, 
    description: '用户创建成功 | User created successfully'
  })
  @ApiResponse({ 
    status: 400, 
    description: '请求数据无效 | Invalid request data'
  })
  @ApiResponse({ 
    status: 409, 
    description: '邮箱已存在 | Email already exists'
  })
  create(@Body() createUserDto: CreateUserDto) {
    // 检查邮箱唯一性 | Check email uniqueness
    const existingUser = this.users.find(u => u.email === createUserDto.email);
    if (existingUser) {
      throw new ConflictException({
        message: `邮箱 ${createUserDto.email} 已被使用 | Email ${createUserDto.email} already in use`,
        error: 'DUPLICATE_EMAIL',
        statusCode: 409
      });
    }

    // 创建新用户 | Create new user
    const newUser = {
      id: (this.users.length + 1).toString(),
      ...createUserDto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users.push(newUser);

    return {
      success: true,
      message: '用户创建成功 | User created successfully',
      data: newUser
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新用户信息 | Update user information' })
  @ApiParam({ name: 'id', description: '用户ID | User ID' })
  @ApiResponse({ 
    status: 200, 
    description: '用户更新成功 | User updated successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: '用户不存在 | User not found'
  })
  @ApiResponse({ 
    status: 409, 
    description: '邮箱冲突 | Email conflict'
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw new NotFoundException({
        message: `用户 ${id} 不存在 | User ${id} not found`,
        error: 'USER_NOT_FOUND',
        statusCode: 404
      });
    }

    // 检查邮箱冲突 | Check email conflict
    if (updateUserDto.email) {
      const emailExists = this.users.some(u => u.id !== id && u.email === updateUserDto.email);
      if (emailExists) {
        throw new ConflictException({
          message: `邮箱 ${updateUserDto.email} 已被使用 | Email ${updateUserDto.email} already in use`,
          error: 'DUPLICATE_EMAIL',
          statusCode: 409
        });
      }
    }

    // 更新用户 | Update user
    this.users[userIndex] = { 
      ...this.users[userIndex], 
      ...updateUserDto,
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      message: '用户更新成功 | User updated successfully',
      data: this.users[userIndex]
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除用户 | Delete user' })
  @ApiParam({ name: 'id', description: '用户ID | User ID' })
  @ApiResponse({ 
    status: 204, 
    description: '用户删除成功 | User deleted successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: '用户不存在 | User not found'
  })
  remove(@Param('id') id: string) {
    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw new NotFoundException({
        message: `用户 ${id} 不存在 | User ${id} not found`,
        error: 'USER_NOT_FOUND',
        statusCode: 404
      });
    }

    this.users.splice(userIndex, 1);

    // 204 状态码不需要返回响应体 | 204 status code doesn't need response body
    return;
  }

  // 高级功能：批量操作 | Advanced feature: batch operations
  @Post('batch')
  @ApiOperation({ summary: '批量创建用户 | Batch create users' })
  @ApiResponse({ 
    status: 201, 
    description: '批量创建成功 | Batch creation successful'
  })
  batchCreate(@Body() users: CreateUserDto[]) {
    if (!Array.isArray(users) || users.length === 0) {
      throw new BadRequestException({
        message: '用户数据数组不能为空 | User data array cannot be empty',
        error: 'EMPTY_BATCH_DATA'
      });
    }

    const createdUsers = [];
    const errors = [];

    users.forEach((userData, index) => {
      try {
        // 检查邮箱唯一性 | Check email uniqueness
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
          errors.push({
            index,
            email: userData.email,
            error: 'DUPLICATE_EMAIL'
          });
          return;
        }

        const newUser = {
          id: (this.users.length + createdUsers.length + 1).toString(),
          ...userData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        this.users.push(newUser);
        createdUsers.push(newUser);
      } catch (error) {
        errors.push({
          index,
          email: userData.email,
          error: error.message
        });
      }
    });

    return {
      success: errors.length === 0,
      message: `批量操作完成 | Batch operation completed`,
      data: {
        created: createdUsers.length,
        failed: errors.length,
        users: createdUsers,
        errors
      }
    };
  }

  // 统计功能 | Statistics feature
  @Get('stats/summary')
  @ApiOperation({ summary: '获取用户统计信息 | Get user statistics' })
  @ApiResponse({ 
    status: 200, 
    description: '统计信息获取成功 | Statistics retrieved successfully'
  })
  getStats() {
    const stats = {
      total: this.users.length,
      byRole: {
        admin: this.users.filter(u => u.role === 'admin').length,
        user: this.users.filter(u => u.role === 'user').length,
        moderator: this.users.filter(u => u.role === 'moderator').length
      },
      ageDistribution: {
        under25: this.users.filter(u => u.age < 25).length,
        between25and35: this.users.filter(u => u.age >= 25 && u.age <= 35).length,
        over35: this.users.filter(u => u.age > 35).length
      }
    };

    return {
      success: true,
      message: '统计信息获取成功 | Statistics retrieved successfully',
      data: stats
    };
  }
}

// 4. 应用模块配置 | Application module configuration
import { Module } from '@nestjs/common';

@Module({
  controllers: [UsersController],
})
export class UsersModule {}

// 5. 主应用配置 | Main application configuration
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 全局验证管道 | Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Swagger配置 | Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('用户管理API | User Management API')
    .setDescription('完整的用户管理RESTful API系统 | Complete user management RESTful API system')
    .setVersion('1.0')
    .addTag('用户管理 | User Management')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log('应用运行在 http://localhost:3000 | Application is running on http://localhost:3000');
  console.log('API文档地址: http://localhost:3000/api/docs | API documentation: http://localhost:3000/api/docs');
}
bootstrap();
```

### 项目完成检查 | Project Completion Check
1. API是否正确实现了所有HTTP方法？| Does the API correctly implement all HTTP methods?
2. 路由参数和查询参数处理是否完善？| Is route and query parameter handling comprehensive?
3. 请求验证和错误处理是否按预期工作？| Do request validation and error handling work as expected?

## 扩展练习 | Extension Exercises

### 概念深化练习 | Concept Deepening Exercises

1. **HTTP方法语义理解练习 | HTTP Method Semantics Understanding Exercise**
   - **练习描述 | Exercise Description:** 分析不同HTTP方法的幂等性和安全性特征
   - **概念检查 | Concept Check:** GET和POST方法的区别是什么？PUT和PATCH有什么不同？
   - **学习目标 | Learning Objective:** 深入理解RESTful设计原则和HTTP方法语义

2. **路由参数验证练习 | Route Parameter Validation Exercise**
   - **练习描述 | Exercise Description:** 实现自定义管道验证路径参数格式
   - **概念检查 | Concept Check:** 如何确保路径参数符合特定格式要求？
   - **学习目标 | Learning Objective:** 掌握高级参数验证技术

3. **错误处理策略练习 | Error Handling Strategy Exercise**
   - **练习描述 | Exercise Description:** 设计统一的错误响应格式和错误码体系
   - **概念检查 | Concept Check:** 什么时候应该返回4xx vs 5xx状态码？
   - **学习目标 | Learning Objective:** 建立完善的API错误处理体系

4. **API版本控制练习 | API Versioning Exercise**
   - **练习描述 | Exercise Description:** 实现基于URL和Header的API版本控制
   - **概念检查 | Concept Check:** 如何在不破坏现有客户端的情况下升级API？
   - **学习目标 | Learning Objective:** 学会设计可维护的API版本策略

5. **性能优化练习 | Performance Optimization Exercise**
   - **练习描述 | Exercise Description:** 添加缓存、分页和数据压缩功能
   - **概念检查 | Concept Check:** 哪些HTTP响应适合缓存？如何设置缓存头？
   - **学习目标 | Learning Objective:** 提高API性能和用户体验

6. **安全增强练习 | Security Enhancement Exercise**
   - **练习描述 | Exercise Description:** 实现请求限流、输入清理和CORS配置
   - **概念检查 | Concept Check:** 如何防止常见的API安全威胁？
   - **学习目标 | Learning Objective:** 构建安全可靠的API服务

7. **测试覆盖练习 | Testing Coverage Exercise**
   - **练习描述 | Exercise Description:** 编写完整的单元测试和集成测试
   - **概念检查 | Concept Check:** 如何测试不同的HTTP状态码和错误场景？
   - **学习目标 | Learning Objective:** 确保API的质量和可靠性

## 学习资源 | Learning Resources
- [NestJS控制器文档 | NestJS Controllers Documentation](https://docs.nestjs.com/controllers)
- [HTTP状态码完整列表 | Complete HTTP Status Codes List](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [class-validator验证装饰器参考 | class-validator Validation Decorators Reference](https://github.com/typestack/class-validator)
- [Swagger/OpenAPI规范 | Swagger/OpenAPI Specification](https://swagger.io/specification/)

---

✅ **完成检查清单 | Completion Checklist**
- [ ] HTTP方法装饰器使用掌握 | HTTP method decorators usage mastered
- [ ] 路径参数和查询参数处理理解 | Path and query parameter handling understood
- [ ] 请求体验证和数据转换实现 | Request body validation and data transformation implemented
- [ ] 响应状态码和错误处理配置 | Response status codes and error handling configured
- [ ] 实践项目完整实现 | Practical project fully implemented
- [ ] 所有CCQs正确回答 | All CCQs answered correctly
- [ ] Swagger API文档生成 | Swagger API documentation generated
- [ ] 中间件和拦截器概念理解 | Middleware and interceptor concepts understood
- [ ] RESTful设计原则应用 | RESTful design principles applied
- [ ] 扩展练习至少完成3个 | At least 3 extension exercises completed

**概念掌握验证 | Concept Mastery Verification:**
在标记完成前，请确保能够正确回答本日所有CCQs，并能够向他人清晰解释HTTP处理的完整流程和每个组件的作用。
Before marking as complete, ensure you can correctly answer all CCQs from today and clearly explain the complete HTTP handling flow and the role of each component to others.
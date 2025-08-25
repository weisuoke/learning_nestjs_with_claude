# NestJS入门 - 第8天：授权与守卫 | NestJS Introduction - Day 8: Authorization and Guards

## 学习目标 | Learning Objectives
- 理解守卫的概念和作用机制 | Understand the concept and working mechanism of guards
- 掌握JWT认证守卫的实现方式 | Master the implementation of JWT authentication guards
- 学会创建基于角色的权限控制系统 | Learn to create role-based access control systems
- 能够开发自定义守卫处理复杂业务逻辑 | Develop custom guards to handle complex business logic
- 熟练保护API端点的各种策略 | Master various strategies for protecting API endpoints
- 掌握守卫与其他组件的集成应用 | Master integration of guards with other components

## 详细内容 | Detailed Content

### 1. 守卫基础概念与工作原理 | Guard Fundamentals and Working Principles (1小时 | 1 hour)

- **守卫概念定义 | Guard Concept Definition**
  
  **概念定义 | Concept Definition:**
  守卫是NestJS中的一种特殊组件，实现CanActivate接口，在路由处理程序执行前决定请求是否应该被处理。守卫主要负责授权逻辑，确定用户是否有权限访问特定资源。 | Guards are special components in NestJS that implement the CanActivate interface, deciding whether a request should be handled before the route handler executes. Guards are primarily responsible for authorization logic, determining if users have permission to access specific resources.
  
  **核心特征 | Key Characteristics:**
  - 实现CanActivate接口，返回boolean值或Promise<boolean> | Implement CanActivate interface, returning boolean or Promise<boolean>
  - 在控制器方法执行前运行，提供访问控制 | Run before controller methods execute, providing access control
  - 可以访问ExecutionContext，获取请求上下文信息 | Can access ExecutionContext to get request context information
  - 支持同步和异步操作，适应各种认证需求 | Support both synchronous and asynchronous operations for various authentication needs
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 守卫必须实现什么接口？| What interface must guards implement?
     **答案 | Answer:** CanActivate - 这是NestJS守卫的标准接口 | This is the standard interface for NestJS guards
  2. 守卫的canActivate方法返回false时会发生什么？| What happens when a guard's canActivate method returns false?
     **答案 | Answer:** 返回403 Forbidden响应 | Returns a 403 Forbidden response
  3. 守卫是在控制器方法之前还是之后执行？| Do guards execute before or after controller methods?
     **答案 | Answer:** 之前 | Before - 守卫在路由处理程序执行前进行访问控制检查 | Guards perform access control checks before route handlers execute
  4. ExecutionContext对象提供什么信息？| What information does the ExecutionContext object provide?
     **答案 | Answer:** 请求上下文信息 | Request context information - 包括HTTP请求、响应对象和处理程序信息 | Including HTTP request, response objects and handler information
  
  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
  import { Observable } from 'rxjs';

  // 基础守卫接口实现 | Basic guard interface implementation
  @Injectable()
  export class AuthGuard implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      // 获取HTTP请求对象 | Get HTTP request object
      const request = context.switchToHttp().getRequest();
      
      // 检查授权头是否存在 | Check if authorization header exists
      const authHeader = request.headers['authorization'];
      
      if (!authHeader) {
        throw new UnauthorizedException('授权头缺失 | Authorization header missing');
      }
      
      // 基础验证逻辑 | Basic validation logic
      return this.validateRequest(request);
    }

    private validateRequest(request: any): boolean {
      // 简单的令牌验证示例 | Simple token validation example
      const token = request.headers['authorization']?.replace('Bearer ', '');
      return token === 'valid-token'; // 实际应用中应该验证真实JWT | Should validate real JWT in production
    }
  }
  ```
  
  **实践检查问题 | Practice Checking Questions:**
  - 这段守卫代码会在什么情况下抛出异常？| Under what conditions will this guard code throw an exception?
    **答案 | Answer:** 当授权头缺失时抛出UnauthorizedException | Throws UnauthorizedException when authorization header is missing
  - 如何修改代码使其支持多种认证方式？| How would you modify the code to support multiple authentication methods?
    **答案 | Answer:** 在validateRequest中添加多种验证策略 | Add multiple validation strategies in validateRequest method
  
  **常见误区检查 | Common Misconception Checks:**
  - 守卫只能用于认证，不能用于授权？| Guards can only be used for authentication, not authorization?
    **答案 | Answer:** 错误 | False - 守卫主要用于授权，决定已认证用户是否有权限访问资源 | Guards are primarily used for authorization, determining if authenticated users have permission to access resources
  - 守卫返回false时会自动返回401状态码？| Do guards automatically return a 401 status code when returning false?
    **答案 | Answer:** 错误 | False - 默认返回403 Forbidden，需要手动抛出UnauthorizedException获得401 | Defaults to 403 Forbidden, need to manually throw UnauthorizedException for 401

- **ExecutionContext深入理解 | Deep Understanding of ExecutionContext**
  
  **概念定义 | Concept Definition:**
  ExecutionContext是NestJS提供的执行上下文对象，包含当前执行环境的所有信息，允许守卫访问请求、响应、处理程序等详细信息。 | ExecutionContext is the execution context object provided by NestJS, containing all information about the current execution environment, allowing guards to access request, response, handlers and other detailed information.
  
  **核心特征 | Key Characteristics:**
  - switchToHttp()方法获取HTTP特定的执行上下文 | switchToHttp() method gets HTTP-specific execution context
  - getRequest()和getResponse()获取原始请求响应对象 | getRequest() and getResponse() get native request and response objects
  - getHandler()获取将要执行的路由处理程序引用 | getHandler() gets reference to the route handler to be executed
  - getClass()获取控制器类的引用信息 | getClass() gets reference information about the controller class
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. ExecutionContext的switchToHttp()方法返回什么？| What does ExecutionContext's switchToHttp() method return?
     **答案 | Answer:** HttpArgumentsHost对象 | HttpArgumentsHost object - 提供HTTP特定的上下文访问方法 | Provides HTTP-specific context access methods
  2. 如何从ExecutionContext获取用户IP地址？| How do you get the user's IP address from ExecutionContext?
     **答案 | Answer:** context.switchToHttp().getRequest().ip | Through context.switchToHttp().getRequest().ip
  3. getHandler()方法主要用于什么场景？| What scenarios is the getHandler() method mainly used for?
     **答案 | Answer:** 获取元数据和装饰器信息 | Getting metadata and decorator information - 常用于基于装饰器的权限控制 | Often used for decorator-based permission control
  4. ExecutionContext在微服务环境中是否可用？| Is ExecutionContext available in microservice environments?
     **答案 | Answer:** 是 | Yes - 但需要使用switchToRpc()等相应方法 | But requires using corresponding methods like switchToRpc()

  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';

  @Injectable()
  export class ContextAnalysisGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
      // HTTP上下文信息提取 | HTTP context information extraction
      const httpContext = context.switchToHttp();
      const request = httpContext.getRequest();
      const response = httpContext.getResponse();
      
      // 请求信息分析 | Request information analysis
      console.log('请求方法 | Request method:', request.method);
      console.log('请求路径 | Request path:', request.url);
      console.log('用户IP | User IP:', request.ip);
      console.log('用户代理 | User agent:', request.get('User-Agent'));
      
      // 处理程序信息获取 | Handler information retrieval
      const handler = context.getHandler();
      const controllerClass = context.getClass();
      
      // 元数据提取示例 | Metadata extraction example
      const requiredRoles = this.reflector.get<string[]>('roles', handler);
      const isPublic = this.reflector.get<boolean>('isPublic', handler);
      
      console.log('需要的角色 | Required roles:', requiredRoles);
      console.log('是否公开接口 | Is public endpoint:', isPublic);
      
      return true;
    }
  }

  // 配合使用的装饰器 | Supporting decorators
  import { SetMetadata } from '@nestjs/common';

  export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
  export const Public = () => SetMetadata('isPublic', true);
  ```

### 2. JWT认证守卫实现与配置 | JWT Authentication Guard Implementation and Configuration (1小时 | 1 hour)

- **JWT守卫核心实现 | JWT Guard Core Implementation**
  
  **概念定义 | Concept Definition:**
  JWT认证守卫是专门用于验证JSON Web Token的守卫组件，它从请求中提取JWT令牌，验证其有效性，并将解码的用户信息附加到请求对象上。 | JWT authentication guard is a specialized guard component for validating JSON Web Tokens, extracting JWT tokens from requests, verifying their validity, and attaching decoded user information to the request object.
  
  **核心特征 | Key Characteristics:**
  - 自动提取Authorization头中的Bearer令牌 | Automatically extracts Bearer tokens from Authorization headers
  - 验证JWT签名和过期时间等标准声明 | Validates JWT signatures and standard claims like expiration time
  - 将解码的用户信息存储在request.user中 | Stores decoded user information in request.user
  - 支持自定义JWT配置和验证逻辑 | Supports custom JWT configuration and validation logic
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. JWT守卫从哪个HTTP头获取令牌？| From which HTTP header does the JWT guard get the token?
     **答案 | Answer:** Authorization头 | Authorization header - 格式为"Bearer <token>" | In the format "Bearer <token>"
  2. JWT令牌验证失败时应该返回什么HTTP状态码？| What HTTP status code should be returned when JWT token validation fails?
     **答案 | Answer:** 401 Unauthorized - 表示认证失败 | Indicates authentication failure
  3. 解码后的用户信息存储在请求对象的哪个属性中？| In which property of the request object is the decoded user information stored?
     **答案 | Answer:** request.user - 这是NestJS的标准约定 | This is NestJS standard convention
  4. JWT守卫是否应该处理令牌刷新逻辑？| Should JWT guards handle token refresh logic?
     **答案 | Answer:** 否 | No - 令牌刷新通常由专门的端点处理 | Token refresh is usually handled by dedicated endpoints

  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';

  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      
      // 提取JWT令牌 | Extract JWT token
      const token = this.extractTokenFromHeader(request);
      
      if (!token) {
        throw new UnauthorizedException('令牌缺失 | Token missing');
      }

      try {
        // 验证JWT令牌 | Verify JWT token
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
        
        // 将用户信息附加到请求对象 | Attach user info to request object
        request.user = {
          userId: payload.sub,
          username: payload.username,
          email: payload.email,
          roles: payload.roles || [],
          iat: payload.iat,
          exp: payload.exp,
        };
        
        // 可选：检查用户是否仍然活跃 | Optional: check if user is still active
        await this.validateUserStatus(request.user);
        
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('令牌已过期 | Token expired');
        } else if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('无效令牌 | Invalid token');
        } else {
          throw new UnauthorizedException('令牌验证失败 | Token validation failed');
        }
      }
      
      return true;
    }

    private extractTokenFromHeader(request: any): string | undefined {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return undefined;
      }
      return authHeader.substring(7); // 移除"Bearer "前缀 | Remove "Bearer " prefix
    }

    private async validateUserStatus(user: any): Promise<void> {
      // 这里可以添加额外的用户状态检查 | Additional user status checks can be added here
      // 例如：检查用户是否被禁用、角色是否仍然有效等 | For example: check if user is disabled, roles are still valid, etc.
      
      // 示例：检查令牌是否在黑名单中 | Example: check if token is blacklisted
      // const isBlacklisted = await this.tokenBlacklistService.isBlacklisted(user.jti);
      // if (isBlacklisted) {
      //   throw new UnauthorizedException('令牌已被吊销 | Token has been revoked');
      // }
    }
  }

  // 可选的令牌提取策略 | Optional token extraction strategies
  @Injectable()
  export class FlexibleJwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      
      // 支持多种令牌提取方式 | Support multiple token extraction methods
      const token = 
        this.extractFromAuthHeader(request) ||  // Authorization header
        this.extractFromCookie(request) ||      // Cookie
        this.extractFromQuery(request);         // Query parameter
      
      if (!token) {
        throw new UnauthorizedException('未找到认证令牌 | Authentication token not found');
      }

      try {
        const payload = await this.jwtService.verifyAsync(token);
        request.user = payload;
        return true;
      } catch (error) {
        throw new UnauthorizedException('令牌验证失败 | Token validation failed');
      }
    }

    private extractFromAuthHeader(request: any): string | null {
      const authHeader = request.headers.authorization;
      return authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    }

    private extractFromCookie(request: any): string | null {
      return request.cookies?.['access_token'] || null;
    }

    private extractFromQuery(request: any): string | null {
      return request.query?.token || null;
    }
  }
  ```
  
  **实践检查问题 | Practice Checking Questions:**
  - JWT令牌过期时这段代码会抛出什么异常？| What exception will this code throw when the JWT token expires?
    **答案 | Answer:** UnauthorizedException with message "令牌已过期" | UnauthorizedException with message "Token expired"
  - 如何修改代码以支持从Cookie中提取令牌？| How would you modify the code to support extracting tokens from cookies?
    **答案 | Answer:** 在extractTokenFromHeader中添加对request.cookies的检查 | Add checking for request.cookies in extractTokenFromHeader method
  
  **常见误区检查 | Common Misconception Checks:**
  - JWT守卫应该同时处理认证和授权逻辑？| Should JWT guards handle both authentication and authorization logic?
    **答案 | Answer:** 不应该 | No - JWT守卫只负责认证(验证身份)，授权应该由其他守卫处理 | JWT guards only handle authentication (identity verification), authorization should be handled by other guards
  - 令牌验证失败时直接返回false即可？| Is it sufficient to just return false when token validation fails?
    **答案 | Answer:** 不够 | No - 应该抛出明确的UnauthorizedException提供错误详情 | Should throw explicit UnauthorizedException to provide error details

### 3. 基于角色的权限控制系统 | Role-Based Access Control System (1小时 | 1 hour)

- **RBAC系统设计原理 | RBAC System Design Principles**
  
  **概念定义 | Concept Definition:**
  基于角色的访问控制(RBAC)是一种将系统访问权限与用户角色关联的安全模型。用户被分配角色，角色被授予权限，从而实现灵活且可扩展的权限管理。 | Role-Based Access Control (RBAC) is a security model that associates system access permissions with user roles. Users are assigned roles, roles are granted permissions, enabling flexible and scalable permission management.
  
  **核心特征 | Key Characteristics:**
  - 角色作为用户和权限之间的中介层 | Roles serve as an intermediary layer between users and permissions
  - 支持角色继承和层次结构关系 | Supports role inheritance and hierarchical relationships
  - 权限可以动态分配和撤销 | Permissions can be dynamically assigned and revoked
  - 降低权限管理的复杂性和错误率 | Reduces complexity and error rate in permission management
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. RBAC系统中用户如何获得权限？| How do users obtain permissions in an RBAC system?
     **答案 | Answer:** 通过角色间接获得 | Indirectly through roles - 用户被分配角色，角色拥有权限 | Users are assigned roles, roles possess permissions
  2. 一个用户是否可以拥有多个角色？| Can a user have multiple roles?
     **答案 | Answer:** 可以 | Yes - 这是RBAC系统的常见设计模式 | This is a common design pattern in RBAC systems
  3. 角色权限检查应该在认证之前还是之后进行？| Should role permission checks be performed before or after authentication?
     **答案 | Answer:** 之后 | After - 必须先确认用户身份才能检查其角色权限 | Must first confirm user identity before checking their role permissions
  4. 权限拒绝时应该返回什么HTTP状态码？| What HTTP status code should be returned when permission is denied?
     **答案 | Answer:** 403 Forbidden - 表示已认证但无权限 | Indicates authenticated but no permission

  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { SetMetadata } from '@nestjs/common';

  // 角色装饰器定义 | Role decorator definition
  export const ROLES_KEY = 'roles';
  export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

  // 权限装饰器定义 | Permission decorator definition  
  export const PERMISSIONS_KEY = 'permissions';
  export const RequirePermissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

  // 角色守卫实现 | Role guard implementation
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
      // 获取处理程序所需的角色 | Get required roles for the handler
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      // 如果没有角色要求，允许访问 | If no role requirements, allow access
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      // 从请求中获取用户信息 | Get user information from request
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
        throw new ForbiddenException('用户信息缺失 | User information missing');
      }

      // 检查用户是否具有所需角色 | Check if user has required roles
      const hasRequiredRole = this.checkUserRoles(user.roles || [], requiredRoles);
      
      if (!hasRequiredRole) {
        throw new ForbiddenException(`访问被拒绝：需要角色 ${requiredRoles.join(', ')} | Access denied: requires roles ${requiredRoles.join(', ')}`);
      }

      return true;
    }

    private checkUserRoles(userRoles: string[], requiredRoles: string[]): boolean {
      // 检查用户是否具有任一所需角色 | Check if user has any of the required roles
      return requiredRoles.some(role => userRoles.includes(role));
    }
  }

  // 高级权限守卫 | Advanced permission guard
  @Injectable()
  export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
      const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredPermissions) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
        throw new ForbiddenException('用户未认证 | User not authenticated');
      }

      // 基于角色计算用户权限 | Calculate user permissions based on roles
      const userPermissions = this.calculateUserPermissions(user.roles || []);
      
      // 检查用户是否具有所需权限 | Check if user has required permissions
      const hasPermission = this.checkPermissions(userPermissions, requiredPermissions);
      
      if (!hasPermission) {
        throw new ForbiddenException(`权限不足：需要 ${requiredPermissions.join(', ')} | Insufficient permissions: requires ${requiredPermissions.join(', ')}`);
      }

      return true;
    }

    private calculateUserPermissions(userRoles: string[]): string[] {
      // 角色到权限的映射 | Role to permission mapping
      const rolePermissionMap: Record<string, string[]> = {
        'admin': ['read', 'write', 'delete', 'manage_users'],
        'editor': ['read', 'write'],
        'viewer': ['read'],
        'moderator': ['read', 'write', 'moderate_content'],
      };

      // 收集所有角色的权限 | Collect permissions from all roles
      const permissions = new Set<string>();
      userRoles.forEach(role => {
        const rolePermissions = rolePermissionMap[role] || [];
        rolePermissions.forEach(permission => permissions.add(permission));
      });

      return Array.from(permissions);
    }

    private checkPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
      // 检查用户是否具有所有必需权限 | Check if user has all required permissions
      return requiredPermissions.every(permission => userPermissions.includes(permission));
    }
  }

  // 组合守卫：同时支持角色和权限检查 | Combined guard: supports both role and permission checks
  @Injectable()
  export class RolePermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
        throw new ForbiddenException('用户未认证 | User not authenticated');
      }

      // 检查角色要求 | Check role requirements
      const roleCheck = this.checkRoleRequirements(context, user);
      
      // 检查权限要求 | Check permission requirements  
      const permissionCheck = this.checkPermissionRequirements(context, user);

      // 只要满足角色或权限要求即可访问 | Access allowed if either role or permission requirements are met
      return roleCheck || permissionCheck;
    }

    private checkRoleRequirements(context: ExecutionContext, user: any): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) return true;
      
      return requiredRoles.some(role => (user.roles || []).includes(role));
    }

    private checkPermissionRequirements(context: ExecutionContext, user: any): boolean {
      const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredPermissions) return true;

      const userPermissions = this.calculateUserPermissions(user.roles || []);
      return requiredPermissions.every(permission => userPermissions.includes(permission));
    }

    private calculateUserPermissions(userRoles: string[]): string[] {
      const rolePermissionMap: Record<string, string[]> = {
        'admin': ['*'], // 管理员拥有所有权限 | Admin has all permissions
        'editor': ['read', 'write', 'edit'],
        'viewer': ['read'],
      };

      const permissions = new Set<string>();
      userRoles.forEach(role => {
        const rolePermissions = rolePermissionMap[role] || [];
        if (rolePermissions.includes('*')) {
          permissions.add('*'); // 通配符权限 | Wildcard permission
        } else {
          rolePermissions.forEach(permission => permissions.add(permission));
        }
      });

      return Array.from(permissions);
    }
  }
  ```

### 4. 自定义守卫与业务逻辑集成 | Custom Guards and Business Logic Integration (1小时 | 1 hour)

- **业务场景驱动的自定义守卫 | Business Scenario-Driven Custom Guards**
  
  **概念定义 | Concept Definition:**
  自定义守卫是根据特定业务需求开发的访问控制组件，它们超越基本的认证和授权，集成复杂的业务规则、资源所有权验证、时间限制等高级逻辑。 | Custom guards are access control components developed for specific business requirements, going beyond basic authentication and authorization to integrate complex business rules, resource ownership verification, time restrictions and other advanced logic.
  
  **核心特征 | Key Characteristics:**
  - 集成业务数据库查询和状态检查 | Integrate business database queries and status checks
  - 支持动态权限计算和上下文相关访问控制 | Support dynamic permission calculation and context-aware access control
  - 可以访问外部服务和第三方API进行验证 | Can access external services and third-party APIs for validation
  - 提供详细的访问日志和审计跟踪 | Provide detailed access logs and audit trails
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 自定义守卫是否可以执行数据库查询？| Can custom guards perform database queries?
     **答案 | Answer:** 可以 | Yes - 但需要注意性能影响和异步处理 | But need to consider performance impact and asynchronous handling
  2. 业务逻辑守卫应该如何处理复杂的资源所有权检查？| How should business logic guards handle complex resource ownership checks?
     **答案 | Answer:** 通过依赖注入服务进行资源查询和验证 | Through dependency injection services for resource queries and validation
  3. 守卫中的异步操作失败时会怎样？| What happens when asynchronous operations in guards fail?
     **答案 | Answer:** 抛出异常并拒绝访问 | Throw exceptions and deny access - 应该有适当的错误处理 | Should have proper error handling
  4. 多个自定义守卫的执行顺序如何确定？| How is the execution order of multiple custom guards determined?
     **答案 | Answer:** 按照在@UseGuards装饰器中的声明顺序 | In the order declared in the @UseGuards decorator

  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';

  // 资源实体定义 | Resource entity definition
  export class Article {
    id: number;
    title: string;
    content: string;
    authorId: number;
    isPublished: boolean;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }

  // 资源所有权守卫 | Resource ownership guard
  @Injectable()
  export class ArticleOwnershipGuard implements CanActivate {
    constructor(
      @InjectRepository(Article)
      private articleRepository: Repository<Article>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      
      if (!user) {
        throw new ForbiddenException('用户未认证 | User not authenticated');
      }

      // 从路径参数获取文章ID | Get article ID from path parameters
      const articleId = parseInt(request.params.id);
      
      if (!articleId) {
        throw new BadRequestException('无效的文章ID | Invalid article ID');
      }

      try {
        // 查询文章信息 | Query article information
        const article = await this.articleRepository.findOne({
          where: { id: articleId }
        });

        if (!article) {
          throw new ForbiddenException('文章不存在 | Article not found');
        }

        // 检查用户是否为文章作者或管理员 | Check if user is article author or admin
        const isOwner = article.authorId === user.userId;
        const isAdmin = user.roles?.includes('admin');
        
        if (!isOwner && !isAdmin) {
          throw new ForbiddenException('无权限访问此文章 | No permission to access this article');
        }

        // 将文章信息附加到请求对象供后续使用 | Attach article info to request for later use
        request.article = article;
        
        return true;
      } catch (error) {
        if (error instanceof ForbiddenException || error instanceof BadRequestException) {
          throw error;
        }
        throw new ForbiddenException('权限验证失败 | Permission verification failed');
      }
    }
  }

  // 时间窗口守卫 | Time window guard
  @Injectable()
  export class TimeWindowGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      
      // 获取时间窗口配置 | Get time window configuration
      const allowedHours = this.getAllowedHours(request);
      
      if (allowedHours.length === 0) {
        return true; // 无时间限制 | No time restrictions
      }

      const currentHour = new Date().getHours();
      const isAllowedTime = allowedHours.includes(currentHour);
      
      if (!isAllowedTime) {
        throw new ForbiddenException(`当前时间不允许访问，允许时间段：${allowedHours.join(', ')}时 | Access not allowed at current time, allowed hours: ${allowedHours.join(', ')}`);
      }

      return true;
    }

    private getAllowedHours(request: any): number[] {
      // 示例：从用户角色或配置中获取允许的时间段 | Example: get allowed time periods from user roles or configuration
      const user = request.user;
      
      if (user?.roles?.includes('admin')) {
        return []; // 管理员无时间限制 | No time restrictions for admin
      }
      
      // 普通用户只能在工作时间访问 | Regular users can only access during work hours
      return [9, 10, 11, 12, 13, 14, 15, 16, 17]; // 9 AM to 5 PM
    }
  }

  // 配额限制守卫 | Quota limit guard
  @Injectable()
  export class QuotaGuard implements CanActivate {
    constructor(
      @InjectRepository(Article)
      private articleRepository: Repository<Article>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      
      if (!user) {
        throw new ForbiddenException('用户未认证 | User not authenticated');
      }

      // 检查用户创建文章的配额 | Check user's article creation quota
      if (request.method === 'POST' && request.url.includes('/articles')) {
        const userArticleCount = await this.articleRepository.count({
          where: { 
            authorId: user.userId,
            // 只统计本月创建的文章 | Count only articles created this month
            createdAt: this.getThisMonthDateRange()
          }
        });

        const maxArticlesPerMonth = this.getMaxArticlesPerMonth(user);
        
        if (userArticleCount >= maxArticlesPerMonth) {
          throw new ForbiddenException(`已达到月度文章创建限制：${maxArticlesPerMonth}篇 | Monthly article creation limit reached: ${maxArticlesPerMonth} articles`);
        }
      }

      return true;
    }

    private getThisMonthDateRange(): any {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      return {
        $gte: startOfMonth,
        $lte: endOfMonth
      };
    }

    private getMaxArticlesPerMonth(user: any): number {
      // 基于用户等级的配额设置 | Quota settings based on user level
      if (user.roles?.includes('premium')) {
        return 100;
      } else if (user.roles?.includes('verified')) {
        return 50;
      }
      return 10; // 普通用户 | Regular users
    }
  }

  // 组合业务守卫 | Combined business guard
  @Injectable()
  export class ComprehensiveBusinessGuard implements CanActivate {
    constructor(
      @InjectRepository(Article)
      private articleRepository: Repository<Article>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      
      // 记录访问尝试 | Log access attempt
      this.logAccessAttempt(request, user);
      
      // 执行多层验证 | Perform multi-layer validation
      await this.validateBusinessRules(request, user);
      await this.validateResourceAccess(request, user);
      await this.validateOperationLimits(request, user);
      
      return true;
    }

    private logAccessAttempt(request: any, user: any): void {
      console.log(`访问尝试 | Access attempt: ${user?.username || 'Anonymous'} -> ${request.method} ${request.url}`);
    }

    private async validateBusinessRules(request: any, user: any): Promise<void> {
      // 业务规则验证示例 | Business rule validation example
      if (request.url.includes('/sensitive') && !user?.roles?.includes('trusted')) {
        throw new ForbiddenException('需要可信用户身份 | Trusted user status required');
      }
    }

    private async validateResourceAccess(request: any, user: any): Promise<void> {
      // 资源访问验证 | Resource access validation
      if (request.params.id && request.method !== 'GET') {
        const resource = await this.articleRepository.findOne({
          where: { id: parseInt(request.params.id) }
        });
        
        if (resource && resource.authorId !== user.userId && !user.roles?.includes('admin')) {
          throw new ForbiddenException('无权限修改他人资源 | No permission to modify others\' resources');
        }
      }
    }

    private async validateOperationLimits(request: any, user: any): Promise<void> {
      // 操作限制验证 | Operation limit validation
      if (request.method === 'DELETE' && !user.roles?.includes('admin')) {
        throw new ForbiddenException('只有管理员可以删除资源 | Only administrators can delete resources');
      }
    }
  }
  ```

### 5. 守卫最佳实践与安全考虑 | Guard Best Practices and Security Considerations (30分钟 | 30 minutes)

- **性能优化策略 | Performance Optimization Strategies**
  
  **核心原则 | Key Principles:**
  - 缓存重复查询结果减少数据库访问 | Cache repeated query results to reduce database access
  - 使用索引优化权限查询性能 | Use indexes to optimize permission query performance
  - 异步操作的超时处理和错误恢复 | Timeout handling and error recovery for asynchronous operations
  - 避免在守卫中执行耗时的外部API调用 | Avoid time-consuming external API calls in guards
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 守卫中的数据库查询应该如何优化？| How should database queries in guards be optimized?
     **答案 | Answer:** 使用缓存和索引 | Use caching and indexing - 避免每次请求都查询数据库 | Avoid querying database on every request
  2. 多个守卫执行时如何减少重复验证？| How to reduce duplicate validation when multiple guards execute?
     **答案 | Answer:** 共享上下文信息和结果缓存 | Share context information and result caching
  3. 守卫失败时是否应该记录详细错误信息？| Should detailed error information be logged when guards fail?
     **答案 | Answer:** 应该记录但不暴露给客户端 | Should log but not expose to client - 保护系统安全信息 | Protect system security information

- **安全最佳实践 | Security Best Practices**
  
  **关键安全措施 | Key Security Measures:**
  - 输入验证和SQL注入防护 | Input validation and SQL injection protection  
  - 敏感信息的安全日志记录 | Secure logging of sensitive information
  - 错误信息的安全处理避免信息泄露 | Secure error handling to prevent information disclosure
  - 请求频率限制防止暴力攻击 | Request rate limiting to prevent brute force attacks
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 守卫返回的错误信息应该包含哪些内容？| What content should error messages returned by guards include?
     **答案 | Answer:** 通用错误信息 | Generic error messages - 避免泄露系统内部详情 | Avoid revealing internal system details
  2. 如何防止通过守卫进行时序攻击？| How to prevent timing attacks through guards?
     **答案 | Answer:** 使用固定时间比较和延迟响应 | Use constant-time comparisons and delayed responses

  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
  import { Cache } from 'cache-manager';
  import { Inject } from '@nestjs/common';

  @Injectable()
  export class OptimizedSecurityGuard implements CanActivate {
    private readonly logger = new Logger(OptimizedSecurityGuard.name);

    constructor(
      @Inject('CACHE_MANAGER')
      private cacheManager: Cache,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      
      try {
        // 性能优化：使用缓存 | Performance optimization: use cache
        const cacheKey = `user_permissions_${user.userId}`;
        let userPermissions = await this.cacheManager.get<string[]>(cacheKey);
        
        if (!userPermissions) {
          userPermissions = await this.fetchUserPermissions(user.userId);
          await this.cacheManager.set(cacheKey, userPermissions, 300); // 缓存5分钟 | Cache for 5 minutes
        }

        // 安全检查 | Security checks
        const hasPermission = await this.validatePermission(request, userPermissions);
        
        // 安全日志记录 | Security logging
        this.logSecurityEvent(request, user, hasPermission);
        
        return hasPermission;
        
      } catch (error) {
        // 安全错误处理 | Security error handling
        this.logger.error(`权限验证错误 | Permission validation error: ${error.message}`, {
          userId: user?.userId,
          url: request.url,
          method: request.method,
        });
        
        // 不暴露内部错误详情 | Don't expose internal error details
        return false;
      }
    }

    private async fetchUserPermissions(userId: number): Promise<string[]> {
      // 模拟数据库查询优化 | Simulate optimized database query
      // 实际应用中应该使用预编译查询和索引 | Should use prepared statements and indexes in production
      return ['read', 'write'];
    }

    private async validatePermission(request: any, userPermissions: string[]): Promise<boolean> {
      // 输入验证 | Input validation
      if (!request.url || typeof request.url !== 'string') {
        return false;
      }
      
      // 权限验证逻辑 | Permission validation logic
      const requiredPermission = this.extractRequiredPermission(request);
      return userPermissions.includes(requiredPermission);
    }

    private extractRequiredPermission(request: any): string {
      // 安全的权限提取逻辑 | Secure permission extraction logic
      const method = request.method?.toUpperCase();
      switch (method) {
        case 'GET':
          return 'read';
        case 'POST':
        case 'PUT':
        case 'PATCH':
          return 'write';
        case 'DELETE':
          return 'delete';
        default:
          return 'unknown';
      }
    }

    private logSecurityEvent(request: any, user: any, success: boolean): void {
      // 安全审计日志 | Security audit logging
      this.logger.log(`权限检查 | Permission check: ${success ? '成功' : '失败'} | ${success ? 'Success' : 'Failed'}`, {
        userId: user?.userId,
        username: user?.username, // 不记录敏感信息如密码 | Don't log sensitive info like passwords
        url: request.url,
        method: request.method,
        ip: request.ip,
        userAgent: request.get('User-Agent'),
        timestamp: new Date().toISOString(),
      });
    }
  }
  ```

### 6. 守卫测试与调试方法 | Guard Testing and Debugging Methods (30分钟 | 30 minutes)

- **守卫单元测试策略 | Guard Unit Testing Strategies**
  
  **测试核心概念 | Testing Core Concepts:**
  守卫测试需要模拟ExecutionContext、验证返回值、测试异常情况，并确保所有业务逻辑分支都得到覆盖。 | Guard testing requires mocking ExecutionContext, validating return values, testing exception cases, and ensuring all business logic branches are covered.
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 测试守卫时如何模拟ExecutionContext？| How to mock ExecutionContext when testing guards?
     **答案 | Answer:** 使用Jest模拟对象创建上下文结构 | Use Jest mock objects to create context structure
  2. 守卫测试应该覆盖哪些场景？| What scenarios should guard tests cover?
     **答案 | Answer:** 成功验证、失败验证、异常情况和边界条件 | Successful validation, failed validation, exception cases and boundary conditions
  3. 如何测试守卫中的异步操作？| How to test asynchronous operations in guards?
     **答案 | Answer:** 使用async/await和Promise断言 | Use async/await and Promise assertions

  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  import { Test } from '@nestjs/testing';
  import { ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { JwtAuthGuard } from './jwt-auth.guard';

  describe('JwtAuthGuard', () => {
    let guard: JwtAuthGuard;
    let jwtService: JwtService;
    let mockExecutionContext: Partial<ExecutionContext>;

    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [
          JwtAuthGuard,
          {
            provide: JwtService,
            useValue: {
              verifyAsync: jest.fn(),
            },
          },
        ],
      }).compile();

      guard = module.get<JwtAuthGuard>(JwtAuthGuard);
      jwtService = module.get<JwtService>(JwtService);

      // 模拟ExecutionContext | Mock ExecutionContext
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {},
          }),
        }),
      };
    });

    describe('canActivate', () => {
      it('应该在有效令牌时返回true | should return true with valid token', async () => {
        // 准备测试数据 | Prepare test data
        const mockRequest = {
          headers: {
            authorization: 'Bearer valid-token',
          },
        };
        
        const mockPayload = {
          sub: 1,
          username: 'testuser',
          email: 'test@example.com',
        };

        // 配置模拟 | Configure mocks
        (mockExecutionContext.switchToHttp as jest.Mock).mockReturnValue({
          getRequest: () => mockRequest,
        });
        
        (jwtService.verifyAsync as jest.Mock).mockResolvedValue(mockPayload);

        // 执行测试 | Execute test
        const result = await guard.canActivate(mockExecutionContext as ExecutionContext);

        // 验证结果 | Verify results
        expect(result).toBe(true);
        expect(mockRequest.user).toEqual({
          userId: mockPayload.sub,
          username: mockPayload.username,
          email: mockPayload.email,
          roles: [],
          iat: undefined,
          exp: undefined,
        });
      });

      it('应该在令牌缺失时抛出UnauthorizedException | should throw UnauthorizedException when token is missing', async () => {
        // 准备测试数据 | Prepare test data
        const mockRequest = {
          headers: {},
        };

        (mockExecutionContext.switchToHttp as jest.Mock).mockReturnValue({
          getRequest: () => mockRequest,
        });

        // 执行测试并验证异常 | Execute test and verify exception
        await expect(
          guard.canActivate(mockExecutionContext as ExecutionContext)
        ).rejects.toThrow(UnauthorizedException);
      });

      it('应该在令牌无效时抛出UnauthorizedException | should throw UnauthorizedException when token is invalid', async () => {
        // 准备测试数据 | Prepare test data
        const mockRequest = {
          headers: {
            authorization: 'Bearer invalid-token',
          },
        };

        (mockExecutionContext.switchToHttp as jest.Mock).mockReturnValue({
          getRequest: () => mockRequest,
        });

        (jwtService.verifyAsync as jest.Mock).mockRejectedValue(
          new Error('JsonWebTokenError')
        );

        // 执行测试并验证异常 | Execute test and verify exception
        await expect(
          guard.canActivate(mockExecutionContext as ExecutionContext)
        ).rejects.toThrow(UnauthorizedException);
      });
    });
  });

  // 集成测试示例 | Integration test example
  describe('RoleGuard Integration', () => {
    let app: any;

    beforeAll(async () => {
      const moduleFixture = await Test.createTestingModule({
        // 配置完整的测试模块 | Configure complete test module
        imports: [/* your modules */],
        controllers: [/* your controllers */],
        providers: [/* your providers */],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    it('应该允许管理员访问受保护端点 | should allow admin to access protected endpoint', () => {
      const adminToken = 'valid-admin-token';
      
      return request(app.getHttpServer())
        .get('/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('应该拒绝普通用户访问管理员端点 | should deny regular user access to admin endpoint', () => {
      const userToken = 'valid-user-token';
      
      return request(app.getHttpServer())
        .get('/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
  ```

## 实践项目：用户权限管理系统 | Practical Project: User Permission Management System

### 目标 | Objective
构建一个完整的用户权限管理系统，集成JWT认证、基于角色的访问控制、资源所有权验证等多层安全机制。 | Build a complete user permission management system integrating JWT authentication, role-based access control, resource ownership verification and multi-layer security mechanisms.

### 概念应用检查 | Concept Application Check
在开始项目前，请确认对以下概念的理解 | Before starting the project, please confirm understanding of the following concepts:

1. 守卫的canActivate方法如何决定请求访问权限？| How does the guard's canActivate method determine request access permissions?
   **答案 | Answer:** 返回true允许访问，返回false或抛出异常拒绝访问 | Return true to allow access, return false or throw exception to deny access
2. JWT守卫如何从请求中提取和验证令牌？| How do JWT guards extract and verify tokens from requests?
   **答案 | Answer:** 从Authorization头提取Bearer令牌，使用JwtService验证签名和有效期 | Extract Bearer token from Authorization header, use JwtService to verify signature and validity
3. 基于角色的访问控制如何实现权限继承？| How does role-based access control implement permission inheritance?
   **答案 | Answer:** 通过角色到权限的映射关系，用户通过角色间接获得权限集合 | Through role-to-permission mapping, users indirectly obtain permission sets through roles

### 步骤 | Steps
1. 创建JWT认证守卫和角色权限守卫 | Create JWT authentication guard and role permission guard
2. 实现资源所有权验证和业务逻辑守卫 | Implement resource ownership verification and business logic guards  
3. 集成多层守卫保护不同API端点 | Integrate multi-layer guards to protect different API endpoints
4. 添加安全日志记录和错误处理 | Add security logging and error handling
5. 编写全面的守卫测试用例 | Write comprehensive guard test cases

### 示例代码 | Example Code
```typescript
"""
用户权限管理系统 | User Permission Management System
综合演示NestJS守卫的各种应用场景和最佳实践 | Comprehensive demonstration of various NestJS guard application scenarios and best practices

本项目演示以下概念的综合应用：| This project demonstrates comprehensive application of:
- JWT认证守卫与令牌验证 | JWT authentication guards and token verification
- 基于角色的权限控制系统 | Role-based access control system
- 资源所有权和业务逻辑守卫 | Resource ownership and business logic guards
- 多层安全防护策略 | Multi-layer security protection strategies
"""

import { 
  Controller, Get, Post, Put, Delete, Body, Param, UseGuards, 
  Injectable, CanActivate, ExecutionContext, ForbiddenException,
  UnauthorizedException, BadRequestException, Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

// ==================== 装饰器定义 | Decorator Definitions ====================

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// ==================== 核心守卫实现 | Core Guard Implementations ====================

// JWT认证守卫 | JWT Authentication Guard
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查是否为公开端点 | Check if endpoint is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('令牌缺失的访问尝试 | Access attempt without token', {
        url: request.url,
        method: request.method,
        ip: request.ip,
      });
      throw new UnauthorizedException('访问令牌缺失 | Access token missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      
      // 将完整用户信息附加到请求 | Attach complete user info to request
      request.user = {
        userId: payload.sub,
        username: payload.username,
        email: payload.email,
        roles: payload.roles || [],
        permissions: payload.permissions || [],
        isActive: payload.isActive !== false,
        lastLoginAt: payload.lastLoginAt,
        tokenId: payload.jti, // JWT ID for token tracking
      };

      // 验证用户状态 | Validate user status
      if (!request.user.isActive) {
        throw new UnauthorizedException('用户账户已被禁用 | User account is disabled');
      }

      this.logger.log('JWT认证成功 | JWT authentication successful', {
        userId: request.user.userId,
        username: request.user.username,
      });

      return true;

    } catch (error) {
      this.logger.error('JWT验证失败 | JWT verification failed', {
        error: error.message,
        url: request.url,
        method: request.method,
      });

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('访问令牌已过期 | Access token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('无效的访问令牌 | Invalid access token');
      }
      
      throw new UnauthorizedException('令牌验证失败 | Token verification failed');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }
    return authHeader.substring(7);
  }
}

// 角色权限守卫 | Role Permission Guard
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('用户认证信息缺失 | User authentication info missing');
    }

    // 获取所需角色 | Get required roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 获取所需权限 | Get required permissions
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果没有角色或权限要求，允许访问 | Allow access if no role or permission requirements
    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const hasRequiredRole = this.checkRoles(user.roles, requiredRoles);
    const hasRequiredPermission = this.checkPermissions(user, requiredPermissions);

    // 满足角色要求或权限要求即可 | Access granted if either role or permission requirements are met
    const hasAccess = hasRequiredRole || hasRequiredPermission;

    if (!hasAccess) {
      this.logger.warn('权限不足的访问尝试 | Access attempt with insufficient permissions', {
        userId: user.userId,
        userRoles: user.roles,
        requiredRoles,
        requiredPermissions,
        url: request.url,
        method: request.method,
      });

      const missingRoles = requiredRoles ? `角色：${requiredRoles.join(', ')}` : '';
      const missingPermissions = requiredPermissions ? `权限：${requiredPermissions.join(', ')}` : '';
      const missing = [missingRoles, missingPermissions].filter(Boolean).join(' 或 ');
      
      throw new ForbiddenException(`访问被拒绝，需要 ${missing} | Access denied, requires ${missing}`);
    }

    this.logger.log('权限验证通过 | Permission validation passed', {
      userId: user.userId,
      matchedRoles: hasRequiredRole,
      matchedPermissions: hasRequiredPermission,
    });

    return true;
  }

  private checkRoles(userRoles: string[], requiredRoles: string[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    return requiredRoles.some(role => userRoles.includes(role));
  }

  private checkPermissions(user: any, requiredPermissions: string[]): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // 计算用户的所有权限 | Calculate all user permissions
    const userPermissions = this.calculateUserPermissions(user);
    
    // 检查是否拥有所有必需权限 | Check if user has all required permissions
    return requiredPermissions.every(permission => userPermissions.includes(permission));
  }

  private calculateUserPermissions(user: any): string[] {
    // 角色到权限映射 | Role to permission mapping
    const rolePermissionMap: Record<string, string[]> = {
      'super_admin': ['*'], // 超级管理员拥有所有权限 | Super admin has all permissions
      'admin': ['users.read', 'users.write', 'users.delete', 'articles.read', 'articles.write', 'articles.delete'],
      'editor': ['articles.read', 'articles.write', 'users.read'],
      'author': ['articles.read', 'articles.write'],
      'user': ['articles.read'],
    };

    const permissions = new Set<string>();
    
    // 添加直接权限 | Add direct permissions
    if (user.permissions) {
      user.permissions.forEach((permission: string) => permissions.add(permission));
    }

    // 添加角色权限 | Add role-based permissions
    user.roles.forEach((role: string) => {
      const rolePermissions = rolePermissionMap[role] || [];
      if (rolePermissions.includes('*')) {
        permissions.add('*'); // 通配符权限 | Wildcard permission
      } else {
        rolePermissions.forEach(permission => permissions.add(permission));
      }
    });

    return Array.from(permissions);
  }
}

// 资源所有权守卫 | Resource Ownership Guard
@Injectable()
export class OwnershipGuard implements CanActivate {
  private readonly logger = new Logger(OwnershipGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('用户未认证 | User not authenticated');
    }

    // 管理员跳过所有权检查 | Admins bypass ownership checks
    if (user.roles.includes('admin') || user.roles.includes('super_admin')) {
      return true;
    }

    const resourceId = request.params.id;
    if (!resourceId) {
      throw new BadRequestException('资源ID缺失 | Resource ID missing');
    }

    // 根据路径确定资源类型 | Determine resource type based on path
    const resourceType = this.getResourceType(request.url);
    
    try {
      const isOwner = await this.verifyOwnership(user.userId, resourceType, resourceId);
      
      if (!isOwner) {
        this.logger.warn('非拥有者访问尝试 | Non-owner access attempt', {
          userId: user.userId,
          resourceType,
          resourceId,
          url: request.url,
        });
        throw new ForbiddenException('只能访问自己创建的资源 | Can only access own resources');
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('资源访问验证失败 | Resource access verification failed');
    }
  }

  private getResourceType(url: string): string {
    if (url.includes('/articles/')) return 'article';
    if (url.includes('/users/')) return 'user';
    if (url.includes('/comments/')) return 'comment';
    return 'unknown';
  }

  private async verifyOwnership(userId: number, resourceType: string, resourceId: string): Promise<boolean> {
    // 在实际应用中，这里应该查询数据库验证所有权
    // In production, this should query database to verify ownership
    
    // 模拟数据库查询 | Simulate database query
    const mockResourceOwnership = {
      article: { '1': 1, '2': 1, '3': 2 },
      user: { '1': 1, '2': 2 },
      comment: { '1': 1, '2': 2, '3': 1 },
    };

    const resourceMap = mockResourceOwnership[resourceType as keyof typeof mockResourceOwnership];
    return resourceMap && resourceMap[resourceId as keyof typeof resourceMap] === userId;
  }
}

// ==================== 控制器实现 | Controller Implementation ====================

// 用户管理控制器 | User Management Controller  
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  @Get()
  @Roles('admin', 'editor')
  @RequirePermissions('users.read')
  async findAll() {
    this.logger.log('获取用户列表 | Get users list');
    return {
      message: '用户列表 | Users list',
      data: [
        { id: 1, username: 'admin', email: 'admin@example.com', roles: ['admin'] },
        { id: 2, username: 'user1', email: 'user1@example.com', roles: ['user'] },
      ]
    };
  }

  @Get(':id')
  @UseGuards(OwnershipGuard)
  async findOne(@Param('id') id: string) {
    this.logger.log(`获取用户详情 | Get user details: ${id}`);
    return {
      message: `用户详情 | User details: ${id}`,
      data: { id: parseInt(id), username: `user${id}`, email: `user${id}@example.com` }
    };
  }

  @Put(':id')
  @UseGuards(OwnershipGuard)
  @RequirePermissions('users.write')
  async update(@Param('id') id: string, @Body() updateData: any) {
    this.logger.log(`更新用户信息 | Update user: ${id}`);
    return { 
      message: `用户 ${id} 已更新 | User ${id} updated`,
      data: { id: parseInt(id), ...updateData }
    };
  }

  @Delete(':id')
  @Roles('admin')
  @RequirePermissions('users.delete')
  async remove(@Param('id') id: string) {
    this.logger.log(`删除用户 | Delete user: ${id}`);
    return { message: `用户 ${id} 已删除 | User ${id} deleted` };
  }
}

// 文章管理控制器 | Article Management Controller
@Controller('articles')
@UseGuards(JwtAuthGuard)
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);

  @Get()
  @Public()  // 公开接口，无需认证 | Public endpoint, no authentication required
  async findAll() {
    return {
      message: '公开文章列表 | Public articles list',
      data: [
        { id: 1, title: '公开文章1', content: '内容1', authorId: 1 },
        { id: 2, title: '公开文章2', content: '内容2', authorId: 2 },
      ]
    };
  }

  @Post()
  @Roles('author', 'editor', 'admin')
  @RequirePermissions('articles.write')
  async create(@Body() createData: any) {
    this.logger.log('创建新文章 | Create new article');
    return {
      message: '文章已创建 | Article created',
      data: { id: Date.now(), ...createData }
    };
  }

  @Put(':id')
  @UseGuards(OwnershipGuard)
  @RequirePermissions('articles.write')
  async update(@Param('id') id: string, @Body() updateData: any) {
    this.logger.log(`更新文章 | Update article: ${id}`);
    return {
      message: `文章 ${id} 已更新 | Article ${id} updated`,
      data: { id: parseInt(id), ...updateData }
    };
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  @RequirePermissions('articles.delete')
  async remove(@Param('id') id: string) {
    this.logger.log(`删除文章 | Delete article: ${id}`);
    return { message: `文章 ${id} 已删除 | Article ${id} deleted` };
  }
}

// ==================== 认证控制器 | Authentication Controller ====================

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Post('login')
  @Public()
  async login(@Body() loginDto: { username: string; password: string }) {
    // 简化的登录验证 | Simplified login validation
    const { username, password } = loginDto;
    
    if (username === 'admin' && password === 'password') {
      const payload = {
        sub: 1,
        username: 'admin',
        email: 'admin@example.com',
        roles: ['admin'],
        permissions: ['*'],
        isActive: true,
        lastLoginAt: new Date().toISOString(),
      };

      const token = await this.jwtService.signAsync(payload);
      
      return {
        message: '登录成功 | Login successful',
        data: {
          access_token: token,
          user: {
            id: payload.sub,
            username: payload.username,
            email: payload.email,
            roles: payload.roles,
          }
        }
      };
    }

    throw new UnauthorizedException('用户名或密码错误 | Invalid username or password');
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return {
      message: '用户资料 | User profile',
      data: req.user
    };
  }
}

// ==================== 应用模块配置 | Application Module Configuration ====================

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key', // 生产环境中应使用环境变量 | Use environment variables in production
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UserController, ArticleController, AuthController],
  providers: [JwtAuthGuard, RolesGuard, OwnershipGuard],
  exports: [JwtAuthGuard, RolesGuard, OwnershipGuard],
})
export class SecurityModule {}
```

### 项目完成检查 | Project Completion Check
1. JWT认证守卫是否正确验证令牌并处理各种错误情况？| Does the JWT authentication guard correctly verify tokens and handle various error cases?
2. 角色权限系统是否实现了基于角色和权限的双重验证？| Does the role permission system implement dual verification based on both roles and permissions?
3. 资源所有权守卫是否能正确验证用户对资源的所有权？| Does the resource ownership guard correctly verify user ownership of resources?
4. 多层守卫是否按预期顺序执行并提供全面保护？| Do multi-layer guards execute in expected order and provide comprehensive protection?
5. 错误处理是否安全且不泄露敏感信息？| Is error handling secure and does not leak sensitive information?

## 扩展练习 | Extension Exercises

### 概念深化练习 | Concept Deepening Exercises

1. **守卫执行顺序深入理解 | Deep Understanding of Guard Execution Order**
   - **练习描述 | Exercise Description:** 创建多个守卫并研究它们的执行顺序，理解全局守卫、控制器守卫和方法守卫的优先级 | Create multiple guards and study their execution order, understand priorities of global guards, controller guards and method guards
   - **概念检查 | Concept Check:** 多个守卫失败时如何确定最终的错误响应？| How is the final error response determined when multiple guards fail?
   - **学习目标 | Learning Objective:** 掌握守卫执行机制和错误传播规则 | Master guard execution mechanism and error propagation rules

2. **JWT安全增强实践 | JWT Security Enhancement Practice**
   - **练习描述 | Exercise Description:** 实现JWT令牌黑名单、刷新令牌机制和双因子认证支持 | Implement JWT token blacklist, refresh token mechanism and two-factor authentication support
   - **概念检查 | Concept Check:** 如何安全地实现令牌刷新而不暴露安全风险？| How to securely implement token refresh without exposing security risks?
   - **学习目标 | Learning Objective:** 提升JWT认证系统的安全性和用户体验 | Enhance security and user experience of JWT authentication system

3. **动态权限系统设计 | Dynamic Permission System Design**
   - **练习描述 | Exercise Description:** 设计支持运行时权限变更的动态RBAC系统，包括权限缓存和失效机制 | Design dynamic RBAC system supporting runtime permission changes, including permission caching and invalidation mechanisms
   - **概念检查 | Concept Check:** 权限变更后如何确保所有活跃会话的权限同步更新？| How to ensure permission synchronization for all active sessions after permission changes?
   - **学习目标 | Learning Objective:** 构建可扩展的企业级权限管理系统 | Build scalable enterprise-level permission management system

4. **守卫性能优化实战 | Guard Performance Optimization Practice**
   - **练习描述 | Exercise Description:** 优化守卫中的数据库查询，实现智能缓存策略和批量权限验证 | Optimize database queries in guards, implement smart caching strategies and batch permission verification
   - **概念检查 | Concept Check:** 如何在保证安全性的前提下最小化权限验证的性能开销？| How to minimize performance overhead of permission verification while ensuring security?
   - **学习目标 | Learning Objective:** 掌握高性能安全系统的设计技巧 | Master design techniques for high-performance security systems

5. **微服务环境下的分布式授权 | Distributed Authorization in Microservices**
   - **练习描述 | Exercise Description:** 设计跨微服务的统一授权机制，实现分布式权限验证和服务间安全通信 | Design unified authorization mechanism across microservices, implement distributed permission verification and secure inter-service communication
   - **概念检查 | Concept Check:** 分布式环境中如何保证权限验证的一致性和可用性？| How to ensure consistency and availability of permission verification in distributed environments?
   - **学习目标 | Learning Objective:** 理解分布式系统中的安全架构设计 | Understand security architecture design in distributed systems

6. **安全审计与监控系统 | Security Audit and Monitoring System**
   - **练习描述 | Exercise Description:** 构建完整的安全审计系统，记录所有权限验证事件并实现异常行为检测 | Build complete security audit system, record all permission verification events and implement anomaly detection
   - **概念检查 | Concept Check:** 如何设计安全日志既能提供足够信息又不泄露敏感数据？| How to design security logs that provide sufficient information without revealing sensitive data?
   - **学习目标 | Learning Objective:** 建立全面的安全监控和响应能力 | Establish comprehensive security monitoring and response capabilities

7. **多租户权限隔离实现 | Multi-tenant Permission Isolation Implementation**
   - **练习描述 | Exercise Description:** 实现多租户环境下的数据和权限完全隔离，确保租户间的安全边界 | Implement complete data and permission isolation in multi-tenant environments, ensure security boundaries between tenants
   - **概念检查 | Concept Check:** 多租户架构中如何防止权限泄露和数据交叉访问？| How to prevent permission leakage and cross-data access in multi-tenant architecture?
   - **学习目标 | Learning Objective:** 掌握企业级SaaS应用的安全架构模式 | Master security architecture patterns for enterprise SaaS applications

## 学习资源 | Learning Resources
- [NestJS官方文档 - Guards](https://docs.nestjs.com/guards) - 守卫官方指南 | Official guards guide
- [NestJS官方文档 - Authentication](https://docs.nestjs.com/security/authentication) - 认证系统实现 | Authentication system implementation
- [NestJS官方文档 - Authorization](https://docs.nestjs.com/security/authorization) - 授权机制详解 | Authorization mechanism explanation
- [JWT官方网站](https://jwt.io/) - JSON Web Token标准和工具 | JSON Web Token standards and tools
- [OWASP认证指南](https://owasp.org/www-project-authentication-cheat-sheet/) - 安全认证最佳实践 | Secure authentication best practices

---

✅ **完成检查清单 | Completion Checklist**
- [ ] 理解守卫的基本概念和CanActivate接口实现 | Understand basic guard concepts and CanActivate interface implementation
- [ ] 掌握ExecutionContext的使用方法和上下文信息提取 | Master ExecutionContext usage and context information extraction
- [ ] 能够实现JWT认证守卫并处理各种令牌验证场景 | Able to implement JWT authentication guards and handle various token validation scenarios
- [ ] 掌握基于角色的权限控制系统设计和实现 | Master role-based access control system design and implementation
- [ ] 能够创建自定义守卫处理复杂业务逻辑需求 | Able to create custom guards to handle complex business logic requirements
- [ ] 了解守卫最佳实践和安全考虑因素 | Understand guard best practices and security considerations
- [ ] 实践项目成功实现多层权限保护机制 | Successfully implement multi-layer permission protection mechanism in practical project
- [ ] 掌握守卫的单元测试和集成测试方法 | Master unit testing and integration testing methods for guards
- [ ] 理解守卫在微服务和分布式环境中的应用 | Understand guard applications in microservice and distributed environments
- [ ] 扩展练习完成至少3个以加深理解 | Complete at least 3 extension exercises to deepen understanding

**概念掌握验证 | Concept Mastery Verification:**
在标记完成前，请确保能够正确回答本日所有CCQs，并能够向他人清晰解释守卫的工作原理、JWT认证流程、RBAC权限模型以及如何设计安全的API保护机制。
Before marking as complete, ensure you can correctly answer all CCQs from today and clearly explain guard working principles, JWT authentication process, RBAC permission model, and how to design secure API protection mechanisms to others.
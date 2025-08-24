# NestJS入门 - 第7天：身份认证基础 | NestJS Introduction - Day 7: Authentication Basics

## 学习目标 | Learning Objectives
- 理解Passport.js认证中间件的工作原理和应用方式 | Understand the working principles and application of Passport.js authentication middleware
- 掌握JWT策略的无状态认证机制和令牌管理 | Master JWT strategy's stateless authentication mechanism and token management
- 学会使用bcrypt进行密码安全加密和验证 | Learn to use bcrypt for secure password encryption and verification
- 实现完整的用户注册和登录认证系统 | Implement a complete user registration and login authentication system
- 掌握认证守卫和授权机制的创建与使用 | Master the creation and usage of authentication guards and authorization mechanisms
- 理解认证流程中的安全最佳实践和防护措施 | Understand security best practices and protective measures in authentication flows

## 详细内容 | Detailed Content

### 1. Passport.js认证中间件原理 | Passport.js Authentication Middleware Principles (1小时 | 1 hour)

- **Passport.js核心概念 | Passport.js Core Concepts**
  
  **概念定义 | Concept Definition:**
  Passport.js是Node.js中最流行的认证中间件，提供了统一的认证接口和多种认证策略的支持。它将认证过程抽象为策略模式，每种认证方法对应一个策略，使得切换和组合不同的认证方式变得简单灵活。| Passport.js is the most popular authentication middleware for Node.js, providing a unified authentication interface and support for various authentication strategies. It abstracts the authentication process into a strategy pattern where each authentication method corresponds to a strategy, making switching and combining different authentication methods simple and flexible.
  
  **核心特征 | Key Characteristics:**
  - **策略模式：支持300+种认证策略，包括本地认证、OAuth、JWT等** | **Strategy Pattern: supports 300+ authentication strategies including local auth, OAuth, JWT, etc.**
  - **中间件集成：无缝集成到Express和NestJS应用中** | **Middleware Integration: seamlessly integrates into Express and NestJS applications**
  - **会话管理：可选的会话持久化和序列化支持** | **Session Management: optional session persistence and serialization support**
  - **插件化架构：模块化设计，按需加载认证策略** | **Plugin Architecture: modular design with on-demand strategy loading**
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. Passport.js是否提供统一的认证接口？| Does Passport.js provide a unified authentication interface?
     **答案 | Answer:** 是 | Yes - Passport.js抽象了不同认证策略的差异，提供统一的接口
  2. 一个应用可以同时使用多种Passport策略吗？| Can an application use multiple Passport strategies simultaneously?  
     **答案 | Answer:** 是 | Yes - 可以同时配置和使用多种认证策略，如JWT和本地认证
  3. Passport策略需要会话存储吗？| Do Passport strategies require session storage?
     **答案 | Answer:** 否 | No - JWT等无状态策略不需要会话存储，但本地认证通常需要
  4. Passport.js可以处理授权逻辑吗？| Can Passport.js handle authorization logic?
     **答案 | Answer:** 否 | No - Passport主要处理认证，授权需要额外的守卫和中间件
  
  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  // Passport策略配置示例 | Passport strategy configuration example
  import { Injectable } from '@nestjs/common';
  import { PassportStrategy } from '@nestjs/passport';
  import { Strategy } from 'passport-local';
  import { AuthService } from './auth.service';

  @Injectable()
  export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
      super({
        usernameField: 'email', // 指定用户名字段 | Specify username field
        passwordField: 'password', // 指定密码字段 | Specify password field
      });
    }

    // 验证方法，返回用户信息或null | Validation method, returns user info or null
    async validate(email: string, password: string): Promise<any> {
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user; // 这个返回值会附加到request.user | This return value will be attached to request.user
    }
  }
  ```
  
  **实践检查问题 | Practice Checking Questions:**
  - 这个策略会在什么时候执行validate方法？| When will this strategy execute the validate method?
    **答案 | Answer:** 当使用@UseGuards(LocalAuthGuard)装饰器时会触发验证
  - validate方法返回false会发生什么？| What happens if the validate method returns false?
    **答案 | Answer:** 会抛出401 Unauthorized错误
  
  **常见误区检查 | Common Misconception Checks:**
  - Passport策略可以直接处理路由吗？| Can Passport strategies handle routes directly?
    **答案 | Answer:** 不能，需要通过守卫(Guards)来应用策略到特定路由 | No, strategies need to be applied to specific routes through Guards
  - 所有策略都需要数据库查询吗？| Do all strategies require database queries?
    **答案 | Answer:** 不是，JWT策略可以通过令牌验证而无需数据库查询 | No, JWT strategies can validate through tokens without database queries

- **认证流程与请求生命周期 | Authentication Flow and Request Lifecycle**
  
  **概念定义 | Concept Definition:**
  认证流程是指用户身份验证在HTTP请求处理过程中的完整生命周期，包括凭据提取、策略验证、用户信息附加和后续授权检查等步骤。理解这个流程对于构建安全可靠的认证系统至关重要。| Authentication flow refers to the complete lifecycle of user identity verification during HTTP request processing, including credential extraction, strategy validation, user information attachment, and subsequent authorization checks. Understanding this flow is crucial for building secure and reliable authentication systems.
  
  **核心特征 | Key Characteristics:**
  - **请求拦截：在路由处理之前进行身份验证** | **Request Interception: performs authentication before route handling**
  - **上下文传递：将用户信息附加到请求上下文中** | **Context Passing: attaches user information to request context**
  - **错误处理：统一处理认证失败和异常情况** | **Error Handling: unified handling of authentication failures and exceptions**
  - **链式处理：支持多级认证和授权检查** | **Chain Processing: supports multi-level authentication and authorization checks**
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 认证是在路由处理之前还是之后执行？| Is authentication executed before or after route handling?
     **答案 | Answer:** 之前 | Before - 认证守卫在路由处理器执行前进行身份验证
  2. 认证成功后用户信息存储在哪里？| Where is user information stored after successful authentication?
     **答案 | Answer:** request.user对象中 | In the request.user object
  3. 认证失败时会继续执行路由处理器吗？| Will the route handler continue to execute when authentication fails?
     **答案 | Answer:** 不会 | No - 认证失败会抛出异常，阻止后续处理
  4. 可以在一个请求中进行多次认证检查吗？| Can multiple authentication checks be performed in one request?
     **答案 | Answer:** 可以 | Yes - 通过多个守卫或中间件实现多级检查
  
  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  // 认证守卫实现 | Authentication guard implementation
  import { Injectable, ExecutionContext } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { Observable } from 'rxjs';

  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      // 在这里可以添加额外的认证逻辑 | Additional authentication logic can be added here
      console.log('JWT认证守卫执行 | JWT Auth Guard executing');
      
      return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
      // 自定义认证结果处理 | Custom authentication result handling
      if (err || !user) {
        console.log('认证失败 | Authentication failed:', err || info);
        throw err || new UnauthorizedException('Token verification failed');
      }
      
      console.log('认证成功，用户:', user.email, '| Authentication successful, user:', user.email);
      return user;
    }
  }

  // 在控制器中使用认证守卫 | Using authentication guard in controller
  @Controller('protected')
  export class ProtectedController {
    @UseGuards(JwtAuthGuard) // 应用JWT认证守卫 | Apply JWT authentication guard
    @Get('profile')
    getProfile(@Request() req) {
      // req.user包含认证后的用户信息 | req.user contains authenticated user info
      return {
        message: '这是受保护的资源 | This is a protected resource',
        user: req.user
      };
    }
  }
  ```

### 2. JWT策略实现与配置 | JWT Strategy Implementation and Configuration (1小时 | 1 hour)

- **JWT令牌结构与原理 | JWT Token Structure and Principles**
  
  **概念定义 | Concept Definition:**
  JSON Web Token(JWT)是一种开放标准(RFC 7519)，用于在各方之间安全地传输信息。JWT采用无状态设计，通过数字签名来验证令牌的完整性和真实性，无需服务端存储会话信息。| JSON Web Token (JWT) is an open standard (RFC 7519) for securely transmitting information between parties. JWT adopts a stateless design, using digital signatures to verify token integrity and authenticity without requiring server-side session storage.
  
  **核心特征 | Key Characteristics:**
  - **三段式结构：Header.Payload.Signature格式** | **Three-part Structure: Header.Payload.Signature format**
  - **自包含性：令牌包含所需的用户信息** | **Self-contained: tokens contain necessary user information**
  - **无状态性：服务端无需存储令牌状态** | **Stateless: server doesn't need to store token state**
  - **跨域支持：适合分布式和微服务架构** | **Cross-domain Support: suitable for distributed and microservice architectures**
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. JWT令牌需要在服务端存储吗？| Do JWT tokens need to be stored on the server side?
     **答案 | Answer:** 不需要 | No - JWT是无状态的，服务端只需验证签名
  2. JWT的三个部分分别是什么？| What are the three parts of a JWT?
     **答案 | Answer:** Header(头部)、Payload(载荷)、Signature(签名) | Header, Payload, Signature
  3. 修改JWT的payload会影响验证吗？| Will modifying the JWT payload affect verification?
     **答案 | Answer:** 会 | Yes - 任何修改都会导致签名验证失败
  4. JWT令牌可以撤销吗？| Can JWT tokens be revoked?
     **答案 | Answer:** 困难 | Difficult - 需要额外的黑名单机制，因为JWT是无状态的
  
  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  // JWT策略配置 | JWT strategy configuration
  import { Injectable } from '@nestjs/common';
  import { PassportStrategy } from '@nestjs/passport';
  import { ExtractJwt, Strategy } from 'passport-jwt';
  import { ConfigService } from '@nestjs/config';

  @Injectable()
  export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
      super({
        // 从Authorization header中提取JWT | Extract JWT from Authorization header
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false, // 不忽略过期时间 | Don't ignore expiration
        secretOrKey: configService.get<string>('JWT_SECRET'), // 验证密钥 | Verification secret
      });
    }

    // 验证JWT payload | Validate JWT payload
    async validate(payload: any) {
      console.log('JWT Payload:', payload);
      
      // 返回的数据会附加到request.user | Returned data will be attached to request.user
      return { 
        userId: payload.sub, 
        username: payload.username,
        email: payload.email,
        roles: payload.roles || []
      };
    }
  }

  // JWT服务：生成和验证令牌 | JWT service: generate and verify tokens
  import { Injectable } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';

  @Injectable()
  export class AuthService {
    constructor(private jwtService: JwtService) {}

    // 生成JWT令牌 | Generate JWT token
    async generateToken(user: any) {
      const payload = { 
        username: user.username, 
        sub: user.userId,
        email: user.email,
        roles: user.roles,
        iat: Math.floor(Date.now() / 1000), // 签发时间 | Issued at
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7天过期 | Expires in 7 days
      };
      
      return {
        access_token: this.jwtService.sign(payload),
        token_type: 'Bearer',
        expires_in: 604800 // 7天 | 7 days in seconds
      };
    }

    // 验证令牌 | Verify token
    async verifyToken(token: string) {
      try {
        return this.jwtService.verify(token);
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }
  ```

- **JWT中间件集成 | JWT Middleware Integration**
  
  **概念定义 | Concept Definition:**
  JWT中间件集成是指将JWT认证机制无缝嵌入到NestJS应用的请求处理流程中，通过模块配置、策略注册和守卫应用等步骤，实现自动化的令牌验证和用户身份识别。| JWT middleware integration refers to seamlessly embedding JWT authentication mechanism into NestJS application's request processing flow through module configuration, strategy registration, and guard application to achieve automated token verification and user identity recognition.
  
  **核心特征 | Key Characteristics:**
  - **模块化配置：通过JwtModule进行统一配置管理** | **Modular Configuration: unified configuration management through JwtModule**
  - **自动验证：请求自动触发JWT令牌验证流程** | **Automatic Verification: requests automatically trigger JWT token verification flow**
  - **错误处理：标准化的认证失败响应机制** | **Error Handling: standardized authentication failure response mechanism**
  - **性能优化：高效的令牌解析和验证算法** | **Performance Optimization: efficient token parsing and verification algorithms**
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. JWT模块需要在每个使用的模块中导入吗？| Does the JWT module need to be imported in every module that uses it?
     **答案 | Answer:** 不需要 | No - 可以在根模块中全局导入，或通过forRoot注册
  2. JWT守卫会自动处理令牌过期吗？| Will JWT guards automatically handle token expiration?
     **答案 | Answer:** 会 | Yes - passport-jwt策略会检查exp字段并抛出相应异常
  3. 自定义JWT提取器可以从cookie中读取令牌吗？| Can custom JWT extractors read tokens from cookies?
     **答案 | Answer:** 可以 | Yes - 可以使用ExtractJwt.fromExtractors()配置自定义提取器
  4. JWT验证失败时会返回什么HTTP状态码？| What HTTP status code is returned when JWT verification fails?
     **答案 | Answer:** 401 Unauthorized - 表示认证失败

### 3. 密码加密与bcrypt应用 | Password Encryption and bcrypt Application (1小时 | 1 hour)

- **密码安全基础原理 | Password Security Fundamentals**
  
  **概念定义 | Concept Definition:**
  密码安全是指通过加密算法、盐值添加和哈希函数等技术手段，将用户的明文密码转换为不可逆的密文存储，同时提供安全的密码验证机制。bcrypt是专为密码哈希设计的自适应函数，具有抗彩虹表攻击和计算成本可调的特性。| Password security refers to converting users' plaintext passwords into irreversible ciphertext for storage through encryption algorithms, salt addition, and hash functions, while providing secure password verification mechanisms. bcrypt is an adaptive function specifically designed for password hashing with rainbow table attack resistance and adjustable computational cost.
  
  **核心特征 | Key Characteristics:**
  - **单向哈希：不可逆的密码转换过程** | **One-way Hashing: irreversible password conversion process**
  - **盐值保护：每个密码使用唯一随机盐值** | **Salt Protection: each password uses a unique random salt**
  - **计算成本：可调节的加密强度和性能平衡** | **Computational Cost: adjustable encryption strength and performance balance**
  - **时间安全：抵御暴力破解和字典攻击** | **Time Security: resistant to brute force and dictionary attacks**
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 可以从bcrypt哈希值反推出原始密码吗？| Can the original password be reverse-engineered from a bcrypt hash?
     **答案 | Answer:** 不可以 | No - bcrypt是单向哈希函数，理论上不可逆
  2. 相同密码的bcrypt哈希值总是相同的吗？| Are bcrypt hashes always the same for identical passwords?
     **答案 | Answer:** 不是 | No - 每次哈希都会生成不同的随机盐值
  3. bcrypt的轮数(rounds)越高越安全吗？| Is higher rounds in bcrypt more secure?
     **答案 | Answer:** 是的 | Yes - 但会增加计算时间，需要平衡安全性和性能
  4. 存储bcrypt哈希值需要单独保存盐值吗？| Do you need to separately store the salt when storing bcrypt hashes?
     **答案 | Answer:** 不需要 | No - bcrypt哈希值已包含盐值信息
  
  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  // 密码加密服务 | Password encryption service
  import { Injectable } from '@nestjs/common';
  import * as bcrypt from 'bcrypt';

  @Injectable()
  export class PasswordService {
    private readonly saltRounds = 12; // 加密强度：12轮 | Encryption strength: 12 rounds

    // 密码哈希 | Password hashing
    async hashPassword(plainPassword: string): Promise<string> {
      try {
        console.log('开始密码哈希处理 | Starting password hash processing');
        
        // 生成盐值并哈希密码 | Generate salt and hash password
        const hashedPassword = await bcrypt.hash(plainPassword, this.saltRounds);
        
        console.log('密码哈希完成 | Password hashing completed');
        return hashedPassword;
      } catch (error) {
        console.error('密码哈希失败 | Password hashing failed:', error);
        throw new Error('Password hashing failed');
      }
    }

    // 密码验证 | Password verification
    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
      try {
        console.log('开始密码验证 | Starting password verification');
        
        // 比较明文密码和哈希值 | Compare plaintext password with hash
        const isValid = await bcrypt.compare(plainPassword, hashedPassword);
        
        console.log('密码验证结果 | Password verification result:', isValid ? '成功' : '失败');
        return isValid;
      } catch (error) {
        console.error('密码验证失败 | Password verification failed:', error);
        return false;
      }
    }

    // 检查密码强度 | Check password strength
    validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      
      if (password.length < 8) {
        errors.push('密码长度至少8位 | Password must be at least 8 characters');
      }
      
      if (!/[A-Z]/.test(password)) {
        errors.push('必须包含大写字母 | Must contain uppercase letter');
      }
      
      if (!/[a-z]/.test(password)) {
        errors.push('必须包含小写字母 | Must contain lowercase letter');
      }
      
      if (!/\d/.test(password)) {
        errors.push('必须包含数字 | Must contain number');
      }
      
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('必须包含特殊字符 | Must contain special character');
      }
      
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  }
  ```

### 4. 用户注册登录系统实现 | User Registration and Login System Implementation (1小时 | 1 hour)

- **用户实体设计与数据模型 | User Entity Design and Data Model**
  
  **概念定义 | Concept Definition:**
  用户实体设计是构建认证系统的基础，需要定义用户的核心属性、安全字段、关系映射和业务规则。良好的用户模型设计不仅要满足基本的认证需求，还要考虑可扩展性、安全性和性能优化。| User entity design is the foundation of building an authentication system, requiring definition of user core attributes, security fields, relationship mappings, and business rules. Good user model design should not only meet basic authentication needs but also consider extensibility, security, and performance optimization.
  
  **核心特征 | Key Characteristics:**
  - **字段完整性：包含必要的用户信息和认证字段** | **Field Completeness: includes necessary user information and authentication fields**
  - **安全设计：密码加密存储、敏感信息保护** | **Security Design: encrypted password storage, sensitive information protection**
  - **索引优化：为常用查询字段创建索引** | **Index Optimization: create indexes for frequently queried fields**
  - **扩展性考虑：支持角色、权限和其他业务扩展** | **Extensibility Consideration: support for roles, permissions, and other business extensions**
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 用户密码应该以明文形式存储吗？| Should user passwords be stored in plaintext?
     **答案 | Answer:** 不应该 | No - 必须使用哈希加密存储，如bcrypt
  2. 用户邮箱字段需要唯一约束吗？| Does the user email field need a unique constraint?
     **答案 | Answer:** 需要 | Yes - 邮箱通常作为唯一标识符用于登录
  3. 软删除和硬删除哪个更适合用户数据？| Which is more suitable for user data: soft delete or hard delete?
     **答案 | Answer:** 软删除 | Soft delete - 保留数据完整性和审计跟踪
  4. 用户实体应该包含角色信息吗？| Should the user entity include role information?
     **答案 | Answer:** 取决于设计 | Depends on design - 可以直接包含或通过关系映射

- **注册登录控制器实现 | Registration and Login Controller Implementation**
  
  **概念定义 | Concept Definition:**
  认证控制器负责处理用户注册、登录、令牌刷新等认证相关的HTTP请求，提供标准化的API接口和错误处理机制。控制器需要与认证服务、验证管道和安全中间件协同工作，确保认证流程的完整性和安全性。| Authentication controller handles user registration, login, token refresh, and other authentication-related HTTP requests, providing standardized API interfaces and error handling mechanisms. Controllers need to work with authentication services, validation pipes, and security middleware to ensure authentication flow integrity and security.
  
  **代码示例与验证 | Code Examples and Verification:**
  ```typescript
  // 用户认证控制器 | User authentication controller
  import { 
    Controller, 
    Post, 
    Body, 
    UseGuards, 
    Request,
    HttpCode,
    HttpStatus,
    Get
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { CreateUserDto, LoginDto } from './dto';
  import { LocalAuthGuard } from './guards/local-auth.guard';
  import { JwtAuthGuard } from './guards/jwt-auth.guard';

  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}

    // 用户注册 | User registration
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDto: CreateUserDto) {
      console.log('用户注册请求 | User registration request:', createUserDto.email);
      
      try {
        const result = await this.authService.register(createUserDto);
        
        return {
          success: true,
          message: '注册成功 | Registration successful',
          data: {
            user: {
              id: result.user.id,
              email: result.user.email,
              username: result.user.username,
              createdAt: result.user.createdAt
            },
            token: result.token
          }
        };
      } catch (error) {
        throw error;
      }
    }

    // 用户登录 | User login
    @UseGuards(LocalAuthGuard) // 使用本地认证策略 | Use local authentication strategy
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Request() req, @Body() loginDto: LoginDto) {
      console.log('用户登录请求 | User login request:', req.user.email);
      
      // LocalAuthGuard已验证用户身份，req.user包含用户信息
      // LocalAuthGuard has verified user identity, req.user contains user info
      const token = await this.authService.generateToken(req.user);
      
      return {
        success: true,
        message: '登录成功 | Login successful',
        data: {
          user: {
            id: req.user.id,
            email: req.user.email,
            username: req.user.username,
            roles: req.user.roles || []
          },
          ...token
        }
      };
    }

    // 获取用户资料 | Get user profile
    @UseGuards(JwtAuthGuard) // 需要JWT令牌认证 | Requires JWT token authentication
    @Get('profile')
    async getProfile(@Request() req) {
      console.log('获取用户资料 | Get user profile:', req.user.userId);
      
      const user = await this.authService.getUserProfile(req.user.userId);
      
      return {
        success: true,
        data: user
      };
    }

    // 刷新令牌 | Refresh token
    @UseGuards(JwtAuthGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Request() req) {
      console.log('刷新令牌 | Refresh token for user:', req.user.userId);
      
      const newToken = await this.authService.generateToken(req.user);
      
      return {
        success: true,
        message: '令牌刷新成功 | Token refresh successful',
        data: newToken
      };
    }

    // 用户登出 | User logout
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req) {
      // 对于JWT，登出通常在前端处理（删除本地存储的令牌）
      // For JWT, logout is usually handled on frontend (delete locally stored token)
      console.log('用户登出 | User logout:', req.user.userId);
      
      // 可选：将令牌加入黑名单 | Optional: add token to blacklist
      // await this.authService.blacklistToken(req.headers.authorization);
      
      return {
        success: true,
        message: '登出成功 | Logout successful'
      };
    }
  }

  // 认证服务核心逻辑 | Authentication service core logic
  import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { User } from './entities/user.entity';
  import { PasswordService } from './password.service';
  import { JwtService } from '@nestjs/jwt';

  @Injectable()
  export class AuthService {
    constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,
      private passwordService: PasswordService,
      private jwtService: JwtService,
    ) {}

    // 用户注册 | User registration
    async register(createUserDto: CreateUserDto) {
      // 检查邮箱是否已存在 | Check if email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email }
      });

      if (existingUser) {
        throw new ConflictException('邮箱已被注册 | Email already registered');
      }

      // 验证密码强度 | Validate password strength
      const passwordValidation = this.passwordService.validatePasswordStrength(createUserDto.password);
      if (!passwordValidation.isValid) {
        throw new BadRequestException({
          message: '密码强度不符合要求 | Password strength requirements not met',
          errors: passwordValidation.errors
        });
      }

      // 加密密码 | Encrypt password
      const hashedPassword = await this.passwordService.hashPassword(createUserDto.password);

      // 创建用户 | Create user
      const user = this.userRepository.create({
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashedPassword,
        isActive: true,
        createdAt: new Date()
      });

      const savedUser = await this.userRepository.save(user);
      
      // 生成JWT令牌 | Generate JWT token
      const token = await this.generateToken(savedUser);

      return {
        user: savedUser,
        token
      };
    }

    // 验证用户凭据 | Validate user credentials
    async validateUser(email: string, password: string): Promise<any> {
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['id', 'email', 'username', 'password', 'isActive', 'roles']
      });

      if (!user || !user.isActive) {
        return null;
      }

      const isPasswordValid = await this.passwordService.validatePassword(password, user.password);
      
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }

      return null;
    }
  }
  ```

### 5. 认证安全最佳实践 | Authentication Security Best Practices (30分钟 | 30 minutes)

- **安全防护机制 | Security Protection Mechanisms**
  
  **概念定义 | Concept Definition:**
  认证安全防护是指通过多层防护策略、输入验证、错误处理和监控机制来保护认证系统免受各种安全威胁，包括暴力破解、会话劫持、令牌伪造等攻击手段。| Authentication security protection refers to protecting authentication systems from various security threats through multi-layered protection strategies, input validation, error handling, and monitoring mechanisms, including brute force attacks, session hijacking, token forgery, and other attack methods.
  
  **核心特征 | Key Characteristics:**
  - **请求限制：防止暴力破解和频繁请求攻击** | **Request Limiting: prevent brute force and frequent request attacks**
  - **输入验证：严格的参数验证和数据清理** | **Input Validation: strict parameter validation and data sanitization**
  - **错误隐藏：避免泄露敏感的系统信息** | **Error Concealment: avoid exposing sensitive system information**
  - **监控记录：完整的安全事件日志记录** | **Monitoring and Logging: complete security event logging**
  
  **概念检查问题 | Concept Checking Questions (CCQs):**
  1. 登录失败时应该详细说明失败原因吗？| Should detailed failure reasons be provided when login fails?
     **答案 | Answer:** 不应该 | No - 避免信息泄露，应使用通用错误信息
  2. JWT令牌应该设置过期时间吗？| Should JWT tokens have expiration times?
     **答案 | Answer:** 应该 | Yes - 限制令牌有效期可以降低安全风险
  3. 需要对登录请求进行频率限制吗？| Should login requests be rate limited?
     **答案 | Answer:** 需要 | Yes - 防止暴力破解攻击

### 6. 认证测试与调试 | Authentication Testing and Debugging (30分钟 | 30 minutes)

- **认证流程测试 | Authentication Flow Testing**
  
  **概念定义 | Concept Definition:**
  认证测试是验证认证系统功能正确性、安全性和性能的重要环节，包括单元测试、集成测试和端到端测试，确保各种认证场景都能正常工作并满足安全要求。| Authentication testing is an important process to verify the functionality, security, and performance of authentication systems, including unit tests, integration tests, and end-to-end tests to ensure all authentication scenarios work properly and meet security requirements.

## 实践项目：用户认证管理系统 | Practical Project: User Authentication Management System

### 目标 | Objective
构建一个完整的用户认证管理系统，综合应用Passport.js策略、JWT令牌管理、bcrypt密码加密、用户注册登录流程和安全防护机制，实现一个生产级别的认证解决方案。| Build a complete user authentication management system that comprehensively applies Passport.js strategies, JWT token management, bcrypt password encryption, user registration/login flows, and security protection mechanisms to implement a production-grade authentication solution.

### 概念应用检查 | Concept Application Check
在开始项目前，请确认对以下概念的理解 | Before starting the project, please confirm understanding of the following concepts:

1. Passport.js策略是如何与NestJS守卫集成工作的？| How do Passport.js strategies integrate with NestJS guards?
   **答案 | Answer:** 通过继承PassportStrategy创建策略类，然后通过AuthGuard应用到路由，策略的validate方法在守卫执行时被调用
2. JWT令牌的无状态特性对系统架构有什么影响？| How does JWT's stateless nature impact system architecture?
   **答案 | Answer:** 无需服务端会话存储，便于水平扩展，但令牌撤销较困难，需要考虑黑名单机制
3. bcrypt的盐值机制如何保护密码安全？| How does bcrypt's salt mechanism protect password security?
   **答案 | Answer:** 每个密码使用唯一随机盐值，相同密码产生不同哈希值，防止彩虹表攻击

### 步骤 | Steps
1. **环境配置与依赖安装** | **Environment Setup and Dependencies Installation**
2. **用户实体与数据模型设计** | **User Entity and Data Model Design**
3. **Passport策略配置与实现** | **Passport Strategy Configuration and Implementation**
4. **JWT服务与令牌管理** | **JWT Service and Token Management**
5. **认证控制器与API设计** | **Authentication Controller and API Design**
6. **安全中间件与防护机制** | **Security Middleware and Protection Mechanisms**
7. **测试用例与调试验证** | **Test Cases and Debugging Verification**

### 示例代码 | Example Code
```typescript
"""
用户认证管理系统 | User Authentication Management System
完整的身份认证解决方案，包含注册、登录、JWT令牌管理和安全防护

本项目演示以下概念的综合应用：| This project demonstrates comprehensive application of:
- Passport.js认证策略集成 | Passport.js authentication strategy integration
- JWT无状态令牌认证机制 | JWT stateless token authentication mechanism  
- bcrypt密码安全加密存储 | bcrypt secure password encryption storage
- 用户注册登录完整流程 | Complete user registration and login flow
- 安全防护与最佳实践 | Security protection and best practices
"""

// 1. 用户实体定义 | User entity definition
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
@Index(['email'], { unique: true }) // 邮箱唯一索引 | Unique email index
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  @Exclude() // 序列化时排除密码字段 | Exclude password field during serialization
  password: string;

  @Column({ type: 'simple-array', default: '' })
  roles: string[]; // 用户角色 | User roles

  @Column({ default: true })
  isActive: boolean; // 账户状态 | Account status

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date; // 最后登录时间 | Last login time

  @Column({ default: 0 })
  loginAttempts: number; // 登录尝试次数 | Login attempt count

  @Column({ type: 'timestamp', nullable: true })
  lockUntil: Date; // 账户锁定时间 | Account lock time

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 检查账户是否被锁定 | Check if account is locked
  get isLocked(): boolean {
    return !!(this.lockUntil && this.lockUntil > new Date());
  }
}

// 2. 数据传输对象 | Data Transfer Objects
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: '请输入有效的邮箱地址 | Please enter a valid email address' })
  email: string;

  @IsString({ message: '用户名必须是字符串 | Username must be a string' })
  @MinLength(3, { message: '用户名至少3个字符 | Username must be at least 3 characters' })
  @MaxLength(20, { message: '用户名最多20个字符 | Username must be at most 20 characters' })
  username: string;

  @IsString({ message: '密码必须是字符串 | Password must be a string' })
  @MinLength(8, { message: '密码至少8个字符 | Password must be at least 8 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { message: '密码必须包含大小写字母、数字和特殊字符 | Password must contain uppercase, lowercase, number and special character' }
  )
  password: string;
}

export class LoginDto {
  @IsEmail({}, { message: '请输入有效的邮箱地址 | Please enter a valid email address' })
  email: string;

  @IsString({ message: '密码必须是字符串 | Password must be a string' })
  @MinLength(1, { message: '请输入密码 | Please enter password' })
  password: string;
}

// 3. 认证模块配置 | Authentication module configuration
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from './password.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
        },
      }),
      inject: [ConfigService],
    }),
    // 请求限流配置 | Request throttling configuration
    ThrottlerModule.forRoot({
      ttl: 60, // 时间窗口：60秒 | Time window: 60 seconds
      limit: 10, // 限制：10次请求 | Limit: 10 requests
    }),
  ],
  providers: [
    AuthService,
    PasswordService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

// 4. JWT策略实现 | JWT strategy implementation
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // 验证用户是否仍然存在且活跃 | Verify user still exists and is active
    const user = await this.authService.validateUserById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('用户不存在或已被禁用 | User does not exist or has been disabled');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
      roles: payload.roles || [],
    };
  }
}

// 5. 本地认证策略 | Local authentication strategy
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误 | Invalid email or password');
    }

    return user;
  }
}

// 6. 认证守卫 | Authentication guards
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}

// 7. 认证控制器完整实现 | Complete authentication controller implementation
import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor) // 自动处理序列化 | Automatic serialization handling
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Throttle(3, 60) // 注册限制：1分钟内最多3次 | Registration limit: max 3 times per minute
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Throttle(5, 60) // 登录限制：1分钟内最多5次 | Login limit: max 5 times per minute
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    return { message: '登出成功 | Logout successful' };
  }
}

// 8. 认证服务核心逻辑 | Core authentication service logic
import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { PasswordService } from './password.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCK_TIME = 2 * 60 * 60 * 1000; // 2小时锁定 | 2 hours lock

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    // 检查邮箱是否已存在 | Check if email exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new ConflictException('邮箱已被注册 | Email already registered');
    }

    // 加密密码 | Hash password
    const hashedPassword = await this.passwordService.hashPassword(createUserDto.password);

    // 创建用户 | Create user
    const user = this.userRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
      roles: ['user'], // 默认角色 | Default role
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);
    const token = await this.generateToken(savedUser);

    return {
      success: true,
      message: '注册成功 | Registration successful',
      data: {
        user: {
          id: savedUser.id,
          email: savedUser.email,
          username: savedUser.username,
          roles: savedUser.roles,
          createdAt: savedUser.createdAt,
        },
        ...token,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password', 'isActive', 'roles', 'loginAttempts', 'lockUntil']
    });

    if (!user || !user.isActive) {
      return null;
    }

    // 检查账户是否被锁定 | Check if account is locked
    if (user.isLocked) {
      throw new UnauthorizedException('账户已被锁定，请稍后再试 | Account is locked, please try again later');
    }

    const isPasswordValid = await this.passwordService.validatePassword(password, user.password);

    if (isPasswordValid) {
      // 重置登录尝试次数 | Reset login attempts
      await this.userRepository.update(user.id, {
        loginAttempts: 0,
        lockUntil: null,
        lastLoginAt: new Date(),
      });

      const { password, loginAttempts, lockUntil, ...result } = user;
      return result;
    } else {
      // 增加登录尝试次数 | Increment login attempts
      await this.handleFailedLogin(user);
      return null;
    }
  }

  private async handleFailedLogin(user: User) {
    const attempts = user.loginAttempts + 1;
    const updates: Partial<User> = { loginAttempts: attempts };

    // 如果达到最大尝试次数，锁定账户 | Lock account if max attempts reached
    if (attempts >= this.MAX_LOGIN_ATTEMPTS) {
      updates.lockUntil = new Date(Date.now() + this.LOCK_TIME);
    }

    await this.userRepository.update(user.id, updates);
  }

  async generateToken(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      username: user.username,
      roles: user.roles || [],
    };

    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
      expires_in: 7 * 24 * 60 * 60, // 7天 | 7 days
    };
  }

  async login(user: any) {
    const token = await this.generateToken(user);
    
    return {
      success: true,
      message: '登录成功 | Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          roles: user.roles,
        },
        ...token,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'username', 'roles', 'isActive', 'createdAt', 'lastLoginAt']
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在 | User not found');
    }

    return {
      success: true,
      data: user,
    };
  }

  async validateUserById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId, isActive: true },
      select: ['id', 'email', 'username', 'roles', 'isActive']
    });
  }

  async refreshToken(user: any) {
    const token = await this.generateToken(user);
    
    return {
      success: true,
      message: '令牌刷新成功 | Token refreshed successfully',
      data: token,
    };
  }
}

// 9. 密码服务 | Password service
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 12;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('密码长度至少8位 | Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('必须包含大写字母 | Must contain uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('必须包含小写字母 | Must contain lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('必须包含数字 | Must contain number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('必须包含特殊字符 | Must contain special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// 10. 环境配置示例 | Environment configuration example
/*
.env文件配置 | .env file configuration:

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=nestjs_auth
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password

JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d

THROTTLE_TTL=60
THROTTLE_LIMIT=10
*/

// 11. 应用启动配置 | Application startup configuration
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证管道 | Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // CORS配置 | CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(3000);
  console.log('认证服务启动成功 | Authentication service started successfully');
}
bootstrap();
```

### 项目完成检查 | Project Completion Check
1. 项目是否正确实现了Passport.js本地和JWT策略？| Does the project correctly implement Passport.js local and JWT strategies?
2. bcrypt密码加密和验证机制是否按最佳实践实现？| Are bcrypt password encryption and verification mechanisms implemented according to best practices?
3. 用户注册登录流程是否包含适当的验证和错误处理？| Does the user registration/login flow include proper validation and error handling?
4. 系统是否实现了必要的安全防护机制？| Does the system implement necessary security protection mechanisms?

## 扩展练习 | Extension Exercises

### 概念深化练习 | Concept Deepening Exercises

1. **Passport策略扩展练习 | Passport Strategy Extension Exercise**
   - **练习描述 | Exercise Description:** 实现OAuth2.0策略（如Google、GitHub）并与现有JWT系统集成
   - **概念检查 | Concept Check:** OAuth2.0授权码流程与Passport策略模式的关系
   - **学习目标 | Learning Objective:** 深入理解多策略认证系统的设计和实现

2. **JWT令牌管理优化练习 | JWT Token Management Optimization Exercise**
   - **练习描述 | Exercise Description:** 实现令牌黑名单机制、刷新令牌轮换和多设备管理
   - **概念检查 | Concept Check:** 无状态JWT与有状态会话管理的权衡
   - **学习目标 | Learning Objective:** 掌握高级JWT令牌管理策略

3. **密码安全强化练习 | Password Security Enhancement Exercise**
   - **练习描述 | Exercise Description:** 实现密码历史记录、强制定期更换和多因子认证
   - **概念检查 | Concept Check:** 密码安全策略与用户体验的平衡
   - **学习目标 | Learning Objective:** 构建企业级密码安全体系

4. **认证性能优化练习 | Authentication Performance Optimization Exercise**
   - **练习描述 | Exercise Description:** 实现Redis缓存、数据库查询优化和负载均衡支持
   - **概念检查 | Concept Check:** 认证系统的性能瓶颈和优化策略
   - **学习目标 | Learning Objective:** 提升认证系统的可扩展性和性能

5. **安全监控和审计练习 | Security Monitoring and Audit Exercise**
   - **练习描述 | Exercise Description:** 实现登录异常检测、安全事件日志和威胁响应机制
   - **概念检查 | Concept Check:** 认证安全事件的识别和响应策略
   - **学习目标 | Learning Objective:** 建立完整的认证安全监控体系

6. **微服务认证练习 | Microservices Authentication Exercise**
   - **练习描述 | Exercise Description:** 设计分布式环境下的认证服务和服务间认证机制
   - **概念检查 | Concept Check:** 微服务架构中的认证授权挑战
   - **学习目标 | Learning Objective:** 掌握分布式系统的认证设计模式

7. **移动端认证集成练习 | Mobile Authentication Integration Exercise**
   - **练习描述 | Exercise Description:** 实现移动应用的生物识别认证和设备绑定机制
   - **概念检查 | Concept Check:** 移动端认证的特殊要求和安全考量
   - **学习目标 | Learning Objective:** 适配多端认证需求和用户体验

## 学习资源 | Learning Resources
- [NestJS官方文档 - 认证](https://docs.nestjs.com/security/authentication) | [NestJS Official Documentation - Authentication]
- [Passport.js官方文档](http://www.passportjs.org/docs/) | [Passport.js Official Documentation]
- [JWT官方规范](https://tools.ietf.org/html/rfc7519) | [JWT Official Specification]
- [bcrypt库文档](https://github.com/kelektiv/node.bcrypt.js) | [bcrypt Library Documentation]
- [认证安全最佳实践](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) | [Authentication Security Best Practices]

---

✅ **完成检查清单 | Completion Checklist**
- [ ] 理解Passport.js策略模式和中间件集成原理 | Understand Passport.js strategy pattern and middleware integration principles
- [ ] 掌握JWT令牌生成、验证和管理机制 | Master JWT token generation, verification, and management mechanisms
- [ ] 熟练使用bcrypt进行密码安全加密和验证 | Proficiently use bcrypt for secure password encryption and verification
- [ ] 实现完整的用户注册登录认证流程 | Implement complete user registration and login authentication flow
- [ ] 理解认证守卫和授权机制的工作原理 | Understand the working principles of authentication guards and authorization mechanisms
- [ ] 掌握认证系统的安全最佳实践和防护措施 | Master security best practices and protection measures for authentication systems
- [ ] 完成用户认证管理系统实践项目 | Complete the user authentication management system practical project
- [ ] 正确回答所有概念检查问题（CCQs） | Correctly answer all Concept Checking Questions (CCQs)
- [ ] 理解和运行所有代码示例 | Understand and execute all code examples
- [ ] 完成至少3个扩展练习 | Complete at least 3 extension exercises

**概念掌握验证 | Concept Mastery Verification:**
在标记完成前，请确保能够正确回答本日所有CCQs，并能够向他人清晰解释Passport.js策略模式、JWT令牌机制、bcrypt密码加密和完整认证流程的核心概念。
Before marking as complete, ensure you can correctly answer all CCQs from today and clearly explain the core concepts of Passport.js strategy pattern, JWT token mechanism, bcrypt password encryption, and complete authentication flow to others.
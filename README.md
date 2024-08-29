# @nextboard/server

https://docs.qq.com/desktop/mydoc/folder/BhdvnNAanMKd

一个基于 `NestJS` 、 `Prisma` 和 `Postgresql` 的通用后端服务，提供以下功能模块：

## 1，用户认证（Authentication）

- 本地帐号及密码登录，jwt 签发、验证、刷新。
- Email 验证码登录。
- 第三方 OAuth 登录（如 Google 登录、Github 登录）等。
- 支持一个用户关联多个登录方式。

## 2，用户授权（Authorization）

- 实现基于角色的访问控制（RBAC）。

## 3，用户管理

- 提供用户管理的 API 接口，包括用户的增删改查等操作。
- 支持用户多角色关联。

## 4，角色管理

- 提供角色管理的 API 接口，包括角色的增删改查等操作。
- 支持角色的权限关联。

## 5，权限管理

- 实现利用位运算的方式实现权限的管理。
- 提供权限管理的 API 接口，包括权限的增删改查等操作。

## 6，菜单管理

- 提供菜单管理的 API 接口，包括菜单的增删改查等操作。
- 支持菜单的动态路由生成。
- 支持菜单关联权限。

## 7，操作日志

- 记录用户的操作日志，包括用户的登录、登出、增删改查等操作。

## 详细设计

### 1. 用户认证（Authentication）

支持的登录认证方式：本地帐号及密码登录、Email 验证码登录、第三方 OAuth 登录（如 Google 登录、Github 登录）等。

实现情况：User 模型包含 password 字段用于本地帐号及密码登录。Account 模型用于存储第三方 OAuth 登录信息。VerificationToken 模型用于存储 Email 验证码登录信息。
支持一个用户多个登录方式：

实现情况：User 模型和 Account 模型之间的一对多关系支持一个用户多个登录方式。

### 2. 用户授权（Authorization）

基于角色的访问控制（RBAC）：
实现情况：UserRole 模型用于关联用户和角色，RolePermission 模型用于关联角色和权限。

### 3. 用户管理

提供用户管理的 API 接口，包括用户的增删改查等操作：

实现情况：User 模型包含了用户的基本信息和关联信息，支持用户的增删改查操作。
支持用户多角色关联：

实现情况：UserRole 模型支持用户和角色的多对多关系。

### 4. 角色管理

提供角色管理的 API 接口，包括角色的增删改查等操作：

实现情况：Role 模型包含了角色的基本信息和关联信息，支持角色的增删改查操作。
支持角色的权限关联：

实现情况：RolePermission 模型支持角色和权限的多对多关系。

### 5. 权限管理

实现利用位运算的方式实现权限的管理：

实现情况：Permission 模型包含 code 字段，可以用于存储权限的位运算值。
提供权限管理的 API 接口，包括权限的增删改查等操作：

实现情况：Permission 模型包含了权限的基本信息和关联信息，支持权限的增删改查操作。

### 6. 菜单管理

提供菜单管理的 API 接口，包括菜单的增删改查等操作：

实现情况：Menu 模型包含了菜单的基本信息和关联信息，支持菜单的增删改查操作。
支持菜单的动态路由生成：

实现情况：Menu 模型包含 url 字段，可以用于动态路由生成。
支持菜单关联权限：

实现情况：MenuPermission 模型支持菜单和权限的多对多关系。

### 7. 操作日志

记录用户的操作日志，包括用户的登录、登出、增删改查等操作：
实现情况：Log 模型包含了用户操作日志的基本信息和关联信息，支持记录用户的各种操作。

## 关于 `服务层` 和 `控制器` 层的职责

服务层（service layer）主要负责处理与数据库的交互逻辑以及其他业务逻辑。服务层的职责包括：

1. **与数据库交互**：通过数据访问层（如使用 ORM 框架）与数据库进行交互，执行 CRUD 操作。
2. **业务逻辑处理**：实现具体的业务逻辑，如数据验证、计算、转换等。
3. **调用其他服务**：如果需要，可以调用其他服务或外部 API。

控制器（controller）则负责处理 HTTP 请求和响应，进行参数验证和权限检查等。

### 控制器层（Controller）职责：

- 处理HTTP请求：控制器是应用程序的入口点，负责接收和响应HTTP请求。
- 请求验证：控制器通常用于验证传入的请求数据，确保它们满足特定的格式和验证规则。
- 路由：控制器定义了应用程序的路由结构，每个路由处理特定的HTTP请求方法（如GET、POST、PUT、DELETE等）。
- 调用服务：控制器调用服务层的方法来执行业务逻辑，并返回结果。
- 错误处理：控制器可以处理来自服务层的错误，并将其转换为适当的HTTP响应。
- 数据转换：控制器可能负责将接收到的数据转换为服务层所需的格式，或者将服务层返回的数据转换为客户端所需的格式。

### 服务层（Service）职责：

- 业务逻辑：服务层包含应用程序的核心业务逻辑，这些逻辑与HTTP请求和响应无关。
- 数据持久化：服务层负责与数据库或其他存储机制交互，执行数据的增删改查（CRUD）操作。
- 数据处理：服务层可以包含数据转换、格式化和计算逻辑。
- 调用外部API：如果应用程序需要与外部系统或第三方服务集成，这些调用通常在服务层进行。
- 事务管理：服务层可以处理数据库事务，确保数据操作的一致性和完整性。
- 业务规则：服务层实现业务规则和策略，例如权限检查、工作流程逻辑等。

### 逻辑分配：

#### 放在控制器层：

- 直接与HTTP请求和响应相关的逻辑。
- 请求数据的验证和初步处理。
- 调用服务层的方法，并根据返回结果构造HTTP响应。

#### 放在服务层：

- 与业务领域相关的逻辑，如计算、决策和业务规则。
- 数据库操作和数据持久化逻辑。
- 与外部系统或服务的交互逻辑。
- 复杂的数据处理和转换逻辑

## 数据缓存篇 - 分布式 Redis 缓存

## 在客户端和服务端共享 Prisma 生成的 DTO 类型

确保客户端不会引入浏览器不兼容的类型，可以采取以下措施：

1. 仅导出需要的类型：在共享的类型文件中，只导出需要在客户端使用的类型，避免导出包含 Node.js 特定类型的内容。
2. 使用 TypeScript 的条件类型：根据环境条件导出不同的类型。
3. 避免在客户端代码中直接使用 Prisma Client：只在服务器端使用 Prisma Client，客户端只使用 DTO（数据传输对象）类型。

### 具体步骤

1. 创建共享包（`@nextboard/common`）

在项目中创建一个共享的包，用于存放客户端和服务端共享的类型文件。
在共享包中创建一个类型文件，只导出需要在客户端使用的类型。例如：

```ts
// packages/shared/prisma/types/index.ts
export type { User, Post } from '@prisma/client'
```

2. 配置 Typescript 路径

在 `tsconfig.json` 中配置路径映射：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@nextboard/common": ["../../packages/common/src/index.ts"]
    }
  }
}
```

3. 在客户端和服务器端使用共享类型

在服务器端和客户端代码中分别导入共享类型。

```ts
import type { Post, User } from '@nextboard/common'
```

NestJS 项目中的 DTO（数据传输对象）通常是类，并且可能包含装饰器和验证逻辑，这些类不适合直接共享给客户端。客户端通常只需要类型定义，而不需要这些类的具体实现和装饰器。

解决方案

- 在服务器端定义 DTO 类：在服务器端继续使用 DTO 类来处理请求和响应。
- 在共享包中定义接口或类型：在共享包中定义与 DTO 类对应的接口或类型，这些接口或类型可以在客户端和服务器端共享。

## NestJS monorepo

参考文档：

- https://docs.nestjs.com/cli/monorepo
- https://github.com/mikemajesty/nestjs-monorepo

## @nestjs/swagger

### 范型类型的支持

https://aalonso.dev/blog/2021/how-to-generate-generics-dtos-with-nestjsswagger-422g

### 一些 Tips

https://trilon.io/blog/nestjs-swagger-tips-tricks

## 单元测试

在 NestJS 项目中，通常不需要为 DTO（Data Transfer Object）和模块文件（Module）编写单元测试。以下是原因：

### DTO 对象

DTO 对象通常只是简单的数据结构，用于定义请求和响应的格式。它们不包含业务逻辑，因此不需要单独的单元测试。你可以通过以下方式确保 DTO 的正确性：

- 验证管道（Validation Pipes）：使用 NestJS 的验证管道来验证 DTO 对象的有效性。
- 集成测试：在集成测试中，通过发送实际的 HTTP 请求来验证 DTO 对象的行为。

### 模块文件

模块文件主要用于组织和配置应用程序的依赖关系和提供者。它们通常不包含业务逻辑，因此也不需要单独的单元测试。你可以通过以下方式确保模块的正确性：

- 依赖注入测试：在服务或控制器的单元测试中，验证依赖注入是否正确。
- 集成测试：通过集成测试来验证模块的整体行为。

### 重点测试内容

在 NestJS 项目中，单元测试的重点通常放在以下几个方面：

- 服务（Service）：测试业务逻辑和数据处理。
- 控制器（Controller）：测试路由处理和请求响应。
- 管道（Pipes）、守卫（Guards）、拦截器（Interceptors）：测试请求处理的中间逻辑。
- 过滤器（Filters）：测试异常处理逻辑。

### 使用 Vitest

- https://docs.nestjs.com/recipes/swc#vitest

### 关于入口文件 `main.ts` 的单元测试

在 NestJS 项目中，`main.ts` 文件通常包含应用程序的引导逻辑，例如创建应用实例、设置全局中间件、管道、拦截器、过滤器等。由于这些操作大多涉及框架的初始化和配置，直接对 `main.ts` 进行单元测试并不常见。

但可以通过以下几种方式来确保 `main.ts` 中的逻辑是正确的：

- 集成测试：通过编写集成测试来测试整个应用程序的行为。这种方法可以确保所有配置和中间件都能正确工作。
- 模块化测试：将 `main.ts` 中的逻辑拆分到不同的服务或模块中，然后对这些服务或模块进行单元测试。例如，将全局管道、拦截器、过滤器的设置逻辑移动到一个独立的模块中，然后对该模块进行单元测试。
- 模拟引导过程：编写一个测试文件，模拟 `main.ts` 中的引导过程，并验证关键配置是否正确。

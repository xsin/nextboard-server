# @nextboard/server

https://docs.qq.com/desktop/mydoc/folder/BhdvnNAanMKd

一个基于 `NestJS` 、 `Prisma` 和 `Postgresql` 的通用后端服务，提供以下功能模块：

## 1，用户认证（Authentication）

- 本地帐号及密码登录，jwt 签发、验证、刷新。
- Email 验证码登录
- 第三方 OAuth 登录（如 Google 登录、Github 登录）等。
- 支持一个用户多个登录方式。

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

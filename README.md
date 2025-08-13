# Voice2Text Cloudflare Worker

这是一个通过 Cloudflare Worker 将语音转换为文本的项目。

## 部署指南

该项目使用 GitHub Actions 自动部署到 Cloudflare Workers。请按照以下步骤操作：

### 1. 创建 GitHub 仓库

首先，在您的 GitHub 账户下创建一个新的仓库。

### 2. 上传代码

将本项目的所有文件推送到您新创建的仓库的 `main` 分支。

```bash
# 初始化 Git 仓库
git init -b main

# 添加所有文件到暂存区
git add .

# 提交更改
git commit -m "Initial commit"

# 添加远程仓库地址
git remote add origin https://github.com/jjbb013/voice2text.git

# 推送到远程仓库
git push -u origin main
```

### 3. 在 Cloudflare 中获取凭证

您需要从 Cloudflare 获取 `Account ID` 和 `API Token`。

- **Account ID**:
  1. 登录到您的 Cloudflare 账户。
  2. 在主页右侧找到并复制您的 `Account ID`。

- **API Token**:
  1. 在您的 Cloudflare 账户中，转到 "My Profile" -> "API Tokens"。
  2. 点击 "Create Token"。
  3. 使用 "Edit Cloudflare Workers" 模板。
  4. 授权该 Token 访问您的账户资源。
  5. 创建并复制生成的 Token。

### 4. 在 GitHub 仓库中设置 Secrets

为了让 GitHub Actions 能够安全地访问您的 Cloudflare 账户，您需要将上一步获取的凭证设置为仓库的 Secrets。

1. 在您的 GitHub 仓库页面，转到 "Settings" -> "Secrets and variables" -> "Actions"。
2. 点击 "New repository secret"。
3. 创建以下两个 Secrets：
   - `CF_ACCOUNT_ID`: 值为您的 Cloudflare Account ID。
   - `CF_API_TOKEN`: 值为您的 Cloudflare API Token。

### 5. 触发自动部署

完成以上步骤后，每次您将代码推送到 `main` 分支时，GitHub Actions 都会自动将您的 Worker 部署到 Cloudflare。您可以在仓库的 "Actions" 选项卡中查看部署状态。

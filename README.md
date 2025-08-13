# Voice2Text Cloudflare Worker

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/deploy?repo=https://github.com/jjbb013/voice2text)

这是一个通过 Cloudflare Worker 将语音转换为文本的项目。

## 部署选项

您有两种方式部署此项目：

### 1. 一键部署 (推荐)

点击上方的 "Deploy with Workers" 按钮，即可将此项目部署到您的 Cloudflare 账户。Cloudflare 将会：

1.  为您 Fork 此仓库。
2.  引导您完成 Worker 的创建和部署。

这是最简单快捷的部署方式。

### 2. 通过 GitHub Actions 自动部署

如果您已经 Fork 或克隆了此仓库，并希望设置一个 CI/CD 流程，可以在您自己的仓库上配置 GitHub Actions 实现自动部署。

**设置步骤:**

1.  **在 Cloudflare 中获取凭证**

    您需要从 Cloudflare 获取 `Account ID` 和 `API Token`。

    -   **Account ID**:
        1.  登录到您的 Cloudflare 账户。
        2.  在主页右侧找到并复制您的 `Account ID`。

    -   **API Token**:
        1.  在您的 Cloudflare 账户中，转到 "My Profile" -> "API Tokens"。
        2.  点击 "Create Token"。
        3.  使用 "Edit Cloudflare Workers" 模板。
        4.  授权该 Token 访问您的账户资源。
        5.  创建并复制生成的 Token。

2.  **在您的 GitHub 仓库中设置 Secrets**

    为了让 GitHub Actions 能够安全地访问您的 Cloudflare 账户，您需要将上一步获取的凭证设置为仓库的 Secrets。

    1.  在您的 GitHub 仓库页面，转到 "Settings" -> "Secrets and variables" -> "Actions"。
    2.  点击 "New repository secret"。
    3.  创建以下两个 Secrets：
        -   `CF_ACCOUNT_ID`: 值为您的 Cloudflare Account ID。
        -   `CF_API_TOKEN`: 值为您的 Cloudflare API Token。

3.  **触发自动部署**

    完成以上步骤后，每次您将代码推送到 `main` 分支时，GitHub Actions 都会自动将您的 Worker 部署到 Cloudflare。您可以在仓库的 "Actions" 选项卡中查看部署状态。

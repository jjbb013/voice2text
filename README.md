# Voice2Text Cloudflare Worker

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/deploy?repo=https://github.com/jjbb013/voice2text)

这是一个通过 Cloudflare Worker 将语音转换为文本的项目。它内置了智能修正功能，可以根据发音自动校准识别错误的词语，特别适用于健身等专业领域。

## 核心功能

- **API 授权**: 通过 Bearer Token 保护您的 API，确保只有授权用户才能访问。
- **语音转文本**: 基于 Cloudflare AI 的 Whisper 模型进行高效的语音识别。
- **繁简转换**: 自动将识别出的繁体中文转换为简体中文。
- **智能拼音修正**:
    - 通过比较发音，自动修正 AI 可能识别错误的同音词或近音词（例如，将“饮体向上”修正为“引体向上”）。
    - 您可以通过 Cloudflare 的环境变量动态更新一个标准术语库，而无需修改代码或重新部署。

## 智能修正配置

为了提高特定领域（如健身）术语的识别准确率，本项目采用**拼音匹配**的策略进行自动修正。

### 工作原理

1.  您在 Cloudflare 的环境变量中维护一个**标准术语列表**（例如 `["引体向上", "负重", "俯卧撑"]`）。
2.  当 AI 返回识别文本后，程序会遍历文本，提取与您标准术语等长的片段。
3.  程序会比较这些文本片段与标准术语的**拼音**。
4.  如果一个片段的拼音与某个标准术语的拼音完全匹配，程序就会用这个标准术语替换掉原文中的片段。

这个方法可以有效地修正同音或近音的识别错误，且无需您预知所有可能的错词。

## API 使用与授权

为了保护您的 API 不被滥用，所有请求都需要进行授权验证。

### 如何调用 API

您需要通过 `POST` 请求调用 API，并在请求头中提供 `Authorization` 信息。

**请求示例 (使用 cURL):**

```bash
curl -X POST \
  --url https://your-worker-name.your-subdomain.workers.dev \
  --header 'Authorization: Bearer your-secret-token' \
  --form 'audio=@/path/to/your/audio/file.m4a'
```

请将 `your-worker-name.your-subdomain.workers.dev` 替换为您的 Worker 的实际 URL，并将 `/path/to/your/audio/file.m4a` 替换为您的音频文件的路径。

### 如何配置环境变量

您可以在 Cloudflare 的仪表盘中轻松更新您的配置。

1.  登录到您的 Cloudflare 账户。
2.  导航到 "Workers & Pages"，然后选择您的 `voice-to-text-api` Worker。
3.  进入 "Settings" -> "Variables"。
4.  在 "Environment Variables" 部分，点击 "Add variable" 来添加或修改变量。

#### 必要配置

-   **`AUTH_TOKEN` (安全密钥)**
    -   **Variable name**: `AUTH_TOKEN`
    -   **Value**: `your-secret-token` (或您希望使用的任何其他高强度密钥)
    -   **重要**: 为了安全，请点击 "Encrypt" 按钮对您的密钥进行加密。**切勿**将此密钥保存在 `wrangler.toml` 或任何公共代码库中。

#### 可选配置

-   **`CORRECT_TERMS` (智能修正术语库)**
        -   **Variable name**: `CORRECT_TERMS`
        -   **Value**: 一个包含您所有标准术语的 JSON 数组字符串。例如：
            ```json
            [
              "引体向上",
          "负重",
          "俯卧撑",
          "杠铃卧推",
          "哑铃卧推",
          "深蹲",
          "硬拉",
          "划船",
          "弯举",
          "臂屈伸",
          "卷腹",
          "平板支撑",
          "公斤",
          "次",
          "组"
        ]
        ```
6.  点击 "Save" 保存更改。

**重要提示**:
-   请确保您输入的是一个**合法**的 JSON 数组字符串。
-   每次更新这个环境变量后，更改会**立即生效**，无需重新部署 Worker。

## 部署选项

您有两种方式部署此项目：

### 1. 一键部署 (推荐)

点击上方的 "Deploy with Workers" 按钮，即可将此项目部署到您的 Cloudflare 账户。Cloudflare 将会：

1.  为您 Fork 此仓库。
2.  引导您完成 Worker 的创建和部署。
3.  部署完成后，请记得按照上面的指南配置 `CORRECT_TERMS` 环境变量。

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

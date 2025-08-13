# 项目概述

本项目是一个基于 Cloudflare Worker 的语音转文本服务。

## 功能说明

- **API 端点**: 提供一个 HTTP 端点，用于接收音频文件。
- **语音识别**: 将接收到的音频数据发送到语音识别服务，并将识别出的文本返回给客户端。

## 技术栈

- **运行时**: Cloudflare Workers
- **语言**: TypeScript
- **部署**: 使用 Wrangler 和 GitHub Actions 自动部署

## 使用方式

### 本地开发

1.  克隆仓库。
2.  安装依赖: `npm install`
3.  启动本地开发服务器: `npm run dev`

### 部署

该项目配置为通过 GitHub Actions 自动部署。将代码推送到 `main` 分支即可触发部署流程。

详细部署步骤请参考 `README.md` 文件。

# 使用轻量级Node镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装serve工具用于提供静态文件服务
RUN npm install -g serve

# 复制构建好的文件
COPY build/ /app/build/

# 暴露端口
EXPOSE 3001

# 启动静态文件服务器
CMD ["serve", "-s", "build", "-l", "3001"]
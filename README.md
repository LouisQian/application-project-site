# UAV Project Site

无人机农业测绘项目成果展示网站（多页面）。

## 页面
- 首页 `index.html`
- 方案原理 `principles.html`
- 创新模块 `modules.html`
- 成果数据 `results.html`
- 实物展示 `gallery.html`

## 本地预览
```powershell
python -m http.server 8080 -d .
```
然后访问 `http://127.0.0.1:8080/index.html`

## GitHub Pages 发布
1. 新建 GitHub 仓库（例如 `uav-project-site`）
2. 上传本目录全部文件到仓库根目录
3. 打开仓库 `Settings -> Pages`
4. Source 选择 `Deploy from a branch`
5. Branch 选择 `main / (root)` 并保存
6. 等待 1-2 分钟，访问：
   `https://<你的用户名>.github.io/uav-project-site/`

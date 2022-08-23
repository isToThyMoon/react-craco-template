# 环境依赖：

@craco/craco 6 官方支持 cra4 react-scripts4，后续会更新支持 cra5，目前可用，后续更新。
craco-less2 支持 craco6.1.2 以上，react-script5 以上

node16 版本会强制约束版本依赖树关系导致无法安装。
node14 正常。建议未升级 craco 完美支持 cra5 前使用 node14 版本。


# commit 规则：

git commit -m "type: xxxxxxxx"
不按规则写commit信息会无法 commit 推送
type 合法类型如下：

```js
[
  'build', 影响构建系统或外部依赖项的更改（webpack npm等）
  'chore',  构建配置相关 更改构建过程或辅助工具和库，例如文档生成
  'ci', 对ci配置文件和脚本的更改（一些自动化工具的配置文件 或者脚本修改）
  'docs', 仅文档修改
  'feat', 新功能 feature
  'fix', 错误修复
  'perf', 性能相关 改进性能的代码更改
  'refactor', 代码重构，既不修复错误也不增加新功能的代码更改（重构）
  'revert', 分支回溯
  'style', 样式相关 不影响代码含义的样式更改
  'test' 测试相关 添加缺失或更正现有测试
];
```











# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

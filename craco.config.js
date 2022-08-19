/*
 * @Author: 王荣
 * @Date: 2022-06-09 15:36:40
 * @LastEditors: 王荣
 * @LastEditTime: 2022-08-19 13:39:55
 * @Description: 填写简介
 */

`npm install @craco/craco babel-plugin-import craco-less --save-dev`;

const CracoLessPlugin = require("ayri-craco-less");
// const CracoLessPlugin = require("craco-less");
// const CracoLessPlugin = require("./config/craco-less/craco-less");
const {
  whenDev,
  whenProd,
  when,
  getPlugin,
  addPlugins,
  pluginByName,
  getLoader,
  removeLoaders,
  addBeforeLoaders,
  addAfterLoaders,
  loaderByName,
} = require("@craco/craco");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  babel: {
    plugins: [
      // 配置 babel-plugin-import 按需加载antd组件
      [
        "import",
        {
          libraryName: "antd",
          libraryDirectory: "es",
          // 按需加载定制less主题样式必须是true，style: 'css'是使用css文件没有样式变量 定制会失效
          style: true,
        },
        "antd",
      ],
    ],
  },
  // craco 提供的插件
  plugins: [
    // 配置 less
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // 自定义主题（如果有需要，单独文件定义更好一些）
              "@primary-color": "#415AF0",
              "@heading-color": "#222222",
              "@text-color": "#555555",
              "@text-color-secondary": "#222222",

              //控制表格无数据时显示暂无数据的字色
              "@disabled-color": "#555555",
              "@border-radius-base": "0px",

              // table
              // // 注意 表格有排序的时候，排序的表头会有一个div包裹住表头文字和图标设置此padding
              // // 如果再额外设置表头单元格(如通过onHeaderCell) padding时会叠加
              "@table-padding-vertical": "15px",
              "@table-padding-horizontal": "20px",

              "@table-header-bg": "#f5f7fa",
              "@table-header-sort-bg": "#f5f7fa",
              "@table-header-sort-active-bg": "#f5f7fa",
              "table-body-sort-bg": "#FFFFFF",
              "@table-border-color": "#dae0e6",
              "@table-border-radius-base": "0px",

              "@table-row-hover-bg": "#F2F8FF",
              // "@table-row-hover-bg": "#ECF0F5",

              //selectd
              "@table-selected-row-bg": "#F2F8FF",
              "@table-selected-row-hover-bg": "#F2F8FF",

              "@item-hover-bg": "#e7e9fb",

              // drawer
              // 高级画像配置
              "@drawer-header-padding": "20px",
              "@drawer-body-padding": "0px 20px 20px 20px",
            },
            // 支持内联 JavaScript
            javascriptEnabled: true,
          },
        },

        // modifyLessRule(lessRule, context) {
        //   // You have to exclude these file suffixes first,
        //   // if you want to modify the less module's suffix
        //   console.log('lessRule',lessRule)
        //   lessRule.use[0] = {
        //     loader: MiniCssExtractPlugin.loader,
        //     options: {}
        //   }
        //   return lessRule;
        // },

        // modifyLessModuleRule(lessModuleRule, context) {
        //   // Configure the file suffix
        //   // lessModuleRule.test = /\.m\.less$/;

        //   // Configure the generated local ident name.
        //   const cssLoader = lessModuleRule.use.find(loaderByName("css-loader"));
        //   console.log('lessModuleRule',lessModuleRule)

        //   lessModuleRule.use[0] = {
        //     loader: MiniCssExtractPlugin.loader,
        //     options: {}
        //   }
        //   return lessModuleRule;
        // },
      },
    },
  ],
  webpack: {
    /**
     * 重写 webpack 任意配置
     *  - 与直接定义 configure 对象方式互斥
     *  - 几乎所有的 webpack 配置均可以在 configure 函数中读取，然后覆盖
     */
    configure: (webpackConfig, { env, paths }) => {
      console.log("**entry**", webpackConfig.entry);
      console.log("**devtool**", webpackConfig.devtool);

      // 修改统计信息输出
      webpackConfig.stats = "normal";

      // devtool 决定sourcemap的形式
      // webpackConfig.devtool = false;
      whenProd(() => {
        // 生产环境关掉devtool 不输出sourcemap文件
        webpackConfig.devtool = false;
      });
      // 修改entry
      webpackConfig.entry = {
        // app: webpackConfig.entry,
        company_add_on: webpackConfig.entry,
        // button: path.resolve(__dirname, "src/components/button/index.tsx"),
        // button: './src/components/button/index.tsx'
      };

      // 修改 output
      webpackConfig.output = {
        ...webpackConfig.output,
        ...{
          // filename: whenDev(() => "static/js/bundle.js", "static/js/[name].js"),
          filename: whenDev(() => "static/js/[name].js", "static/js/[name].js"),
          chunkFilename: "static/js/[name].js",
        },
      };

      // 配置扩展扩展名
      webpackConfig.resolve.extensions = [
        ...webpackConfig.resolve.extensions,
        ...[".scss", ".less"],
      ];

      // 配置devserver相关配置
      console.log("devServer", webpackConfig.devServer);
      webpackConfig.devServer = {
        ...webpackConfig.devServer,
        port: 9000,
      };

      // 配置minimizer
      whenProd(() => {
        webpackConfig.optimization.minimize = true;
        webpackConfig.optimization.minimizer.map((plugin, index) => {
          if (plugin instanceof TerserPlugin) {
            webpackConfig.optimization.minimizer[index] = new TerserPlugin({
              extractComments: false, // 禁止生成license文件
              terserOptions: {
                parse: {
                  ecma: 8,
                },
                compress: {
                  ecma: 5,
                  warnings: false,
                  comparisons: false,
                  inline: 2,
                  //生产环境打包时删除console内容
                  drop_console: true,
                },
                mangle: {
                  safari10: true,
                },
                // Added for profiling in devtools
                keep_classnames: true,
                keep_fnames: true,
                output: {
                  ecma: 5,
                  comments: false,
                  ascii_only: true,
                },
              },
              // sourceMap: false,  新版仅建议在devtool中配置sourceMap 详见官方文档
            });
          }
        });
      });
      // 配置 splitChunks
      webpackConfig.optimization.splitChunks = {
        ...webpackConfig.optimization.splitChunks,
        ...{
          chunks: "all",
          name: false,
          // name(module, chunks, cacheGroupKey) {
          //   const moduleFileName = module
          //     .identifier()
          //     .split('/')
          //     .reduceRight((item) => item);
          //   const allChunksNames = chunks.map((item) => item.name).join('~');
          //   return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
          // },
          cacheGroups: {
            appVendor: {
              name: "company_add_on-vendor",
              // webpack4之前用test区分module位置，webpack5推荐使用type区分类型
              // 详见文档资源模块（asset module）的解释
              // type: "javascript/auto",
              test: /[\\/]node_modules[\\/]/,
              // priority: 20,
              chunks: (chunk) => {
                return chunk.name === "company_add_on";
              },
            },

            appMain: {
              name: "company_add_on-main",
              // webpack4之前用test区分module位置，webpack5推荐使用type区分类型
              // 详见文档资源模块（asset module）的解释
              // type: "javascript/auto",
              test: /[\\/]src[\\/]/,
              // priority: 10,
              chunks: (chunk) => {
                return chunk.name === "company_add_on";
              },
            },

            // 配合mini-css-extract-plugin,所有的 CSS 可以被提取到一个 CSS 文件中，请注意在 webpack 5 中应该使用 type 而不是 test，否则将会生成.js 文件而不是.css。这是因为 test 不知道应该去掉哪个模块（在这种情况下，它不会检测到.js 应该被删除）。
            appVendorStyles: {
              name: "company_add_on_vendor_styles",
              type: "css/mini-extract",
              // chunks: "all",
              // 清晰区分了type可不设置priority，没区分type时 会走上面的cache规则 影响打包出的包名
              // priority: 10,
              test: /[\\/]node_modules[\\/]/,
              chunks: (chunk) => {
                return chunk.name === "company_add_on";
              },
              enforce: true,
            },

            appMainStyles: {
              name: "company_add_on_main_styles",
              type: "css/mini-extract",
              // chunks: "all",
              // 清晰区分了type可不设置priority，没区分type时 会走上面的cache规则 影响打包出的包名
              // priority: 10,
              chunks: (chunk) => {
                return chunk.name === "company_add_on";
              },
              enforce: true,
            },

            // contentVendor : {
            //     name : "button-vendor",
            //     chunks : (chunk) => {
            //         console.log("********button vendor chunk", chunk);
            //         return chunk.name === "button";
            //     },
            // },

            // buttonStyles: {
            //     name: "button-styles",
            //     type: "css/mini-extract",
            //     // chunks: "all",
            //     chunks: (chunk) => {
            //         return chunk.name === "button";
            //     },
            //     enforce : true,
            // },
          },
        },
      };
      // webpackConfig.optimization.runtimeChunk = {
      //   ...webpackConfig.optimization.runtimeChunk,
      //   ...{
      //     name: "runtime"
      //   }
      // }

      // console.log('!!!webpackConfig.plugins', webpackConfig.plugins)

      // 覆盖已经内置的 plugin 配置

      // 开发环境增加MiniCssExtractPlugin 修改样式文件最后一步使用MiniCssExtractPlugin.loader
      whenDev(() => {
        // react新版开发环境不提供MiniCssExtractPlugin而是最后采用style loader，在线上override调试代码时不方便。
        addPlugins(webpackConfig, [
          new MiniCssExtractPlugin({
            filename: "static/css/[name].css",
            chunkFilename: "static/css/[name].css",
          }),
        ]);

        // 去除掉style loader
        removeLoaders(webpackConfig, loaderByName("style-loader"));

        // 这里的addBefore是按数组的顺序，css-loader的index是0，addBefore之后，css-loader的index就是1，MiniCssExtractPlugin.loader的index是0，符合理解。
        const result = addBeforeLoaders(
          webpackConfig,
          loaderByName("css-loader"),
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          }
        );

        // console.log(
        //   "!!!webpackConfig.module",
        //   webpackConfig.module.rules[1].oneOf[7].use[0],
        //   webpackConfig.module.rules[1].oneOf[7].use[1],
        //   webpackConfig.module.rules[1].oneOf[7].use[2],
        //   webpackConfig.module.rules[1].oneOf[7].use[3],
        //   webpackConfig.module.rules[1].oneOf[7].use[4],
        // );
      });

      // 修改loader
      // 修改file loader
      const { isFound: isFoundFileLoader, match: foundedFileLoader } =
        getLoader(webpackConfig, loaderByName("file-loader"));
      console.log("**foundedFileLoader**", foundedFileLoader);
      if (isFoundFileLoader) {
        Object.assign(foundedFileLoader.loader.options, {
          name: "static/media/[name].[hash].[ext]",
        });
      }

      //MiniCssExtractPlugin 默认react的cra配置只在npm run build时生效 生产环境运行
      const {
        isFound: isFoundMiniCssExtractPlugin,
        match: foundedMiniCssExtractPlugin,
      } = getPlugin(webpackConfig, pluginByName("MiniCssExtractPlugin"));
      console.log(
        "**foundedMiniCssExtractPlugin**",
        foundedMiniCssExtractPlugin
      );
      if (isFoundMiniCssExtractPlugin) {
        Object.assign(foundedMiniCssExtractPlugin.options, {
          filename: "static/css/[name].css",
          chunkFilename: "static/css/[name].css",
        });
      }

      const {
        isFound: isFoundWebpackManifestPlugin,
        match: foundedWebpackManifestPlugin,
      } = getPlugin(webpackConfig, pluginByName("WebpackManifestPlugin"));
      console.log(
        "**foundedWebpackManifestPlugin**",
        foundedWebpackManifestPlugin
      );
      if (isFoundWebpackManifestPlugin) {
        Object.assign(foundedWebpackManifestPlugin.options, {
          generate: (seed, files, entrypoints) => {
            const manifestFiles = files.reduce((manifest, file) => {
              manifest[file.name] = file.path;
              return manifest;
            }, seed);
            // const entrypointFiles = entrypoints.main.filter(
            //     fileName => !fileName.endsWith('.map')
            // );
            // 上面的语句导致入口文件名必须为main；如果重定义入口文件 必须修改它。
            let entrypointFiles = [];

            let filterUnMap = function (entryFiles) {
              return entryFiles.filter(
                (fileName) => !fileName.endsWith(".map")
              );
            };
            // 遍历所有入口文件生成然后再加入entrypointFiles
            Object.keys(entrypoints).forEach((entry) => {
              entrypointFiles.push(filterUnMap(entrypoints[entry]));
            });

            console.log("!!entrypointFiles!!", entrypointFiles);

            return {
              files: manifestFiles,
              entrypoints: entrypointFiles,
            };
          },
        });
      }
      // 需要分析打包后各文件包含模块时开启，使用npm run build
      // npm run deploy是个人定制在build完成后再自动将build后的资源文件copy到发布仓库并自动git三连
      // 如果开启了bundleanalyzer插件并开启分析的服务器 会导致deploy无法执行下面的自动部署代码。
      // whenProd(() => {
      //   addPlugins(webpackConfig, [new BundleAnalyzerPlugin()]);
      // });

      // 重新配置html-webpack-plugin
      // const {
      //   isFound : isFoundHtmlWebpackPlugin,
      //   match : foundedHtmlWebpackPlugin
      // } = getPlugin(webpackConfig, pluginByName("MiniCssExtractPlugin"));
      // console.log('**foundedHtmlWebpackPlugin**', foundedHtmlWebpackPlugin)
      // if (isFoundHtmlWebpackPlugin) {
      //     Object.assign(foundedHtmlWebpackPlugin.options, {
      //         fileName: (entryName) => entryName + '.html',
      //     });
      // }

      // 使用craco自带getPlugin方法 下面map方式的纯手写替换就可以废弃了
      // 覆盖已经内置的 plugin 配置
      // webpackConfig.plugins.map((plugin) => {
      //   whenProd(() => {
      //     if (plugin instanceof MiniCssExtractPlugin) {
      //       Object.assign(plugin.options, {
      //         filename: "static/css/[name].css",
      //         chunkFilename: "static/css/[name].css",
      //       });
      //     }
      //   });
      //   if (plugin instanceof WebpackManifestPlugin) {
      //     Object.assign(plugin.options, {
      //       generate: (seed, files, entrypoints) => {
      //         const manifestFiles = files.reduce((manifest, file) => {
      //           manifest[file.name] = file.path;
      //           return manifest;
      //         }, seed);
      //         // const entrypointFiles = entrypoints.main.filter(
      //         //     fileName => !fileName.endsWith('.map')
      //         // );
      //         //上面的语句导致入口文件名必须为main；如果重定义入口文件 必须修改它。
      //         let entrypointFiles = [];

      //         let filterUnMap = function(entryFiles) {
      //           return entryFiles.filter(
      //             (fileName) => !fileName.endsWith(".map"));
      //         };
      //         //遍历所有入口文件生成然后再加入entrypointFiles
      //         Object.keys(entrypoints).forEach((entry) => {
      //           entrypointFiles.push(filterUnMap(entrypoints[entry]));
      //         });

      //         console.log("!!", entrypointFiles);

      //         return {
      //           files: manifestFiles,
      //           entrypoints: entrypointFiles,
      //         };
      //       },
      //     });
      //   }

      //   return plugin;
      // });

      return webpackConfig;
    },
  },
};

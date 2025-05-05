import { terser } from 'rollup-plugin-terser';

export default {
  input: 'js/router.js',
  output: {
    file: 'dist/router.min.js',
    format: 'iife',
    name: 'Router',
    sourcemap: false
  },
  plugins: [
    terser({
      compress: {
        drop_console: true,  // 移除console语句
        drop_debugger: true, // 移除debugger语句
        passes: 3,           // 多次压缩以提高效果
        toplevel: true,      // 顶级变量和函数的压缩
        pure_funcs: ['console.log'], // 移除特定函数调用
        booleans_as_integers: true, // 布尔值转换为整数
        keep_fargs: false,   // 移除未使用的函数参数
        keep_fnames: false,  // 移除未使用的函数名
        reduce_vars: true,   // 合并和简化变量
        collapse_vars: true, // 合并和简化变量
        unused: true,        // 移除未使用的代码
        dead_code: true,     // 移除死代码
        conditionals: true,  // 优化条件表达式
        evaluate: true,      // 尽可能地计算常量表达式
        sequences: true,     // 使用逗号运算符合并语句
        join_vars: true      // 合并连续的 var 声明
      },
      mangle: {
        toplevel: true,      // 顶级变量和函数的混淆
        properties: {
          regex: /./         // 混淆所有属性
        }
      }
    })
  ]
}; 
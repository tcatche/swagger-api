# swagger-api
根据 Swagger 定义生成 axios api 的请求

# Installation
```shell
npm install swagger-api --dev
```
# 生成代码

```javascript
const path = require('path')
const swaggerGen = require('../index')
const testJson = require('./test.json')
// 循环初始化API
const opt = {
  swaggers: [
    {
      swagger: swaggerUrl, // swagger 可以为swagger的地址
      ignore: false, // 使用 ignore: true 则不执行此配置，false或不填则会重新生成
      fileName: 'api1', // 指定保存的文件名为api1.js
    },
    {
      swagger: swaggerJSONObj, // swagger 也可以为json 对象
      ignore: false, // 使用 ignore: true 则不执行此配置，false或不填则会重新生成
      fileName: 'api2', // 指定保存的文件名为api2.js
    }
  ],
  swaggersDir: path.join(__dirname, './api/') // 指定生成的文件的目录
}
try {
  swaggerGen.generateApis(opt) // generate 代码
} catch (err) {
  console.log(err)
}

```

# 使用生成的代码

使用前必须初始化
```javascript
import { requester } from './apis/api.js'
requester.setDomain('http://localhost:3000/api')
```

使用代码
```javascript
import { userLogin } from '../apis/api.js'

userLogin({
  userInfo: {
    username: 'admin',
    password: 'admin'
  }
}).then(function (resp) {
  console.log(resp.data)
})
```
All requests use **axios** module with promise, for more information about that follow axios documentation

# Links
 - [swagger-js-codegen](https://github.com/wcandillon/swagger-js-codegen)
 - [axinos](https://www.npmjs.com/package/axios)

# License

[MIT](https://opensource.org/licenses/MIT)

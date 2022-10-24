const request = require('request')
const fs = require('fs')
const path = require('path')
const Generator = require('./lib/generator.js')
const url = require('url')
/**
 * http 请求 swagger json文件
 * @param {*} swaggerUrl swagger json 文件地址
 */
function apiRequest (swaggerUrl) {
  return new Promise((resolve, reject) => {
    request
      .get(swaggerUrl, (error, resp, body) => {
        if (error) {
          reject(new Error(`${url} error: statusCode ${resp.statusCode}`))
        } else if (resp.statusCode !== 200) {
          reject(new Error(`${url} error: statusCode ${resp.statusCode}`))
        } else {
          resolve(JSON.parse(body))
        }
      })
  })
}

function saveFile (apiContent, outputName) {
  if (outputName.split('.').pop() !== 'js') {
    console.log(`outputName 必须以 '.js' 结尾，否则不会自动保存文件`)
    return apiContent
  }
  const dirName = path.dirname(outputName)
  fs.mkdirSync(dirName, { recursive: true }, (err) => {
    if (err) {
      console.error('创建文件夹失败:', dirName)
      throw err
    }
  })
  fs.writeFileSync(outputName, apiContent)
  return apiContent
}

/**
 * 根据swagger json描述生成axios请求方法
 * @param {*} opt swagger json数据对象
 */
function generateApi (swaggerOpt, swaggersDir) {
  const { swagger, fileName } = swaggerOpt
  if (!swagger) {
    return
  }
  function runGenerator (json) {
    if (fileName) {
      const content = Generator.genApiContent(json, fileName)
      const saveFileName = fileName.endsWith('.js') ? fileName : `${fileName}.js`
      const saveFilePath = path.resolve(swaggersDir, saveFileName)
      console.log('Generate api file:', saveFilePath)
      saveFile(content, saveFilePath)
    } else {
      console.log('Generate api fileName undefined, not generate!')
    }
  }
  if (typeof swagger === 'string' && swagger.startsWith('http')) {
    return apiRequest(swagger).then(runGenerator)
  }
  return Promise.resolve(swagger).then(runGenerator)
}

function generateApiBase (opts) {
  const content = Generator.genApiBase()
  const basePath = path.resolve(opts.swaggersDir, 'base.js')
  console.log('Generate base api file:', basePath)
  saveFile(content, basePath)
}

function generateApis (opts) {
  generateApiBase(opts)
  opts.swaggers.filter(item => !item.ignore)
  .forEach(async (item) => {
    await generateApi(item, opts.swaggersDir)
    // const fileName = item.fileName.endsWith('.js') ? item.fileName : `${item.fileName}.js`
    // const filePath = path.resolve(opts.swaggersDir, fileName)
    // console.log('Generate api file:', filePath)
    // await generateApi(item.swagger, filePath)
  })
}

module.exports.generateApis = generateApis

const Handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
const parse = require('./parse.js')
const beautify = require('js-beautify').js_beautify
const apiTemplate = fs.readFileSync(path.join(__dirname, './template/api.hbs'), 'utf-8')
const base = fs.readFileSync(path.join(__dirname, './template/base.hbs'), 'utf-8')
const methods = fs.readFileSync(path.join(__dirname, './template/methods.hbs'), 'utf-8')
const method = fs.readFileSync(path.join(__dirname, './template/method.hbs'), 'utf-8')
Handlebars.registerPartial('base', base)
Handlebars.registerPartial('methods', methods)
Handlebars.registerPartial('method', method)
Handlebars.registerHelper('toLowerCase', function (word) {
  return word.toLowerCase()
})

const genApiContent = function (json) {
  const swaggerApiData = parse.parseApi(json)
  const apiContent = Handlebars.compile(apiTemplate)(swaggerApiData)
  return beautify(apiContent, { indent_size: 2, max_preserve_newlines: -1 })
}

const genApiBase = function () {
  const apiContent = Handlebars.compile(base)()
  return beautify(apiContent, { indent_size: 2, max_preserve_newlines: -1 })
}

module.exports.genApiBase = genApiBase
module.exports.genApiContent = genApiContent

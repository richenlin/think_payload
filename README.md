# 介绍
-----

[![npm version](https://badge.fury.io/js/think_payload.svg)](https://badge.fury.io/js/think_payload)
[![Dependency Status](https://david-dm.org/thinkkoa/think_payload.svg)](https://david-dm.org/thinkkoa/think_payload)

Payload parser for ThinkKoa

# 安装
-----

```
npm i think_payload
```

# 使用
-----

1、payload中间件为thinkkoa内置中间件,无需在项目中创建引用。该中间件默认开启

2、项目中间件配置 config/middleware.js:
```
config: { //中间件配置
    ...,
    payload: {
        extTypes: {
            json: ['application/json'],
            form: ['application/x-www-form-urlencoded'],
            text: ['text/plain'],
            multipart: ['multipart/form-data'],
            xml: ['text/xml']
        }
        limit: '1mb',
        encoding: 'utf-8',
        multiples: true,
        // keepExtensions: false,
        // multiples: true,
        // uploadDir:  os.tmpdir(),
        // hash: 'md5'

    }
}
```
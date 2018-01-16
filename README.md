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
        limit: '20mb',
        encoding: 'utf-8',
        //Sets the directory for placing file uploads in. You can move them later on using fs.rename(). The default is os.tmpdir().
        // uploadDir:  os.tmpdir(),
        //If you want checksums calculated for incoming files, set this to either 'sha1' or 'md5'.
        // hash: 'md5'
    }
}
```
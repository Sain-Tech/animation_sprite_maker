# Animation Sprite Maker

## 1. How to set-up
+ #### 1). Initialize npm
      $ npm init
      
+ #### 2). Modify package.json
      {
        "name": "app_name",
        "version": "1.0.0",
        "description": "app_description",
        "main": "main.js",
        "scripts": {
          "test": "echo \"Error: no test specified\" && exit 1",
          "start": "electron ."
        },
        "author": "Author",
        "license": "ISC",
      }
      
+ #### 3). Install electron npm module
       $ npm i --save-dev electron
       
+ #### 4). Install electron npm module
       $ npm i --save-dev electron
       
+ #### 5). Run the application
       $ npm start      

## 2. How to packaging the application
+ #### 1). Install packaging tools
      # npm i -g electron-packager asar
      
+ #### 2). Command for Windows platform
      $ electron-packager . AppName --platform win32 --arch x64 --out dist/
      
+ #### 3). Command for Mac OS platform
      $ electron-packager . AppName --platform darwin --arch x64 --out dist/

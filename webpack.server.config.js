'use strict';

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const  NODE_ENV_DEV = 'dev1';
const  NODE_ENV_PROD = 'prod';
const  NODE_ENV = process.env.NODE_ENV.trim() || NODE_ENV_DEV;


module.exports = {
    entry:{
        server:'./nodeserver/server',
        mono:'./nodeserver/server_mono'
    },
    output: {
        path:path.join(__dirname,'back'),
        filename:'[name].js',
        library: '[name]'
    },
    watch: (NODE_ENV == NODE_ENV_DEV),
    watchOptions:{
        aggregateTimeout: 100
    },
    devtool: false,
    plugins:[
        new webpack.DefinePlugin({
            NODE_ENV:JSON.stringify(NODE_ENV)
        }),
    ],
    //module:{
    //    loaders:[{
    //        test:/\.js$/,
    //        include:[
    //            path.join(__dirname,'nodeserver')
    //        ],
    //        exclude:/\/node_modules\//,
    //        loader:'babel-loader',
    //        query: {
    //            presets: ['env']
    //        }
    //    }],
    //    noParse:/\/node_modules\/[^!]+/,
    //},
  resolve:
  {
      alias: {
          'handlebars' : 'handlebars/dist/handlebars.js'
      }
  },
  target: 'node',
  externals: [nodeExternals()]
   
};

if(NODE_ENV==NODE_ENV_PROD){
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            warning:false,
            drop_console:true,
            unsave:true
    })
);
}




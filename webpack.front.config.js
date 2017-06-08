'use strict';

const path = require('path');
const webpack = require('webpack');

const  NODE_ENV_DEV = 'dev';
const  NODE_ENV_PROD = 'prod';
const  NODE_ENV = process.env.NODE_ENV.trim() || NODE_ENV_DEV;


module.exports = {
    entry: {
        front: ['./frontend/front']
},
    output: {
        path:path.join(__dirname,'public/js'),
        filename:'bundle.js',
        library: '[name]'
    },
    watch: (NODE_ENV == NODE_ENV_DEV),
    watchOptions:{
        aggregateTimeout: 100
    },
    devtool: (NODE_ENV == NODE_ENV_DEV ? 'source-map' : false),
    plugins:[
        new webpack.DefinePlugin({
            NODE_ENV:JSON.stringify(NODE_ENV)
        })],
    module:{
        loaders:[{
            test:/\.js$/,
            include:[
                path.join(__dirname,'frontend'),
                path.join(__dirname,'nodeserver')
                ],
            loader:'babel-loader',
            query: {
                presets: ['env']
            },
            exclude:/\/node_modules\//
        }],
        noParse:/\/node_modules\/[^!]+/
    }
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




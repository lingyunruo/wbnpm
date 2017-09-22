const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const HappyPack = require('happypack');

const entryDir = path.join(__dirname, './src/entry');

function getEntry(filepath) {

	try {
		let filelist = fs.readdirSync(filepath);
		let entryList = {};

		filelist.map((file) => {
			let name = path.parse(file).name;

			entryList[name] = path.join(entryDir, file);
		});

		return entryList;
	}
	catch(e) {
		console.log(`get entry is error: ${e}`);
	}
}

module.exports = {
    entry: getEntry(entryDir),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            use: ['happypack/loader'],
	        exclude: function(path) {
		        let isNpmModule = !!path.match(/node_modules/);
		        return isNpmModule;
            }
        }, {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", "sass-loader"]
            })
        }, {
        	test: /\.(png|jpg|gif)$/,
	        use: [{
        		loader: 'url-loader',
		        options: {
        			limit: 8192
		        }
	        }]
        }]
    },
	resolve: {

    },
    plugins: [
        new ExtractTextPlugin("[name].css"),
	    // new CommonsChunkPlugin('common.js', ['index']),
	    new webpack.DllReferencePlugin({
		    context: __dirname,
		    /**
		     * 在这里引入 manifest 文件
		     */
		    manifest: require('./dist/vendor-manifest.json')
	    }),
	    new HappyPack({
		    loaders: ['babel-loader?presets[]=env']
	    })
    ]
};
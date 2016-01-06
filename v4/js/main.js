define('main', [], function () {
    require.config({
        baseUrl: './js/',
        paths: {
            'jquery': 'jquery-1.8.2',
			'imageSlider': 'imageSlider',


        },
        shim: {
            'imageSlider': ['jquery']
        }
    });

    /*
    启动站点
    这里先加载头部是因为头部里有些重要的事件需要优先载入
    */
    require(['imageSlider'
    ],function(imageSlider){
		var slide=new imageSlider();
	});



});

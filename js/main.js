(function ($) {
    "use strict";
    // loader
    var loader = function () {
        setTimeout(function () {
            if ($('#loader').length > 0) {
                $('#loader').removeClass('show');
            }
        }, 1);
    };
    loader();
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('nav-sticky');
        } else {
            $('.navbar').removeClass('nav-sticky');
        }
    });
    
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });

    
    // Main carousel
    $(".carousel .owl-carousel").owlCarousel({
        autoplay: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        items: 1,
        smartSpeed: 300,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ]
    });
    
    
    // Modal Video

    
    
    // Causes carousel
    $(".causes-carousel").owlCarousel({
        autoplay: true,
        animateIn: 'slideInDown',
        animateOut: 'slideOutDown',
        items: 1,
        smartSpeed: 450,
        dots: false,
        loop: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
    
    // Causes progress
    $('.causes-progress').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});
    
    
    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Testimonials carousel
    $(".testimonials-carousel").owlCarousel({
        center: true,
        autoplay: true,
        dots: true,
        loop: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
    	var chart1 = echarts.init(document.getElementById("main"));
    	
    	// 圆环图各环节的颜色
    	var color = ['rgb(58,105,156)', 'rgb(91,157,219)', 'rgb(239,116,33)', 'rgb(161,161,161)','rgb(255,198,4)','rgb(56,106,196)','rgb(102,168,58)'];
    	
    	// 圆环图各环节的名称和值(系列中各数据项的名称和值)
    	var data =[{  
    	                name: 'Into the black hole',
    	                value: 20
    	            },{
    	                name: 'Private Placement',
    	                value: 10
    	            },{
    	                name: 'Marketing',
    	                value: 15
    	            },{
    	                name: 'Charitable',
    	                value: 10
    	            },{
    	                name: 'Law',
    	                value: 5
    	            },{
    	                name: 'Pre-sale',
    	                value: 15
    	            },{
    	                name: 'Liquidity',
    	                value: 25
    	            }];
    	  
    	// 指定图表的配置项和数据
    	var option = {
    		fontFamily: "Quicksand",
    		//背景色
    		backgroundColor: {			// 背景颜色
    		    type: 'linear',
    		    x: 0,
    		    y: 0,
    		    x2: 0,
    		    y2: 1,
    		    colorStops: [{
    		        offset: 0, color: 'rgba(0,0,0,0.4)' // 0% 处的颜色
    		    }, {
    		        offset: 0.5, color: 'rgba(0,0,0,0.4)' 	// 50% 处的颜色
    		    }, {
    		        offset: 1, color: 'rgba(0,0,0,0.4)' // 100% 处的颜色
    		    }],
    		    globalCoord: false // 缺省为 false
    		},
    		
    	    // 标题
    	    title: [{
    	        text: 'Token Information',
    	        top:'5%',
    	        left:'3%',
    	        textStyle:{
    	            color: '#fff',
    	            fontSize:18,
    	        }
    	    }],
    	    

    	    
    	    // 提示框
    	    tooltip: {
    	        show: true,                 // 是否显示提示框
    	        formatter: '{b} </br> {d}%'      // 提示框显示内容,此处{b}表示各数据项名称，此项配置为默认显示项，{c}表示数据项的值，默认不显示，({d}%)表示数据项项占比，默认不显示。
    	    },

    	    
    	    // 系列列表
    	    series: [{
    	        name: '圆环图系列名称',         // 系列名称
    	        type: 'pie',                    // 系列类型 
    	        center:['50%','50%'],           // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。[ default: ['50%', '50%'] ]
    	        radius: ['30%', '45%'],         // 饼图的半径，数组的第一项是内半径，第二项是外半径。[ default: [0, '75%'] ]
    	        hoverAnimation: true,           // 是否开启 hover 在扇区上的放大动画效果。[ default: true ]
    	        color: color,                   // 圆环图的颜色
    	        label: {                        // 饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等.
    	            normal: {
    	                show: true,             // 是否显示标签[ default: false ]
    	                position: 'outside',    // 标签的位置。'outside'饼图扇区外侧，通过视觉引导线连到相应的扇区。'inside','inner' 同 'inside',饼图扇区内部。'center'在饼图中心位置。
    	                formatter: '{b} : {c}%'  // 标签内容
    	            }
    	        },
    	        labelLine: {                    // 标签的视觉引导线样式,在 label 位置 设置为'outside'的时候会显示视觉引导线。
    	            normal: {
    	                show: true,             // 是否显示视觉引导线。
    	                length: 15,             // 在 label 位置 设置为'outside'的时候会显示视觉引导线。
    	                length2: 10,            // 视觉引导项第二段的长度。
    	                lineStyle: {            // 视觉引导线的样式
    	                    //color: '#000',
    	                    //width: 1
    	                }
    	            }
    	        },
    	        data: data                      // 系列中的数据内容数组。
    	    }]
    	};
    	
    	// 使用刚指定的配置项和数据显示图表
    	chart1.setOption(option)
    // Related post carousel
    $(".related-slider").owlCarousel({
        autoplay: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            }
        }
    });
    
})(jQuery);


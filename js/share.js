/**
 * Created by cuss on 2016/4/6.
 */
/**
 * [名称]页面分享插件
 * [描述]Share
 *
 * [主要方法]
 * init(); 初始化
 * openWeixin() 弹出微信分享
 * toggleShare() 弹出或者影藏分享框
 * openQQ() 弹出qq
 * openSina() 弹出新浪分享
 * toTop() 返回顶层
 *  destory () 销毁
 *
 * [使用说明]
 * var r = $.Share({
     *          el 容器对象 在当前容器当中进行操作
     *         settings 设置  before  after 函数构造之后进行的操作
     * });
 *
 * [依赖文件]: jquery
 * [创建日期]: 2016-04-07
 * [作者]: zuohang
 * [版本]: v1.0
 */

(function ($) {
    var config = {
            url:'http://qr.liantu.com/api.php'
        },
        defaultHTML = '<div class="share-tools  bdsharebuttonbox open">' +
            '<div class="group">' +
            '<div class="qq item "><i class="img"></i> <a class="js-qq one" data-cmd="sqq">QQ</a> </div>' +
            '<div class="sina item"> <i class="img"></i> <a class="js-sina">新浪微博</a> </div>' +
            '<div class="weixin item"> <i class="img"></i> <a class="js-weixin one">微信</a><div class="tips"><img><p>请扫描分享到朋友圈</p> </div> </div> </div>' +
            '<div class="share-zw item"> <i class="img"></i> <a class="js-share-zw">分享展位</a> </div>' +
            ' <div class="to-top item"> <i class="img"></i> <a class="js-top">返回顶部</a> </div> </div>';

    //页面添加 元素
    $('body').append(defaultHTML);

    function Share(el,settings){
        if(settings&&settings.before){
            settings.before();
        }
        this.context = {};
        this.context.$dom = $(el);
        //设置底部的高度
        /*      this.context.footer = {
         height:$('.footer').height() || 293
         };*/
        this.shareSetting = {
            bottom:0,
            qq:{
                text:'QQ',
                handel:undefined
            },
            sina:{
                text:'新浪微博',
                handel:undefined
            },
            weixin:{
                text:'微信',
                $tips:undefined,
                handel:undefined
            },
            share:{
                text:'分享链接',
                handel:undefined
            },
            toTop:{
                text:'返回顶部',
                handel:undefined
            }
        }
        $.extend(this.shareSetting ,settings);
        this.render();
        if(settings&&settings.after){
            settings.after();
        }
    }
    Share.prototype = {
        constructor:Share,
        render: function () {
            var $items,
                that = this;

            $items = this.context.$dom.find('.item');
            $items.find('.js-qq').text(this.shareSetting.qq.text).on('click', function (e) {
                that.shareSetting.qq.handel.call(that,e);
            });
            $items.find('.js-sina').text(this.shareSetting.sina.text).on('click', function (e) {
                that.shareSetting.sina.handel.call(that,e);
            });
            $items.find('.js-weixin').text(this.shareSetting.weixin.text).on('hover', function (e) {

                that.shareSetting.weixin.handel.call(that,e);
            });
            $items.find('.js-share-zw').text(this.shareSetting.share.text).on('click', function (e) {
                that.shareSetting.share.handel.call(that,e);
            });
            $items.find('.js-top').text(this.shareSetting.toTop.text).on('click', function (e) {
                that.shareSetting.toTop.handel.call(that,e);
            });

            this.shareSetting.toTop.handel = this.toTop;
            this.shareSetting.share.handel = this.toggleShare;
            this.shareSetting.weixin.handel = this.openWeixin;
            this.shareSetting.sina.handel = this.openSina;
            this.shareSetting.qq.handel = this.openQQ;

            this.shareSetting.weixin.$tips =  this.context.$dom.find('.weixin .tips');
            //设置他的聚力左边的聚力
            this.resize();
            $(window).resize(function () {
                if(that.context.timmer) clearTimeout(that.context.timmer)
                that.context.timmer = setTimeout(function () {
                    that.resize();
                },100)
            })
            if(that.shareSetting .bottom !==0){
                $(window).scroll( function() {
                    //判断高度
                    var top =  document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop,
                        height = document.documentElement.scrollHeight,
                        clientHeight = document.documentElement.clientHeight;
                    if(height - top < clientHeight +that.shareSetting .bottom){
                        that.context.$dom.css({
                            'position':'fixed',
                            'bottom':clientHeight + that.shareSetting .bottom  - (height - top )
                        })
                    }else{
                        that.context.$dom.css({
                            'position':'fixed',
                            'bottom':'20px'
                        })
                    }
                });
            }
            $(window).trigger('scroll')
        },
        setBottom: function (bottom) {
            that.shareSetting .bottom = bottom
        },
        openQQ: function () {

        },
        resize : function () {
            var $body = $('body'),
                width = $body.width(),
                height = $body.height();
            //宽度1002px
            if(width<1050){
                this.context.$dom.css({
                    left:'auto',
                    right:0})
            }else{
                this.context.$dom.css({
                    left:width/2 + 530
                })
            }
        },
        openWeixin: function (e) {
            if(e.type === 'mouseenter'){
                this.shareSetting.weixin.$tips.stop().fadeIn(300);
            }else{
                this.shareSetting.weixin.$tips.stop().fadeOut(200);
            }
        },
        openSina: function () {
            window.open('http://v.t.sina.com.cn/share/share.php?title='+encodeURIComponent(document.title)+'&url='+encodeURIComponent(location.href)+'&source=bookmark','_blank','width=450,height=400');
        },
        toTop: function () {
            $('html,body').stop().animate({
                scrollTop:0
            },300)
        },
        toggleShare: function () {
            if(this.context.$dom.hasClass('open')) this.context.$dom.removeClass('open');
            else this.context.$dom.addClass('open');
        },
        _removeEvent: function () {
            var  $items = this.context.$dom.find('.item');
            $items.find('.js-qq').off('click');
            $items.find('.js-sina').off('click');
            $items.find('.js-weixin').off('click');
            $items.find('.js-share-zw').off('click');
            $items.find('.js-top span').off('click');
        },
        destroy: function () {
            this._removeEvent();
            this.context.$dom&& this.context.$dom.remove();
            this.context = undefined;
            this.shareSetting = undefined;
        }
    }
    $.Share = Share;
    var $tools = $('.share-tools');
    window.$share  = new $.Share($tools, {
        bottom: $('.footer').height()  + 97,
        before: function () {
            $tools.find('.weixin .tips img').attr('src',config.url + '?text='+ location.href + '');
        },
        after: function () {
            //然后添加插件 设置百度插件
            window._bd_share_config = {
                "common": {
                    "bdSnsKey": {},
                    "bdText": "内容",
                    "bdMini": "1",
                    "bdMiniList": false,
                    "bdPic": "",
                    "bdStyle": "1",
                    "bdSize": "16"
                },
                "share": {},
                "image": {"viewList": [ "sqq"], "viewText": "分享到：", "viewSize": "16"},
                "selectShare": {"bdContainerClass": null, "bdSelectMiniList": ["sqq"]}
            };
            with (document)0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
        }
    });

}(window.jQuery))
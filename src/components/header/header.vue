<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img width="64" height="64" :src="seller.avatar" alt=""><!-- src需加:綁定，因為在vue裡seller.avatar是不存在的-->
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description"><!--運送資訊-->
                    {{seller.description}}/{{seller.deliveryTime}}分鐘送達
                </div>
                <div v-if="seller.supports" class="support">
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div v-if="seller.supports" class="support-count">
                <span class="count">{{seller.supports.length}}個</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div>
        <div class="bulletin-wrapper">
            <span class="bulletin-title"></span><span
             class="bulletin-text">{{seller.bulletin}}</span>
            <i class="icon-keyboard_arrow_right"></i>
        </div>
        <div class="background">
            <img width="100%" height="100%" :src="seller.avatar" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        // 接收seller
        props: {
            seller: {
                type: Object
            }
        },
        created() {
            this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
        }
    };
</script>

<style lang="sass">
 @import "../../common/sass/index"
 .header
    position: relative
    // overflow: hidden
    color: #fff
    background-color: rgba(7,17,27,0.5)
    .content-wrapper
        position: relative
        padding: 24px 12px 18px 24px
        font-size: 0
        .avatar
            display: inline-block
            vertical-align: top
            img
                border-radius: 2px
        .content
            display: inline-block
            margin-left: 16px
            .title
                margin: 2px 0 8px 0
                .brand
                    display: inline-block //brand本身沒內容，所以要設定inline-block空出空間
                    vertical-align: top
                    width: 30px
                    height: 18px
                    +bg-image('brand')
                    background-size: 30px 18px
                    background-repeat: no-repeat
                .name
                    margin-left: 6px
                    font-size: 16px
                    line-height: 18px
                    font-weight: bold
            .description
                margin-bottom: 10px
                line-height: 12px
                font-size: 12px
            .support
                .icon
                    display: inline-block
                    vertical-align: top
                    width: 12px
                    height: 12px
                    margin-right: 4px
                    background-size: 12px 12px
                    background-repeat: no-repeat
                    &.decrease
                        +bg-image('decrease_1') //圖片
                    &.discount
                        +bg-image('discount_1')
                    &.guarantee
                        +bg-image('guarantee_1')
                    &.invoice
                        +bg-image('invoice_1')
                    &.special
                        +bg-image('special_1')
                .text
                    line-height: 12px
                    font-size: 10px
        .support-count
            position: absolute //相對於.content-wrapper定位
            right: 12px
            bottom: 18px
            padding: 0 8px
            height: 24px
            line-height: 24px
            border-radius: 14px
            background: rgba(0,0,0,0.2)
            text-align: center
            .count
                font-size: 10px
            .icon-keyboard_arrow_right
                line-height: 24px
                font-size: 10px
    .bulletin-wrapper
        position: relative
        height: 28px
        line-height: 28px
        padding: 0 22px 0 12px
        white-space: nowrap //文字不換行
        overflow: hidden
        text-overflow: ellipsis //多出去的顯示省略符...
        background-color: rgba(7,17,27,0.2)
        .bulletin-title
            display: inline-block
            vertical-align: top
            margin-top: 7px
            width: 22px
            height: 14px
            +bg-image('bulletin') //圖片
            background-size: 22px 14px
            background-repeat: no-repeat
        .bulletin-text
            vertical-align: top
            font-size: 10px
            margin: 0 4px
        .icon-keyboard_arrow_right
            position: absolute //相對於.bulletin-wrapper定位
            font-size: 10px
            right: 12px
            top: 8px
    .background
        position: absolute //相對於.header定位
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: -1
        filter: blur(10px)
</style>

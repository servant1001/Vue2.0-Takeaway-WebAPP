<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menuWrapper"><!--Vue1.x中使用v-el標記DOM元素，v-ref標記组件元素，2.0统一使用ref-->
            <ul>
                <li v-for="item in goods" class="menu-item" :key="item.id">
                    <span class="text border-1px">
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodsWrapper">
            <ul>
                <li v-for="item in goods" class="food-list" :key="item.id ">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li v-for="food in item.foods" class="food-item border-1px" :key="food.id">
                            <div class="icon">
                                <img width="57px" height="57px" :src="food.icon" alt="">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="description">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span>
                                    <span>好評論{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now"><span class="CNY">¥</span> {{food.price}}</span>
                                    <span class="old" v-show="food.oldPrice">¥ {{food.oldPrice}}</span>
                                    <span class="TWD"> TWD {{food.price * 4.5}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';
    const ERR_OK = 0;
    // let data = require('../../../data.json');
    export default {
        props: {
            seller: {
                type: Object
            }
        },
        data() {
            return {
                goods: []
            };
        },
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
            this.$http.get('api/goods').then((response) => {
                response = response.body;
                if (response.errno === ERR_OK) {
                    this.goods = response.data;
                    this._initScroll();
                }
                // console.log(this.goods); // 查看是否有接收到goods資料
            });
            // this.goods = data.goods;
        },
        methods: {
            _initScroll() {
                this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true
                });
                this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                    click: true
                });
            }
        }
    };
</script>

<style lang="sass">
    @import "../../common/sass/index"
    .goods
        position: absolute
        display: flex
        top: 174px
        bottom: 46px
        width: 100%
        overflow: hidden
        .menu-wrapper
            flex: 0 0 80px
            width: 80px
            background: #f3f5f7
            .menu-item
                display: table // 文字多行垂直置中
                width: 56px
                height: 54px
                line-height: 14px
                padding: 0 12px
                .icon
                    display: inline-block
                    vertical-align: top
                    width: 12px
                    height: 12px
                    margin-right: 2px
                    background-size: 12px 12px
                    background-repeat: no-repeat
                    &.decrease
                        +bg-image('decrease_3') // 優惠圖示
                    &.discount
                        +bg-image('discount_3')
                    &.guarantee
                        +bg-image('guarantee_3')
                    &.invoice
                        +bg-image('invoice_3')
                    &.special
                        +bg-image('special_3')
                .text
                    display: table-cell
                    vertical-align: middle
                    line-height: 14px
                    width: 56px
                    font-size: 12px
                    +border-1px(rgba(7,17,27,0.1))
        .foods-wrapper
            flex: 1
            .title
                padding-left: 12px
                height: 26px
                line-height: 26px
                font-size: 12px
                color: rgb(147,153,159)
                background: #f3f5f7
                border-left: 2px solid #d9dde1
            .food-item
                display: flex
                margin: 18px
                padding-bottom: 18px
                +border-1px(rgba(7,17,27,0.1))
                &:last-child
                    +border-none()
                    margin-bottom: 0
                .icon
                    flex: 0 0 57px
                    margin-right: 10px
                .content
                    flex: 1
                    .name
                        margin: 2px 0 8px 0
                        height: 14px
                        line-height: 14px
                        font-size: 14px
                        color: rgb(7,17,27)
                    .description, .extra
                        line-height: 10px
                        font-size: 10px
                        color: rgb(147,153,159)
                    .description
                        margin-bottom: 8px
                        line-height: 14px
                    .extra
                        margin-bottom: 2px
                        .count
                            margin-right: 12px
                    .price
                        font-weight: 700
                        line-height: 24px
                        .now
                            margin-right: 8px
                            font-size: 16px
                            color: rgb(240,20,20)
                        .old
                            text-decoration: line-through
                            font-size: 10px
                            color: rgb(147,153,159)
                        .TWD
                            font-size: 10px
                            color: rgb(147,153,159)
                        .CNY
                            font-size: 10px
</style>

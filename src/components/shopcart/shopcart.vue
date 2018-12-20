<template>
    <div>
        <div class="shopcart">
            <div class="content" @click="toggleList">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{'highlight':totalCount>0}">
                            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                        </div>
                        <div  class="num" v-show="totalCount>0">{{totalCount}}</div>
                    </div>
                    <div class="price" :class="{'highlight':totalPrice>0}">¥ {{totalPrice}}</div>
                    <div class="description">另需配送費{{deliveryPrice}}元</div>
                </div>
                <div class="content-right" @click.stop.prevent="pay"><!--stop.prevent 按下結帳確定後阻止購物車自動展開-->
                    <div class="pay" :class="payClass">
                        {{payDesc}}
                    </div>
                </div>
            </div>
            <div class="ball-container"><!-- 小球容器 -->
                <div v-for="ball in balls" :key="ball.id">
                    <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
                        <div class="ball" v-show="ball.show"><!-- 外層縱向動畫，內層橫向動畫-->
                            <div class="inner inner-hook"></div>
                        </div>
                    </transition>
                </div>
            </div>
            <transition name="fold">
                    <!-- <div class="shopcart-list" v-show="!fold&&listShow"> -->
                    <div class="shopcart-list" v-show="!fold">
                        <div class="list-header">
                            <h1 class="title">購物車</h1>
                            <span class="empty" @click="empty">清空</span>
                        </div>
                        <div class="list-content" ref="listContent">
                            <ul>
                                <li class="food" v-for="food in selectFoods" :key="food.id">
                                    <span class="name">{{food.name}}</span>
                                    <div class="price">
                                        <span>¥ {{food.price*food.count}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <cartcontrol @add="addFood" :food="food"></cartcontrol>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
            </transition>
        </div>
        <transition name="fade">
            <div class="list-mask" @click="hideList" v-show="!fold"></div>
        </transition>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'; // 頁面滾動插件
    import cartcontrol from '../../components/cartcontrol/cartcontrol'; // 商品數量控制(-+)組建
    export default {
        props: {
            selectFoods: {
                type: Array,
                default() {
                    return [];
                }
            },
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                balls: [ // 創建5個小球用於動畫，目的在於多次快速點擊時可以同時出現多個小球
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    }
                ],
                dropBalls: [], // 創建dropBalls用來儲存處在下落中的小球
                fold: true // 購物車是否折疊(沒展開)
            };
        },
        computed: {
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count;
                });
                return total;
            },
            totalCount() {
                let count = 0;
                this.selectFoods.forEach((food) => {
                    count += food.count;
                });
                return count;
            },
            payDesc() {
                if (this.totalPrice === 0) {
                    return `${this.minPrice}元起送`;
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `還差${diff}元起送`;
                } else {
                    return `去結算`;
                }
            },
            payClass() {
                if (this.totalPrice < this.minPrice) {
                    return 'not-enough';
                } else {
                    return 'enough';
                }
            }
            // ,
            // listShow() {
            //     let show = !this.fold;
            //     if (show) {
            //         this.$nextTick(() => {
            //             if (!this.scroll) {
            //                 this.scroll = new BScroll(this.$refs.listContent, {
            //                     click: true
            //                 });
            //             } else {
            //                 this.scroll.refresh();
            //             }
            //         });
            //     }
            //     return show;
            // }
        },
        watch: {
            totalCount: function() {
                if (!this.totalCount) {
                    this.fold = true;
                    return false;
                }
            },
            fold: function(totalCount) {
                let show = this.fold;
                if (show) {
                    this.$nextTick(() => {
                        if (!this.scroll) {
                            this.scroll = new BScroll(this.$refs.listContent, {
                                click: true
                            });
                        } else {
                            this.scroll.refresh();
                        }
                    });
                }
                return show;
            }
        },
        methods: {
            drop(el) {
                // console.log(el);
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.show) {
                        ball.show = true;
                        ball.el = el;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            beforeDrop(el) { // 設置小球(ball)初始位置
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if (ball.show) {
                        let rect = ball.el.getBoundingClientRect();
                        let x = rect.left - 32;
                        let y = -(window.innerHeight - rect.top - 22);
                        el.style.display = '';
                        el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                        el.style.transform = `translate3d(0,${y}px,0)`;
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                        inner.style.transform = `translate3d(${x}px,0,0)`;
                    }
                }
            },
            dropping(el, done) { // 手動觸發瀏覽器重繪
                /* eslint-disable no-unused-vars */
                let rf = el.offsetHeight;
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0,0,0)';
                    el.style.transform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0,0,0)';
                    inner.style.transform = 'translate3d(0,0,0)';
                    el.addEventListener('transitionend', done);
                });
            },
            afterDrop(el) { // 從儲存小球的dropBalls中unshift當前小球
                let ball = this.dropBalls.shift();
                if (ball) { // 重置小球
                    ball.show = false;
                    el.style.display = 'none';
                }
            },
            toggleList() {
                if (!this.totalCount) { // 若購物車為空
                    return; // 點擊無法應
                }
                this.fold = !this.fold;
            },
            hideList() {
                this.fold = true; // 收起購物車商品列表
            },
            empty() { // 清空購物車
                this.selectFoods.forEach((food) => {
                    food.count = 0;
                });
            },
            pay() {
                if (this.totalPrice < this.minPrice) { // 少於最低結帳金額直接返回
                    return;
                }
                window.alert(`支付${this.totalPrice}元`);
            },
            addFood(target) { // 子組件傳來的事件(小球)
                this.drop(target);
            }
        },
        components: {
            cartcontrol
        }
    };
</script>

<style lang="sass">
    @import "../../common/sass/index"
    .shopcart
        position: fixed
        left: 0
        bottom: 0
        z-index: 50
        width: 100%
        height: 48px
        .content
            display: flex
            background: #141d27
            font-size: 0
            color: rgba(255,255,255,.4)
            .content-left
                flex: 1
                .logo-wrapper
                    display: inline-block
                    position: relative
                    vertical-align: top
                    top: -10px
                    margin: 0 12px
                    padding: 6px
                    width: 44px
                    height: 44px
                    box-sizeing: border-box
                    border-radius: 50%
                    background: #141d27
                    text-align: center
                    .logo
                        width: 100%
                        height: 100%
                        border-radius: 50%
                        text-align: center
                        background: #2b343c
                        &.highlight
                            background: rgb(0,160,220)
                        .icon-shopping_cart
                            font-size: 24px
                            line-height: 44px
                            color: #80858a
                            &.highlight
                                color: #fff
                    .num
                        position: absolute
                        top: 0
                        right: 0
                        width: 24px
                        height: 16px
                        line-height: 16px
                        text-align: center
                        border-radius: 16px
                        font-size: 9px
                        font-weight: 700
                        color: #fff
                        background: rgb(240,20,20)
                        box-shadow: 0 4px 8px 0 rgba(0,0,0,.4)
                .price
                    display: inline-block
                    vertical-align: top
                    margin-top: 12px
                    padding-right: 14px
                    padding-left: 4px
                    line-height: 24px
                    box-sizing: border-box
                    border-right: 1px solid rgba(255,255,255,0.1)
                    font-size: 16px
                    font-weight: 700
                    &.highlight
                        color: #fff
                .description
                    display: inline-block
                    vertical-align: top
                    margin: 12px 0 0 12px
                    line-height: 24px
                    font-size: 10px
            .content-right
                flex: 0 0 105px
                width: 105px
                .pay
                    height: 48px
                    line-height: 48px
                    text-align: center
                    font-size: 12px
                    font-weight: 700
                    &.not-enough
                        background: #2b333b
                    &.enough
                        background: #00b43c
                        color: #fff
        .ball-container // 小球
            .ball
                position: fixed
                left: 32px
                bottom: 22px
                z-index: 200
                transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
                .inner
                    width: 16px
                    height: 16px
                    border-radius: 50%
                    background: rgb(0, 160, 220)
                    transition: all 0.4s linear
        .shopcart-list
            position: absolute
            left: 0
            top: 0
            z-index: -1
            width: 100%
            transform: translate3d(0, -100%, 0)
            &.fold-enter-active, &.fold-leave-active
                transition: all 0.5s
            &.fold-enter, &.fold-leave-active
                transform: translate3d(0, 0, 0)
            .list-header
                height: 40px
                line-height: 40px
                padding: 0 18px
                background: #f3f5f7
                border-bottom: 1px solid rgba(7,17,27,.1)
                .title
                    float: left
                    font-size: 14px
                    color: rgb(7,17,27)
                .empty
                    float: right
                    font-size: 12px
                    color: rgb(0,160,220)
            .list-content
                padding: 0 18px
                max-height: 217px
                overflow: hidden
                background: #fff
                .food
                    position: relative
                    padding: 12px 0
                    box-sizing: border-box
                    +border-1px(rgba(7,17,27,0.1))
                    .name
                        line-height: 24px
                        font-size: 14px
                        color: rgb(7,17,27)
                    .price
                        position: absolute
                        right: 90px
                        bottom: 12px
                        line-height: 24px
                        font-size: 14px
                        font-weight: 700
                        color: rgb(240,20,20)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 6px
    .list-mask
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: 40
        backdrop-filter: blur(10px) // 背景模糊
        opacity: 1 // transition start
        background: rgba(7, 17, 27, 0.6)
        &.fade-enter-active, &.fade-leave-active
            transition: all 0.5s
        &.fade-enter, &.fade-leave-active
            opacity: 0
            background: rgba(7, 17, 27, 0) // transition end
</style>

<template>
    <transition name="move">
        <div v-show="showFlag" class="food" ref="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image" alt="">
                    <div class="back" @click="hide">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好評率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                        <cartcontrol @add="addFood" :food="food"></cartcontrol>
                    </div>
                    <transition name="fade">
                        <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count||food.count===0">加入購物車</div>
                    </transition>
                </div>
                <split v-show="food.info"></split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品信息</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <split></split>
                <div class="rating">
                    <h1 class="title">商品評價</h1>
                    <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
                    <div class="rating-wrapper">
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="rating-item border-1px" :key="rating.id">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="avatar" width="12" height="12" :src="rating.avatar">
                                </div>
                                <div class="time">{{rating.rateTime | formatDate}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暫無評價</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import BScroll from 'better-scroll'; // 頁面滾動插件
    import Vue from 'vue';
    import {formatDate} from '../../common/js/date.js'; // 引入 export function 前面用{}包住，一般的export default則不需要
    import cartcontrol from '../../components/cartcontrol/cartcontrol'; // 商品數量控制(-+)組建
    import split from '../../components/split/split';
    import ratingselect from '../../components/ratingselect/ratingselect';
    const ALL = 2;
    export default {
        props: {
            food: {
                type: Object // 可以指定組件的 props 驗證規則，如果傳入的數據不符合要求Vue會發出警告
            }
        },
        data() { // 儲存元件內部狀態或資料，和 v-model 合作實現雙向綁定
            return {
                showFlag: false,
                selectType: ALL,
                onlyContent: true,
                desc: {
                    all: '全部',
                    positive: '推薦',
                    negative: '吐槽'
                }
            };
        },
        methods: {
            show() {
                this.showFlag = true;
                this.selectType = ALL;
                this.onlyContent = true;
                this.$nextTick(() => {
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.food, {
                            click: true
                        });
                    } else {
                        this.scroll.refresh();
                    }
                });
            },
            hide() {
                this.showFlag = false;
            },
            addFirst(event) {
                if (event._contructed) { // 防止PC多次點擊
                    return;
                }
                this.$emit('add', event.target); // 小藍球拋物線動畫
                Vue.set(this.food, 'count', 1); // import Vue from 'vue'
            },
            addFood(target) { // 小藍球拋物線動畫
                this.$emit('add', target); // 子組件使用 $emit 觸發父組件的定義事件
            },
            needShow(type, text) {
                if (this.onlyContent && !text) { // 如果他只要顯示內容但你又沒內容則不顯示
                    return false;
                }
                if (this.selectType === ALL) { // 判斷選擇類型
                    return true;
                } else {
                    return type === this.selectType;
                }
            },
            selectRating(type) {
                this.selectType = type;
                this.$nextTick(() => {
                    this.scroll.refresh(); // scroll 範圍刷新 (防止回彈)
                });
            },
            toggleContent() {
                this.onlyContent = !this.onlyContent;
                this.$nextTick(() => {
                    this.scroll.refresh();
                });
            }
        },
        filters: {
            formatDate(time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm'); // 放在date.js裡
            }
        },
        components: {
            cartcontrol,
            split,
            ratingselect
        }
    };
</script>

<style lang="sass">
    @import "../../common/sass/index"
    .food
        position: fixed
        top: 0
        left: 0
        bottom: 48px
        z-index: 30
        width: 100%
        background: #fff
        transform: translate3d(0,0,0) // transition start
        &.move-enter-active, &.move-leave-active
            transition: all 0.2s linear
        &.move-enter, &.move-leave-active
            transform: translate3d(100%,0,0) // transition end 從右到左滑入
        .image-header
            position: relative
            width: 100%
            height: 0
            padding-top: 100%
            img
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
            .back
                position: absolute
                top: 10px
                left: 0
                .icon-arrow_lift
                    display: block
                    padding: 10px
                    font-size: 20px
                    color: #fff
        .content
            position: relative
            padding: 18px
            .title
                margin-bottom: 8px
                line-height: 14px
                font-size: 14px
                font-weight: 700
                color: rgb(7,17,27)
            .detail
                margin-bottom: 18px
                line-height: 10px
                height: 10px
                font-size: 0
                .sell-count, .rating
                    font-size: 10px
                    color: rgb(147,153,159)
                .sell-count
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
            .cartcontrol-wrapper
                position: absolute
                right: 12px
                bottom: 12px
            .buy
                position: absolute
                right: 18px
                bottom: 18px
                z-index: 10
                height: 24px
                line-height: 24px
                padding: 0 12px
                box-sizing: border-box
                border-radius: 12px
                font-size: 10px
                color: #fff
                background: rgb(0, 160, 220)
                opacity: 1
                &.fade-enter-active, &.fade-leave-active
                    transition: all 0.2s
                &.fade-enter, &.fade-leave-active
                    opacity: 0
                    z-index: -1
        .info
            padding: 18px
            .title
                line-height: 14px
                margin-bottom: 6px
                font-size: 14px
                color: rgb(7, 17, 27)
            .text
                line-height: 24px
                padding: 0 8px
                font-size: 12px
                color: rgb(77, 85, 93)
        .rating
            padding-top: 18px
            .title
                line-height: 14px
                margin-left: 18px
                font-size: 14px
                color: rgb(7, 17, 27)
            .rating-wrapper
                padding: 0 18px
                .rating-item
                    position: relative
                    padding: 16px 0
                    +border-1px(rgba(7,17,27,0.1))
                    .user
                        position: absolute
                        top: 16px
                        right: 0
                        line-height: 12px
                        font-size: 0
                        .name
                            display: inline-block
                            margin-right: 6px
                            vetical-align: top
                            font-size: 10px
                            colo: rgb(147,153,159)
                        .avatar
                            border-radius: 50%
                    .time
                        margin-bottom: 6px
                        line-height: 12px
                        font-size: 10px
                        color: rgb(147,153,159)
                    .text
                        line-height: 16px
                        font-size: 12px
                        color: rgb(7,17,27)
                        .icon-thumb_up, .icon-thumb_down
                            margin-right: 4px
                            line-height: 24px
                            font-size: 12px
                        .icon-thumb_up
                            color: rgb(0,160,220)
                        .icon-thumb_down
                            color: rgb(147,153,159)
                .no-rating
                    padding: 16px 0
                    font-size: 12px
                    color: rgb(147,153,159)
</style>

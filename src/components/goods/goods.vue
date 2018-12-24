<template>
    <div>
        <div class="goods">
            <div class="menu-wrapper" ref="menuWrapper"><!--Vue1.x中使用v-el標記DOM元素，v-ref標記组件元素，2.0统一使用ref-->
                <ul>
                    <li v-for="(item,index) in goods" class="menu-item" ref="menuList" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)" :key="item.id">
                        <span class="text border-1px">
                            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="foods-wrapper" ref="foodsWrapper">
                <ul>
                    <li v-for="item in goods" class="food-list" ref="foodList" :key="item.id"><!--商品類別-->
                        <h1 class="title">{{item.name}}</h1>
                        <ul>
                            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px" :key="food.id"><!--每種類別裡的商品-->
                                <div class="icon">
                                    <img width="57" height="57" :src="food.icon">
                                </div>
                                <div class="content">
                                    <h2 class="name">{{food.name}}</h2>
                                    <p class="description">{{food.description}}</p>
                                    <div class="extra">
                                        <span class="count">月售{{food.sellCount}}份</span><span>好評率{{food.rating}}%</span>
                                    </div>
                                    <div class="price">
                                        <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <cartcontrol @add="addFood" :food="food"></cartcontrol><!--@add用來傳遞在cartcontrol被點擊的+其DOM元素透過&emit派發給父組件good.vue-->
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice"
                        :minPrice="seller.minPrice"></shopcart><!--購物車組件-->
        </div>
        <food @add="addFood" :food="selectedFood" ref="food"></food><!--商品資訊組件(點擊商品後顯示)-->
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll'; // 頁面滾動插件
    import shopcart from '../../components/shopcart/shopcart'; // 購物車組件
    import cartcontrol from '../../components/cartcontrol/cartcontrol'; // 商品數量控制(-+)組建
    import food from '../../components/food/food'; // 商品資訊組件(點擊商品後顯示)

    const ERR_OK = 0;
    let data = require('../../../data.json');
    export default {
        props: {
            // seller: {
            //     type: Object
            // }
        },
        data() {
            return {
                goods: [],
                listHeight: [],
                scrollY: 0,
                selectedFood: {} // 點擊打開商品資訊，一開始無任何點擊
            };
        },
        computed: {
            currentIndex() { // 判斷目前落在哪個區間，回傳index
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i + 1];
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        this._followScroll(i);
                        return i;
                    }
                }
                return 0;
            },
            selectFoods() {
                let foods = [];
                this.goods.forEach((good) => {
                    good.foods.forEach((food) => {
                        if (food.count) {
                            foods.push(food);
                        }
                    });
                });
                return foods;
            }
        },
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
            this.seller = data.seller;
            this.$http.get('api/goods').then((response) => { // vue-resource
                response = response.body;
                if (response.errno === ERR_OK) {
                    this.goods = response.data;
                    this.$nextTick(() => { // $nextTick 是在下次DOM更新循環结束後執行延遲回調，在修改數據後使用$nextTick，可以在回調中獲取更新後的DOM，*這樣才可以確保執行函數是使用更新過的DOM
                        this._initScroll();
                        this._calculateHeight();
                    });
                }
                // console.log(this.goods); // 查看是否有接收到goods資料
            });
            this.goods = data.goods;
            this.$nextTick(() => { // $nextTick 是在下次DOM更新循環结束後執行延遲回調，在修改數據後使用$nextTick，可以在回調中獲取更新後的DOM，*這樣才可以確保執行函數是使用更新過的DOM
                this._initScroll();
                this._calculateHeight();
            });
        },
        methods: {
            selectMenu(index, event) { // 點擊左邊商品列表時，右側滾動到對應商品位置
                if (!event._constructed) { // 如果不存在這個屬性，則判斷為原生js點擊事件，不執行下面函数
                    return;
                }
                let foodList = this.$refs.foodList;
                let el = foodList[index];
                this.foodsScroll.scrollToElement(el, 300);
            },
            selectFood(food, event) { // 點擊右邊商品列表中商品時
                if (!event._constructed) {
                    return;
                }
                this.selectedFood = food;
                this.$refs.food.show(); // 調用food.vue裡的show()方法
            },
            addFood(target) { // 子組件傳來的事件 小球
                this._drop(target); // 傳遞Target
            },
            _drop(target) { // 有加_符號的方法代表為目前組件私有使用
                // 使用$nextTick目的為優化小球掉落動畫流暢度，因為有兩個動畫(-出現、小球)同時執行會卡，使用$nextTick避開同時執行
                this.$nextTick(() => {
                    this.$refs.shopcart.drop(target); // 調用shopcart組件中的drop方法，向shopcart組件傳入當前點擊的DOM元素
                });
            },
            _initScroll() { // BScroll
                this.meunScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true
                });

                this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                    click: true,
                    probeType: 3
                });

                this.foodsScroll.on('scroll', (pos) => {
                    // 判斷滑動方向，避免下拉时分類高亮錯誤（如第一分類商品數量為1時，下拉使得第二分類高亮）
                    if (pos.y <= 0) {
                        this.scrollY = Math.abs(Math.round(pos.y));
                    }
                });
            },
            _calculateHeight() { // 計算每種商品類別區塊高度
                let foodList = this.$refs.foodList;
                let height = 0;
                this.listHeight.push(height); // 第一個設height=0
                for (let i = 0; i < foodList.length; i++) {
                    let item = foodList[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                    // console.log(height);
                }
            },
            _followScroll(index) { // BScroll
                let menuList = this.$refs.menuList;
                let el = menuList[index];
                this.meunScroll.scrollToElement(el, 300, 0, -100); // scrollToElement(el, time, offsetX, offsetY, easing)
            }
        },
        components: { // 註冊組件
            shopcart,
            cartcontrol,
            food
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
                &.current // 目前位置的商品高亮白底
                    position: relative
                    margin-top: -1px
                    z-index: 10px
                    background: #fff
                    font-weight: 700
                    .text
                        +border-none()
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
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 12px
</style>

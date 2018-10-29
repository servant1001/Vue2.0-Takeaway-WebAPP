<template>
    <div class="cartcontrol">
        <transition name="move">
            <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
                <span class="inner icon-remove_circle_outline"></span>
            </div>
        </transition>
        <div class="cart-count" v-show="food.count">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
    </div>
</template>

<script>
    import Vue from 'vue';
    export default {
        props: {
            food: {
                type: Object
            }
        },
        created() {
            // console.log(this.food); // 檢查是否成功載入
        },
        methods: {
            addCart(event) {
                if (!event._constructed) { // 若不是我們開發的click直接忽略掉點擊(防止多點一次的情況發生)
                    return;
                }
                // console.log('click'); // 檢查點擊
                if (!this.food.count) {
                    Vue.set(this.food, 'count', 1); // 在vue中，要給一個新的對象設置屬性的時候，要引入Vue然後用它的set(k, v, default)方法來設置，這樣該屬性才會被動態的檢測
                } else {
                    this.food.count++;
                }
                this.$emit('add', event.target); // 將被點擊的+其DOM元素透過&emit派發給父組件good.vue
            },
            decreaseCart(event) {
                if (!event._constructed) {
                    return;
                }
                if (this.food.count) {
                    this.food.count--;
                }
            }
        }
    };
</script>

<style lang="sass">
    .cartcontrol
        font-size: 0
        .cart-decrease
            display: inline-block
            padding: 6px
            opacity: 1
            transform: translate3D(0, 0, 0)
            .inner
                display: inline-block
                line-height: 24px
                font-size: 24px
                color: rgb(0,160,220)
                transition: all 0.4s linear
                transform: rotate(0)
            &.move-enter-active, &.move-leave-active
                transition: all 0.4s linear
            &.move-enter, &.move-leave-active
                opacity: 0
                transform: translate3D(24px, 0, 0)
                .inner
                    transform: rotate(180deg)
        .cart-count
            display: inline-block
            vertical-align: top
            width: 12px
            padding-top: 6px
            line-height: 24px
            text-align: center
            font-size: 10px
            color: rgb(147,153,159)
        .cart-add
            display: inline-block
            padding: 6px
            line-height: 24px
            font-size: 24px
            color: rgb(0, 160, 220)
</style>

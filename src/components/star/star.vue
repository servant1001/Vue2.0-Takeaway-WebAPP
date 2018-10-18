<template>
    <div class="star" :class="starType">
        <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item" :key="itemClass.id"></span>
    </div>
</template>

<script>
    const LENGTH = 5;
    const CLS_ON = 'on';
    const CLS_HELF = 'half';
    const CLS_OFF = 'off';

    export default {
        props: {
            size: {
                type: Number
            },
            score: {
                type: Number
            }
        },
        computed: {
            starType() {
                return 'star-' + this.size;
            },
            itemClasses() {
                let result = [];
                let score = Math.floor(this.score * 2) / 2; // 換算顯示幾顆星(e.g. 4.3 = 4顆星)
                let hasDecimal = score % 1 !== 0; // 判斷有沒有小數
                let integer = Math.floor(score); // 多少個全星(四捨五入)
                for (let i = 0; i < integer; i++) {
                    result.push(CLS_ON);
                }
                if (hasDecimal) {
                    result.push(CLS_HELF);
                }
                while (result.length < LENGTH) { // 補齊空白星星
                    result.push(CLS_OFF);
                }
                return result;
            }
        }
    };
</script>

<style lang="sass">
    @import "../../common/sass/index"
    .star
        .star-item
            display: inline-block
            background-repeat: no-repeat
        &.star-48
            .star-item
                width: 20px
                height: 20px
                margin-right: 22px
                background-size: 20px 20px
                &:last-child
                    margin-right: 0
                &.on // 整顆星
                    +bg-image('star48_on')
                &.half // 半顆星
                    +bg-image('star48_half')
                &.off // 沒有星
                    +bg-image('star48_off')
        &.star-36
            .star-item
                width: 15px
                height: 15px
                margin-right: 6px
                background-size: 15px 15px
                &:last-child
                    margin-right: 0
                &.on // 整顆星
                    +bg-image('star36_on')
                &.half // 半顆星
                    +bg-image('star36_half')
                &.off // 沒有星
                    +bg-image('star36_off')
        &.star-24
            .star-item
                width: 10px
                height: 10px
                margin-right: 3px
                background-size: 10px 10px
                &:last-child
                    margin-right: 0
                &.on // 整顆星
                    +bg-image('star24_on')
                &.half // 半顆星
                    +bg-image('star24_half')
                &.off // 沒有星
                    +bg-image('star24_off')

</style>

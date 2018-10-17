<template>
  <div>
    <Header :seller="seller"></Header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods" exact>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">評論</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">店家</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/header/header.vue';

const ERR_OK = 0;

export default {
  name: 'App',
  data() {
    return {
      seller: {}
    };
  },
  created() {
    this.$http.get('api/seller?id=' + this.seller.id).then((response) => {
      response = response.body;
      if (response.error === ERR_OK) {
        this.seller = Object.assign({}, this.seller, response.data);
      }
      this.seller = response.data;
      // console.log(this.seller);
    });
  },
  components: {
    Header
  }
};
</script>

<style lang="sass">
  @import "./common/sass/mixin.sass"
  body,html
    margin: 0
    paddgin: 0
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    +border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
</style>

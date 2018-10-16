<template>
  <div>
    <Header/>
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

export default {
  name: 'App',
  data () {
    return {
      seller: {}
    };
  },
  components: {
    Header
  }
};
</script>

<style lang="sass">
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    .tab-item
      flex: 1
      text-align: center
</style>

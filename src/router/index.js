import Vue from 'vue';
import Router from 'vue-router';
import Resource from 'vue-resource';
import goods from '@/components/goods/goods';
import seller from '@/components/seller/seller';
import ratings from '@/components/ratings/ratings';

Vue.use(Router);
Vue.use(Resource);

export default new Router({
  linkActiveClass: 'active',
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'good',
      component: goods
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: ratings
    }
  ]
});

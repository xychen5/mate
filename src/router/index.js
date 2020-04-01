import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import IO from '@/components/IO'
import IOData from '@/components/IOData'
import VisualSimulation from '@/components/VisualSimulation'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/io',
      name: 'IO',
      component: IO,
      children: [
        {
          path: 'ioData',
          name: 'ioData',
          component: IOData
        },
        {
          path: 'visualSimulation',
          name: 'visualSimulation',
          component: VisualSimulation
        }
      ]
    }
  ],
  mode: 'history'
})

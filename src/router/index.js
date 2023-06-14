import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
    hidden: true

  },
  {
    path: '/login',
    name: 'login',
    hidden: true,
    component: () => import('@/components/Login')
  },

  // {
  //   //父级路由
  //   path: '/home',
  //   name: '成绩管理系统',
  //   redirect: '/home/info/student',
  //   component: () => import('@/components/Home'),
  //   //配置子路由
  //   children: [
  //     {
  //       path: '/home/info',
  //       name: '信息管理',
  //       component: () => import('@/components/info'),
  //       children: [
  //         {
  //           path: '/home/info/student',
  //           name: '学生列表',
  //           component: () => import('@/components/students/studentList')
  //         },
  //         {
  //           path: '/home/info/course',
  //           name: '课程列表',
  //           component: () => import('@/components/course/courseList')
  //         }
  //       ]
  //     },
  //     {
  //       path: '/result',
  //       name: '成绩管理',
  //       component: () => import('@/components/result/resultSearch'),
  //     }
  //
  //   ]
  // }
  {
    path: '/home',
    name: '个人信息',
    component: () => import('@/components/page/info')
  },
  {
    //父级路由
    path: '/management',
    name: '信息管理',
    redirect: '/management/student',
    component: () => import('@/components/Home'),
    //配置子路由
    children: [
      {
        path: '/management/student',
        name: '学生列表',
        component: () => import('@/components/page/studentList')
      },
      {
        path: '/management/teacher',
        name: '教师列表',
        component: () => import('@/components/page/teacherList')
      },
      {
        path: '/management/course',
        name: '课题列表',
        component: () => import('@/components/page/topicList')
      }
    ]
  },
  {
    path: '/selectedTopic',
    name: '选题情况',
    hidden: true,
    component: () => import('@/components/page/selectedTopic'),
  },
  {
    path: '/score',
    name: '成绩管理',
    hidden: true,
    component: () => import('@/components/page/score'),
  },
  {
    path: '/midcheck',
    name: '中期检查',
    hidden: true,
    component: () => import('@/components/page/midCheck'),
  },
  {
    path: '/defense',
    name: '答辩情况',
    hidden: true,
    component: () => import('@/components/page/defense'),
  }


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

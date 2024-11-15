import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/dev',
    component: Layout,
    redirect: '/dev/data_convert',
    name: 'Dev',
    meta: { title: '开发', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'gen_stream',
        name: 'GenStream',
        component: () => import('@/views/dev/gen_stream/index'),
        meta: { title: '流式生成器', icon: 'table' }
      },
      {
        path: 'data_convert',
        name: 'DataConvert',
        component: () => import('@/views/dev/data_convert/index'),
        meta: { title: '数据转换', icon: 'table' }
      },
      {
        path: 'data_source',
        name: 'data_source',
        component: () => import('@/views/dev/database_config/DataSourceManager'),
        meta: { title: '数据源管理', icon: 'table' }
      },
      {
        path: 'database_config',
        name: 'database_config',
        component: () => import('@/views/dev/database_config/DataManagement'),
        meta: { title: '数据管理', icon: 'table' }
      },
      {
        path: 'act_json_conf',
        name: 'act_json_conf',
        component: () => import('@/views/dev/act_json_conf/index'),
        meta: { title: '活动JSON配置', icon: 'table' }
      },
      {
        path: 'text_convert',
        name: 'TextConvert',
        component: () => import('@/views/dev/text_convert/index'),
        meta: { title: '文本转换', icon: 'table' }
      },
      {
        path: 'time_convert',
        name: 'TimeConvert',
        component: () => import('@/views/dev/time_convert/index'),
        meta: { title: '时间转换', icon: 'table' }
      },
      {
        path: 'regexp',
        name: 'regexp',
        component: () => import('@/views/dev/regexp/index'),
        meta: { title: '正则表达式', icon: 'table' }
      },
    ]
  },

  {
    path: '/bookmark',
    component: Layout,
    redirect: '/bookmark/list',
    name: 'bookmark',
    meta: { title: '书签管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'bookmark_list',
        name: 'bookmark_list',
        component: () => import('@/views/bookmark/bookmark_list.vue'),
        meta: { title: '书签列表', icon: 'table' }
      },
      {
        path: 'bookmark_folder_list',
        name: 'bookmark_folder_list',
        component: () => import('@/views/bookmark/bookmark_folder_list'),
        meta: { title: '文件夹列表', icon: 'tree' }
      }
    ]
  },

  {
    path: '/proto',
    component: Layout,
    redirect: '/proto/gen_stream_form',
    name: 'proto',
    meta: { title: '原型', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'gen_stream_form',
        name: 'gen_stream_form',
        component: () => import('@/views/proto/gen_stream_form/index'),
        meta: { title: '流式表单', icon: 'table' }
      },
      {
        path: 'gen_stream_form_gpt',
        name: 'gen_stream_form_gpt',
        component: () => import('@/views/proto/gen_stream_form/gpt'),
        meta: { title: '流式表单(gpt)', icon: 'table' }
      },
      {
        path: 'todo',
        name: 'todo',
        component: () => import('@/views/proto/gen_stream_form/index'),
        meta: { title: '占位', icon: 'table' }
      },
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

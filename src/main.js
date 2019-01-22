import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import router from './router';
import ElementUI from 'element-ui';
import vueQuillEditor from 'vue-quill-editor';
// require styles 引入样式
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import 'element-ui/lib/theme-chalk/index.css';
import store from './vuex/store';

Vue.use(ElementUI);
Vue.use(vueQuillEditor);
// 这里进行判断相对应的角色
// 例：roles['T1']中在对应的路径页面/operationData/userAnalysis/heldOutData是否属于权限可以查看
function hasPermission(roles, permissionRoles) {
    if(!permissionRoles) return true;
    return roles.some(role => permissionRoles.indexOf(role) >= 0);
}
const whiteList = ['/login', '/401'];
// 跳转规则
router.beforeEach((to, from, next) => {
    if(store.getters.token) {
        if(to.path==='/login') {
            // 虽然是跳转到login，但是在login会直接跳转到hello
            next();
            // 刷新取消掉
            // location.reload();
        } else {
            if(store.getters.roles.length===0) {
                // 在login组建里面进行直接服务器获取权限
                // 一般不进入这一层，在login中已经请求加上角色信息
                alert('对不起，权限丢失到火星了！');
            } else {
                // 没有动态改变权限的需求可直接next()
                // 进行对应的大路由切换的进行对应路由信息读取写入
                if(hasPermission(store.getters.roles, to.meta.role)) {
                    // 直接配置的初始页面的跳转没有权限判断
                    if(to.meta.role) {
                        // 大板块路由切换时，可以直接进入对应的之前保留的页面
                        // 大的版块的进行保存相应的路由信息的
                        if(to.path=='/operationData') {
                            next({ path:  store.getters.allroute[0]});                        
                        } else if(to.path=='/userManagement') {
                            next({ path:  store.getters.allroute[1]});                                                
                        } else if(to.path=='/operationSupport') {
                            next({ path:  store.getters.allroute[2]});                        
                        } else if(to.path=='/activities') {
                            next({ path:  store.getters.allroute[3]});                        
                        } else if(to.path=='/systemSetup') {
                            next({ path:  store.getters.allroute[4]});                        
                        } else if( 
                            // 在这里保存对应的存储路由的信息
                            // 在5个大的版块里面进行对应的路由信息保存
                            to.path.indexOf('/operationData')==0 || 
                            to.path.indexOf('/userManagement')==0 || 
                            to.path.indexOf('/operationSupport')==0 || 
                            to.path.indexOf('/activities')==0 || 
                            to.path.indexOf('/systemSetup')==0 
                        ){
                            store.dispatch('ChangeOneRoute', {path: to.path, data: store.getters.allroute})
                                .then((res) => {
                                    // console.log(res);
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                            next();
                        } else {
                            // 不在大板块里面的路由直接进行跳转
                            next();                        
                        }
                    } else {
                        // 没有权限的判断，初始化设置的路径不在权限范围内
                        // 该大项存在着对应展示，默认展示第0个
                        store.getters.addRouters.forEach((item, index1) => {
                            if(to.path.indexOf(item.path)==0){
                                item.children.forEach((subItem, index2) => {
                                    // 二、三级路由结构相同，相同处理
                                    next({ path: subItem.children[0].path });
                                });
                            } else {
                                // 过滤项不进行处理
                            }
                        });
                    }
                } else { 
                    // 该角色没有权限进行进入对应的路由，直接跳转404页面
                    next({ path: '/401' });
                }
            }
        }
    } else {
        // 在免登录白名单，直接进入，否则全部重定向到登录
        if(whiteList.indexOf(to.path) !== -1) { 
            next();
        } else {
            next('/login');
        }
    }
});

/* eslint-disable no-new */
new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app');
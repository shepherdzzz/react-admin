import ajax from './ajax';
import jsonp from 'jsonp';

export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

export function reqWeather(city) {
// 天气api：https://console.heweather.com/app/index
    const url = `https://free-api.heweather.net/s6/weather/now?location=${city}&key=6d93465464b54e568e8d3e62c58a0030`
    return new Promise((resolve,reject) => {
        jsonp(url, {
            param: 'callback'
        }, (error, response) => {
            if (!error&&response.status === 'ok') {
                const {weather} = response.HeWeather6.now.cond_txt
                const {temperature} =response.HeWeather6.now.fl
                resolve({weather, temperature})
            } else {
                alert('获取天气信息失败')
            }
        }
        )
    })
}

export const reqCategorys = (parentId) => ajax('/manage/category/list', {parentId})

export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add',
{
    parentId,
    categoryName
}, 'POST'
)

export const reqUpdateCategory = ({categoryId, categoryName}) => ajax('/manage/category/update', {
    categoryId,
    categoryName,
}, 'POST')

export const reqProduct = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})

export const reqSearchProducts = ({pageNum, pageSize, searchType, searchName}) => ajax('/manage/product/search', {pageNum, pageSize, [searchType]: searchName, })

export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id? 'update' : 'add'), product, 'POST')

export const reqUpdateProductStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')

export const reqDeleteImg = (name) => ajax('/manage/img/delete', name, 'POST')

export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')

export const reqRoles =() =>ajax('/manage/role/list')

export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')
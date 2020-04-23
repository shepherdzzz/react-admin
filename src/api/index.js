import ajax from './ajax';
import jsonp from 'jsonp';

export const reqLogin = (username, password) => ajax('/login', { username, password }, 'POST')

export function reqWeather() {
    // 天气api：https://console.heweather.com/app/index   
    return new Promise((resolve, reject) => {
        const url = `https://tianqiapi.com/api?version=v61&appid=18754824&appsecret=rkHmPZu8`
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()', err, data)
            if (!err ) {
                const { city,wea } = data
                resolve({ city, wea })
            } else {
                alert('获取天气信息失败')
            }
        }
        )
    })
}

export const reqCategory = (parentId) => ajax('/manage/category/list', { parentId })

export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add',
    {
        parentId,
        categoryName
    }, 'POST'
)

export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax('/manage/category/update', {
    categoryId,
    categoryName,
}, 'POST')

export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', { pageNum, pageSize })

export const reqSearchProducts = ({ pageNum, pageSize, searchType, searchName }) => ajax('/manage/product/search', { pageNum, pageSize, [searchType]: searchName, })

export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

export const reqUpdateProductStatus = (productId, status) => ajax('/manage/product/updateStatus', { productId, status }, 'POST')

export const reqDeleteImg = (name) => ajax('/manage/img/delete', name, 'POST')

export const reqAddRole = (roleName) => ajax('/manage/role/add', { roleName }, 'POST')

export const reqRoles = () => ajax('/manage/role/list')

export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')

export const reqAddOrUpdateUser = (user) => ajax('/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

export const reqUsers = () => ajax('/manage/user/list')

export const reqDeleteUser = (userId) => ajax('/mange/user/delete', { userId }, 'POST')
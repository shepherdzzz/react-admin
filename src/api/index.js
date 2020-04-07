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
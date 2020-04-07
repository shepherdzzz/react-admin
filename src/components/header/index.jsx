import React, { Component } from "react";
import {Modal} from 'antd';
import {withRouter} from 'react-router-dom';


import LinkButton from '../link-button';
import menuList from '../../config/menuConfig';
import {reqWeather} from '../../api'
import {formateDate} from '../../utils/dataUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.less'

class Header extends Component {

    state = {
        sysTime: formateDate(Date.now()),
        weather: '',
        tempareture: '',
    }
    getWeather = async () => {
        const {weather, tempareture} =await reqWeather('hangzhou')
        this.setState({
            weather,
            tempareture
        })
    }
    getSysTime = () => {
        this.intervalid = setInterval(() => {
            this.setState({
                sysTime: formateDate(Date.now())
            })
        }, 1000)
    }
    logout = () => {
        Modal.confirm({
            content: '确定退出吗？',
            onOk: () => {
                console.log('OK')
                storageUtils.removeUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }
    getTitle = (path) => {
        let title
        menuList.forEach(menu => {
            if(menu.key===path) {
                title = menu.title
            } else if (menu.children) {
                menu.children.forEach(item => {
                    if(path.indexOf(item.key)===0) {
                        title = item.title
                    }
                })
            }
        })
        return title
    }
    componentDidMount (){
        this.getSysTime();
        this.getWeather();
    }
    componentWillUnmount(){
        clearInterval(this.intervalid)
    }
    render() {
        const {sysTime, weather} = this.state
        const user = memoryUtils.user
        const path = this.props.location.pathname
        const title = this.getTitle(path)

        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{user.username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{sysTime}</span>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)

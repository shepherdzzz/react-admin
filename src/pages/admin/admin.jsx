import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import {Layout} from 'antd'
import memoryUtils from '../../utils/memoryUtils'
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/prodect'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'


const { Footer, Sider, Content } = Layout
export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        if (!user || !user._id) {
            return <Redirect to='/login' />
        }
        return (
            <Layout>
            <Header>
                <Header/>
            </Header>
            <Layout>
              <Sider><LeftNav/></Sider>
              <Content>Content</Content>
            </Layout>
            <Footer>推荐使用谷歌浏览器， 可以获得更佳页面操作体验</Footer>
          </Layout>
        )
    }
}
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';

import logo from '../../assets/images/logo.png';
import menuConfig from '../../config/menuConfig';
import './index.less';

const SubMenu = Menu.SubMenu;
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1738484_7kzenqfasuu.js',
});

class LeftNav extends Component {
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname

        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <IconFont type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                if (item.children.find(cItem => path.indexOf(cItem.key) === 0)) {
                    this.openkey = item.key
                }
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <IconFont type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    render() {
        const selectKey = this.props.location.pathname
        const openkey = this.openkey

        return (
            <div className="left-nav">
                <Link to='/home' className='logo-link'>
                    <img src={logo} alt="logo" />
                    <h1>后台管理系统</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[selectKey]}
                    defaultOpenKeys={[openkey]}
                >
                    {
                        this.getMenuNodes(menuConfig)
                    }
                </Menu>
            </div>
        )
    }
}

export default withRouter(LeftNav)
import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import logo from './images/logo.png'
import './login.less'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'

/* 登 陆 路 由 组 件 */
class Login extends Component {
    formRef = React.createRef();
    onFinish = async (err, values) => {
        // 检验成功
        if (!err) {
            console.log('提交登陆的ajax请求', values)
            // 请求登陆
            const { username, password } = values
            const result = await reqLogin(username, password) // {status: 0, data: user}  {status: 1, msg: 'xxx'}
            console.log('请求成功', result)
            if (result.status === 0) { // 登陆成功
                // 提示登陆成功
                message.success('登陆成功', 2)
                const user = result.data
                storageUtils.saveUser(user)
                memoryUtils.user = user
                this.props.history.replace('/')
            } else { // 登陆失败
                // 提示错误信息
                message.error(result.msg)
            }

        } else {
            console.log('检验失败!', err)
        }
    }
    render() {
        if (memoryUtils.user && memoryUtils.user._id) {
            return <Redirect to='/' />
        }
        return (

            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="logo" />
                    <h1>React 项目: 后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h3>用户登陆</h3>
                    <Form onFinish={this.onFinish} className="login-form" ref={this.formRef}>
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: '必须输入用户名!', },
                                { min: 4, message: '用户名必须大于4位' },
                                { max: 12, message: '用户名必须小于12位' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' }
                            ]}>
                            <Input prefix={<UserOutlined />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: '必须输入密码!', },
                                { min: 4, message: '密码必须大于4位' },
                                { max: 12, message: '密码必须小于12位' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是英文、数字或下划线组成' }
                            ]}>
                            <Input prefix={<LockOutlined />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button"> 登录 </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
export default Login

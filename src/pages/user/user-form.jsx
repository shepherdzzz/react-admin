import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd'

class UserForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        user: PropTypes.object,
        roles: PropTypes.array
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 }
        }
        const { user, roles } = this.props
        return (
            <Form initialValues={{ username: user.username, password: '', phone: user.phone, email: user.email }} {...formItemLayout}>
                <Form.Item label='用户名' name='username'>
                    <Input type='text' placeholder='请输入用户名' />
                </Form.Item>
                {
                    !user._id ?
                        (
                            <Form.Item label='密码' name='password'>
                                <Input type='password' placeholder='请输入密码' />
                            </Form.Item>
                        ) : null
                }
                <Form.Item label='手机号' name='phone'>
                    <Input type='phone' placeholder='请输入手机号' />
                </Form.Item>
                <Form.Item label='邮箱' name='email'>
                    <Input type='email' placeholder='请输入邮箱' />
                </Form.Item>
                <Form.Item label='角色' name='role_id'>
                    <Select>
                        {
                            roles.map(role => <Select.Options key={role._id} value={role._id}>{role.name}</Select.Options>)
                        }
                    </Select>
                </Form.Item>
            </Form>
        )
    }
}
export default UserForm
import React, { Component } from 'react'
import { Card, Button, Table, Modal } from 'antd'

import LinkButton from '../../components/link-button'
import UserForm from './user-form'
import { reqUsers, reqAddOrUpdateUser, reqDeleteUser } from '../../api'
import { formateDate } from '../../utils/dataUtils'
import { PAGE_SIZE } from '../../utils/constants'

export default class User extends Component {
    state = {
        isShow: false,
        users: [],
        roles: []
    }

    initColumns = () => {
        this.colums = [
            {
                titile: '用户名',
                dataIndex: 'username'
            },
            {
                titile: '邮箱',
                dataIndex: 'email'
            },
            {
                titile: '电话',
                dataIndex: 'phone'
            },
            {
                titile: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                titile: '所属角色',
                dataIndex: 'roles_id',
                render: value => this.roleNames[value]
            },
            {
                titile: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.clickDelete(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }
    iniitRoleNames = (roles) => {
        this.roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
    }

    clickDelete = (user) => {
        Modal.confirm({
            content: `确定删除${user.username}吗`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.state === 0) {
                    this.getUsers()
                }
            }
        })
    }
    showUpdate = (user) => {
        this.user = user
        this.setState({
            isShow: true
        })
    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.state===0) {
            const {users, roles} = result.data
            this.iniitRoleNames(roles)
            this.setState({
                users, roles
            })
        }
    }

    showAddUser = () => {
        this.user = null
        this.setState({
            isShow: true
        })
    }

    AddOrUpdateUser = async () => {
        const user = this.form.getFieldValue()
        this.form.resetFields()
        if (this.user) {
            user._id = this.user._id
        }
        this.setState({
            isShow: false
        })

        const result = await reqAddOrUpdateUser(user)
        if (result.state === 0){
            this.getUsers()
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        const {users, roles, isShow} = this.state
        const user = this.user || {}
        const title = <Button type='primary' onClick={this.showAddUser}>创建用户</Button>

        return (
            <div>
                <Card title={title}>
                    <Table 
                    columns={this.colums}
                    rowKey='_id'
                    dataSource={users}
                    bordered
                    pagination={{defaultPageSize: PAGE_SIZE, showQuickJumper: true}}
                    />
                    <Modal
                    title={user._id ? '修改用户':'添加用户'}
                    visible={isShow}
                    onCancel={() => this.setState({isShow: false})}
                    onOk={this.AddOrUpdateUser}
                    >
                        <UserForm 
                        setForm={(form) => this.form = form}
                        user={user}
                        roles={roles}
                        />
                    </Modal>
                </Card>
            </div>
        )
    }
}
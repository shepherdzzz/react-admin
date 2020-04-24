import React, { Component } from 'react'
import { Button, Card, Modal, Table, message, Form, Select, Input } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategory, reqUpdateCategory, reqAddCategory } from '../../api'
// import AddForm from './add-form'
// import UpdateForm from './update-form'
import { PlusOutlined, RightOutlined } from '@ant-design/icons'

const { Option } = Select;
/*
商品分类路由
 */
export default class Category extends Component {

    addformRef = React.createRef();
    updateformRef = React.createRef();

    state = {
        categorys: [],
        subCategorys: [],
        parentId: '0',
        parentName: '',
        loading: false,
        showStatus: 0,  // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
    }

    /*
    初始化Table所有列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name', // 显示数据对应的属性名
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}

                    </span>
                )
            }
        ]
    }


    getCategorys = async (parentId) => {
        this.setState({
            loading: true
        })
        parentId = parentId || this.state.parentId
        const result = await reqCategory(parentId)
        this.setState({
            loading: false
        })
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                this.setState({
                    categorys
                })
            } else {
                this.setState({
                    subcategorys: categorys
                })
            }
        } else {
            message.error('获取列表失败')
        }
    }

    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name,
        }, () => {
            this.getCategorys()
        })
    }

    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: [],
        })
    }

    handleCancel = () => {
        this.form.resetFields()
        this.setState({
            showStatus: 0
        })
    }

    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    showUpdate = (category) => {
        this.category = category
        this.setState({
            showStatus: 2
        })
    }

    addCategory = async () => {
        // 隐藏确认框
        this.setState({
            showStatus: 0
        })
        // 收集数据, 并提交添加分类的请求
        const { parentId, categoryName } = this.addformRef.current.getFieldsValue()
        // 清除输入数据
        this.addformRef.current.resetFields()
        const result = await reqAddCategory(parentId, categoryName)
        if (result.status === 0) {
            // 添加的分类就是当前分类列表下的分类
            if (parentId === this.state.parentId) {
                // 重新获取当前分类列表显示
                this.getCategorys()
            } else if (parentId === '0') { // 在二级分类列表下添加一级分类, 重新获取一级分类列表, 但不需要显示一级列表
                this.getCategorys('0')
            }
        }
    }

    updateCategory = async () => {
        const categoryId = this.category._id
        const { categoryName } = this.formRef.getFieldsValue()

        this.setState({
            showStatus: 0
        })

        this.formRef.resetFields()

        const result = await reqUpdateCategory({ categoryId, categoryName })
        if (result.status === 0) {
            this.getCategorys()
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getCategorys()
    }
    render() {
        const { categorys, subcategorys, parentId, parentName, loading, showStatus } = this.state;
        const category = this.category || {};
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <RightOutlined /> &nbsp;&nbsp;
                <span>{parentName}</span>
            </span>
        );
        const extra = (
            <Button onClick={this.showAdd} type="primary" icon={<PlusOutlined />}>添加</Button>
        );

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={parentId === '0' ? categorys : subcategorys}
                    columns={this.columns}
                    loading={loading}
                    pagination={{ pageSize: 5, showQuickJumper: true, showSizeChanger: true }}
                />
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={() => this.setState({ showStatus: 0 })}
                >
                    <Form ref={this.addformRef} >
                        <Form.Item label="所属分类" name="parentId" initialValues={parentName}>
                            <Select >
                                <Option value='0' >一级分类目录</Option>
                                {
                                    categorys.map(c => <Option value={c._name}>{c.name}</Option>)
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label='分类名称' name='categoryName' initialValues={''}>
                            <Input placeholder='请输入分类名称' />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={() => {
                        this.setState({ showStatus: 0 })
                        this.form.resetFields()
                    }
                    }
                >
                    <Form>
                        <Form.Item name="categoryName" label="分类名称" initialValues={category.name}>
                            <Input placeholder='请输入分类名称' />
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        )
    }
}
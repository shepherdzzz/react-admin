import React, { Component } from 'react'
import { Card, Select, Input, Button, Table, message, } from 'antd'
import { PlusSquareOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateProductStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

export default class ProductHome extends Component {
    state = {
        total: 0,
        product: [],
        searchType: 'procuctName',
        searchName: '',
    }

    updateProductStatus = async (productId, status) => {
        const result = await reqUpdateProductStatus(productId, status)
        if (result.status === 0) {
            message.success('更新状态成功!')
            this.getProducts(this.pageNum || 1)
        }
    }

    /*
    初始化table的列的数组
     */
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                    const { status, _id } = product
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => this.updateStatus(_id, newStatus)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            {/*将product对象使用state传递给目标路由组件*/}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    }

    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        const {  searchName, searchType } = this.state
        let result
        if (searchName) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchType, searchName })
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        console.log('getProducts()', result)
        if (result.state === 0) {
            const { total, list } = result.data
            this.setState({
                total, products: list
            })
        }
    }
    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        const { products, total, searchType } = this.state

        const title = (
            <span>
                <Select value={searchType} onChange={value => this.setState({ searchType: value })}>
                    <Select.Option key='productName' value='productName'>按名称搜索</Select.Option>
                    <Select.Option key='productDesc' value='productDesc'>按描述搜索</Select.Option>
                </Select>
                <Input style={{ width: 150, marginLeft: 10, marginRight: 10 }} placeholder='关键词' onChange={(e) => this.setState({ searchName: e.target.value })} />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary' style={{ float: 'right' }} onClick={() => this.props.history.push('/product/addupdate')}>
                <PlusSquareOutlined />添加商品
            </Button>
        )
        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        bordered
                        rowKey='_id'
                        columns={this.columns}
                        dataSource={products}
                        pagination={{
                            defaultPageSize: PAGE_SIZE,
                            total,
                            showQuickJumper: true,
                            onChange: this.getProducts
                        }}
                    />
                </Card>
            </div>
        )
    }
}
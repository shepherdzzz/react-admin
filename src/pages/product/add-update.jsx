import React, { Component } from 'react';
import { Card, Form, Input, Cascader, Button, message } from 'antd';
import LinkButton from '../../components/link-button'
import PicturesWall from './picture-wall'
import { reqCategory, reqAddOrUpdateProduct } from '../../api'
import { LeftOutlined } from '@ant-design/icons'
import RichtextEditor from './rich-text-editor';

const { Item } = Form
const { TextArea } = Input

/*
Product的添加和更新的子路由组件
 */
class ProductAddUpdate extends Component {
    state = {
        option: [],
    }

    constructor(props) {
        super(props);
        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef();
        this.editor = React.createRef()
    }

    initOptions = async (categorys) => {
        // 根据categorys生成options数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))

        // 如果是一个二级分类商品的更新
        const { product, isUpdate } = this
        if (isUpdate && product.pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(product.pCategoryId)
            // 生成二级下拉列表的options
            if (subCategorys && subCategorys.length > 0) {
                const cOptions = subCategorys.map(c => ({
                    value: c._id,
                    label: c.name,
                    isLeaf: true,
                }))
                // 找到当前商品对应的一级option对象
                const targetOption = options.find(options => options.value === product.pCategoryId)
                // 关联对应的一级option上
                targetOption.children = cOptions
            }
        }
        // 更新options状态
        this.setState({ options })
    }

    /*
    用加载下一级列表的回调函数
     */
    loadData = async (selectedOptions) => {
        // 得到选择的option对象
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false
        if (subCategorys && subCategorys.length > 0) {
            const cOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            targetOption.children = cOptions
        } else {
            targetOption.isLeaf = true
        }
        this.setState({
            option: [...this.state.option]
        });
    }
    /*
    异步获取一级/二级分类列表, 并显示
    async函数的返回值是一个新的promise对象, promise的结果和值由async的结果来决定
     */
    getCategorys = async (parentId) => {
        const result = await reqCategory(parentId)     // {status: 0, data: categorys}
        if (result.state === 0) {
            const categorys = result.data
            // 如果是一级分类列表
            if (parentId === 0) {
                this.initOptions(categorys)
            } else { // 二级列表
                return categorys    // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
            }
        }
    }


    validatePrice = (rule, value, callback) => {
        value = value * 1
        if (value > 0) {
            callback()
        } else {
            callback('价格必须是大于0的数值')
        }
    }

    /*
    用加载下一级列表的回调函数
     */
    loadData = async (selectedOptions) => {
        // 得到选择的option对象
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false
        if (subCategorys && subCategorys.length > 0) {
            const cOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            targetOption.children = cOptions
        } else {
            targetOption.isLeaf = true
        }
        this.setState({
            option: [...this.state.option]
        });
    }

    submit = () => {
        this.props.form.validateFields(async (values) => {
            const { name, desc, price, categoryIds } = values
            const imgs = this.pw.current.getImgs()
            const detail = this.editor.current.getDetail()

            let pCategoryId = ''
            let categoryId = ''
            if (categoryIds.length === 1) {
                pCategoryId = '0'
                categoryId = categoryIds[0]
            } else {
                pCategoryId = categoryIds[0]
                categoryId = categoryIds[1]
            }
            const product = { name, desc, price, pCategoryId, categoryId, detail, imgs }
            if (this.isUpdate) {
                product._id = this.product._id
            }
            const result = await reqAddOrUpdateProduct(product)
            if (result.status === 0) {
                message.success('保存商品成功')
                this.props.history.goBack()
            } else {
                message.success('保存商品失败')
            }
        })
    }

    componentDidMount() {
        this.getCategorys('0')
    }

    componentWillMount() {
        const product = this.props.location.state
        this.product = product || {}
        this.isUpdate = !!product
    }

    render() {
        const { product, isUpdate } = this
        const { pCategoryId, categoryId } = product
        const { options } = this.state
        const categoryIds = []
        if (isUpdate) {
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <LeftOutlined style={{ fontSize: 20 }} />
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        }

        return (
            <Card title={title}>
                <Form initialValues={{ name: product.name }} >
                    <Item label='商品名称' name='name' rules={[{ require: true, message: '商品名称必须输入' }]} {...formItemLayout}>
                        <Input placeholder='请输入商品名称' />
                    </Item>
                    <Item label='商品描述' name='desc' rules={[{ required: true, message: '商品描述必须输入' }]} {...formItemLayout}>
                        <TextArea placeholder='请输入商品描述' autoSize />
                    </Item>
                    <Item label='商品价格' name='price' rules={[{ required: true, message: '' }]} {...formItemLayout}>
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
                    </Item>
                    <Item label='商品分类' name='categoryIds' rules={[{ required: true, message: '商品分类必须输入' }]} {...formItemLayout}>
                        <Cascader options={options} loadData={this.loadData} />
                    </Item>
                    <Item label='商品图片' {...formItemLayout}>
                        <PicturesWall ref={this.pw} imgs={product.imgs} />
                    </Item>
                    <Item label='商品详情' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichtextEditor ref={this.editor} detail={product.detail} />
                    </Item>
                    <Button type='primary' onClick={this.submit}>提交</Button>
                </Form>
            </Card>
        )
    }
}

export default ProductAddUpdate
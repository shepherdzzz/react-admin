import React, {Component} from 'react';
import {Card, Form, Input, Cascader, Button, message} from 'antd';
import LinkButton from '../../components/link-button'
import PicturesWall from './picture-wall'
import {reqCategorys, reqAddOrUpdateProduct} from '../../api'
import {LeftOutlined} from 'ant-design/icons'
import RichtextEditor from './rich-text-editor';

const {Item} = Form
const {TextArea}  = Input

class ProductAddUpdate extends Component{
    state =  {
        option: [],
    }

    constructor(props){
        super(props);
        this.pw = React.createRef();
        this.editor = React.createRef()
    }

    loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false
        if(subCategorys&&subCategorys.length>0){
            const cOptions = subCategorys.map(c => ({
                value:c._id,
                label:c.name,
                isLeaf: true,
            }))
            targetOption.children = cOptions
        } else {
            targetOption.isLeaf = true
        }
        this.setState({
            option:[...this.state.option]
        });
    }

    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if(result.state===0){
            const categorys = result.data
            if(parentId===0){
                this.initOptions(categorys)
            }else{
                return categorys
            }
        }
    }

    initOptions = async(categorys) => {
        const options = categorys.map(c => ({
            value:c._id,
            label:c.name,
            isLeaf: false,
        }))

        const {product, isUpdate} = this
        if(isUpdate && product.pCategoryId!=='0'){
            const subCategorys = await this.getCategorys(product.pCategoryId)
            if(subCategorys&&subCategorys.length>0){
                const cOptions = subCategorys.map(c=>({
                    value:c._id,
                    label:c.name,
                    isLeaf:true,
                }))
                const targetOption = options.find(options => options.value===product.pCategoryId)
                targetOption.children = cOptions
            }
        }

        this.setState({options})
    }

    validatePrice = (rule,value, callback) => {
        value = value*1
        if(value>0){
            callback()
        }else{
            callback('价格必须是大于0的数值')
        }
    }

    submit = () => {
        this.props.form.validateFields(async (values) => {
            const {name,desc,price,categoryIds} = values
            const imgs =this.pw.current.getImgs()
            const detail = this.editor.current.getDetail()

            let pCategoryId = ''
            let categoryId = ''
            if(categoryIds.length===1){
                pCategoryId = '0'
                categoryId= categoryIds[0]
            } else {
                pCategoryId = categoryIds[0]
                categoryId = categoryIds[1]
            }
            const product ={name,desc,price,pCategoryId, categoryId,detail,imgs}
            if(this.isUpdate) {
                product._id = this.product._id
            }
            const result = await reqAddOrUpdateProduct(product)
            if(result.status===0){
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

    componentWillMount(){
        const product = this.props.location.state
        this.product = product || {}
        this.isUpdate = !!product
    }
    
    render() {
        const {product, isUpdate} = this
        const {pCategoryId, categoryId} = product
        const {options}  = this.state       
        const categoryIds =[]
        if(isUpdate){
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        const title = (
            <span>
                <LinkButton>
                <LeftOutlined  style={{fontSize:20}} />
                </LinkButton>
                {isUpdate?'修改商品':'添加商品'}
            </span>
        )

        const formItemLayout = {
            labelCol: {span:2},
            wrapperCol: {span:8}
        }

        return (
            <Card title={title}>
                <Form initialValues={{name:product.name}} >
                    <Item label='商品名称' name='name' rules={[{require: true, message: '商品名称必须输入'}]} {...formItemLayout}>
                        <Input placeholder='请输入商品名称' />
                    </Item>
                    <Item label='商品描述' name='desc' rules={[{required: true, message:'商品描述必须输入'}]} {...formItemLayout}>
                        <TextArea placeholder='请输入商品描述'  autoSize/>
                    </Item>
                    <Item label='商品价格' name='price' rules={[{required: true, message:''}]} {...formItemLayout}>
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
                    </Item>
                    <Item label='商品分类' name='categoryIds' rules={[{required: true, message:'商品分类必须输入'}]} {...formItemLayout}>
                        <Cascader options={options} loadData={this.loadData} />
                    </Item>
                    <Item label='商品图片' {...formItemLayout}>
                        <PicturesWall ref={this.pw} imgs={product.imgs} />
                    </Item>
                    <Item label='商品详情' labelCol={{span:2}} wrapperCol={{span:20}}>
                        <RichtextEditor ref={this.editor} detail={product.detail} />
                    </Item>
                    <Button type='primary' onClick={this.submit}>提交</Button>
                </Form>
            </Card>
        )
    }
}

export default ProductAddUpdate
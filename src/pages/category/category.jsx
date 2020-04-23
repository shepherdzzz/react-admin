import React,{Component} from 'react'
import { Button, Card, Modal,Table, message } from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategory, reqUpdateCategory, reqAddCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
import {PlusOutlined, RightOutlined} from '@ant-design/icons'

export default class Category extends Component {

    state = {
        categorys: [],
        subCategorys: [],
        parentId: '0',
        parentName: '',
        loading: false,
        showStatus: 0,
    }

    getCategorys = async (parentId) => {
        this.setState({
            loading: true
        })
        parentId = parentId ||this.state.parentId
        const result = await reqCategory(parentId)
        this.setState({
            loading:false
        })
        if (result.status===0) {
            const categorys = result.dataSource
            if (parentId==='0'){
                this.setState({
                    categorys
                })
            }else{
                this.setState({
                    subcategorys:categorys
                })
            }
        }else{
            message.error('获取列表失败')
        }
    }

    showSubCates = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name,
        }, ()=>{
            this.getCategorys()
        })
    }

    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: [],
            showStatus: 0,
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
        const {parentId, categoryName} = this.formRef.getFieldsValue()
        this.setState({
            showStatus: 0
        })
        this.form.resetFields()

        const result =await reqAddCategory(categoryName, parentId)
        if (result.status === 0) {
            if(parentId===this.state.parentId){
                this.getCategorys()
            } else if (parentId === '0') {
                this.getCategorys(parentId)
            }
        }
    }

    updateCategory = async () => {
        const categoryId =this.category._id
        const {categoryName} = this.formRef.getFieldsValue()

        this.setState({
            showStatus: 0
        })

        this.formRef.resetFields()

        const result = await reqUpdateCategory({categoryId, categoryName})
        if (result.status === 0) {
            this.getCategorys()
        }
    }

    componentWillMount(){
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={()=>this.showUpdate(category)} >修改分类</LinkButton>&nbsp;&nbsp;&nbsp;
                        {this.state.parentId === '0'?<LinkButton onClick={()=>this.showSubCates(category)}>查看子分类</LinkButton>:null}
                    </span>
                )
            }
        ]
    }

    componentDidMount(){
        this.getCategorys()
    }
    render(){
        const { categorys, subcategorys, parentId, parentName, loading, showStatus } = this.state;
        const category = this.category || {};
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton>一级分类列表</LinkButton>
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
                dataSource={parentId==='0' ? categorys : subcategorys}
                columns={this.columns}
                loading={loading}
                pagination={{pageSize: 5, showQuickJumper: true, showSizeChanger: true}}
                />
                <Modal
                title="添加分类"
                visible={showStatus===1}
                onOk={this.addCategory}
                onCancel={() => this.setState({showStatus: 0})}
                >
                    <AddForm
                    categorys={categorys}
                    parentId={parentId}
                    setForm={form => this.form =form}
                    />
                </Modal>
                <Modal
                title="修改分类"
                visible={showStatus===2}
                onOk={this.updateCategory}
                onCancel={() => {
                    this.setState({showStatus:0})
                    this.form.resetFields()
                }
                }
                >
                    <UpdateForm 
                    categoryName={category.name}
                    setForm={form => this.form =form} 
                    />
                </Modal>
            </Card>
        )
    }
}
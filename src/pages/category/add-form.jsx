import React, { Component } from 'react';
import { Form, Select, Input, Modal, message } from 'antd';
import PropTypes from 'prop-types';
import { reqAddCategory, reqCategory } from '../../api'

const { Option } = Select;

class AddForm extends Component {

    formRef = React.createRef();

    static propTypes = {
        categorys: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired,
        showStatus: PropTypes.number.isRequired,
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

    addCategory = async () => {
            // 隐藏确认框
            this.setState({
                showStatus: 0
            })
            // 收集数据, 并提交添加分类的请求
            const { parentId, categoryName } = this.formRef.current.getFieldsValue( )
            // 清除输入数据
            this.formRef.current.resetFields()
            const result = await reqAddCategory(categoryName, parentId)
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


    // componentWillMount() {
    //     // 将form对象通过setForm()传递父组件
    //     this.props.setForm(this.props.form)
    // }

    render() {
        const { categorys, parentId, showStatus } = this.props;
        return (
            <Modal
                title="添加分类"
                visible={showStatus === 1}
                onOk={this.addCategory}
                onCancel={() => this.setState({ showStatus: 0 })}
            >
                <Form ref={this.formRef} >
                    <Form.Item label="所属分类" name="parentId" initialValues={parentId}>
                        <Select >
                            <Option key='0' value='0' >一级分类目录</Option>
                            {
                                categorys.map(c => <Option key={c._id} value={c._name}>{c.name}</Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label='分类名称' name='category' initialValues={''}>
                        <Input placeholder='请输入分类名称' />
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

export default AddForm
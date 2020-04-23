import React, {Component} from 'react';
import {Form, Select, Input} from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

class AddForm extends Component {
    // const [form] = Form.useForm();
     static propTypes ={
         categorys: PropTypes.array.isRequired,
         parentId: PropTypes.string.isRequired,
         setForm: PropTypes.func.isRequired,
    }

    componentDidMount(){
        this.props.setForm(this.props.form)
    }

    render () {
        const {categorys, parentId} = this.props;
        return (
            // <Form form={form}>
            <Form >
                <Form.Item name="parentId" label="parentId" initialValues={parentId}>
                    <Select >
                        <Option key='0' value='0' >一级分类目录</Option>
                        {
                            categorys.map(c => <Option key={c._id} value={c._id}>{c._name}</Option>)
                        }
                    </Select>
                </Form.Item>
                <Form.Item label='分类名称' name='category' initialValues={''}>
                        <Input placeholder='请输入分类名称' />
                </Form.Item>
            </Form>
        )
    }
}

export default AddForm
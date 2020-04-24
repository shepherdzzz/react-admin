import React, {Component} from 'react';
import {Form, Input} from 'antd';
import PropTypes from 'prop-types';




class UpdateForm extends Component {
     static propTypes ={
         categoryName: PropTypes.string,
         setForm: PropTypes.func.isRequired,
    }

    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render () {
        const {categoryName} = this.props;
        return (
            <Form>
                <Form.Item name="categoryName" label="分类名称" initialValues={categoryName}>
                    <Input placeholder='请输入分类名称' />
                </Form.Item>
            </Form>
        )
    }
}

export default UpdateForm
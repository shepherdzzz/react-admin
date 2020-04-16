import React from 'react';
import PorpTypes from 'prop-types';
import { Upload, Moadl, message } from 'antd';
import {PlusOutlined} from '@ant-design/icons'

import { BASE_IMG_PATH, UPLOAD_IMG_NAME } from '../../utils/constants'
import { reqDeleteImg } from '../../api'
import { previewImage } from 'antd/lib/upload/utils';

export default class PictureWall extends React.Component {
    static PorpTypes = {
        imgs: PorpTypes.array
    }

    constructor(props) {
        super(props)
        let fileList = []
        const imgs = this.props.imgs
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                udi: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_PATH + img,
            }))
        }

        this.state = {
            previewVisible: false,
            perviewImage: '',
            fileList: fileList,
        }
    }

    getImgs = () => this.state.fileList.map(file => file.name)

    handleCancel = () => this.setState({previewVisible:false})

    handlePreview = (file) => {
        this.setState({
            perviewImage: file.url ||file.thumbUrl,
            previewVisible: true
        })
    }

    handleChange = async ({file, fileList}) => {
        console.log('handleChange()', file, fileList)
        if(file.state==='done'){
            const result = file.response
            if (result.status.state===0){
                message.success('上传成功')
                const {name, url} = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传失败')
            }
        } else if(file.status === 'removed') {
            const result = await reqDeleteImg(file.name)
            if(result.state ===0){
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }

        this.setState({fileList})
    }
    render (){
        const {previewVisible, perviewImage, fileList} = this.state

        const uploadButton = (
            <div>
                <PlusOutlined />
                <div>上传图片</div>
            </div>
        )

        return (
            <div>
                <Upload
                action="/manage/img/upload"
                accept="image/*"
                name= {UPLOAD_IMG_NAME}
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                >
                    {uploadButton}
                </Upload>
                <Moadl visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img src="example" src={previewImage} style={{width: '100%'}} />
                </Moadl>
            </div>
        )
    }
}
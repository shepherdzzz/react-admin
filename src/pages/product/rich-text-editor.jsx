import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Editor} from 'react-draft-wysiwyg'
import {EditorState, convertToRaw, ContentState} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichtextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }

    constructor(props) {
        super(props)
        const detail = this.props.detail
        let editorState
        if(detail) {
            const blocksFormHtml =htmlToDraft(detail)
            const { contentBlock, entityMap }= blocksFormHtml
            const ContentState = ContentState.createFormBlockArray(contentBlock,entityMap)
            editorState= EditorState.createWithContent(ContentState)
        } else {
            editorState = EditorState.createEmpty()
        }
        this.state = {editorState}
    }

    onEditorStateChange = (editorState) => {
        this.setState({editorState})
    }

    getDetail = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    render(){
        const {editorState} = this.state
        return (
        <Editor 
        editorState={editorState}
        editorStyle={{height: 250, border:'1px solid #000', padding: '0 30px'}}
        onEditorStateChange={this.onEditorStateChange}
        />
        )
    }
}
import * as React from 'react';
import * as monaco from 'monaco-editor';
import ReactDOM from 'react-dom'
import CellsManager from './CellsManager'

const startState = {
    language: 'markdown',
    defaultVal: 'test\ntest',
    options: {
      glyphMargin: true,
      contextmenu: false
    },
    rows: [],
    contentWidgets: [],
    newContentWidgets: true
}

export default class Notebook extends React.Component {

    constructor(props) {
        super(props);
        this.monacoRef = React.createRef();
        this._editor = null;
        this._model = monaco.editor.createModel(startState.defaultVal, startState.language);
        this._cells = []
    }

    componentDidMount() {
        this._editor = monaco.editor.create(this.monacoRef, startState.options);
        this._editor.setModel(this._model)

        this._cellsManager = new CellsManager(this._model, this._editor, this.props.kernelManager);

        this._model.onDidChangeContent((changeEvent) => {
            this._cellsManager.updateCells(changeEvent);
        })
    }

    render() {
        return <div style={this.props.style} ref={c => this.monacoRef = c}/>
    }
}

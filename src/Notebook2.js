import * as React from 'react';
import * as monaco from 'monaco-editor';
import CellsManager from './CellsManager'

const startState = {
    language: 'markdown',
    defaultVal: 'test\ntest',
    options: {
      glyphMargin: true,
      contextmenu: false,
      wordWrap: "on"
    },
    rows: [],
    contentWidgets: [],
    newContentWidgets: true,
}

export default class Notebook extends React.Component {

    constructor(props) {
        super(props);
        this.monacoRef = React.createRef();
        this._editor = null;
        this._model = monaco.editor.createModel(startState.defaultVal, startState.language);
        this._cells = []
        this.keyHandler = this.keyHandler.bind(this)
    }

    async componentDidMount() {
        this._editor = monaco.editor.create(this.monacoRef, startState.options);
        this._editor.setModel(this._model)
        
        this._cellsManager = new CellsManager(this._model, this._editor, this.props.kernelManager);

        this._model.onDidChangeContent((changeEvent) => {
            this._cellsManager.updateCells(changeEvent);
        })

        window.addEventListener("resize", () => this._editor.layout());

        if (this.props.path) {
            this.initializeModel(this.props.path)
        }
    }

    async initializeModel(path) {
        if (this.props.getContent) {
            const content = await this.props.getContent(path);
            this._model.pushEditOperations(
                [],
                [
                  {
                    range: this._model.getFullModelRange(),
                    text: content
                  },
                ]
            )
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.path !== null && this.props.path !== newProps.path) {
            this._cellsManager.disposeCells()
            this.initializeModel(newProps.path)
            
        }
    }

    keyHandler(e) {
        if(e.metaKey && e.key == 's') {
            this.props.save(this.props.path, this._model.getLinesContent())
            e.preventDefault()
        }
    }

    render() {
        return <div onKeyDown={this.keyHandler} style={this.props.style} ref={c => this.monacoRef = c}/>
    }
}

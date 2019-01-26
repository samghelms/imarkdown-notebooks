import * as React from 'react';
import * as monaco from 'monaco-editor';
import ContentWidget from './ContentWidget'
import * as Automerge from 'automerge'
import { KernelMessage, Kernel, ServerConnection } from '@jupyterlab/services';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import {
  RenderMimeRegistry,
  standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';

const opt = {
	language: "markdown",
	glyphMargin: true,
	contextmenu: false
}

const startState = {
    language: 'markdown',
    // value: jsCode,

    options: {
      glyphMargin: true,
      contextmenu: false
    },
    rows: [],
    contentWidgets: [],
    newContentWidgets: true
}
const settings = ServerConnection.makeSettings(
  {
      baseUrl: 'http://localhost:8888', 
      wsUrl: 'ws://localhost:8888',
      token: '2ff1a321e5ba37ca7671da1f76dd2ed44d5b6776bafd5228'
  }
)

export default class Notebook extends React.Component {

  constructor(props) {
    super(props)
    this._model = monaco.editor.createModel(startState.defaultVal, startState.language);

    // const doc = Automerge.init()

    // const initialDoc = Automerge.change(doc, 'Initialize card list', doc => {
    //   doc.rows = ['']
    // })

    // this.state = {...startState, doc: initialDoc, widgets: [], kernelLoaded: false}

    // this._model.onDidChangeContent((changeEvent) => {
    //     const value = this._model.getValue();
    //     const newDoc = Automerge.change(this.state.doc, 'change in editor content', doc => {
    //       // console.log(doc.rows)
    //       changeEvent.changes.map((ch) => {
    //         const startLine = ch.range.startLineNumber - 1 // arrays are 0 indexed, the editor is 1 indexed
    //         let length = ch.range.endLineNumber - ch.range.startLineNumber
    //         const newRows = ch.text.split('\n')

    //         const releventRows = doc.rows.slice(startLine, ch.range.endLineNumber)
    //         const releventRowsCopy = [...releventRows]
    //         const firstRowText = releventRowsCopy[0] ? releventRowsCopy[0].text : ''
    //         const lastRowText = releventRowsCopy[releventRowsCopy.length - 1] ? releventRowsCopy[releventRowsCopy.length - 1].text : ''
    //         newRows[0] = firstRowText.substring(0, ch.range.startColumn - 1) + newRows[0]
    //         newRows[newRows.length - 1] = newRows[newRows.length - 1] + lastRowText.substring(ch.range.endColumn - 1)
    //         length = length + 1

    //         const newRowsPrepped = newRows.map(r => ({text: r}))

    //         const numReplace = ch.range.endLineNumber - startLine
    //         doc.rows.splice(startLine, numReplace, ...newRowsPrepped) 

    //       })
    //     })
    //     this.setState({doc: newDoc, newView: true})
    // })

    // this.registerOutput = this.registerOutput.bind(this)

  }

  componentDidMount() {
    const this2 = this
    Kernel.getSpecs(settings).then(kernelSpecs => {
        console.log(kernelSpecs.default)
        return Kernel.startNew({
            name: kernelSpecs.default,
            serverSettings: settings
          });
    }).then(kernel => {
        this2.setState({kernel: kernel, kernelLoaded: true})
    });

    this._editor = monaco.editor.create(this._node, startState.options)
    this._editor.setModel(this._model)
    
    // var jsCode = [
    //   '# my notebook',
    //   '```python',
    //   'x = 1',
    //   'y = x',
    //   '```'
    // ]

    // this._model.pushEditOperations(
    //   [],
    //   [
    //     {
    //       range: this._model.getFullModelRange(),
    //       text: jsCode.join('\n'),
    //     },
    //   ]
    // )
  }

  componentWillUnmount() {
    this._editor && this._editor.dispose();
  }

  // cleanupOldChunks() {
  //   const editor = this._editor
  //   this.state.widgets.map(w => w.delete(editor))
  //   this.setState({widgets: []})
  // }

  // registerOutput(outputWidget, row) {
  //   console.log('registering at', row)
  //   const newDoc = Automerge.change(this.state.doc, 'change in editor content', doc => {
  //     this.state.doc.rows[row].output = outputWidget
  //   })
  //   this.setState({doc: newDoc})
  // }

  // makeInteractiveChunks() {
  //   const viewState = this._editor.getVisibleRanges()[0];
  //   const lines = this._editor.getModel().getValueInRange(viewState).split('\n')

  //   const blockBeginRegex = /```[\s]{0,5}[A-Za-z]+$/g
  //   const blockEndRegex = /```([\s]+$|$)/g

  //   let j = viewState.startLineNumber
  //   let state = 'NOT_IN_BLOCK'
  //   let blockStart = null
  //   let widgets = []
  //   for(let l of lines) {

  //     const startTest = l.match(blockBeginRegex)
  //     const endTest = l.match(blockEndRegex)
  //     if (startTest && state === 'NOT_IN_BLOCK') {
  //       console.log(`start`, j)
  //       state = 'IN_BLOCK'
  //       blockStart = j
  //       // splice in update
  //     } else if(endTest && state === 'IN_BLOCK') {
  //       console.log(`end`, j)
  //       console.log([...this.state.doc.rows])
  //       console.log(this.state.doc.rows[j - 1])
  //       const output = this.state.doc.rows[j - 1].output
  //       console.log(output)
  //       state = 'NOT_IN_BLOCK'
  //       // const output = this.state.doc.rows[j - 1].output ? this.state.rows[j - 1].output : null
  //       // addInteractiveBlock(blockStart, j, output, addOutputCB)
  //       const contentWidget = new ContentWidget(blockStart, j, this.props, output, this.state.kernel, this.registerOutput)
  //       contentWidget.addWidget(this._editor)

  //       widgets.push(contentWidget)
  //     }
  //     j ++
  //   }
  //   this.setState({newView: false, widgets: widgets})
  // }

  // clearDecorations() {
  //   for (let cw of this.state.contentWidgets) {
  //       this._editor.removeContentWidget(cw)
  //   }
  // }

  // componentDidUpdate(prevProps) {
  //  console.log([...this.state.doc.rows])
  //  if (this.state.newView === true && this.state.kernelLoaded === true) {
  //   this.cleanupOldChunks()
  //   this.makeInteractiveChunks()
  //  }
  // }

  render() {
    return <div style={this.props.style} ref={c => this._node = c} />
  }
}
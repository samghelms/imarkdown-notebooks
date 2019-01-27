import './App.css'
import React, {Component} from 'react'
import Notebook from './Notebook2';
import KernelSelector from './kernelSelector';
import KernelManager from './kernelManager'
import JupyterKernel from './kernels/jupyterKernel'
import { KernelMessage, Kernel, ServerConnection } from '@jupyterlab/services';
import Finder from './Finder';
import JupyterFSProvider from './jupyterFSProvider'
import Nav from './Nav'
import ReactModal from 'react-modal';
import {CloseButton, PlusButton} from 'react-svg-buttons';

class App extends Component {

  constructor(props) {
    super(props)
    this._kernelManager = new KernelManager();
    this.state = {showFS: false, path: null, fsProvider: null}
    this.openNotebook = this.openNotebook.bind(this)
    this.openFile = this.openFile.bind(this)
    this.getContent = this.getContent.bind(this)
    this.saveContent = this.saveContent.bind(this)
  }

  componentDidMount() {
    ReactModal.setAppElement(document.querySelector('#content'));
    
    const settings = ServerConnection.makeSettings(
      {
          baseUrl: 'http://localhost:8888', 
          wsUrl: 'ws://localhost:8888',
          token: 'bca2a8e1249304613d04c73f944a92dc66fc370ccc6d60cf'
      }
    )
    const kernel = new JupyterKernel(settings)
    kernel.initializeKernel('').then(() => this.registerKernel(kernel))
  
      // Restart the kernel and then s

    
    // window.addEventListener('beforeunload', async function (e) {
    //   // Cancel the event
    //   e.preventDefault();
    //   // Chrome requires returnValue to be set
    //   await this._kernelManager.close();
    //   e.returnValue = '';
    // })

    const fsProvider = new JupyterFSProvider(settings)

    this.setState({fsProvider: fsProvider})
  }

  registerKernel(kernel) {
    this._kernelManager.register(kernel)
  }

  componentWillUnmount() {
    console.log("unmounting");
    this._kernelManager.close()
  }

  openNotebook(path) {
    console.log(path)
    this.setState({view: 'notebook'})
  }

  showFS(showOrHide) {
    this.setState({showFS: showOrHide})
  }

  async openFile(fileInfo) {
    const {path, name} = fileInfo
    this.showFS(false)
    console.log('opening', path)
    this.setState({path: path, name: name})
  }

  saveContent(path, editorContent) {
    if (this.state.fsProvider) {
      const joinedContent = editorContent.join('\n')// TODO: figure out if I need to do anything special with EOL characters for different platforms
      this.state.fsProvider.save(path, joinedContent)
    }
  }

  async getContent(path) {
    const {content} = await this.state.fsProvider.getContent(path);
    return content;
  }

  render() {
      return <div> 
        <Nav fileName={this.state.name} filePath={this.state.path} showFS={() => this.showFS(true)}/>
        <div id='content'>
          <Notebook path={this.state.path} save={this.saveContent} getContent={this.getContent} kernelManager={this._kernelManager} style={{width: "100%", height: 800}}/>
          <ReactModal 
            isOpen={this.state.showFS}
            contentLabel="Minimal Modal Example"
            parentSelector={() => document.querySelector('#content')}
          >
            {this.state.fsProvider ? <Finder openFile={this.openFile} onCancel={() => this.showFS(false)} fsProvider={this.state.fsProvider}></Finder>: <div>loading</div>}
          </ReactModal>
        </div>
      </div>
  }
}

export default App;
import './App.css'
import React, {Component} from 'react'
import Notebook from './Notebook2';
import KernelSelector from './kernelSelector';
import KernelManager from './kernelManager'
import JupyterKernel from './kernels/jupyterKernel'
import { KernelMessage, Kernel, ServerConnection } from '@jupyterlab/services';

const settings = ServerConnection.makeSettings(
  {
      baseUrl: 'http://localhost:8888', 
      wsUrl: 'ws://localhost:8888',
      token: 'a5ba01b1343b539a1dec2fe1846caecb3c7b49014a7426dd'
  }
)

class App extends Component {

  constructor(props) {
    super(props)
    this._kernelManager = new KernelManager();
  }

  async componentDidMount() {
    const jupyterKernel = await Kernel.getSpecs(settings).then(kernelSpecs => {
        console.log(kernelSpecs.default)
        return Kernel.startNew({
            name: kernelSpecs.default,
            serverSettings: settings
          });
    })
    const kernel = new JupyterKernel(jupyterKernel)
    this.registerKernel(kernel, '')
  }

  registerKernel(kernel) {
    this._kernelManager.register(kernel)
  }

  componentWillUnmount() {
    this._kernelManager.close()
  }

  render() {
    return <div>
      {/* <KernelSelector registerKernel={this.registerKernel}/> */}
      <Notebook kernelManager={this._kernelManager} style={{width: 800, height: 800}}/>;
    </div>
  }
}

export default App;
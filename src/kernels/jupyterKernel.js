import { SimplifiedOutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import {
  RenderMimeRegistry,
  standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';

export default class JupyterKernel {
    constructor(kernel, kernelName) {
        this.kernel = kernel
        this.kernelName = kernelName
        // this.beginRegex = /```[\s]{0,5}python/g
    }

    execute(header, code) {
        console.log('executing', header, code)

        const model = new OutputAreaModel();
        const rendermime = new RenderMimeRegistry({ initialFactories });
        const outputArea = new SimplifiedOutputArea({ model, rendermime });
        const future = this.kernel.requestExecute({ code });
        outputArea.future = future;
        return {future, node: outputArea.node}

    }

    match(header) {
        return true;
    }

    close() {
        this.kernel.close()
    }
}
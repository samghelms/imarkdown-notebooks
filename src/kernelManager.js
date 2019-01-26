export default class KernelManager {
    constructor() {
        this._kernels = {}
    }

    // return a promise that resolves when the entire execution is done as well as an initial placeholder
    // allows you to pass arbitrary string arguments to your kernel
    execute(header, body) {
        const kernel = this.findMatchingKernel(header)
        if (kernel) {
            return kernel.execute(header, body)
        }
        // TODO: add some error messages here
        console.log("error: could not find kernel");
        return null;
    }

    findMatchingKernel(header) {
        for (let k of Object.values(this._kernels)) {
            if (k.match(header)) {
                return k;
            }
        }
        return null;
    }

    register(newKernel, kernelName) {
        this._kernels[kernelName] = newKernel;
    }

    close() {
        for (let k of Object.values(this._kernels)) {
            k.close()
        }
        // closes connections to all open kernels
    }
}
import { ContentsManager, ServerConnection, Contents } from '@jupyterlab/services';
import * as _ from './util';

function createLoadingColumn() {
    var div = _.el('div.fjs-col.leaf-col');
    var row = _.el('div.leaf-row');
    var text = _.text('Loading...');
    var i = _.el('span');
  
    _.addClass(i, ['fa', 'fa-refresh', 'fa-spin']);
    _.append(row, [i, text]);
  
    return _.append(div, row);
}
  
export default class JupyterFSProvider {
    constructor(settings) {
        this.contentsManager = new ContentsManager({serverSettings: settings, defaultDrive: undefined});
        this.get = this.get.bind(this);
    }

    async get(parent, cfg, callback) {
        // jupyter is going fast enough I'm going to disable this for now
        // var loadingIndicator = createLoadingColumn();
        // cfg.emitter.emit('create-column', loadingIndicator);
        const path = (parent && parent.path) || '/'
        const data = await this.contentsManager.get(path);
        // _.remove(loadingIndicator)
        callback(data.content)
    }

    async save(path, content) {
        return await this.contentsManager.save(path, {content, type: 'file', format: 'text'});
    }

    async rename(oldPath, newPath) {
        return await this.contentsManager.rename(oldPath, newPath);
    }

    async getContent(path) {
        return await this.contentsManager.get(path);
    }

}
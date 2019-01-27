import React, {Component} from 'react'
import finder from './finder-impl';
import './finder-style.css'
import * as _ from './util';

const isMD = (name) => {
    const splitName = name.split('.');
    return splitName[splitName.length - 1] === 'md'

}
export default class Finder extends Component {
    constructor(props) {
        super(props)
        this.finderRef = React.createRef();
        this.createSimpleColumn = this.createSimpleColumn.bind(this)
        this.createItemContent = this.createItemContent.bind(this)
        this.state = {disabledOpen: true}
    }

    componentDidMount() {
        const this2 = this
        // createExample(this.finderRef)
        this.finder = finder(this.finderRef, this.props.fsProvider.get, {
            createItemContent: this.createItemContent
        });
    
        // when a leaf node selected, display the details in a new column
        this.finder.on('leaf-selected', function selected(item) {
            this2.finder.emit('create-column', this2.createSimpleColumn(item));
        });
    
        // scroll to the right if necessary when a new column is created
        this.finder.on('column-created', function columnCreated() {
            this2.finderRef.scrollLeft = this2.finderRef.scrollWidth - this2.finderRef.clientWidth;
        });

        this.finder.on('item-selected', (obj) => {
            const item = obj.item._item;
            this.setState({selectedFile: item, disabledOpen: !isMD(item.name)})
        });

    }

    createSimpleColumn(item) {
        var div = _.el('div.fjs-col.leaf-col');
        var row = _.el('div.leaf-row');
        var filename = _.text(item.name);
        var i = _.el('i');
        var size = _.el('div.meta');
        var sizeLabel = _.el('strong');
        var mod = _.el('div.meta');
        var modLabel = _.el('strong');
        var path = _.el('div.meta');
        var pathLabel = _.el('strong');
        
    
        _.addClass(i, ['fa', 'fa-file-o']);
        _.append(sizeLabel, _.text('Size: '));
        _.append(size, [sizeLabel, _.text(item.size)]);
        _.append(modLabel, _.text('Modified: '));
        _.append(mod, [modLabel, _.text(item.last_modified)]);
        _.append(pathLabel, _.text('Path: '));
        _.append(path, [pathLabel, _.text(item.path)]);
    
        _.append(row, [i, filename, size, mod, path]);
    
        if (isMD(item.name)) {
            var open = _.el('div.meta');
            var openLabel = _.el('strong');
            _.append(openLabel, _.text('Open as notebook: '));
            var button = _.el('button');
            button.onclick = () => this.props.openFile(item)
            _.append(button, [_.text('open')])
            _.append(open, [openLabel, button]);
            _.append(row, [open])
        }
    
        return _.append(div, row);
    }

    // how each item in a column should be rendered
    createItemContent(cfg, item) {
        var frag = document.createDocumentFragment();
        var label = _.el('span');
        var iconPrepend = _.el('i');
        var iconAppend = _.el('i');
        var prependClasses = ['fa'];
        var appendClasses = ['fa'];

        // prepended icon
        if (item.type === 'directory') {
            prependClasses.push('fa-folder');
        } else if (item.type === 'file') {
            prependClasses.push('fa-file-o');
        }
        _.addClass(iconPrepend, prependClasses);

        // text label
        _.append(label, [iconPrepend, _.text(item.name)]);
        frag.appendChild(label);

        // appended icon
        if (item.type === 'directory') {
            appendClasses.push('fa-caret-right');
        }

        _.addClass(iconAppend, appendClasses);
        frag.appendChild(iconAppend);

        if (isMD(item.name)) {
            label.ondblclick = () => this.props.openFile(item)
        }

        return frag;
    }

    render() {
        return <div><div style={this.props.style} ref={c => this.finderRef = c}/>
            <button onClick={this.props.onCancel} style={{float: "right"}}>cancel</button>
            <button disabled={this.state.disabledOpen} onClick={() => this.props.openFile(this.state.selectedFile)} style={{float: "right"}}>open</button>
        </div>
    }
}
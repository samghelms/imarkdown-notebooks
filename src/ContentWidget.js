import * as monaco from 'monaco-editor'
import { SimplifiedOutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import {
  RenderMimeRegistry,
  standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';

const getContentWidget = (startLineNumber, editorWidth, addOutputCB) => (
     {
        domNode: null,
        getId: function() {
            return 'my.content.widget.'+startLineNumber.toString();
        },
        getDomNode: function() {
            this.viewZoneId = null

            this.domNode = document.createElement('div');
            // this.domNode.innerHTML = 'My content widget';
            this.domNode.className = 'test'
            this.domNode.style.pointerEvents = 'none';
            // this.domNode.style.background = 'grey';
            this.domNode.style.width = `${editorWidth}px`;
            this.domNode.style.display = 'flex';
            this.domNode.style.justifyContent = 'flex-end';
            const internalDomNode = document.createElement('div');
            const btn = document.createElement('button');
            btn.innerHTML = 'run code';
            btn.onclick = (e) => {
                addOutputCB();
            };
            btn.style.pointerEvents = 'all';
            btn.style.marginRight = '20px';
            internalDomNode.appendChild(btn);
            this.domNode.appendChild(internalDomNode);
                
            return this.domNode;
        },
        getPosition: function(test) {
            return {
                position: {
                    lineNumber: startLineNumber,
                },
                preference: [monaco.editor.ContentWidgetPositionPreference.EXACT]
            };
        }
    }
)

class ContentWidget {
    constructor(blockStart, blockEnd, notebookProps, output, kernel, registerOutputCB) {
        this.blockStart = blockStart
        this.blockEnd = blockEnd
        this.width = notebookProps.style.width
        this.output = output 
        this.outputHeight = 4
        this.kernel = kernel
        this.registerOutputCB = registerOutputCB
    }

    addRunButton(editor) {
        const this2 = this
        const addOutCB = () => {
            if (this2.viewZoneId) {
                this2.deleteOutputArea(editor)
            }
            console.log('adding output')
            const code = [
                "import pandas as pd",
                "pd.DataFrame({'x': [1, 1, 1, 1, 1, 1, 1, 1]})"
            ].join('\n');
            const model = new OutputAreaModel();
            const rendermime = new RenderMimeRegistry({ initialFactories });
            const outputArea = new SimplifiedOutputArea({ model, rendermime });
            outputArea.future = this2.kernel.requestExecute({ code });

            this2.registerOutputCB(outputArea, this.blockEnd - 1)
            
            this2.addOutput(editor, outputArea)
        }
        this.buttonsWidget = getContentWidget(this.blockStart, this.width, addOutCB)
        editor.addContentWidget(this.buttonsWidget)
    }

    addOutput(editor, outputArea) {
        const this2 = this

        editor.changeViewZones(function(changeAccessor) {
            this2.outputNode = document.createElement('div')
            this2.outputNode.innerHTML = outputArea.node.innerHTML
            // this2.outputNode.style.background = 'lightgreen'
            
            // if(this2.output) {
            //     this2.outputNode.innerHTML = this2.output
            // }
            this2.viewZoneId = changeAccessor.addZone({
                        afterLineNumber: this2.blockEnd,
                        heightInLines: this2.outputHeight,
                        domNode: this2.outputNode
            })
        })

    }

    addWidget(editor) {
        this.addRunButton(editor)

        if(this.output) {
            this.addOutput(editor, this.output)
        }
    }

    deleteOutputArea(editor) {
        // delete output area
        const this2 = this
        editor.changeViewZones(function(changeAccessor) {
            changeAccessor.removeZone(this2.viewZoneId)
        })
    }

    delete(editor) {
        // delete buttons
        this.deleteOutputArea(editor)
        editor.removeContentWidget(this.buttonsWidget)

    }
}

export default ContentWidget
import * as React from 'react';
import {NavButton} from 'react-svg-buttons';

export default class Nav extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return <div style={{height: 65, width: '100%'}}> 
            <span style={{padding: 10, top: 20, position: "absolute"}}>{this.props.fileName ? this.props.fileName : null}</span>
            <NavButton onClick={() => this.props.showFS(true)} style={{float: "right", padding: 10, marginRight: 40}} direction="down" opened={false} />
        </div>
    }
}

export class OutWidget extends React.Component {
    constructor(props) {
      super(props);
      this.textInput = React.createRef();
    }
    render() {
      return (
        <div ref={this.myRef}> outwidget  </div>;
      );
    }
  }
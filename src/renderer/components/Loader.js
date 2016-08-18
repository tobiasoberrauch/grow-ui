import React from 'react';

export default React.createClass({
  displayName: 'Loader',
  getDefaultProps() {
    return {
      isLoading: false
    };
  },
  render() {
    const preloaderStyle = {
      width: 100,
      height: 100,
      position: 'absolute',
      left: '50%',
      top: '50%',
      marginLeft: -50,
      marginTop: -50,
      display: this.props.isLoading ? 'block' : 'none'
    };

    return (
      <img style={preloaderStyle} src="img/rings.svg"/>
    );
  }
});

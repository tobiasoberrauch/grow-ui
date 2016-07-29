import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Detail from '../components/Detail';
import * as DetailActions from '../actions/detail';

function mapStateToProps(state) {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(DetailActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);

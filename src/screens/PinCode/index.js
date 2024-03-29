import React, { Component } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DrawerActions } from 'react-navigation';
import { SET_CURRENT_ROUTE } from '../../config/actionTypes';
import {
  GradientBackground,
  Header,
  PinIndicator,
  PinKeyboard,
} from '../../components';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  dotsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  dot: {
    height: 20,
    width: 20,
    marginHorizontal: 10,
  },
});

class PinCode extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    pinCode: PropTypes.string.isRequired,
  };

  state = {
    pinCode: '',
  };

  onAuthSuccess = () => {
    if(this.props.currentRoute === 'home') {
      this.props.navigation.navigate('Wallet');
    } else {
      this.props.navigation.navigate(this.props.currentRoute);
    }
  };

  onBackPress = () => {
    this.setState(prevState => ({
      pinCode: prevState.pinCode.slice(0, -1),
    }));
  };

  onKeyPress = n => {
    this.updatePinCode(n);
  };

  updatePinCode = n => {
    this.setState(
      prevState => ({
        pinCode: `${prevState.pinCode}${n}`,
      }),
      () => {
        if (this.state.pinCode.length === 4) {
          if (this.state.pinCode === this.props.pinCode) {
            setTimeout(() => {
              this.onAuthSuccess();
            });
          } else {
            this.setState(
              {
                pinCode: '',
              },
              () => {
                Alert.alert(
                  'PIN Code',
                  'Your PIN code is incorrect. Please try again.',
                );
              },
            );
          }
        }
      },
    );
  };

  goBack = () => {
    const stackLength = this.props.navigation.dangerouslyGetParent().state.routes.length - 2;
    const stackRoute = this.props.navigation.dangerouslyGetParent().state.routes[stackLength].routeName;
    this.props.setRoute(stackRoute)
    this.props.navigation.navigate(stackRoute)
  };

  render() {
    const headerTitle = this.props.currentRoute == "CreateWallet" ? "Enter Current Pin" : "Enter Pin"

    let header;

    if(headerTitle == "Enter Current Pin") {
      header = <Header
        onBackPress={() => this.goBack()}
        title={headerTitle} />
    } else {
      header = <Header
        title={headerTitle} />
    }
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          {header}
          <PinIndicator length={this.state.pinCode.length} />
          <PinKeyboard
            onBackPress={this.onBackPress}
            onKeyPress={this.onKeyPress}
            onAuthSuccess={this.onAuthSuccess}
            showBackButton={this.state.pinCode.length > 0}
          />
        </SafeAreaView>
      </GradientBackground>
    );
  }
}

const mapStateToProps = state => ({
  pinCode: state.pinCode,
  currentRoute: state.currentRoute,
});

const mapDispatchToProps = dispatch => ({
  setRoute: route => dispatch({ type: SET_CURRENT_ROUTE, route })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PinCode);
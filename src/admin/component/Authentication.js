import React, { Component } from 'react';

class Auth extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: false,
    };
  }

  // Check the user's authentication status on component mount
  componentDidMount() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    this.setState({ isAuthenticated });
  }

  // Function to set the user's authentication status
  setAuthenticated = (isAuthenticated) => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    this.setState({ isAuthenticated });
  };

  render() {
    return this.props.children({ isAuthenticated: this.state.isAuthenticated, setAuthenticated: this.setAuthenticated });
  }
}

export default Auth;

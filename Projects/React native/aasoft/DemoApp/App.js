import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackRoutes from './src/routes/StackRoutes';

export class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <StackRoutes />
      </NavigationContainer>
    );
  }
}

export default App;

import * as React from "react";
import StackNavigator from "./src/navigators/stack-navigator";
import store from "./src/reducers/createReducers";
import { Provider } from "react-redux";

const App = () => {
  return (
    <Provider store={store}>
        <StackNavigator />
    </Provider>
  );

};

export default App;



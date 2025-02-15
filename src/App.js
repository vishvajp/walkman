import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route,Router, Navigate } from "react-router-dom";
import ProductPage from './Components/ProductPage';
import ReaderPage from './Components/ReaderPage';
import Test from './Components/Test';
import HomePage from './Components/HomePage';

function App() {
  return (
    <div className="App">
     
      <Routes>
      <Route
     
            path="/"
            element={
            <HomePage></HomePage>
            }
          > 
          <Route
            path="/product"
            element={
             <ProductPage></ProductPage>
            }
          /> 
           <Route
            path="/reader"
            element={
             <ReaderPage></ReaderPage>
            }
          /> 
            <Route
            path="/test"
            element={
             <Test></Test>
            }
          /> 
          </Route>
      
      </Routes>
   
    </div>
  );
}

export default App;

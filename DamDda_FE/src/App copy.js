// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// /////////////////////////////지영////////////////////////////////////
// import Home from './components/pages/mainpage/Main'; 
// import Payment from './components/pages/support/Payment';
// import OrderPage from './components/pages/support/OrderPage';
// import TossReady from './components/pages/support/TossReady';
// import TossResult from './components/pages/support/TossResult';
// import PaymentSuccess from "./components/pages/support/PaymentSuccess";
// import MyOrders from './components/pages/support/MyOrders';
// import PaymentFail from './components/pages/support/PaymentFail';
// import SupportingSearch from './components/pages/support/SupportingSearch';
// import ProjectStatistics from './components/pages/support/ProjectStatistics';


// /////////////////////////////남희////////////////////////////////////
// import YourPage from "./components/layout/YourPage";
// import Login from "./components/pages/member/Login";
// import FindID from "./components/pages/member/FindID";
// import ResetPassword from "./components/pages/member/ResetPassword";
// import Join from "./components/pages/member/Join";
// import Detail from "./components/pages/detail/Detail";
// import Register from "./components/pages/register/info/Register";
// import ErrorPage from "./components/pages/error/ErrorPage";

// /////////////////////////////혜원////////////////////////////////////
// import MyPage from "./components/pages/mypage/Mypage";
// import styles from "./components/styles/style.css";
// import ProjectDetail from "./components/pages/detail/ProjectDetail";
// import { UserProvider } from "./UserContext";

// /////////////////////////////주현////////////////////////////////////
// import Entire from "./components/pages/entire/Main";
// import CollaborationList from "./components/pages/mypage/CollaborationList";
// import Collaboration from "./components/pages/mypage/Collaboration";
// import CollaborationDetail from "./components/pages/mypage/CollaborationDetail";
// // import { useUser } from './UserContext';

// function App() {
//   // const {user} = useUser()

//   return (
//     <UserProvider>
//       <Router>
//         <Routes>
//           {/* /////////////////////////////지영//////////////////////////////////// */}
//           <Route path="/" element={<Home />} />  
//           <Route path="/user/myorders/:userId" element={<MyOrders />} />
//           <Route path="/payment" element={<Payment />} />
//           <Route path="/payment/success" element={<PaymentSuccess />} />
//           <Route path="/payment/fail" element={<PaymentFail />} />

//           <Route path="/TossReady" element={<TossReady />} />
//           <Route path="/TossResult" element={<TossResult />} />

//         <Route path="/SupportingSearch" element={<SupportingSearch />} />
//         <Route path="/ProjectStatistics" element={<ProjectStatistics />} />

//           {/* /////////////////////////////남희/////////////////////////////////// */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/find-id" element={<FindID />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//           <Route path="/join" element={<Join />} />
//           <Route path="/detail" element={<Detail />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/error" element={<ErrorPage />} />
//           <Route path="/projectDetail" element={<ProjectDetail />} />
//           {/* /////////////////////////////혜원/////////////////////////////////// */}
//           <Route path="/mypage" element={<MyPage />} />
//           {/* /////////////////////////////주현/////////////////////////////////// */}
//           <Route path="/entire" element={<Entire />} />
//           <Route path="/collab" element={<CollaborationList />} />
//           <Route path="/clb" element={<Collaboration />} />
//           <Route path="/collab/detail/:id" element={<CollaborationDetail />} />
//         </Routes>
//       </Router>
//     </UserProvider>
//   );
// }

// export default App;

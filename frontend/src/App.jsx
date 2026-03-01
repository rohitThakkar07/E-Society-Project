import { Route, Routes } from "react-router-dom"
import React from "react"
import Footer from "./components/layout/Footer"
import Header from "./components/layout/Header"
import Home from "./components/pages/Home"
import Login from "./components/pages/Login"
import NoticeBoard from "./components/pages/NoticeBoard"
import RaiseComplaint from "./components/pages/RaiseComplaint"
import EventsCalendar from "./components/pages/EventsCalander"
import DiscussionPolls from "./components/pages/DiscussionPolls"
import VisitorManagement from "./components/pages/VisitorManagement"
import BookFacility from "./components/pages/VisitorManagement"
import MaintenancePayment from "./components/pages/MaintenancePayment"
import MyInvoice from "./components/pages/MyInvoice"
import SocietyExpense from "./components/pages/SocietyExpence"

function App() {

  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/notices" element={<NoticeBoard/>}/>
        <Route path="/raise-complaint" element={<RaiseComplaint/>}/>
        <Route path="/polls" element={<DiscussionPolls/>}/>
        <Route path="/events" element={<EventsCalendar/>}/>
        <Route path="/visitors" element={<VisitorManagement/>}/>
        <Route path="/facilities" element={<BookFacility/>}/>
        <Route path="/maintenance" element={<MaintenancePayment/>}/>
        <Route path="/invoices" element={<MyInvoice/>}/>
        <Route path="/expenses" element={<SocietyExpense/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
      <Footer/>
    </>
  )
}

export default App

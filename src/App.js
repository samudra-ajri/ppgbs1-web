import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import BottomNav from './components/BottomNav'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'

const theme = createTheme({
  typography: {
    fontFamily: [
      'Varela Round', 
      'sans-serif'
    ].join(",")
  }
});

function App() {
  return (
    <>
      <Router>
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <Container maxWidth="sm">
          <Header />
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
          <BottomNav />
        </Container>
        </ThemeProvider>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App

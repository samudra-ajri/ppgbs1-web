import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ChildLayout from './layouts/ChildLayout'
import MainLayout from './layouts/MainLayout'

const theme = createTheme({
  typography: {
    fontFamily: [
      'OpenSans',
      'Arial',
      'Helvetica',
      'sans-serif',
    ].join(",")
  },
  palette: {
    gold: {
      main: '#DBB000',
    }
  }
});

function App() {
  return (
    <>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path='/c/*' element={<ChildLayout />} />
            <Route path='/*' element={<MainLayout />} />
          </Routes>
        </ThemeProvider>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App

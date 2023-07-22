import { useState } from 'react'
import './App.css'
import StaredRepos from './component/StaredRepos'
import { Box } from '@mui/material'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <Box sx={{
        display: "flex", alignItems: "center",
        margin: "auto", justifyContent: "center",
        backgroundColor: "#5C5470", maxWidth: "800px"
      }}>
        <StaredRepos />
      </Box>
    </div>
  )
}

export default App

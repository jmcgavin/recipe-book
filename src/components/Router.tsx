import { BrowserRouter, Route, Routes } from 'react-router-dom'

import RecipeDetail from './RecipeDetail'
import RecipeList from './RecipeList'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RecipeList />} />
        <Route path='/:id' element={<RecipeDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router

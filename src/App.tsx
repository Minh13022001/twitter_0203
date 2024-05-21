
import useRouteElements from "./useRouteElement";


function App() {
  const routeElements = useRouteElements()
  return (
  <div>
    {routeElements}
    </div>)
}

export default App;

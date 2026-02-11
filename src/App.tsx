
import './App.css'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  // CardAction, 
  CardFooter 
} from '@/components/ui/warcraftcn/card'
import { Button } from './components/ui/warcraftcn/button'

function App() {

  return (
    <>
    <Card>
      <CardHeader >
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
      <CardFooter>
        <p>Card footer</p>
      </CardFooter>
    </Card>
    <Button>Ask</Button>
    </>
  )
}

export default App

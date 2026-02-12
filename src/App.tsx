
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
    <Button variant='frame' className='p-4 px-24'>Ask</Button>
    </main>
  )
}

export default App

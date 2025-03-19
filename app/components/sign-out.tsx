
import { signOut } from "@/auth"
 
export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut({redirectTo:"/"})
      }}
    >
      <button className="btn btn-ghost text-xl text-black hover:text-blue-500" type="submit">Signout</button>
    </form>
  )
} 
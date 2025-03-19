
import { signIn } from "@/auth"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <button className="btn btn-ghost text-xl text-black hover:text-blue-500" type="submit">Signin with Google</button>
    </form>
  )
} 
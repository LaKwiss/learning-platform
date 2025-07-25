import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <SignIn afterSignInUrl="/home" afterSignUpUrl="/home" />
        </div>
    );
}
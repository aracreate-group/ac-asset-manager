import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreVertical } from "lucide-react"
import Link from "next/link"


export function AccountCard() {
    return (
        <Card className="h-44 hover:shadow-lg hover:scale-105  transition-all duration-500 ease-in-out">
            <CardHeader className="flex justify-between">
                <Image src="/negative-logo.png" alt="Card image" className="rounded-full border" width={46} height={46} />
                <Button variant={"link"} className="border-none shadow-none hover:shadow-lg p-0 m-0"><MoreVertical width={46} height={46} /></Button>
            </CardHeader>
            <CardContent>
                <Link className="cursor-pointer" href={`/calendar/accounts/`}>
                    <h2 className="text-lg font-semibold">Gowtham</h2>
                    <p className="text-sm text-muted-foreground">gowtham@aracreate.com</p>
                </Link>
                {/* <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Name of your project" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="framework">Framework</Label>

                        </div>
                    </div>
                </form> */}


            </CardContent>
            {/* <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Deploy</Button>
            </CardFooter> */}
        </Card>
    )
}

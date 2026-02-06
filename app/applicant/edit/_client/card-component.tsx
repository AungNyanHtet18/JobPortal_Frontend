'use client'

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PagerWidget from "@/components/widgets/pager-widgert";
import { DummyPage } from "@/lib/type";

export default function CardComponent() {

    const onPageChange = (a: number) => console.log(a);
    const onSizeChange = (a: number) => console.log(a);


     return (
        <div className="space-y-4">

        <div className="grid grid-cols-4 gap-3">
            <Card>
                <img className="object-cover w-75 mx-auto mb-2" src="/images/signin.jpg"></img>
                <CardHeader>
                    <CardTitle>Junior Web Developer</CardTitle>
                    <CardDescription>Proficient in java, spring mvc, thymleaf and restful api.Can integrate with database by using jdbc or jpa</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full">Save Job</Button>
                </CardFooter>
            </Card>

            <Card>
                <img className="object-cover w-75 mx-auto mb-2" src="/images/signin.jpg"></img>
                <CardHeader>
                    <CardTitle>Junior Web Developer</CardTitle>
                    <CardDescription>Proficient in java, spring mvc, thymleaf and restful api.Can integrate with database by using jdbc or jpa</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full">Save Job</Button>
                </CardFooter>
            </Card>

            <Card>
                <img className="object-cover w-75 mx-auto mb-2" src="/images/signin.jpg"></img>
                <CardHeader>
                    <CardTitle>Junior Web Developer</CardTitle>
                    <CardDescription>Proficient in java, spring mvc, thymleaf and restful api.Can integrate with database by using jdbc or jpa</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full">Save Job</Button>
                </CardFooter>
            </Card>

            <Card>
                <img className="object-cover w-75 mx-auto mb-2" src="/images/signin.jpg"></img>
                <CardHeader>
                    <CardTitle>Junior Web Developer</CardTitle>
                    <CardDescription>Proficient in java, spring mvc, thymleaf and restful api.Can integrate with database by using jdbc or jpa</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full">Save Job</Button>
                </CardFooter>
            </Card>


             <Card>
                <img className="object-cover w-75 mx-auto mb-2" src="/images/signin.jpg"></img>
                <CardHeader>
                    <CardTitle>Junior Web Developer</CardTitle>
                    <CardDescription>Proficient in java, spring mvc, thymleaf and restful api.Can integrate with database by using jdbc or jpa</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full">Save Job</Button>
                </CardFooter>
            </Card>

             <Card>
                <img className="object-cover w-75 mx-auto mb-2" src="/images/signin.jpg"></img>
                <CardHeader>
                    <CardTitle>Junior Web Developer</CardTitle>
                    <CardDescription>Proficient in java, spring mvc, thymleaf and restful api.Can integrate with database by using jdbc or jpa</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full">Save Job</Button>
                </CardFooter>
            </Card>


            <Card>
                <img className="object-cover w-75 mx-auto mb-2" src="/images/signin.jpg"></img>
                <CardHeader>
                    <CardTitle>Junior Web Developer</CardTitle>
                    <CardDescription>Proficient in java, spring mvc, thymleaf and restful api.Can integrate with database by using jdbc or jpa</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full">Save Job</Button>
                </CardFooter>
            </Card>

        </div>
        
        <PagerWidget pager={DummyPage} onPageChange={onPageChange} onSizeChange={onSizeChange}/>

    </div>
     )
}

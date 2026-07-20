import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function PhoneOTP() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Phone verification</CardTitle>
        <CardDescription>This sign-in method is being connected to the new backend.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-gray-600">
        Please use email sign-in for the initial release.
      </CardContent>
    </Card>
  )
}

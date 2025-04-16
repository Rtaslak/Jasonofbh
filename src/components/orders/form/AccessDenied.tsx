
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PageTransition from "@/components/layout/PageTransition";

export function AccessDenied() {
  return (
    <PageTransition>
      <div className="container mx-auto max-w-4xl p-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You must be logged in with a valid @jasonofbh.com email to submit orders.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PageTransition>
  );
}
